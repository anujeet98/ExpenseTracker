const express = require('express');
const membershipController = require('../contollers/membership-controller');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/premium-membership', authenticationMiddleware.auth, membershipController.purchaseMembership);

router.put('/update-membership', authenticationMiddleware.auth, membershipController.updateMembershipOrder);



module.exports = router;