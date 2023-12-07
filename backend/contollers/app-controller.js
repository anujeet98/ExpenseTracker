const Expense = require('../models/expense-model.js');
const db = require('../Util/db.js');

exports.getExpenses = (req,res,next) => {
    // console.log('get Expenses hit');
    Expense.fetchAll()
        .then(result => {
            res.json(result[0]);
        })
        .catch(err => {
            console.error('ReadError-getExpenses',err);
            // res.status(400).json([]);
        });
};

exports.postExpense = (req,res,next) => {
    // console.log('post Expense hit');
    const expense = new Expense(req.body.amount,req.body.description,req.body.category);
    expense.save()
        .then(result => {
            let resJSON = {
                "newExpenseDetail" : {
                    "id" : result[0].insertId, ...req.body
                }
            }
            
            // console.log(resJSON);
            res.json(resJSON);
        })
        .catch(err => {
            console.error('WriteError-postExpense',err);
            // res.status(400).json([]);
        });
};

exports.deleteExpense = (req,res,next) => {
    const expenseId = req.params.id;
    Expense.deleteexpense(expenseId)
        .then(result => {
            if(result[0].affectedRows == 1)
                res.json({"delete status": "success"});
            else
                res.json({"delete status": "fail"});
        })
        .catch(err => {
            console.error('DeleteError-deleteExpense',err);
            // res.status(400).json([]);
        });
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