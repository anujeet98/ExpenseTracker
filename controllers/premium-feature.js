const User = require('../models/user');
const Expense = require('../models/expense');
const Download = require('../models/download');
const AwsS3Service = require('../services/aws-s3-service')

exports.getLeaderBoard = async(req,res,next) => {
    try{
        const result = await User.find().select('username total_expense').sort({total_expense: -1});
        res.status(200).json(result);
    }
    catch(err){
        console.log("getLeaderBoardError",err);
        res.status(500).json({error:'Internal server error while fetching leaderboard details'});
    }
};

exports.getReport = async(req, res, next) => {
    try{
        const user = req.user;
        const expenses = await Expense.find({userId: user._id});

        const filename = `expense_${user._id}_${new Date()}.csv`;
        const data = JSON.stringify(expenses);
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