const express = require('express')

const {
  getOfficerDashboard,
  getMyAssignedComplaints,
  getMyComplaintDetails,
  acceptComplaint,
  updateComplaintStatus,
} = require('../controllers/officerController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router
  .route('/complaints/:id/accept')
  .put(isAuthenticatedUser, authorizeRoles('officer'), acceptComplaint)

router
  .route('/complaints/:id/status')
  .put(isAuthenticatedUser, authorizeRoles('officer'), updateComplaintStatus)

router
  .route('/complaints')
  .get(isAuthenticatedUser, authorizeRoles('officer'), getMyAssignedComplaints)

router
  .route('/complaints/:id')
  .get(isAuthenticatedUser, authorizeRoles('officer'), getMyComplaintDetails)

router
  .route('/dashboard')
  .get(isAuthenticatedUser, authorizeRoles('officer'), getOfficerDashboard)

module.exports = router
