const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
    },
    emailID: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender");
            }
        },
    },
    photoUrl:{
        type: String,
        default:"https://geographyandyou.com/images/user-profile.png",
    },
    about:{
        type: String,
        default:"Hey there! I am using DevTinder",
    },
    skills:{
        type: [String],
    },
   
},
{
        timestamps: true,
    }
);
 
const User = mongoose.model("User", userSchema);
module.exports = User;