const express = require('express');
const router = express.Router();

const premiumController = require('../contollers/premium-feature-controller');
const authenticationMiddleware = require('../middleware/authentication');


router.get('/leaderboard', authenticationMiddleware.auth, premiumController.getLeaderBoard);

module.exports = router;