const User = require('../models/user-model');
const db = require('../util/db');

exports.getLeaderBoard = async(req,res,next) => {
    try{
        // const result = await db.execute('SELECT users.username, sum(expenses.amount) AS total_expense FROM users LEFT JOIN expenses ON users.id = expenses.user_id GROUP BY users.id ORDER BY total_expense DESC');
        const result = await User.getTotalEpensesDesc();
        res.status(200).json(result[0]);
    }
    catch(err){
        console.log("getLeaderBoardError",err);
        res.status(500).json({error:'Internal server error while fetching leaderboard details'});
    }
};