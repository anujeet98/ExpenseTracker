const express = require('express');
const purchaseController = require('../controllers/purchase-controller');
const authenticationMiddleware = require('../middlewares/authentication');

const router = express.Router();

router.get('/premium-membership', authenticationMiddleware.auth, purchaseController.purchaseMembership);

router.put('/update-membership', authenticationMiddleware.auth, purchaseController.updateMembershipOrder);



module.exports = router;