const Razorpay = require('razorpay');
const Order = require('../models/order-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');


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

        if(Object.keys(req.body).length===1) //update status failed
            orderObj = new Order(razorpay_order_id, null, "FAILED", req.userId);
        else //update status success/payment_id/isPremium
            orderObj = new Order(razorpay_order_id, razorpay_payment_id, "SUCCESS", req.userId);

        const updateOrderPromise = orderObj.updateOrderPayment();

        let updateUserPromise = Promise.resolve();

        //update user isPremium
        if(Object.keys(req.body).length!==1)
            updateUserPromise = User.updateIsPremium(req.userId);
        

        const [updatedOrder, updatedUser] = await Promise.all([updateOrderPromise, updateUserPromise]);   
        if(updatedOrder[0].affectedRows === 1){
            return res.status(200).json({token: jwt.sign({userId:req.userId, isPremium: true}, process.env.AUTH_KEY)});
        }
        else{
            return res.status(404).json({ error: 'Resource not found' });
        }
                
    }
    catch(err){
        console.error('UpdateOrderError-updateMembershipOrder: ',err);
        return res.status(500).json({ error: 'Internal Server Error while updating membership' });
    }

};