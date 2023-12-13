const Razorpay = require('razorpay');
const Order = require('../models/order-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const crypto = require('crypto');


async function rzpPaymentValidator(user, razorpay_payment_id, razorpay_signature){
    let order_ids = await user.getOrders({
        attributes: ['order_id'], 
        order: [['createdAt', 'DESC']], 
        where: {order_status: { [Sequelize.Op.in]: ['PENDING', 'FAILURE']}}
    });
    const order_id = order_ids[0].order_id;

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                        .update(order_id + "|" +razorpay_payment_id)
                        .digest('hex');
    
    if (generated_signature === razorpay_signature)
        console.log(true);
    else
        console.log(false);
}

exports.purchaseMembership = async(req,res,next) => {
    try{
        let rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        });
        const amount = 250;
        
        let order;
        try{
            order = await rzp.orders.create({amount: amount, currency: "INR"});
        }
        catch(err){
            console.error('RZPcreateOrderError-purchaseMembership: ',err);
            return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
        }
        const user = req.user;
        const result = await user.createOrder({order_id: order.id});
        res.status(201).json({order, key_id: rzp.key_id});
    }
    catch(err){
        console.error('MembershipOrderError-purchaseMembership: ',err);
        return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
    }
};


exports.updateMembershipOrder = async(req,res,next) => {
    try{
        const{ razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        const user = req.user;
        console.log(razorpay_payment_id);

        // await rzpPaymentValidator(user, razorpay_payment_id, razorpay_signature);        

        let paymentStatus = "FAILED";
        let paymentId = null;
        if(razorpay_payment_id !== undefined && razorpay_payment_id.length !== 0){
            paymentStatus = "SUCCESS";
            paymentId = razorpay_payment_id;
        }   

        const updateOrderPromise =  Order.update(
            {payment_id: paymentId, order_status: paymentStatus},
            {where: {order_id: razorpay_order_id, userId: user.id}}
        ); 

        let updateUserPromise = Promise.resolve();
        //update user isPremium
        if(paymentStatus === "SUCCESS")
            updateUserPromise = user.update({is_premium: true});
        

        const [updatedOrder, updatedUser] = await Promise.all([updateOrderPromise, updateUserPromise]); 
        if(paymentStatus === "FAILED"){
            return res.status(400).json({error: "Payment failed.\n Please try again"})
        }  

        if(updatedOrder[0] === 1){
            return res.status(200).json({token: jwt.sign({userId:user.id, isPremium: true}, process.env.AUTH_KEY)});
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