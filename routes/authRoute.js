const express = require('express')
const {
  registerUser,
  loginUser,
  getMyProfile,
} = require('../controllers/authController')

const { isAuthenticatedUser } = require('../middleware/auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

router.route('/me').get(isAuthenticatedUser, getMyProfile)

module.exports = router
