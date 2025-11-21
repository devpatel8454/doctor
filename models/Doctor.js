const mongoose = require('mongoose');

const doctor = new mongoose.Schema({
    name : String,
    Specialization : String,
    Experience : Number,
    Fees : String,
    email : {type : String , unique : true},
    Password : String,
    image : String
});
module.exports = mongoose.model('Doctor', doctor);