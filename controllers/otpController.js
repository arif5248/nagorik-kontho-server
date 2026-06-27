const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const Otp = require('../models/otpModel')
const sendEmail = require('../utils/sendEmail')

exports.createOtpForUser = catchAsyncError(async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return next(new ErrorHandler('Email is required', 400))
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  await Otp.deleteMany({
    email,
    otpStatus: 'pending',
  })

  await Otp.create({
    email,
    otp,
    otpStatus: 'pending',
  })

  const message = `
Hello,

Your verification OTP is: ${otp}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.
`

  await sendEmail({
    email,
    subject: 'Your Verification OTP',
    message,
  })

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully to your email',
  })
})
exports.verifyOtpForUser = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return next(new ErrorHandler('Email and OTP are required', 400))
  }

  const otpData = await Otp.findOne({
    email,
    otpStatus: 'pending',
  }).sort({ createdAt: -1 })

  if (!otpData) {
    return next(new ErrorHandler('OTP not found or already expired', 404))
  }

  if (otpData.otp !== otp) {
    return next(new ErrorHandler('Invalid OTP', 400))
  }

  otpData.otpStatus = 'verified'
  await otpData.save()

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
  })
})
