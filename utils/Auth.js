const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require('passport');
const { SECRET } = require('../config');
const { session } = require("passport");

const userRegister = async (userDets, role, res) => {
    try{

    let usernameNotTaken = await validateUsername(userDets.username);
    if(!usernameNotTaken) {
        return res.status(400).json({
            message: `Username is already taken.`,
            success: false
        });
    }

    let emailNotTaken = await validateEmail(userDets.email);
    if(!emailNotTaken) {
        return res.status(400).json({
            message: `Email is already taken.`,
            success: false
        });
    }
    
    const password = await bcrypt.hash(userDets.password, 12);

    const newUser = new User({ ...userDets, password, role});

    await newUser.save();
    return res.status(201).json({
        message: "Hurry! now you are succesfully registred. Please login.",
        success: true
    });

    }catch(err){

        return res.status(500).json({
            message:"Unable to create your account.",
            success: false
        });
    }
};

const userLogin = async (userCreds, role, res ) => {
    let { username, password } = userCreds;
    const user = await User.findOne({username});
    if(!user){
        return res.status(404).json({
            message: "Username is not found. Invalid login credentials.",
            success: false
        });
    }

    if(user.role !== role){
        return res.status(403).json({
            message: "Please make sure you are logging in from the right portal.",
            success: false
        });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        let token = jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        },
        SECRET,
        {expiresIn: "7 days"}
        );
        
        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };

        return res.status(200).json({
            ...result,
            message: "Hurry! you are now logged in.",
            success: true
        });

    }else{
        return res.status(403).json({
            message: "Incorrect password.",
            success: false
        });
    }

};

const userAuth = passport.authenticate("jwt", {session:false});

const checkRole = roles => (req, res, next) =>
    !roles.includes(req.user.role)
        ? res.status(401).json("Unauthorized")
        : next();

const validateUsername = async username => {
    let user = await User.findOne({username});
    return user ? false : true;
};

const validateEmail= async email => {
    let user = await User.findOne({email});
    return user ? false : true;
};

const serializeUser = user => {
    return {
        username: user.username,
        email: user.email,
        name: user.name,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    };
};

module.exports = { serializeUser, userRegister ,userAuth, userLogin,checkRole}