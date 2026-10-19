const mongoose = require('mongoose');
require('dotenv').config();

const connectdb = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is missing. Set it in the project .env file.');
    }

    await mongoose.connect(mongoUri);
};

module.exports = connectdb;
