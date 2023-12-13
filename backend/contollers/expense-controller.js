const sequelize= require('../util/db');
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
    let tran;
    try{
        tran = await sequelize.transaction();
        const {amount, description, category} = req.body;

        if(inputValidator(amount) || inputValidator(description) || inputValidator(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const resJSON = {
            "newExpenseDetail" : {
                "id" : expenseRes.id, ...req.body
            }
        }

        const user = req.user;
        const [expenseRes, userRes] = await Promise.all([
            user.createExpense({ amount, description, category }, { transaction: tran }),
            user.update({ total_expense: user.total_expense + +amount }, { transaction: tran })
          ]);
        await tran.commit();
        return res.status(201).json(resJSON);
    }
    catch(err){
        if(tran)
            await tran.rollback();
        console.error('WriteError-postExpense: ',err);
        return res.status(500).json({ error: 'Internal Server Error while adding expense' });
    }
};

exports.deleteExpense = async (req,res,next) => {
    let tran;
    try{
        tran = await sequelize.transaction();
        const expenseId = req.params.id;
        const user = req.user;
        const oldExpenseAmount = await user.getExpenses({where: {id: expenseId}, attributes: ['amount']});
        const newTotalExpense = -oldExpenseAmount[0].dataValues.amount + +user.total_expense;

        const[expenseRes, userRes] = await Promise.all([
            Expense.destroy({where: {id: expenseId, userId: user.id}}, {transaction: tran}),
            user.update({total_expense: newTotalExpense}, {transaction: tran})
        ]);

        if(expenseRes === 1){
            await tran.commit();
            return res.status(204).json({status: "success"});
        }
        else{
            await tran.rollback();
            res.status(404).json({ error: 'Resource not found' });
        }
    }catch(err){
        if(tran)
            await tran.rollback();
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
    let tran;
    try{
        tran = await sequelize.transaction();

        const {amount, description, category} = req.body;
        const user = req.user;
        const expenseId = req.params.id;

        if(inputValidator(amount) || inputValidator(description) || inputValidator(category)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const oldExpenseAmount = await user.getExpenses({where: {id: expenseId}, attributes: ['amount']});
        const newTotalExpense = +user.total_expense + -oldExpenseAmount[0].dataValues.amount + +amount;

        const [expenseRes, userRes] = await Promise.all([
            Expense.update(
                {amount: amount, description:description, category:category},
                {where: {id:expenseId, userId:user.id}},
                {transaction: tran}
            ),
            user.update({total_expense: newTotalExpense}, {transaction: tran})
        ]);

        if(expenseRes[0] === 1){
            let resJSON = {
                "updatedExpenseDetail" : {
                    "id" : req.params.id, ...req.body
                }
            }
            await tran.commit();
            res.status(201).json(resJSON);
        }
        else{
            await tran.rollback();
            res.status(404).json({ error: 'Resource not found' });
        }
    }
    catch(err){
        if(tran)
            await tran.rollback();
        console.error('updateError-putExpense',err);
        return res.status(500).json({ error: 'Internal Server Error while updating expense' });
    }
};