import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    documentNo: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    verificationId: {
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
      required: false,
      default: null,
      index: true
    },
    serviceId: {
      type: String,
      default: 'locker'
    },
    category: {
      type: String,
      enum: ['identity', 'transport', 'certificates', 'tax_finance', 'education', 'health', 'employment', 'land_property', 'utilities', 'other'],
      default: 'identity',
      index: true
    },
    docType: {
      type: String,
      default: 'custom'
    },
    isSelfUploaded: {
      type: Boolean,
      default: false,
      index: true
    },
    notes: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: null        // Cloudinary public_id for generating signed download URLs
    },
    fileUrl: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      default: 'application/pdf'
    },
    fileSizeBytes: {
      type: Number,
      default: 0
    },
    qrCodeData: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'revoked', 'expired'],
      default: 'active',
      index: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
)

documentSchema.index({ userId: 1, createdAt: -1 })
documentSchema.index({ verificationId: 1 }, { unique: true })

export const Document = mongoose.model('Document', documentSchema)
