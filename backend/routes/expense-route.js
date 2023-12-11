const express = require('express');
const expenseController = require('../contollers/expense-controller');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/get-expenses', authenticationMiddleware.auth, expenseController.getExpenses);

router.post('/add-expense', authenticationMiddleware.auth, expenseController.addExpense);

router.delete('/delete-expense/:id', authenticationMiddleware.auth, expenseController.deleteExpense);

router.get('/get-expense/:id', authenticationMiddleware.auth, expenseController.getExpense);

router.put('/update-expense/:id', authenticationMiddleware.auth, expenseController.updateExpense);

module.exports = router;