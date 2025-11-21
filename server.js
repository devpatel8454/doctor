const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const Appoinment = require('./models/Appointment');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: "svbsvsdzvbfvbsd",
    resave: false,
    saveuninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/healthcare' })
}));

mongoose.connect('mongodb://localhost:27017/healthcare')
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

const storage = multer.diskStorage({
    diskStorage: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const ADMIN = { email: 'admin@gmail.com', password: 'admin' };

app.get('/admin/login', async (req, res) => {
    res.render('admin_login');
});

app.get('/admin/dashboard', async (req, res) => {
    res.render('admin_dashboard');
});

app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (email === ADMIN.email && password === ADMIN.password) {
        req.session.admin = ADMIN;
        res.render('admin_dashboard');
    }
});

app.get('/doctor/add', (req, res) => {
    res.render('add_doctor');
});

app.post('/doctor/add', upload.single('image'), async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const doctor = new Doctor({
        name: req.body.name,
        Specialization: req.body.specialization,
        Experience: req.body.experience,
        Fees: req.body.fees,
        email: req.body.email,
        Password: hashedpassword,
        Photo: req.file.filename
    });
    await doctor.save();
    const doctors = await Doctor.find();
    res.render('doctor_list', { doctors });

});

app.get('/patient/add', (req, res) => {
    res.render('add_patient');
});

app.post('/patient/add', upload.single('image'), async (req, res) => {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const patient = new Patient({
        name: req.body.name,
        email: req.body.email,
        Password: hashedpassword,
        Age: req.body.age,
        Mobile: req.body.mobile,
        Gender: req.body.gender
    });

    await patient.save();
    res.render('patient_login');
});

app.get('/patient/login', (req, res) => {
    res.render('patient_login');
});

app.post('/patient/login', async (req, res) => {
    const patient = await Patient.findOne({email : req.body.email});
    if(!patient) return res.render('patient_login',{error:"Invalid Email"});
    
    const match = await bcrypt.compare(req.body.password , patient.Password );
    if(!match) return res.render('patient_login',{error:"Invalid Password"});
    console.log("Stored password:", patient.Password);
    console.log("Entered password:", req.body.password);

    req.session.patientId = patient._id;
    res.render('patient_dashboard');
});

app.get('/doctor/list' , async (req,res) => {
    const doctors = await Doctor.find();
    res.render('doctor_list',{doctors});
});

app.get('/appointment/book/:doctorId', async (req,res) => {
    const doctor = await Doctor.findById(req.params.doctorId);
    res.render('book_appointment',{doctorId:req.params.doctorId, doctor:doctor} );
});

app.get('/patient/dashboard', async (req, res) => {
    const patients = await Patient.find();
    res.render('patient_dashboard', { patients });
});

app.post('/appointment/book/:doctorId', async (req,res) => {
   if (!req.session.patientId) {
    return res.redirect('/patient/login');
   }

   const appointment = new Appoinment({
         date : req.body.date,
            Reason : req.body.reason, 
            Status : 'pending' ,
            PatientID : req.body.patientId, 
            DoctorID : req.params.doctorId
   });
   await appointment.save();
    res.render('patient_dashboard');
});

app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
});


