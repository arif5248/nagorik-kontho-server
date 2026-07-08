const express = require('express')

const {
  acceptComplaint,
  updateComplaintStatus,
} = require('../controllers/officerController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router.put(
  '/complaints/:id/accept',
  isAuthenticatedUser,
  authorizeRoles('officer'),
  acceptComplaint,
)

router.put(
  '/complaints/:id/status',
  isAuthenticatedUser,
  authorizeRoles('officer'),
  updateComplaintStatus,
)

module.exports = router
