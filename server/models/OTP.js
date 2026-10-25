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
    // Store only the hashed OTP — never plain-text
    hashedCode: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['login', 'register', 'email_verification', 'mobile_verification', 'password_reset', 'admin_2fa'],
      required: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    // Max 5 wrong attempts before this OTP is permanently blocked
    maxAttempts: {
      type: Number,
      default: 5
    },
    verified: {
      type: Boolean,
      default: false
    },
    // Track when the OTP was last sent so we can enforce 60-second resend cooldown
    lastSentAt: {
      type: Date,
      default: Date.now
    },
    // How many OTPs have been sent this hour for this identifier
    hourlySendCount: {
      type: Number,
      default: 1
    },
    // Start of the current hourly window
    hourlyWindowStart: {
      type: Date,
      default: Date.now
    },
    // IP that triggered the OTP send
    ipAddress: {
      type: String,
      default: ''
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
