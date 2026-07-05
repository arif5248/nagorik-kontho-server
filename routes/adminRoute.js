const express = require('express')

const {
  getAllComplaints,
  getComplaintDetails,
  assignComplaint,
  getFilteredOfficers,
} = require('../controllers/adminController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router
  .route('/complaints')
  .get(
    isAuthenticatedUser,
    authorizeRoles('master_admin', 'admin'),
    getAllComplaints,
  )

router
  .route('/complaints/:id')
  .get(
    isAuthenticatedUser,
    authorizeRoles('master_admin', 'admin', 'officer'),
    getComplaintDetails,
  )

router
  .route('/complaints/:id/assign')
  .put(
    isAuthenticatedUser,
    authorizeRoles('master_admin', 'admin'),
    assignComplaint,
  )

router
  .route('/officers')
  .get(
    isAuthenticatedUser,
    authorizeRoles('master_admin', 'admin'),
    getFilteredOfficers,
  )

module.exports = router
