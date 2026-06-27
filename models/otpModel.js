const mongoose = require('mongoose')
const validator = require('validator')

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please Enter your Email'],
    validate: [validator.isEmail, 'Please Enter a valid Email'],
  },
  otp: {
    type: String,
    required: true,
  },
  otpStatus: {
    type: String,
    enum: ['pending', 'verified', 'expired'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
})

module.exports = mongoose.model('OtpModel', otpSchema)
