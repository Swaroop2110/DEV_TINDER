const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");


profileRouter.get("/",userAuth,async(req,res)=>{
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
module.exports = profileRouter;