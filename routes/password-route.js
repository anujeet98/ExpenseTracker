const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/password');

router.get('/forget/:email', passwordController.forget);

router.get('/reset/:id', passwordController.reset);

router.patch('/update/', passwordController.update);

module.exports = router;