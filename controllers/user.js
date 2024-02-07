const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const inputValidator = require('../util/input-validator');

module.exports.signup = async(req,res,next) => {
    try{
        const {username, email, password} = req.body;
        if(inputValidator.text(username) || inputValidator.text(email) || inputValidator.text(password))
            return res.status(422).json({error: "bad input parameters"});
        if(inputValidator.email(email))
            return res.status(422).json({error: "bad input parameters", message: "Invalid email received"});

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(400).json({error: "Email already exists.\nKindly login with your credentials"});
        }

        //else, user doesn't exists -> Encrypt password -> create new record
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({username: username, email:email, password:hash});
        await newUser.save();

        return res.status(201).json({message: "User account created. \nPlease sign-in to continue"});
    }catch(err){
        console.log("signup error: ",err);
        res.status(500).json({error: 'Internal server error while signup'});
    }
}

module.exports.signin = async(req,res,next) => {
    try{
        const {email, password} = req.body;
        if(inputValidator.email(email) || inputValidator.text(password)){
            return res.status(422).json({error: "bad input parameters"});
        }
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            //user email exists => verify password
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if(passwordMatch){
                const expirationTimeInSeconds = 3600;
                const tokenExpiry = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
                return res.status(201).json({message: "User login successful", status: "success", token: jwt.sign({userId: existingUser.id, isPremium: existingUser.is_premium, exp: tokenExpiry}, process.env.AUTH_KEY) });
            }
            else{
                return res.status(401).json({error: "Incorrect user password."});
            }
        }
        else{
            //user email doesn't exist
            return res.status(404).json({error: "Email not found.\nUser not authenticated."});
        }
    }
    catch(err){
        console.log('signin error: ',err);
        res.status(500).json({error: 'Internal server error while signin'});
    }
}