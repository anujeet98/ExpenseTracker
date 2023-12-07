const User = require('../models/user-model');


module.exports.postSignup = async(req,res,next) => {
    try{
        const existingUser = await User.findUserByEmail(req.body.email);
        if(existingUser[0].length != 0){
            //user exists
            return res.status(400).json({error: "Email already exists"});
        }

        //else, user doesn't exists -> create new record
        const {username, email, password} = req.body;
        const newUser = new User(username, email, password);

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser[0]);
    }catch(err){
        res.status(500).json({error: 'SignupError: '+err});
    }
}