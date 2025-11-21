const mongoose = require('mongoose');

const patient = new mongoose.Schema({
    name : String,
    email : String,
    Password : String,
    Age : Number,  
    Mobile : Number, 
    Gender : String
});
module.exports = mongoose.model('Patient', patient);