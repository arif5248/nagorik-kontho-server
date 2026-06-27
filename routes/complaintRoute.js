const express = require('express')
const {
  createComplaint,
  getComplaintByTicketNumber,
} = require('../controllers/complaintController')

const router = express.Router()

router.route('/complaint/new').post(createComplaint)
router.route('/track/:ticketNumber').get(getComplaintByTicketNumber)

module.exports = router
