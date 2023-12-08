const User = require('../models/user-model');
const bcrypt = require('bcrypt');


function validateInput(input){
    if(input.length === 0)
        return true;
    return false;
}

module.exports.postSignup = async(req,res,next) => {
    try{
        const {username, email, password} = req.body;
        if(validateInput(username) || validateInput(email) || validateInput(password)){
            return res.status(400).json({error: "bad input parameters"});
        }
        const existingUser = await User.findUserByEmail(email);
        if(existingUser[0].length !== 0){
            //user exists
            return res.status(400).json({error: "Email already exists"});
        }

        //else, user doesn't exists -> Encrypt password -> create new record
    
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User(username, email, hash);

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser[0]);
    }catch(err){
        res.status(500).json({error: 'SignupError: '+err});
    }
}

module.exports.postLogin = async(req,res,next) => {
    try{
        const {email, password} = req.body;
        if(validateInput(email) || validateInput(password)){
            return res.status(400).json({error: "bad input parameters"});
        }
        const userExists = await User.findUserByEmail(email);
        if(userExists[0].length!==0){
            //user email exists => verify password
            const passwordMatch = await bcrypt.compare(password, userExists[0][0].password);
            if(passwordMatch){
                return res.status(201).json({message: "User login successfull", status: "success"});
            }
            else{
                return res.status(401).json({error: "Incorrect user password.\nUser not authorized."});
            }
        }
        else{
            //user email doesn't exist
            return res.status(404).json({error: "User not found"});
        }
    }
    catch(err){
        res.status(500).json({error: 'LoginError: '+err});
    }
}