const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

module.exports.auth = async(req,res,next) => {
    try{
        const token = req.headers.authorization;
        const verifiedToken = jwt.verify(token, process.env.AUTH_KEY);
        const verifiedUser = await User.findByPk(verifiedToken.userId);
        if(verifiedUser!=null){
            req.user = verifiedUser;
            next();
        }
        else{
            return res.status(404).json({ error: 'User not found' });
        }
    }
    catch(err){
        if(err.name === 'JsonWebTokenError'){
            console.error('JsonWebTokenError-auth: ',err);   
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        console.error('InternalServerError-auth: ',err);   
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}