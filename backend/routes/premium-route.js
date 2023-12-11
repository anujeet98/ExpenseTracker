const express = require('express');

const premiumController = require('../contollers/premium-feature-controller');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/leaderboard', authenticationMiddleware.auth, premiumController.getLeaderBoard);

module.exports = router;