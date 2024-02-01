const User = require('../models/user-model');
const AwsS3Service = require('../services/aws-s3-service')
const db = require('../util/db');

exports.getLeaderBoard = async(req,res,next) => {
    try{
        const result = await User.findAll({attributes: ['username', 'total_expense'], order: [['total_expense', 'DESC']]});
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
        const expenses = await user.getExpenses();

        const filename = `expense_${user.id}_${new Date()}.csv`;
        const data = JSON.stringify(expenses);
        const file_url = await AwsS3Service.uploadToS3(filename, data);

        await user.createDownload({download_url: file_url});
        res.status(201).json({status:"success", reportURL: file_url});
    }
    catch(err){
        console.log('uploadExpenseError-getReport: ',err);
        res.status(500).json({error: 'something went wrong', error_context: err});
    }
};