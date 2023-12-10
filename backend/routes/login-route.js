
const express = require('express');
const router = express.Router();

const loginpController = require('../contollers/login-controller');


router.post('/signup', loginpController.postSignup);

router.post('/login', loginpController.postLogin);



module.exports = router;