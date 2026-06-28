const express = require('express')
const {
  createComplaint,
  getComplaintByTicketNumber,
  getDashboardData,
} = require('../controllers/complaintController')

const router = express.Router()

router.route('/complaint/new').post(createComplaint)
router.route('/track/:ticketNumber').get(getComplaintByTicketNumber)
router.route('/dashboard').get(getDashboardData)

module.exports = router
