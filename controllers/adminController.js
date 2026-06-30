const Complaint = require('../models/complaintModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')

exports.getAllComplaints = catchAsyncError(async (req, res, next) => {
  const complaints = await Complaint.find()
    .populate('assignedTo', 'name email department')
    .populate('assignedBy', 'name')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints,
  })
})
