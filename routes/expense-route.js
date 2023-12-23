const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense-controller');
const authenticationMiddleware = require('../middlewares/authentication');


router.get('/get-expenses', authenticationMiddleware.auth, expenseController.getExpenses);
router.post('/add-expense', authenticationMiddleware.auth, expenseController.addExpense);
router.delete('/delete-expense/:id', authenticationMiddleware.auth, expenseController.deleteExpense);
router.put('/update-expense/:id', authenticationMiddleware.auth, expenseController.updateExpense);
router.get('/get-expense/:id', authenticationMiddleware.auth, expenseController.getExpense);

module.exports = router;