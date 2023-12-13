const Sib = require('sib-api-v3-sdk');
const User = require('../models/user-model');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

exports.getResetPassword = async(req, res, next) => {
    try{
        const email = req.params.email;
        const user = await User.findOne({where: {email: email}});

        if(user){
            const tranEmailApi = new Sib.TransactionalEmailsApi();
    
            const sender = {email: process.env.SIB_SENDER_EMAIL, name: process.env.SIB_SENDER_NAME};
            const receiver = {email: email};
        
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receiver,
                subject: 'PASSWORD-RESET: Expense Tracker',
                htmlContent: `
                    <h1>Expense Tracker - Password Reset</h1><br>
                    <br>
                    <h3>Dear ${user.username},</h3><br>
                    <br>
                    <p>Please use the following link to <a href="${process.env.APP_URL}">reset</a> the password.</p><br>
                    <br><br>
                    <h5>Thank You<h5><br>
                `
            });
        
            res.status(200).json({message: `We have sent the password reset link to ${email}`});
        }
        else{
            res.status(404).json({error: `${email} is not a registered email`});
        }
    }
    catch(err){
        console.log('Error-getResetPassword: ',err);
        res.status(500).json({error: 'Internal server error while sending reset password email'});
    }

};