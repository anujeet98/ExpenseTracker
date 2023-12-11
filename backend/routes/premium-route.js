const express = require('express');

const leaderboardController = require('../contollers/leaderboard-controller');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/leaderboard', authenticationMiddleware.auth, leaderboardController.leaderboardController);

module.exports = router;