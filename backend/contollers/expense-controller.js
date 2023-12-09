const Expense = require('../models/expense-model.js');
const db = require('../util/db.js');
const jwt = require('jsonwebtoken');

exports.getExpenses = async(req,res,next) => {
    try{
        // console.log('get Expenses hit');
        const token = req.headers.authorization;
        const verifiedJWT = jwt.verify(token, "secretkey");
        const result = await Expense.fetchAll(verifiedJWT.userId);  
        return res.status(200).json(result[0]);
    }
    catch(err){
        if(err.name === 'JsonWebTokenError'){
            console.error('JsonWebTokenError-postExpense: ',err);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        console.error('ReadError-getExpenses',err);
        return res.status(500).json({error: "Internal Server Error while fetching expenses"});
    }
};

exports.postExpense = async(req,res,next) => {
    try{
        // console.log('post Expense hit');
        const token = req.headers.authorization;
        const verifiedJWT = jwt.verify(token, "secretkey");
        const expense = new Expense(req.body.amount, req.body.description, req.body.category, verifiedJWT.userId);
        const result = await expense.save();
        const resJSON = {
            "newExpenseDetail" : {
                "id" : result[0].insertId, ...req.body
            }
        }
        return res.status(201).json(resJSON);
    }
    catch(err){
        if(err.name === 'JsonWebTokenError'){
            console.error('JsonWebTokenError-postExpense: ',err);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        console.error('WriteError-postExpense: ',err);
        return res.status(500).json({ error: 'Internal Server Error while adding expense' });
    }
};

exports.deleteExpense = async (req,res,next) => {
    try{
        const token = req.headers.authorization;
        const verifiedJWT = jwt.verify(token, "secretkey");
        const expenseId = req.params.id;
        const result = await Expense.deleteExpense(expenseId, verifiedJWT.userId);
        if(result[0].affectedRows == 1)
            res.status(204).json({status: "success"});
        else
            res.status(404).json({ error: 'Resource not found' });
    }
    catch(err){
        if(err.name === 'JsonWebTokenError'){
            console.error('JsonWebTokenError-postExpense: ',err);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        console.error('DeleteError-deleteExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while deleting expense' });
    }
};

exports.getExpense = (req,res,next) => {
    // console.log('get Expense hit');
    const expenseId = req.params.id;
    Expense.fetchById(expenseId)
        .then(result => {
            res.json(result[0][0]);
        })
        .catch(err => {
            console.error('ReadError-getExpense',err);
            // res.status(400).json([]);
        });
};

exports.putExpense = (req,res,next) => {
    const expense = new Expense(req.body.amount,req.body.description,req.body.category);
    expense.update(req.params.id)
        .then(result => {            
            // console.log(result);
            let resJSON = {
                "updatedExpenseDetail" : {
                    "id" : req.params.id, ...req.body
                }
            }
            res.json(resJSON);
        })
        .catch(err => {
            console.error('WriteError-putExpense',err);
            // res.status(400).json([]);
        });
};