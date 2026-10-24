import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderRole: {
      type: String,
      enum: ['user', 'staff', 'super_admin'],
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
)

const ticketSchema = new mongoose.Schema(
  {
    ticketNo: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    subject: {
      type: String,
      required: true,
      maxlength: 150
    },
    category: {
      type: String,
      enum: ['application_status', 'document_correction', 'payment_issue', 'technical_help', 'other'],
      default: 'application_status'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true
    },
    messages: [messageSchema]
  },
  {
    timestamps: true
  }
)

ticketSchema.index({ userId: 1, createdAt: -1 })
ticketSchema.index({ status: 1, createdAt: -1 })

export const Ticket = mongoose.model('Ticket', ticketSchema)
