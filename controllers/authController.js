const User = require('../models/userModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role, department, district } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return next(new ErrorHandler('User already exists with this email', 400))
  }
  console.log('==========')
  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
    district,
  })
  console.log(user)

  const token = user.getJwtToken()
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user,
  })
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }
  console.log(user)
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401))
  }

  if (!user.isActive) {
    return next(new ErrorHandler('Your account is disabled', 403))
  }

  const token = user.getJwtToken()

  user.password = undefined

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user,
  })
})
exports.getMyProfile = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  })
})
