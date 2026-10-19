const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailID, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error('First name and last name are required');
    }

    if (!validator.isEmail(emailID)) {
        throw new Error('Invalid email address');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }
};

const validateEditProfileData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'emailID', 'age', 'gender', 'photoUrl', 'about', 'skills'];
    return Object.keys(req.body).every((key) => allowedFields.includes(key));
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};
