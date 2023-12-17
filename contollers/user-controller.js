const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');

const inputValidator = require('../util/input-validator');
const sequelize = require('../util/db');

module.exports.signup = async(req,res,next) => {
    let trans;
    try{
        trans = await sequelize.transaction();
        const {username, email, password} = req.body;
        if(inputValidator.text(username) || inputValidator.text(email) || inputValidator.text(password)){
            return res.status(400).json({error: "bad input parameters"});
        }
        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser !== null){
            //user exists
            return res.status(400).json({error: "Email already exists.\nKindly login with your credentials"});
        }

        //else, user doesn't exists -> Encrypt password -> create new record
        const hash = await bcrypt.hash(password, 10);
        await User.create({username: username, email:email, password:hash}, {transaction: trans});

        await trans.commit();
        return res.status(201).json({message: "success"});
    }catch(err){
        if(trans)
            trans.rollback();
        console.log("SignupError- ",err);
        res.status(500).json({error: 'Internal server error while signup'});
    }
}

module.exports.login = async(req,res,next) => {
    try{
        const {email, password} = req.body;
        if(inputValidator.text(email) || inputValidator.text(password)){
            return res.status(400).json({error: "bad input parameters"});
        }
        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser!==null){
            //user email exists => verify password
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if(passwordMatch){
                return res.status(201).json({message: "User login successful", status: "success", token: jwt.sign({userId: existingUser.id, isPremium: existingUser.is_premium}, process.env.AUTH_KEY) });
            }
            else{
                return res.status(401).json({error: "Incorrect user password.\nUser not authenticated."});
            }
        }
        else{
            //user email doesn't exist
            return res.status(404).json({error: "Email not found.\nUser not authenticated."});
        }
    }
    catch(err){
        console.log('LoginError- ',err);
        res.status(500).json({error: 'Internal server error while login'});
    }
}