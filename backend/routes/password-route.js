const express = require('express');
const router = express.Router();

const passwordController = require('../contollers/password-controller');

router.get('/forgotpassword/:email', passwordController.getResetPassword);

module.exports = router;