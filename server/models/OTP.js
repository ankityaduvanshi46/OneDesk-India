import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true
    },
    code: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['email_verification', 'mobile_verification', 'password_reset', 'admin_2fa'],
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  {
    timestamps: true
  }
)

otpSchema.index({ identifier: 1, type: 1 })

export const OTP = mongoose.model('OTP', otpSchema)
