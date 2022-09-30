const mongoose = require('mongoose');


const loginSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    otp: {
        type: Number,
        required: true
    },
    otpStatus: {
        type: String,
        required: true,
        default: "PENDING"
    }
});


const LoginSchema = mongoose.model('Login', loginSchema);
module.exports = { Login: LoginSchema } 