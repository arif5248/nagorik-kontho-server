const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema(
  {
    problemType: {
      type: String,
      required: [true, 'Please select problem type'],
      enum: [
        'corruption',
        'health',
        'waste',
        'roads',
        'land',
        'justice',
        'other',
      ],
    },

    title: {
      type: String,
      required: [true, 'Please enter title'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Please enter description'],
    },

    district: {
      type: String,
      required: [true, 'Please select district'],
    },

    upazila: {
      type: String,
      required: [true, 'Please select upazila'],
    },

    postalCode: {
      type: String,
      required: [true, 'Please select postal code'],
    },

    area: {
      type: String,
      required: [true, 'Please enter area'],
    },

    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
      required: [true, 'Please enter email'],
    },

    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

    evidences: [
      {
        evidenceType: {
          type: String,
          enum: ['image', 'file', 'audio'],
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
        },
        format: {
          type: String,
        },
      },
    ],

    tracking: [
      {
        title: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        updatedBy: {
          type: String,
          default: 'system',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: [
        'submitted',
        'under_review',
        'investigating',
        'in_progress',
        'resolved',
        'rejected',
      ],
      default: 'submitted',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    assignedAt: {
      type: Date,
    },

    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Complaint', complaintSchema)
