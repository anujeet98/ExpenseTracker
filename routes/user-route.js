const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/authentication');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/', authMiddleware.auth, userController.getUserInfo);


module.exports = router;