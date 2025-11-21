const mongoose = require('mongoose');

const appointment = new mongoose.Schema({
     date : Date,
    Reason : String, 
    Status : String ,
    PatientID : {type : mongoose.Schema.Types.ObjectId ,ref : 'Paitent'}, 
    DoctorID : {type : mongoose.Schema.Types.ObjectId ,ref : 'Doctor'}
});
module.exports = mongoose.model('Appoinment', appointment);