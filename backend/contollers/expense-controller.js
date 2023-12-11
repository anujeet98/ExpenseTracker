const Expense = require('../models/expense-model.js');
const db = require('../util/db.js');
const jwt = require('jsonwebtoken');

function validateInput(input){
    if(input.length===0)
        return true;
}

exports.getExpenses = async(req,res,next) => {
    try{
        // console.log('get Expenses hit');
        const result = await Expense.fetchAll(req.userId);  
        return res.status(200).json(result[0]);
    }
    catch(err){
        console.error('ReadError-getExpenses',err);
        return res.status(500).json({error: "Internal Server Error while fetching expenses"});
    }
};

exports.postExpense = async(req,res,next) => {
    try{
        // console.log('post Expense hit');
        const {amount, description, category} = req.body;
        if(validateInput(amount) || validateInput(description) || validateInput(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }
        const expense = new Expense(amount, description, category, req.userId);
        const result = await expense.save();
        const resJSON = {
            "newExpenseDetail" : {
                "id" : result[0].insertId, ...req.body
            }
        }
        return res.status(201).json(resJSON);
    }
    catch(err){
        console.error('WriteError-postExpense: ',err);
        return res.status(500).json({ error: 'Internal Server Error while adding expense' });
    }
};

exports.deleteExpense = async (req,res,next) => {
    try{
        const expenseId = req.params.id;
        const result = await Expense.deleteExpense(expenseId, req.userId);
        if(result[0].affectedRows === 1)
            res.status(204).json({status: "success"});
        else
            res.status(404).json({ error: 'Resource not found' });
    }
    catch(err){
        console.error('DeleteError-deleteExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while deleting expense' });
    }
};

exports.getExpense = async(req,res,next) => {
    try{
        // console.log('get Expense hit');
        const expenseId = req.params.id;
        const result = await Expense.fetchById(expenseId, req.userId);
        if(result[0].length !== 0)
            res.status(200).json(result[0][0]);
        else
            res.status(404).json({ error: 'Resource not found' });
    }
    catch(err){
        console.error('ReadError-getExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while getting expense' });
    }
};

exports.putExpense = async(req,res,next) => {
    try{
        const {amount, description, category} = req.body;
        if(validateInput(amount) || validateInput(description) || validateInput(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const expense = new Expense(amount, description, category, req.userId);
        const result = await expense.update(req.params.id);
        if(result[0].affectedRows === 1){
            let resJSON = {
                "updatedExpenseDetail" : {
                    "id" : req.params.id, ...req.body
                }
            }
            res.status(201).json(resJSON);
        }
        else
            res.status(404).json({ error: 'Resource not found' });
    }
    catch(err){
        console.error('WriteError-putExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while updating expense' });
    }
};