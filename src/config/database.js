const mongoose = require('mongoose');

const connectdb = async()=>{
    mongoose.connect(
    "mongodb+srv://swaroop:swaroop2005@cluster0.mpxlfut.mongodb.net/devTinder"
)   ;
};
module.exports = connectdb;
