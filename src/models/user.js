const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
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
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }   
        }
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
 
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id}, "DEV@123", { expiresIn: "7d" });
    return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user= this;
    const passwordhash = user.password;
    const isMatch = await bcrypt.compare(passwordInputByUser,passwordhash);
    return isMatch;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
