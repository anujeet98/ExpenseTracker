const mailjet = require('node-mailjet').Client.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  )
const User = require('../models/user-model');


exports.getResetPassword = async(req, res, next) => {
    try{
        const email = req.params.email;
        const user = await User.findOne({where: {email: email}});

        if(user){            
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
                    <p>Please use the following link to </p> <a href="http://localhost:9000/password/resetpassword/${user.id}">reset</a> <p> your password.</p><br>
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
        console.log('Error-getResetPassword: ',err);
        res.status(500).json({error: 'Internal server error while sending reset password email'});
    }

};