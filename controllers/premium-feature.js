const User = require('../models/user');
const Expense = require('../models/expense');
const Download = require('../models/download');
const AwsS3Service = require('../services/aws-s3-service');
const inputValidator = require('../util/input-validator');
const ExcelJS = require('exceljs');

exports.getLeaderBoard = async(req,res,next) => {
    try{
        const timelinecode = +req.query.timelinecode;
        const page = +req.query.page;
        const ITEMS_PER_PAGE = +req.query.rowsperpage
        if(inputValidator.number(page) || inputValidator.number(ITEMS_PER_PAGE) || (inputValidator.number(timelinecode) || timelinecode>4 || timelinecode<0)){
            return res.status(422).json({ error: 'bad input parameters' });
        }

        let totalUserCount;
        let leaderboard;
        if(timelinecode === 0)
        {
            [totalUserCount, leaderboard] = await Promise.all([
                User.countDocuments(),
                User.find().select('username total_expense').sort({total_expense: -1}).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
            ]);
        }
        else if(timelinecode === 1){
            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(Date.UTC(currentYear, 0, 1));  
            [totalUserCount, leaderboard] = await Promise.all([
                Expense.find({date: {$gte: startOfYear}}).distinct('userId'),
                Expense.aggregate([
                    {
                        $match: {
                            date: { $gte: startOfYear}
                        }
                    },
                    {
                        $group: {
                            _id: '$userId',
                            total_expense: { $sum: '$amount' }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user_doc"
                        }
                    },
                    {
                        $set: {
                          username: { $arrayElemAt: ["$user_doc.username", 0] }
                        }
                      }
                ]).sort({'total_expense': -1}).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
            ]);
            totalUserCount = totalUserCount.length;
        }
        else if(timelinecode === 2){
            const currentDate = new Date();
            const startOfMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
            
            [totalUserCount, leaderboard] = await Promise.all([
                Expense.find({date: {$gte: startOfMonth}}).distinct('userId'),
                Expense.aggregate([
                    {
                        $match: {
                            date: { $gte: startOfMonth}
                        }
                    },
                    {
                        $group: {
                            _id: '$userId',
                            total_expense: { $sum: '$amount' }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user_doc"
                        }
                    },
                    {
                        $set: {
                          username: { $arrayElemAt: ["$user_doc.username", 0] }
                        }
                      }
                ]).sort({'total_expense': -1}).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
            ]);
            totalUserCount = totalUserCount.length;
        }
        const resJSON = {
            leaderboard: leaderboard,
            hasNextPage: totalUserCount > (page*ITEMS_PER_PAGE),
            hasPreviousPage: page > 1,
            previousPage: page-1,
            currentPage: page,
            nextPage: page+1,
            lastsPage: Math.ceil(totalUserCount/ITEMS_PER_PAGE)
        }   
        res.status(200).json(resJSON);
    }
    catch(err){
        console.log("getLeaderBoardError",err);
        res.status(500).json({error:'Internal server error while fetching leaderboard details'});
    }
};

exports.getReport = async(req, res, next) => {
    try{
        const user = req.user;
        const datetype = req.query.datetype;
        const datevalue = req.query.datevalue;
        let expenses = await Expense.find(
            {
                userId: user._id,
                date: {
                    $gt: (datetype==='month') ? new Date(datevalue + '-01') : new Date(datevalue + '-01-01'),
                    $lt: (datetype==='month') ? new Date(new Date(datevalue + '-01').setMonth(new Date(datevalue + '-01').getMonth() + 1)) : new Date((parseInt(datevalue) + 1) + '-01-01'),
                }
            }
        ).select('description category date amount -_id').lean(); //lean to convert back to Js object format. select doesn't return plain js object
        if(expenses.length===0)
            return res.status(404).json({error: 'no data for the selected month/year'});
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        const headers = Object.keys(expenses[0] || {});
        worksheet.addRow(headers);
        let total = 0;

        expenses.forEach(expense => {
            const row = [];
            headers.forEach(header => {
                row.push(expense[header]);
            });
            worksheet.addRow(row);
            total+= +expense.amount;
        });
        worksheet.addRow([`Total Expense = ${total}`]);

        const data = await workbook.xlsx.writeBuffer();

        const filename = `expense_${user._id}_${new Date()}.xlsx`;
        // const data = JSON.stringify(expenses);
        const file_url = await AwsS3Service.uploadToS3(filename, data);

        const newDownload = new Download({download_url: file_url, userId: user._id});
        await newDownload.save();
        res.status(201).json({status:"success", reportURL: file_url});
    }
    catch(err){
        console.log('uploadExpenseError-getReport: ',err);
        res.status(500).json({error: 'something went wrong', error_context: err});
    }
};


exports.getExpenseByCategory = async(req, res, next) => {
    try{
        const datetype = req.query.datetype;
        const datevalue = req.query.datevalue;

        const result = await Expense.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: {
                        $gte: (datetype==='month') ? new Date(datevalue + '-01') : new Date(datevalue + '-01-01'),
                        $lt: (datetype==='month') ? new Date(new Date(datevalue + '-01').setMonth(new Date(datevalue + '-01').getMonth() + 1)) : new Date((parseInt(datevalue) + 1) + '-01-01')
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total_expense: { $sum: '$amount'}
                }
            },
            {
                $project: {
                    category: '$_id',
                    total_expense: 1,
                    _id: 0
                }
            },
        ]);
        res.status(200).json(result);
    }
    catch(err){
        console.log('categoryAggregate error: ',err);
        res.status(500).json({error: 'something went wrong', error_context: err});
    }
}


exports.getExpenseByTimeline = async(req, res, next) => {
    try{
        const datetype = req.query.datetype;
        const datevalue = req.query.datevalue;
        let result;

        if(datetype==='year'){
            result = await Expense.aggregate([
                {
                    $match: {
                        userId: req.user._id,
                        date: {
                          $gte: new Date(datevalue + '-01-01'),
                          $lt: new Date((parseInt(datevalue) + 1) + '-01-01')
                        }
                    }
                },
                {
                    $project: {
                        month: { $month: '$date' }, // Extract month from the date
                        amount: 1
                    }
                },
                {
                    $group: {
                    _id: '$month',
                    total_expense: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                    month: '$_id',
                    total_expense: 1,
                    _id: 0
                    }
                },
                {
                    $sort: {
                        month: 1 // Sort by month in ascending order
                    }
                }   
            ]);
    
        }

        else{
            const [year, month] = datevalue.split('-').map(Number);
            result = await Expense.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: {
                        $gte: new Date(year, month - 1, 1), // Start of the month
                        $lt: new Date(year, month, 1) // Start of the next month
                    }
                }
            },
            {
                $project: {
                    day: { $dayOfMonth: '$date' }, // Extract day from the date
                    amount: 1
                }
            },
            {
                $group: {
                    _id: '$day',
                    total_expense: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    day: '$_id',
                    total_expense: 1,
                    _id: 0
                }
            },
            {
                $sort: {
                    day: 1 // Sort by day in ascending order
                }
            }
            ]);
        }

        res.status(200).json(result);
    }
    catch(err){
        console.log('categoryAggregate error: ',err);
        res.status(500).json({error: 'something went wrong', error_context: err});
    }
}