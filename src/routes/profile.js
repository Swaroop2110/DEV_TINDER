const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const {validateEditProfileData} = require("../utlis/validation");

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
module.exports = profileRouter;