const Expense = require('../models/expense-model.js');
const User = require('../models/user-model.js')
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

exports.addExpense = async(req,res,next) => {
    try{
        // console.log('post Expense hit');
        const {amount, description, category} = req.body;
        if(validateInput(amount) || validateInput(description) || validateInput(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }
        const expense = new Expense(amount, description, category, req.userId);
        
        const expensePromise = expense.save();
        const userPromise = User.updateTotalExpense(amount, req.userId);

        const [expenseRes, userRes] = await Promise.all([expensePromise, userPromise]);

        const resJSON = {
            "newExpenseDetail" : {
                "id" : expenseRes[0].insertId, ...req.body
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
        const old_expense = await Expense.fetchById(expenseId, req.userId);
        const result = await Expense.deleteExpense(expenseId, req.userId);
        if(result[0].affectedRows === 1){
            res.status(204).json({status: "success"});
            try{
                const amtToRemove = old_expense[0][0].amount * -1;
                await User.updateTotalExpense(amtToRemove,req.userId);
            }
            catch(err){
                console.error('updateError-deleteExpense',err);
                return res.status(500).json({ error: 'Internal Server Error while deleting expense' });
            }
        }
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

exports.updateExpense = async(req,res,next) => {
    try{
        const {amount, description, category} = req.body;
        if(validateInput(amount) || validateInput(description) || validateInput(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const old_expense = await Expense.fetchById(req.params.id, req.userId);
        const expense = new Expense(amount, description, category, req.userId);
        const result = await expense.update(req.params.id);
        if(result[0].affectedRows === 1){
            try{
                const amtToUpdate = amount-old_expense[0][0].amount;
                await User.updateTotalExpense(amtToUpdate,req.userId);
            }
            catch(err){
                console.error('updateError-updateExpense',err);
                return res.status(500).json({ error: 'Internal Server Error while updating total expense' });
            }

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