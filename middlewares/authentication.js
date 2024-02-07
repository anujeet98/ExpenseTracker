const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.auth = async(req,res,next) => {
    try{
        const token = req.headers.authorization;
        const verifiedToken = jwt.verify(token, process.env.AUTH_KEY);
        const verifiedUser = await User.findById(verifiedToken.userId);
        if(verifiedUser){
            req.user = verifiedUser;
            next();
        }
        else{
            return res.status(401).json({ error: 'User not found. \nPlease sign in again' });
        }
    }
    catch(err){
        if(err.name === 'JsonWebTokenError'){
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        if(err.name === 'TokenExpiredError')
            return res.status(401).json({error: 'Token expired', message: 'Authentication token expired. \nPlease sign in again'});

        console.error('auth error: ',err);   
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}