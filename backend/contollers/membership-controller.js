const Razorpay = require('razorpay');
const Order = require('../models/order-model');
const User = require('../models/user-model');


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

        const orderObj = new Order(order.id, "", "PENDING", req.userId);
        
        const result = await orderObj.save();
        res.status(201).json({order, key_id: rzp.key_id});
    }
    catch(err){
        console.error('MembershipOrderError-purchaseMembership: ',err);
        return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
    }
};


exports.updateMembershipOrder = async(req,res,next) => {
    try{
        const{razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        let orderObj;
        let updateUser = Promise.resolve();
        if(Object.keys(req.body).length===1){
            //update status failed
            orderObj = new Order(razorpay_order_id, null, "FAILED", req.userId);
        }
        else{
            //update status success/payment_id/isPremium
            orderObj = new Order(razorpay_order_id, razorpay_payment_id, "SUCCESS", req.userId);
            updateUser = User.updateIsPremium(req.userId);

        }
        const updateOrder = orderObj.updateOrderPayment();

        const [updatedOrder, updatedUser] = await Promise.all([updateOrder, updateUser]);   
        if(updatedOrder[0].affectedRows === 1){
            return res.status(204).json();
        }
        else{
            console.log("res not found");
            return res.status(300).json({ error: 'Resource not found' });
        }
                
    }
    catch(err){
        console.error('UpdateOrderError-updateMembershipOrder: ',err);
        return res.status(500).json({ error: 'Internal Server Error while updating membership' });
    }

};