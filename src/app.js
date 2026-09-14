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
    await user.save();
    res.send("User signed up successfully");
})
app.get("/users",async(req,res)=>{
    const email = req.body.emailID;
    const users = await User.find({ emailID: email });

    res.send(users);
})

app.get("/feed",async(req,res)=>{
    const users = await User.find();
    res.send(users);
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
