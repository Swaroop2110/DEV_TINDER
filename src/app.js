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

app.post("/signup",async(req,res)=>{
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
})
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
app.get("/profile",userAuth,async(req,res)=>{
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
