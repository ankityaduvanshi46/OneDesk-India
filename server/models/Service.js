import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    // Slug — matches the id used in services.js static data and URL param
    serviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    nameHi: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'identity', 'transport', 'certificates', 'tax-finance',
        'education', 'health', 'jobs', 'land-property', 'utilities', 'grievance'
      ]
    },
    description: { type: String, trim: true },
    descriptionHi: { type: String, trim: true },
    url: { type: String, trim: true },           // Official government portal URL
    helpline: { type: String, trim: true },
    fees: { type: String, default: 'Free' },
    processingTime: { type: String, default: 'Varies' },
    documents: [{ type: String, trim: true }],   // Required document names
    steps: [{ type: String, trim: true }],       // How-to-apply steps

    // OneDesk Hub apply support
    applyEnabled: { type: Boolean, default: true },
    applyFee: { type: String, default: 'Free' }, // Platform service fee (₹)
    applyTime: { type: String, default: 'Varies' },

    // Visibility
    isActive: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },

    // Admin metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

serviceSchema.index({ category: 1, isActive: 1 })
serviceSchema.index({ isTrending: -1, isActive: 1 })

export const Service = mongoose.model('Service', serviceSchema)
