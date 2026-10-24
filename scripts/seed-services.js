/**
 * seed-services.js
 * Seeds the MongoDB `services` collection from the static services.js catalog.
 * Safe to run multiple times — uses upsert (insert or update, never duplicate).
 *
 * Usage:
 *   node scripts/seed-services.js
 *   NODE_ENV=production MONGODB_URI="mongodb+srv://..." node scripts/seed-services.js
 */

import 'dotenv/config'
import mongoose from 'mongoose'

// ── Inline static service data (mirrors server/data catalog) ─────────────────
// We import directly from the frontend data file. The script runs as ESM because
// package.json has "type": "module".
import { services as staticServices } from '../src/data/services.js'

// ── Connect ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onedesk_staging'
console.log(`\n🔗  Connecting to MongoDB: ${MONGO_URI.replace(/:([^:@]+)@/, ':***@')}\n`)

await mongoose.connect(MONGO_URI, { maxPoolSize: 2 })

// ── Inline Service model (avoids circular-import issues) ─────────────────────
const serviceSchema = new mongoose.Schema(
  {
    serviceId:     { type: String, required: true, unique: true, lowercase: true },
    name:          { type: String, required: true },
    nameHi:        String,
    category:      { type: String, required: true },
    description:   String,
    descriptionHi: String,
    url:           String,
    helpline:      String,
    fees:          { type: String, default: 'Free' },
    processingTime:{ type: String, default: 'Varies' },
    documents:     [String],
    steps:         [String],
    applyEnabled:  { type: Boolean, default: true },
    applyFee:      { type: String, default: 'Free' },
    applyTime:     { type: String, default: 'Varies' },
    isActive:      { type: Boolean, default: true },
    isTrending:    { type: Boolean, default: false },
    isVerified:    { type: Boolean, default: true }
  },
  { timestamps: true }
)

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema)

// ── Seed ──────────────────────────────────────────────────────────────────────
let created = 0
let updated = 0

for (const s of staticServices) {
  const doc = {
    serviceId:     s.id,
    name:          s.name,
    nameHi:        s.nameHi,
    category:      s.category,
    description:   s.description,
    descriptionHi: s.descriptionHi,
    url:           s.url,
    helpline:      s.helpline,
    fees:          s.fees || 'Free',
    processingTime:s.time || 'Varies',
    documents:     s.documents || [],
    steps:         s.steps || [],
    applyEnabled:  true,
    applyFee:      s.fees || 'Free',
    applyTime:     s.time || 'Varies',
    isActive:      true,
    isTrending:    s.trending === true,
    isVerified:    s.verified !== false
  }

  const result = await Service.findOneAndUpdate(
    { serviceId: s.id },
    { $setOnInsert: doc },   // upsert insert only — do not overwrite admin edits
    { upsert: true, new: true, lean: true }
  )

  if (result) {
    // Check if it was a new insert or existing
  }

  // Detect if it was inserted (no updatedAt before) or just found
  const existing = await Service.findOne({ serviceId: s.id }).lean()
  const isNew = Math.abs(existing.createdAt - existing.updatedAt) < 1000
  if (isNew) created++; else updated++
}

console.log(`✅  Services seed complete:`)
console.log(`   ➕  Inserted (new): ${created}`)
console.log(`   ♻️   Skipped (existing, not overwritten): ${updated}`)
console.log(`   📦  Total in DB: ${await Service.countDocuments()}\n`)

await mongoose.disconnect()
process.exit(0)
