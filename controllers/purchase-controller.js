const Razorpay = require('razorpay');
const Order = require('../models/order-model');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const crypto = require('crypto');
const sequelize = require('../util/db');


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
    let tran;
    try{
        tran = await sequelize.transaction();
        const user = req.user;

        let rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        });
        const amount = 250;
        const order = await rzp.orders.create({amount: amount, currency: "INR"});

        await user.createOrder({order_id: order.id}, {transaction: tran});
        await tran.commit();
        res.status(201).json({order, key_id: rzp.key_id});
    }
    catch(err){
        if(tran)
            await tran.rollback();
        console.error('MembershipOrderError-purchaseMembership: ',err);
        return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
    }
};


exports.updateMembershipOrder = async(req,res,next) => {
    try{
        const tran = await sequelize.transaction();
        const{ razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        const user = req.user;

        // await rzpPaymentValidator(user, razorpay_payment_id, razorpay_signature);        

        let paymentStatus = "FAILED";
        let paymentId = null;

        if(razorpay_payment_id !== undefined && razorpay_payment_id.length !== 0){
            paymentStatus = "SUCCESS";
            paymentId = razorpay_payment_id;
        }   

        let updateOrderPromise;
        let updateUserPromise = Promise.resolve();
        try{
            updateOrderPromise =  Order.update(
                {payment_id: paymentId, order_status: paymentStatus},
                {where: {order_id: razorpay_order_id, userId: user.id}},
                {transaction: tran}
            ); 
            //update user isPremium
            if(paymentStatus === "SUCCESS")
                updateUserPromise = user.update({is_premium: true}, {transaction: tran});
        }
        catch(err){
            await tran.rollback();
            throw new Error(err);
        }
        const [updatedOrder, updatedUser] = await Promise.all([updateOrderPromise, updateUserPromise]); 

        if(paymentStatus === "FAILED" && updatedOrder[0] === 1){  //update db with failed status
            await tran.commit();
            return res.status(200).json({ message: 'Payment status updated successfully to FAILED' });
            // return res.status(200).json({error: "Payment status updated to FAILED.\n Please try again"})
        }  

        if(paymentStatus === "SUCCESS" && updatedOrder[0] === 1 && updatedUser.dataValues.is_premium===true){
            await tran.commit();
            return res.status(200).json({token: jwt.sign({userId:user.id, isPremium: true}, process.env.AUTH_KEY)});
        }
        else{
            await tran.rollback();
            return res.status(404).json({ error: 'Resource not found' });
        }
                
    }
    catch(err){
        console.error('UpdateOrderError-updateMembershipOrder: ',err);
        return res.status(500).json({ error: 'Internal Server Error while updating membership' });
    }

};