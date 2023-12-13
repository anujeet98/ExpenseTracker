const { Sequelize } = require('sequelize');

const Expense = require('../models/expense-model');
const User = require('../models/user-model');

const inputValidator = require('../util/input-validator');


exports.getExpenses = async(req,res,next) => {
    try{
        const user = req.user;
        const result = await user.getExpenses();
        return res.status(200).json(result);
    }
    catch(err){
        console.error('ReadError-getExpenses',err);
        return res.status(500).json({error: "Internal Server Error while fetching expenses"});
    }
};

exports.addExpense = async(req,res,next) => {
    try{
        const {amount, description, category} = req.body;

        if(inputValidator(amount) || inputValidator(description) || inputValidator(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const user = req.user;
        const expensePromise = user.createExpense({amount: amount, description: description, category: category});
        const userPromise = user.update(
            {total_expense:  user.total_expense + +amount}
        );

        const [expenseRes, userRes] = await Promise.all([expensePromise, userPromise]);

        const resJSON = {
            "newExpenseDetail" : {
                "id" : expenseRes.insertId, ...req.body
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
        const user = req.user;
        const oldExpenseAmount = await user.getExpenses({where: {id: expenseId}, attributes: ['amount']});
        const result = await Expense.destroy({where: {id: expenseId, userId: user.id}});
        if(result === 1){
            const newTotalExpense = -oldExpenseAmount[0].dataValues.amount + +user.total_expense;
            await user.update({total_expense: newTotalExpense});
            return res.status(204).json({status: "success"});
        }
        else
            res.status(404).json({ error: 'Resource not found' });
    }catch(err){
        console.error('DeleteError-deleteExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while deleting expense' });
    }
};

exports.getExpense = async(req,res,next) => {
    try{
        const expenseId = req.params.id;
        const result = await Expense.findOne({where: {id: expenseId, userId: req.user.id}});
        if(result!==null)
            res.status(200).json(result);
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
        const user = req.user;
        const expenseId = req.params.id;
        if(inputValidator(amount) || inputValidator(description) || inputValidator(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const oldExpenseAmount = await user.getExpenses({where: {id: expenseId}, attributes: ['amount']});
        const result = await Expense.update(
            {amount: amount, description:description, category:category},
            {where: {id:expenseId, userId:user.id}}
        );
        if(result[0] === 1){
            if(oldExpenseAmount[0].dataValues.amount !== +amount){
                const newTotalExpense = +user.total_expense + -oldExpenseAmount[0].dataValues.amount + +amount;
                await user.update({total_expense: newTotalExpense});
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
        console.error('updateError-putExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while updating expense' });
    }
};