const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense-controller');
const authenticationMiddleware = require('../middlewares/authentication');

router.get('/:id', authenticationMiddleware.auth, expenseController.getExpense);
router.get('/', authenticationMiddleware.auth, expenseController.getExpenses);
router.post('/', authenticationMiddleware.auth, expenseController.addExpense);
router.put('/:id', authenticationMiddleware.auth, expenseController.updateExpense);
router.delete('/:id', authenticationMiddleware.auth, expenseController.deleteExpense);


module.exports = router;