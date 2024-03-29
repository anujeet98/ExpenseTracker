const mailjet = require('node-mailjet').Client.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgetPassword = require('../models/password');
const inputValidator = require('../util/input-validator');

//----------------------------------------------------------------------------------------------------

exports.forget = async(req, res, next) => {
    try{
        const email = req.params.email;
        const user = await User.findOne({email: email});

        if(user){
            const id = uuid.v4();
            await new ForgetPassword({_id: id, active: true, userId: user._id}).save();

            const request = await mailjet.post('send').request({
                FromEmail: process.env.SIB_SENDER_EMAIL,
                FromName: process.env.SIB_SENDER_NAME,
                Subject: 'PASSWORD-RESET: Expense Tracker',
                'Text-part':
                  'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
                'Html-part': `
                    <h1>Expense Tracker - Password Reset</h1><br>
                    <br>
                    <h3>Dear ${user.username},</h3><br>
                    <br>
                    <p>Please use the following link to </p> <a href="${process.env.BACKEND_ADDR}/password/reset/${id}">reset</a> <p> your password.</p><br>
                    <br><br>
                    <h5>Thank You<h5><br>
                `,
                Recipients: [{ Email: email }],
            });  
            if(request)   
                res.status(200).json({message: `We have sent the password reset link to ${email}. Please check your spam for the reset email`});   
        }
        else{
            res.status(404).json({error: `${email} is not a registered email`});
        }
    }
    catch(err){
        console.log('Error-forgetPassword: ',err);
        res.status(500).json({error: 'Internal server error while sending reset password email'});
    }

};


exports.reset = async (req, res, next) => {
    try{
        const requestId = req.params.id;
        const passwordRequest = await ForgetPassword.findOne({_id: requestId});
        if(passwordRequest && passwordRequest.active){
            passwordRequest.active = false;
                await passwordRequest.save();
                res.status(200).sendFile('reset-password.html',{root: 'views'});
        }
        else{
            res.status(401).json({error: 'Invalid request recieved'});
        }
    }
    catch(err){
        console.error('Error-getResetPassword: ',err);
        res.status(500).json({error: 'Internal Server Error while fetching password reset form'});
    }
};



exports.update = async (req, res, next) => {
    try{
        const requestId = req.body.requestId;
        const newPassword = req.body.newPassword;

        if(inputValidator.text(requestId) || inputValidator.text(newPassword)){
            return res.status(400).json({ error: 'bad input parameters' });
        }

        const passwordRequest = await ForgetPassword.findOne({_id: requestId});
        if(passwordRequest){
            const user = await User.findOne({_id:passwordRequest.userId});
            if(user){
                user.password = await bcrypt.hash(newPassword, 10);
                await user.save();
                res.status(200).json({message: 'password reset successful. Kindly login again.'});
            }
            else{
                return res.status(404).json({error: "User doesn't exists"});
            }
        }
        else{
            return res.status(404).json({error: "Invalid resuestID for password reset"});
        }
    }
    catch(err){
        console.error('Error-updatePassword: ',err);
        res.status(500).json({error: 'Internal Server Error while updating the password'});
    }
};
