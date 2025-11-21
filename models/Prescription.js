const mongoose = require('mongoose');

const prescription = new mongoose.Schema({
    AppointmentID : {type : mongoose.Schema.Types.ObjectId ,ref : 'Appointment'}, 
    MedicineName : String, 
    Dosage : String, 
    Advice : String
});
module.exports = mongoose.model('Prescription', prescription);