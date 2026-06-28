const express = require('express')
const {
  createComplaint,
  getComplaintByTicketNumber,
  getDashboardData,
  getRecentComplaints,
  getCategoryStats,
} = require('../controllers/complaintController')

const router = express.Router()

router.route('/complaint/new').post(createComplaint)
router.route('/track/:ticketNumber').get(getComplaintByTicketNumber)
router.route('/dashboard').get(getDashboardData)
router.route('/dashboard/recent-complaints').get(getRecentComplaints)
router.route('/dashboard/category-stats').get(getCategoryStats)

module.exports = router
