const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error')
const fileUpload = require('express-fileupload')

const complaint = require('./routes/complaintRoute')
const otp = require('./routes/otpRoutes')

const app = express()

// Middleware
app.use(express.json())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
)
app.use(cors())
app.use(cookieParser())

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running successfully')
})

// Error Middleware
app.use(errorMiddleware)

app.use('/api/v1', complaint)
app.use('/api/v1', otp)

module.exports = app
