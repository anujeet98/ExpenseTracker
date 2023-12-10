const express = require('express');
const membershipController = require('../contollers/membership-controller');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/premium-membership', authenticationMiddleware.auth, membershipController.purchaseMembership);



module.exports = router;