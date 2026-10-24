import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    citizenName: {
      type: String,
      required: true
    },
    serviceId: {
      type: String,
      index: true
    },
    serviceName: {
      type: String
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 600,
      trim: true
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'hidden'],
      default: 'approved',
      index: true
    }
  },
  {
    timestamps: true
  }
)

feedbackSchema.index({ serviceId: 1, status: 1, rating: -1 })

export const Feedback = mongoose.model('Feedback', feedbackSchema)
