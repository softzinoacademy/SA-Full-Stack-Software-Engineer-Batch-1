import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now }
})

export const doctorSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    title: { type: String },
    experience: { type: String },
    location: { type: String },
    image: { type: String },
    workingTime: { type: String },
    bio: { type: String },
    education: [{ type: String }],
    services: [{ type: String }],
})

export const serviceSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    description: { type: String },
})

export const appointmentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    date: { type: String },
    time: { type: String },
    patientName: { type: String },
    email: { type: String },
    phone: { type: String },
    doctorId: { type: String },
    reason: { type: String },
})