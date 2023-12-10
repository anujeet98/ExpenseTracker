const Razorpay = require('razorpay');
const Order = require('../models/order-model');


exports.purchaseMembership = async(req,res,next) => {
    try{
        let rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        });
        const amount = 250;

        let order;
        try{
            order = await rzp.orders.create({amount, currency: "INR"});
        }
        catch(err){
            console.error('RZPcreateOrderError-purchaseMembership: ',err);
            return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
        }

        const orderObj = new Order(order.id, "PENDING", req.userId);
        
        const result = await orderObj.save();
        res.status(201).json({order, key_id: rzp.key_id});
    }
    catch(err){
        console.error('MembershipOrderError-purchaseMembership: ',err);
        return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
    }
};


exports.updateMembershipOrder = async(req,res,next) => {
};