const express = require('express');
const connectdb= require('./config/database');
const app = express();

const User = require('./models/user');
// app.use((req,res)=>{
//     res.send("Hello from the server!");
// });
app.use(express.json());

app.post("/signup",async(req,res)=>{
    // const userobj = {
    //     firstName: "Swaroop",
    //     lastName:"Gupta",
    //     emailID:"swaroopgupta2005@gmail.com",
    //     password:"swaroop2005",
    // }
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User signed up successfully");
    }
    catch(err){
        res.status(400).send("Error occurred while signing up" + err.message);
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
app.patch("/users",async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:"after",
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
