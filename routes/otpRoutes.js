const express = require('express')
const {
  createOtpForUser,
  verifyOtpForUser,
} = require('../controllers/otpController')
const router = express.Router()

router.route('/createOtp').post(createOtpForUser)
router.route('/verifyOtp').post(verifyOtpForUser)

module.exports = router
