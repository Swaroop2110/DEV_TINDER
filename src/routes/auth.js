const express = require("express");
const authRouter = express.Router();
const{validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
authRouter.post("/signup",async(req,res)=>{
    // const userobj = {
    //     firstName: "Swaroop",
    //     lastName:"Gupta",
    //     emailID:"swaroopgupta2005@gmail.com",
    //     password:"swaroop2005",
    // }
   // const user = new User(req.body);
    try{
        validateSignUpData(req);
        const {firstName,lastName,emailID,password,age,gender,photoUrl,about,skills} = req.body;
        const passwordhash = await bcrypt.hash(password,10);

        await user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        res.status(400).send("Error occurred while signing up" + err.message);
    }
    
})
app.post("/login",async(req,res) =>{
    try{
        const {emailID,password} = req.body;
        const user = await User.findOne({emailID});
        if(!user){
            throw new Error("User not found");
        }
        //const isMatch = await bcrypt.compare(password,user.password);
        const isMatch = await user.validatePassword(password);
        if(!isMatch){
            throw new Error("Invalid password");
        }
        if(isMatch){
           // const token = await jwt.sign({_id:user._id}, "DEV@123");
           const token = await user.getJWT(); 
           res.cookie("token",token);
            res.send("User logged in successfully");
        }
        else{
            throw new Error("Invalid password");
        }
        
    }
    catch(err){
        res.status(400).send("Error occurred while logging in" + err.message);
    }
});
module.exports = authRouter;