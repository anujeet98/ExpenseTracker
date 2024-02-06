const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premium-feature');
const authenticationMiddleware = require('../middlewares/authentication');
const premiumVerifyMiddleware = require('../middlewares/premium-verify');


router.get('/leaderboard', authenticationMiddleware.auth, premiumVerifyMiddleware.verify, premiumController.getLeaderBoard);
router.get('/download', authenticationMiddleware.auth, premiumVerifyMiddleware.verify, premiumController.getReport);
router.get('/report/category', authenticationMiddleware.auth, premiumVerifyMiddleware.verify, premiumController.getExpenseByCategory);
router.get('/report/timeline', authenticationMiddleware.auth, premiumVerifyMiddleware.verify, premiumController.getExpenseByTimeline);


module.exports = router;