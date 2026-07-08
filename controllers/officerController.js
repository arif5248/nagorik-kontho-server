const Complaint = require('../models/complaintModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')

exports.acceptComplaint = catchAsyncError(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorHandler('Complaint not found', 404))
  }

  if (!complaint.assignedTo) {
    return next(new ErrorHandler('Complaint is not assigned yet', 400))
  }

  // Only assigned officer can accept
  if (complaint.assignedTo.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('You are not assigned to this complaint', 403))
  }

  if (complaint.status !== 'assigned') {
    return next(
      new ErrorHandler('Only assigned complaints can be accepted', 400),
    )
  }

  complaint.status = 'accepted'

  complaint.tracking.push({
    title: 'Complaint Accepted',
    message: 'Officer accepted the complaint.',
    status: 'accepted',
    updatedBy: req.user._id,
    updatedByType: 'user',
  })

  await complaint.save()

  res.status(200).json({
    success: true,
    message: 'Complaint accepted successfully',
    complaint,
  })
})
