const express = require('express');
const connectdb= require('./config/database');
const app = express();
const bcrypt = require('bcrypt');
const {validateSignUpData} = require('./utlis/validation');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');
// app.use((req,res)=>{
//     res.send("Hello from the server!");
// });
app.use(express.json());
app.use(cookieParser());
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

//get user by emailID
app.get("/users",async(req,res)=>{
    const email = req.body.emailID;
   try{ 
    const users = await User.find({ emailID: email });
    if(!users){
        res.status(404).send("User not found");
    }
    else{
        res.send(users);
    }
    }
    catch(err){
        res.status(400).send("Error occurred while fetching user" + err.message);
    }
    
})
// feed api -get all users
app.get("/feed",async(req,res)=>{
    try{    
        const users = await User.find();
        res.send(users);
    }
    catch(err){
        res.status(400).send("Error occurred while fetching users" + err.message);
    }
        
})

// delete user from the database
app.delete("/users",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIDAndDelete(userId);
    }
    catch(err){
        res.status(400).send("Error occurred while deleting user" + err.message);
    }
})
// update user details
app.patch("/users/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["photurl","about","gender","age","skills"];
        const isupdateAllowed = object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
       if(!isupdateAllowed){
        throw new Error("Invalid updates");
       }
       if(data.skills.length > 10){
        throw new Error("Skills cannot be more than 10");
       }
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
            runValidators:true,
        })
        console.log(user);
        res.send("User details updated successfully");
    }
    catch(err){
        res.status(400).send("Error occurred while updating user" + err.message);
    }
})
app.use("/auth",authRouter);
app.use("/profile",profileRouter);
app.use("/request",requestRouter);
connectdb()
.then(()=>{
    console.log("Database connected successfully");
    app.listen(3000,()=>{
    console.log("SERVER IS SUCCESSFULLY LISTEINING");
});
})
.catch((err)=>{
    console.log("Database connection failed", err);
});
