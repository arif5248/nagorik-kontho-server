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
        'master_admin',
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
      trim: true,
    },

    district: {
      type: String,
      required: [true, 'Please select district'],
      trim: true,
    },

    upazila: {
      type: String,
      required: [true, 'Please select upazila'],
      trim: true,
    },

    postalCode: {
      type: String,
      required: [true, 'Please select postal code'],
      trim: true,
    },

    area: {
      type: String,
      required: [true, 'Please enter area'],
      trim: true,
    },

    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please enter email'],
      lowercase: true,
      trim: true,
    },

    ticketNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
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

    status: {
      type: String,
      enum: [
        'submitted',
        'assigned',
        'accepted',
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
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    adminNote: {
      type: String,
      trim: true,
      default: '',
    },

    tracking: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
        },

        status: {
          type: String,
          enum: [
            'submitted',
            'assigned',
            'accepted',
            'under_review',
            'investigating',
            'in_progress',
            'resolved',
            'rejected',
          ],
          required: true,
        },

        eventType: {
          type: String,
          enum: [
            'system',
            'assignment',
            'acceptance',
            'progress',
            'inspection',
            'document',
            'resolution',
            'rejection',
          ],
          default: 'progress',
        },

        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },

        updatedByName: {
          type: String,
          default: '',
        },

        updatedByType: {
          type: String,
          enum: ['system', 'master_admin', 'admin', 'officer', 'citizen'],
          default: 'system',
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Complaint', complaintSchema)
