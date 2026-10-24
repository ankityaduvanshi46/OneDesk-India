import mongoose from 'mongoose'

const uploadedFileSchema = new mongoose.Schema(
  {
    documentType: { type: String, required: true },
    originalName: { type: String, required: true },
    fileName:     { type: String },          // local filename (legacy / dev only)
    publicId:     { type: String },          // Cloudinary public_id for signed URL generation
    fileUrl:      { type: String, required: true },
    mimeType:     { type: String, required: true },
    sizeBytes:    { type: Number, required: true },
    uploadedAt:   { type: Date, default: Date.now }
  },
  { _id: true }
)

const historyEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    updatedBy: { type: String, default: 'System' },
    role: { type: String, default: 'system' },
    remarks: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: true }
)

const applicationSchema = new mongoose.Schema(
  {
    applicationNo: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    serviceId: {
      type: String,
      required: true,
      index: true
    },
    serviceName: {
      type: String,
      required: true
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    uploadedFiles: [uploadedFileSchema],
    status: {
      type: String,
      enum: ['draft', 'submitted', 'in_review', 'action_required', 'approved', 'ready', 'rejected'],
      default: 'submitted',
      index: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    officerNotes: {
      type: String,
      default: ''
    },
    assignedOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    issuedDocumentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    history: [historyEntrySchema]
  },
  {
    timestamps: true
  }
)

applicationSchema.index({ userId: 1, createdAt: -1 })
applicationSchema.index({ status: 1, createdAt: -1 })
applicationSchema.index({ serviceId: 1 })

export const Application = mongoose.model('Application', applicationSchema)
