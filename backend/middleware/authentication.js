const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

module.exports.auth = async(req,res,next) => {
    try{
        const token = req.headers.authorization;
        const verifiedJWT = jwt.verify(token, process.env.AUTH_KEY);
        const userExists = await User.findUserById(verifiedJWT.userId);
        if(userExists[0].length!==0){
            req.userId = verifiedJWT.userId;
            next();
        }
        else{
            console.error("UserNotFound");
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