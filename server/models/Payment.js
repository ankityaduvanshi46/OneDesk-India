import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    transactionNo: {
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
      ref: 'Application',
      required: true,
      index: true
    },
    serviceId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet', 'free_tier'],
      default: 'upi'
    },
    gateway: {
      type: String,
      default: 'razorpay'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
      index: true
    },
    receiptUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

paymentSchema.index({ userId: 1, createdAt: -1 })

export const Payment = mongoose.model('Payment', paymentSchema)
