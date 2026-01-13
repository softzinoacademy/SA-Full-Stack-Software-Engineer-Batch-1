import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { appointmentSchema, doctorSchema, serviceSchema, userSchema } from './schema';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors())


// MongoDB Connection
const mongoURI = "mongodb+srv://connectionuser:connectionpassword@cluster0.azxufzl.mongodb.net/connection?retryWrites=true&w=majority";
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


// Models
const User = mongoose.model('User', userSchema)
const Doctor = mongoose.model('Doctor', doctorSchema)
const Service = mongoose.model('Service', serviceSchema)
const Appointment = mongoose.model('Appointment', appointmentSchema)

// Basic route
app.get('/', (_req, res) => {
    res.json({ message: 'Server is running Working!' });
});

// user route GET, POST, PUT, DELETE
app.get('/api/user', async (req, res) => {
    const user = await User.find({});
    if (!user) res.json({
        status: '404',
        message: 'there is no user data'
    })
    res.json({
        status: 'success',
        message: 'user data fetch sucessfully ',
        data: user
    })
})

app.post('/api/user', async (req, res) => {
    const { name, email, phone } = req.body;
    console.log('name:', name)
    if (!name && !email && !phone) res.status(400).json({
        status: '',
        message: "name not found"
    })
    const user = new User({
        id: Date.now(),
        name,
        email,
        phone
    })
    const u = await user.save()
    res.json({
        status: 'success',
        message: "User created successfully",
        data: u
    })
})

app.put('/api/user', async (req, res) => {
    const { id, name, email, phone } = req.body;
    if (!name && !email && !phone) res.status(400).json({
        status: '',
        message: "name not found"
    })
    console.log("id", id)
    const user = await User.findByIdAndUpdate(id, { name, email, phone })
    console.log("user", user)
    res.json({
        status: 'success',
        message: "User updated successfully",
        data: user
    })
})

app.delete('/api/user', async (req, res) => {
    const { id } = req.body;
    console.log("id", id)
    const user = await User.findByIdAndDelete(id)
    console.log("user", user)
    res.json({
        status: 'success',
        message: "User deleted successfully",
        data: user
    })
})

// doctor route GET, POST, PUT, DELETE

app.post('/api/doctor/uploadMany', async (req, res) => {
    const doctors = req.body;
    const doctor = await Doctor.insertMany(doctors)
    res.json({
        status: 'success',
        message: "Doctors uploaded successfully",
        data: doctor
    })
})

app.get('/api/doctors/:id', async (req, res) => {
    const id = req.params.id;
    console.log("id", id)
    const doctor = await Doctor.findById(id)
    // we will find the this doctors all apointment date and time
    // yyyy-MM-dd
    const date = new Date().toISOString().split('T')[0];
    const appointment = await Appointment.find({ doctorId: id, date })
    if (!doctor) res.json({
        message: 'Doctor not found'
    })
    res.json({
        message: 'Doctor found',
        data: doctor,
        appointment: appointment
    })
})

app.get('/api/doctors/:id/:date', async (req, res) => {
    const id = req.params.id;
    console.log("id", id)
    const doctor = await Doctor.findById(id)
    // we will find the this doctors all apointment date and time
    const date = req.params.date;
    const appointment = await Appointment.find({ doctorId: id, date })
    if (!doctor) res.json({
        message: 'Doctor not found'
    })
    res.json({
        message: 'Doctor found',
        data: doctor,
        appointment: appointment
    })
})

app.get('/api/doctors', async (req, res) => {
    const doctor = await Doctor.find({})
    if (!doctor) res.json({
        status: '404',
        message: 'there is no doctor data'
    })

    res.json({
        status: 'success',
        data: doctor,
        message: 'doctor data fetch successfully '
    })
})


// service route GET , POST, PUT, DELETE = Try later with relationship
// app.get('/api/services', async (req, res) => {
//     const service = await Service.find({})
//     if (!service) res.json({
//         status: '404',
//         message: 'there is no service data'
//     })
//     res.json({
//         status: 'success',
//         message: 'service fetch successfully ',
//         data: service
//     })
// })

// appointment GET, POST, PUT, DELETE
app.get('/api/appointments', async (req, res) => {
    const appointment = await Appointment.find({});
    if (!appointment) res.json({
        status: '404',
        message: 'there is no appointment data'
    })
    res.json({
        status: 'success',
        message: 'appointment fetch successfully ',
        data: appointment
    })
})


app.get('/api/appointments/:id', async (req, res) => {
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    if (!appointment) res.json({
        status: '404',
        message: 'there is no appointment data'
    })
    res.json({
        status: 'success',
        message: 'appointment fetch successfully ',
        data: appointment
    })
})

app.post('/api/appointments', async (req, res) => {
    // use mongoose trasection for this
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        const { name, email, phone, reason, time, doctorId, date } = req.body;
        const user = await User.findOne({ email });
        let newUserId;
        if (!user) {
            const newUser = new User({
                id: Date.now(),
                name,
                email,
                phone
            })
            const nu = await newUser.save()
            newUserId = nu._id;
        };
        const userId = user?._id || newUserId;
        console.log("*********** userId", userId);

        const appointment = await Appointment.find({ doctorId: doctorId, date: date, time: time });
        if (appointment.length > 0) {
            res.json({
                status: '404',
                message: 'this time already booked'
            })
        } else {
            const newAppointment = new Appointment({
                id: Date.now(),
                doctorId,
                date,
                time,
                patientName: name,
                email,
                phone,
                reason,
            })
            const a = await newAppointment.save()
            res.json({
                status: 'success',
                message: 'appointment done successfully ',
                data: a
            })
        }
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.log('error happening')
        res.json({
            status: 'error',
            message: 'appointment not done successfully ',
            error: error
        })
    }
})


app.listen(PORT, () => {
    console.log('Over the network server will listen', PORT)
})