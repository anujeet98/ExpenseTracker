const express = require('express');
const appController = require('../contollers/app-controller');

const router = express.Router();

router.get('/get-expenses', appController.getExpenses);

router.post('/add-expense', appController.postExpense);

router.delete('/delete-expense/:id', appController.deleteExpense);

router.get('/get-expense/:id', appController.getExpense);

router.put('/update-expense/:id', appController.putExpense);

module.exports = router;