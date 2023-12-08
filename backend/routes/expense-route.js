const express = require('express');
const expenseController = require('../contollers/expense-controller');

const router = express.Router();

router.get('/get-expenses', expenseController.getExpenses);

router.post('/add-expense', expenseController.postExpense);

router.delete('/delete-expense/:id', expenseController.deleteExpense);

router.get('/get-expense/:id', expenseController.getExpense);

router.put('/update-expense/:id', expenseController.putExpense);

module.exports = router;