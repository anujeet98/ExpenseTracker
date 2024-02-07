const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
        const user = req.user;

        let rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        });
        const amount = 250;
        const order = await rzp.orders.create({amount: amount, currency: "INR"});

        await new Order({order_id: order.id, userId: user._id}).save();

        res.status(201).json({order, key_id: rzp.key_id});
    }
    catch(err){
        console.error('MembershipOrderError-purchaseMembership: ',err);
        return res.status(500).json({ error: 'Internal Server Error while purchasing membership' });
    }
};


exports.updateMembershipOrder = async(req,res,next) => {
    try{
        const user = req.user;
        const{ razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        // await rzpPaymentValidator(user, razorpay_payment_id, razorpay_signature);        

        let paymentStatus = "FAILED";
        let paymentId = null;
        if(razorpay_payment_id !== undefined && razorpay_payment_id.length !== 0){
            paymentStatus = "SUCCESS";
            paymentId = razorpay_payment_id;
        }   

        let updateOrderPromise;
        let updateUserPromise = Promise.resolve();

        const session = await mongoose.startSession();
        session.startTransaction();
        try{        
            //update order paymentStatus and paymentId
            updateOrderPromise =  Order.findOneAndUpdate({order_id: razorpay_order_id, userId: user._id},
                {payment_id: paymentId, order_status: paymentStatus},
                { session }
            ); 
            //update user isPremium
            updateUserPromise = paymentStatus === "SUCCESS" ? User.findByIdAndUpdate({_id: user._id}, {is_premium: true}, {session}) : Promise.resolve();

            await Promise.all([updateOrderPromise, updateUserPromise]); 
            await session.commitTransaction(); 
        }
        catch(err){
            await session.abortTransaction();
            throw new Error(err);
        }      
        finally{
            await session.endSession();
        }       
        if(paymentStatus === "FAILED")
            return res.status(200).json({ message: 'Payment status updated successfully to FAILED' });
        return res.status(200).json({token: jwt.sign({userId:user._id, isPremium: true}, process.env.AUTH_KEY)}); 
    }
    catch(err){
        console.error('UpdateOrderError-updateMembershipOrder: ',err);
        return res.status(500).json({ error: 'Internal Server Error while updating membership' });
    }
};