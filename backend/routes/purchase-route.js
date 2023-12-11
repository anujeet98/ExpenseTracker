const express = require('express');
const purchaseController = require('../contollers/purchase-controller');
const authenticationMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/premium-membership', authenticationMiddleware.auth, purchaseController.purchaseMembership);

router.put('/update-membership', authenticationMiddleware.auth, purchaseController.updateMembershipOrder);



module.exports = router;