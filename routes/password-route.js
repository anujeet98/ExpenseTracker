const express = require('express');
const router = express.Router();

const passwordController = require('../controllers/password-controller');

router.get('/forgotpassword/:email', passwordController.forgetPassword);

router.get('/resetpassword/:id', passwordController.resetPassword);

router.patch('/updatepassword/', passwordController.updatePassword);

module.exports = router;