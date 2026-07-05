const Complaint = require('../models/complaintModel')
const User = require('../models/userModel')
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

exports.getComplaintDetails = catchAsyncError(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('assignedTo', 'name email role department district')
    .populate('assignedBy', 'name email role')
    .populate('tracking.updatedBy', 'name email role department')

  if (!complaint) {
    return next(new ErrorHandler('Complaint not found', 404))
  }

  res.status(200).json({
    success: true,
    complaint,
  })
})

exports.assignComplaint = catchAsyncError(async (req, res, next) => {
  const { officerId, adminNote } = req.body

  if (!officerId) {
    return next(new ErrorHandler('Officer ID is required', 400))
  }

  const officer = await User.findById(officerId)

  if (!officer) {
    return next(new ErrorHandler('Officer not found', 404))
  }

  if (officer.role !== 'officer') {
    return next(new ErrorHandler('Selected user is not an officer', 400))
  }

  const complaint = await Complaint.findById(req.params.id)

  if (!complaint) {
    return next(new ErrorHandler('Complaint not found', 404))
  }

  complaint.assignedTo = officer._id
  complaint.assignedBy = req.user._id
  complaint.assignedAt = Date.now()
  complaint.status = 'under_review'

  if (adminNote) {
    complaint.adminNote = adminNote
  }

  complaint.tracking.push({
    title: 'Complaint Assigned',
    message: `Complaint assigned to ${officer.name}`,
    status: 'under_review',
    updatedBy: req.user._id,
    updatedByType: 'user',
  })

  await complaint.save()

  res.status(200).json({
    success: true,
    message: 'Complaint assigned successfully',
    complaint,
  })
})

exports.getFilteredOfficers = catchAsyncError(async (req, res, next) => {
  const { department, district } = req.query

  const filter = {
    role: 'officer',
    isActive: true,
  }

  if (department) {
    filter.department = department
  }

  if (district) {
    filter.district = district
  }

  const officers = await User.find(filter).select(
    'name email role department district isActive',
  )

  res.status(200).json({
    success: true,
    count: officers.length,
    officers,
  })
})
