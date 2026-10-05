const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailID, password, age, gender, photoUrl, about, skills } = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(emailID)){
        throw new Error("Invalid email address");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
};
const validateEditProfileData = (req) => {
    const allowedFields = ["firstName", "lastName", "emailID", "age", "gender", "photoUrl", "about", "skills"];
    const iseditable = Object.keys(req.body).every((key) => allowedFields.includes(key));
};
module.exports = {
    validateSignUpData,
    validateEditProfileData,
}