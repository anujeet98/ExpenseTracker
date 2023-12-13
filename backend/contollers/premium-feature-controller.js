const User = require('../models/user-model');
const db = require('../util/db');

exports.getLeaderBoard = async(req,res,next) => {
    try{
        const user = req.user;
        const result = await User.findAll({attributes: ['username', 'total_expense']});
        res.status(200).json(result);
    }
    catch(err){
        console.log("getLeaderBoardError",err);
        res.status(500).json({error:'Internal server error while fetching leaderboard details'});
    }
};