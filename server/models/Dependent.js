import mongoose from 'mongoose'

const dependentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      enum: ['spouse', 'child', 'parent', 'sibling', 'other'],
      required: true,
      index: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other'
    },
    govIdType: {
      type: String,
      enum: ['aadhaar_last4', 'pan', 'birth_cert', 'voter_id', 'none'],
      default: 'none'
    },
    govIdMasked: {
      type: String,
      default: ''
    },
    govIdHash: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true
    }
  },
  {
    timestamps: true
  }
)

dependentSchema.index({ userId: 1, createdAt: -1 })
dependentSchema.index({ userId: 1, name: 1 })

export const Dependent = mongoose.model('Dependent', dependentSchema)
