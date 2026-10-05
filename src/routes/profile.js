const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const {validateEditProfileData} = require("../utlis/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const cookies = req.cookies;
        // const {token} = cookies;
        // if(!token){
        //     throw new Error("No token found");
        // }
        // const decodedMessage = jwt.verify(token,"DEV@123");
        // const {_id} = decodedMessage;
        // const user = await User.findById(_id);
        // if(!user){
        //     throw new Error("User not found");
        // }
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error occurred while fetching profile" + err.message);
    }
});
profileRouter.post("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid data");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>{
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.send(` ${loggedInUser.firstName}, your profile has been updated successfully`);
    }
    catch(err){
        res.status(400).send("Error occurred while editing profile" + err.message);
}});

profileRouter.patch("/password",userAuth,async(req,res)=>{
    try{
        const {currentPassword,newPassword} = req.body;
        if(typeof currentPassword !== "string" || typeof newPassword !== "string"){
            return res.status(400).send("Current password and new password are required");
        }
        if(!validator.isStrongPassword(newPassword)){
            return res.status(400).send("New password is not strong enough");
        }

        const loggedInUser = req.user;
        const isCurrentPasswordValid = await loggedInUser.validatePassword(currentPassword);
        if(!isCurrentPasswordValid){
            return res.status(401).send("Current password is incorrect");
        }

        loggedInUser.password = await bcrypt.hash(newPassword,10);
        await loggedInUser.save();
        res.send("Password updated successfully");
    }
    catch(err){
        res.status(400).send("Error occurred while updating password: " + err.message);
    }
});

module.exports = profileRouter;