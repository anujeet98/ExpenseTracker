
module.exports.verify = (req, res, next) => {
    try{
        if(req.user.is_premium)
            next();
        else
            return res.status(403).json({error: 'User not a premium member'});
    }
    catch(err){
        console.error('member-verify error: ',err);   
        res.status(500).json({error: 'Internal Server Error'});
    }
}