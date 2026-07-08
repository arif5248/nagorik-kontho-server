const express = require('express')

const { acceptComplaint } = require('../controllers/officerController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router.put(
  '/complaints/:id/accept',
  isAuthenticatedUser,
  authorizeRoles('officer'),
  acceptComplaint,
)

module.exports = router
