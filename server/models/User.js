import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    registerId: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    mobile: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
    },
    govIdHash: {
      type: String
    },
    govIdType: {
      type: String,
      enum: ['aadhaar_last4', 'pan', 'voter_id', 'driving_licence', 'other'],
      default: 'aadhaar_last4'
    },
    govIdMasked: {
      type: String,
      trim: true
    },
    passwordHash: {
      type: String
      // Optional: legacy users may have a password hash stored; new users login via OTP only
    },
    role: {
      type: String,
      enum: ['user', 'staff', 'super_admin'],
      default: 'user',
      index: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isMobileVerified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification'],
      default: 'active'
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    twoFactorSecret: {
      type: String
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false
    },
    address: {
      street: { type: String, trim: true, maxlength: 120 },
      city: { type: String, trim: true, maxlength: 60 },
      state: { type: String, trim: true, maxlength: 50 },
      pincode: { type: String, trim: true, match: [/^\d{6}$/, 'Invalid 6-digit PIN code'] }
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    lastLoginAt: {
      type: Date
    },
    consentGivenAt: {
      type: Date,
      default: Date.now
    },
    consentVersion: {
      type: String,
      default: 'DPDP-2023-v1'
    }
  },
  {
    timestamps: true
  }
)

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ mobile: 1 }, { unique: true, sparse: true })
userSchema.index({ registerId: 1 }, { unique: true })
userSchema.index({ govIdHash: 1 }, { unique: true, sparse: true })

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  const salt = await bcrypt.genSalt(12)
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
}

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 }
    })
  }

  const updates = { $inc: { failedLoginAttempts: 1 } }
  if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) }
  }
  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { failedLoginAttempts: 0 },
    $unset: { lockUntil: 1 }
  })
}

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.passwordHash
    delete ret.twoFactorSecret
    delete ret.govIdHash
    delete ret.__v
    return ret
  }
})

export const User = mongoose.model('User', userSchema)
