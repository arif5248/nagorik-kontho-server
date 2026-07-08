const Complaint = require('../models/complaintModel')
const ErrorHandler = require('../utils/ErrorHandler')
const addTrackingLog = require('../utils/addTrackingLog')
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

  addTrackingLog(complaint, {
    title: 'Complaint Accepted',
    message: 'Officer accepted the complaint.',
    status: 'accepted',
    eventType: 'acceptance',
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

exports.updateComplaintStatus = catchAsyncError(async (req, res, next) => {
  const { status, message } = req.body

  if (!status) {
    return next(new ErrorHandler('Status is required', 400))
  }

  if (!message) {
    return next(new ErrorHandler('Update message is required', 400))
  }

  const allowedStatuses = [
    'investigating',
    'in_progress',
    'resolved',
    'rejected',
  ]

  if (!allowedStatuses.includes(status)) {
    return next(new ErrorHandler('Invalid status value', 400))
  }

  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorHandler('Complaint not found', 404))
  }

  if (!complaint.assignedTo) {
    return next(new ErrorHandler('Complaint is not assigned yet', 400))
  }

  if (complaint.assignedTo.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('You are not assigned to this complaint', 403))
  }

  if (
    !['accepted', 'investigating', 'in_progress'].includes(complaint.status)
  ) {
    return next(
      new ErrorHandler(
        'You must accept the complaint before updating progress',
        400,
      ),
    )
  }

  complaint.status = status
  const statusTitles = {
    investigating: 'Investigation Started',
    in_progress: 'Work In Progress',
    resolved: 'Complaint Resolved',
    rejected: 'Complaint Rejected',
  }

  addTrackingLog(complaint, {
    title: statusTitles[status],
    message,
    status,
    eventType:
      status === 'resolved'
        ? 'resolution'
        : status === 'rejected'
          ? 'rejection'
          : 'progress',
    updatedBy: req.user._id,
    updatedByType: 'user',
  })

  await complaint.save()

  res.status(200).json({
    success: true,
    message: 'Complaint status updated successfully',
    complaint,
  })
})
