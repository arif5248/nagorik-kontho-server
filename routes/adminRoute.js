const express = require('express')

const { getAllComplaints } = require('../controllers/adminController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router
  .route('/complaints')
  .get(
    isAuthenticatedUser,
    authorizeRoles('master_admin', 'admin'),
    getAllComplaints,
  )

module.exports = router
