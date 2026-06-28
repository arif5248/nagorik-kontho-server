const Complaint = require('../models/complaintModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncError = require('../middleware/catchAsyncError')
const generateTicketNumber = require('../utils/generateTicketNumber')
const sendEmail = require('../utils/sendEmail')
const cloudinary = require('../utils/cloudinary')

exports.getDashboardData = catchAsyncError(async (req, res, next) => {
  const allComplaints = await Complaint.find()
  console.log(allComplaints)
  const totalComplaints = await Complaint.countDocuments()

  const resolvedComplaints = await Complaint.countDocuments({
    status: 'resolved',
  })

  const activeComplaints = await Complaint.countDocuments({
    status: {
      $in: ['submitted', 'under_review', 'investigating', 'in_progress'],
    },
  })

  const rejectedComplaints = await Complaint.countDocuments({
    status: 'rejected',
  })

  const activeCitizens = await Complaint.distinct('email')

  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 0

  res.status(200).json({
    success: true,
    dashboard: {
      totalComplaints,
      resolvedComplaints,
      activeComplaints,
      rejectedComplaints,
      activeCitizens: activeCitizens.length,
      resolutionRate,
    },
  })
})

exports.getRecentComplaints = catchAsyncError(async (req, res, next) => {
  const recentComplaints = await Complaint.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select(
      'title problemType district upazila area ticketNumber status privacy createdAt',
    )

  res.status(200).json({
    success: true,
    recentComplaints,
  })
})

exports.getCategoryStats = catchAsyncError(async (req, res, next) => {
  const categoryStats = await Complaint.aggregate([
    {
      $group: {
        _id: '$problemType',
        totalComplaints: { $sum: 1 },
        resolvedComplaints: {
          $sum: {
            $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        problemType: '$_id',
        totalComplaints: 1,
        resolvedComplaints: 1,
        resolutionRate: {
          $cond: [
            { $gt: ['$totalComplaints', 0] },
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$resolvedComplaints', '$totalComplaints'],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $sort: { totalComplaints: -1 },
    },
  ])

  res.status(200).json({
    success: true,
    categoryStats,
  })
})

const uploadToCloudinary = async (file, evidenceType) => {
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'nagorik_kontho/evidences',
    resource_type: 'auto',
  })

  return {
    evidenceType,
    public_id: result.public_id,
    url: result.secure_url,
    originalName: file.name,
    format: result.format,
  }
}

exports.createComplaint = catchAsyncError(async (req, res, next) => {
  const {
    problemType,
    title,
    description,
    district,
    upazila,
    postalCode,
    area,
    privacy,
    phone,
    email,
  } = req.body

  if (!email) {
    return next(
      new ErrorHandler('Email is required to send ticket number', 400),
    )
  }

  if (!req.files || (!req.files.image && !req.files.file && !req.files.audio)) {
    return next(
      new ErrorHandler(
        'Please upload at least one evidence: image, file, or audio',
        400,
      ),
    )
  }

  const evidences = []

  if (req.files.image) {
    const images = Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image]

    for (const image of images) {
      const uploadedImage = await uploadToCloudinary(image, 'image')
      evidences.push(uploadedImage)
    }
  }

  if (req.files.file) {
    const files = Array.isArray(req.files.file)
      ? req.files.file
      : [req.files.file]

    for (const file of files) {
      const uploadedFile = await uploadToCloudinary(file, 'file')
      evidences.push(uploadedFile)
    }
  }

  if (req.files.audio) {
    const audios = Array.isArray(req.files.audio)
      ? req.files.audio
      : [req.files.audio]

    for (const audio of audios) {
      const uploadedAudio = await uploadToCloudinary(audio, 'audio')
      evidences.push(uploadedAudio)
    }
  }

  const ticketNumber = generateTicketNumber(problemType)

  const complaint = await Complaint.create({
    problemType,
    title,
    description,
    district,
    upazila,
    postalCode,
    area,
    privacy,
    phone,
    email,
    ticketNumber,
    evidences,
    tracking: [
      {
        title: 'Complaint Submitted',
        message:
          'Your complaint has been successfully submitted to the system.',
        updatedBy: 'system',
      },
    ],
  })

  const message = `Thank you for submitting your complaint.

Your ticket number is: ${ticketNumber}

Please keep this ticket number for tracking your complaint status.`

  await sendEmail({
    email,
    subject: 'Your Complaint Ticket Number',
    message,
  })

  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully. Ticket number sent to email.',
    ticketNumber,
    complaint,
  })
})

exports.getComplaintByTicketNumber = catchAsyncError(async (req, res, next) => {
  const { ticketNumber } = req.params

  if (!ticketNumber) {
    return next(new ErrorHandler('Ticket number is required', 400))
  }
  const complaint = await Complaint.findOne({ ticketNumber })

  if (!complaint || null) {
    return next(new ErrorHandler('Complaint not found', 404))
  }

  const complaintData = complaint.toObject()

  if (complaintData.privacy === 'private') {
    delete complaintData.email
    delete complaintData.phone
  }

  res.status(200).json({
    success: true,
    complaint: complaintData,
  })
})
