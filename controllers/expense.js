const { default: mongoose } = require('mongoose');
const Expense = require('../models/expense');
const User = require('../models/user');

const inputValidator = require('../util/input-validator');


exports.getExpenses = async(req,res,next) => {
    try{
        const user = req.user;
        if(inputValidator.number(req.query.page) || inputValidator.number(req.query.rowsperpage)){
            return res.status(422).json({ error: 'bad input parameters' });
        }
        
        const page = +req.query.page;
        const ITEMS_PER_PAGE = +req.query.rowsperpage;
        const reqDate = req.query.date;
        //+process.env.EXPENSE_PER_PAGE;
        const currentDate = new Date(reqDate)
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);

        const [totalExpenseCount, expenses] = await Promise.all([
            Expense.countDocuments(
                {
                    userId: user.id,
                    ...(
                        reqDate ? 
                            {
                                date: {
                                    $gt : currentDate,
                                    $lt : nextDate,
                                }
                            }
                        :{}),
                }
            ),
            Expense.find(
                {
                    userId: user.id,
                    ...(
                        reqDate ? 
                            {
                                date: {
                                    $gt : currentDate,
                                    $lt : nextDate,
                                }
                            }
                        :{}),
                }).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        ]);
        const resJSON = {
            expenses: expenses,
            hasNextPage: totalExpenseCount > (page*ITEMS_PER_PAGE),
            hasPreviousPage: page > 1,
            previousPage: page-1,
            currentPage: page,
            nextPage: page+1,
            lastsPage: Math.ceil(totalExpenseCount/ITEMS_PER_PAGE)
        }   
        return res.status(200).json(resJSON);
    }
    catch(err){
        console.error('getExpenses error: ',err);
        return res.status(500).json({error: "Internal Server Error while fetching expenses"});
    }
};

exports.addExpense = async(req,res,next) => {
    try{
        const {amount, description, category} = req.body;

        if(inputValidator.number(amount) || inputValidator.text(description) || inputValidator.text(category)){
            return res.status(422).json({ error: 'bad input parameters' });
        }

        const newExpense = new Expense({
            amount: amount,
            description: description,
            category: category,
            date: new Date(),
            userId: req.user._id
        });

        req.user.total_expense += +amount;

        const session = await mongoose.startSession();
        session.startTransaction(); 
        try{
            await newExpense.save({session}),
            await req.user.save({session})
            await session.commitTransaction(); 
        }
        catch(err){
            await session.abortTransaction();
            throw new Error(err);
        }
        finally{
            await session.endSession();
        }
        
        return res.status(201).json({status: "success"});
    }
    catch(err){
        console.error('addExpense error: ',err);
        return res.status(500).json({ error: 'Internal Server Error while adding expense' });
    }
};

exports.deleteExpense = async (req,res,next) => {
    try{
        const expenseId = req.params.id;
        const user = req.user;

        const oldExpense = await Expense.findById(expenseId);
        if(!oldExpense)
            return res.status(404).json({error: 'expense with expenseId not found'});
        const newTotalExpense = -oldExpense.amount + +user.total_expense;

        user.total_expense = +newTotalExpense;

        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            await oldExpense.deleteOne({_id: expenseId, userId: user.id}, {session}),
            await user.save({session})
            await session.commitTransaction();
        }
        catch(err){
            await session.abortTransaction();
            throw new Error(err);
        }
        finally{
            await session.endSession();
        }

        return res.status(204).json({status: "success"});
    }catch(err){
        console.error('deleteExpense error: ',err);
        return res.status(500).json({ error: 'Internal Server Error while deleting expense' });
    }
};

exports.getExpense = async(req,res,next) => {
    try{
        const expenseId = req.params.id;
        const result = await Expense.findById(expenseId);
        if(result)
            res.status(200).json(result);
        else
            res.status(404).json({ error: 'Resource not found' });
    }
    catch(err){
        console.error('getExpense error: ',err);
        return res.status(500).json({ error: 'Internal Server Error while getting expense' });
    }
};

exports.updateExpense = async(req,res,next) => {
    try{
        const {amount, description, category} = req.body;
        const user = req.user;
        const expenseId = req.params.id;

        if(inputValidator.number(amount) || inputValidator.text(description) || inputValidator.text(category)){
            return res.status(422).json({ error: 'bad input parameters' });
        }

        const oldExpense = await Expense.findById(expenseId);
        if(!oldExpense)
            return res.status(404).json({error: 'expense with expenseId not found'})
        const newTotalExpense = +user.total_expense + -oldExpense.amount + +amount;

        oldExpense.amount = amount;
        oldExpense.description = description;
        oldExpense.category = category;

        user.total_expense = +newTotalExpense;

        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            await oldExpense.save({session});  //save the updated values
            await user.save({session});

            await session.commitTransaction();
        }
        catch(err){
            await session.abortTransaction();
            throw new Error(err);
        }
        finally{
            session.endSession();
        }

        res.status(201).json({message: "success"});
    }
    catch(err){
        console.error('putExpense error: ',err);
        return res.status(500).json({ error: 'Internal Server Error while updating expense' });
    }
};