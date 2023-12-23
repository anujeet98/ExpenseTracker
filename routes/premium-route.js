const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premium-feature-controller');
const authenticationMiddleware = require('../middlewares/authentication');


router.get('/leaderboard', authenticationMiddleware.auth, premiumController.getLeaderBoard);
router.get('/download', authenticationMiddleware.auth, premiumController.getReport);
module.exports = router;