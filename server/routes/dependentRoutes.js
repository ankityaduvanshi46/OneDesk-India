import express from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import { Dependent } from '../models/Dependent.js'
import { Application } from '../models/Application.js'
import { Document } from '../models/Document.js'
import { authenticate } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'

const router = express.Router()

const dependentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  relationship: z.enum(['spouse', 'child', 'parent', 'sibling', 'other']),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
  govIdType: z.enum(['aadhaar_last4', 'pan', 'birth_cert', 'voter_id', 'none']).optional(),
  govIdNumber: z.string().optional(),
  notes: z.string().max(500).optional()
})

function hashGovId(idNumber) {
  if (!idNumber) return null
  const salt = process.env.GOV_ID_SALT || 'onedesk_gov_salt_secure_2026'
  return crypto.createHmac('sha256', salt).update(idNumber.trim().toUpperCase()).digest('hex')
}

function maskGovId(type, number) {
  if (!number) return ''
  const trimmed = number.trim().toUpperCase()
  if (type === 'aadhaar_last4') {
    return `••••-••••-${trimmed.slice(-4)}`
  }
  if (type === 'pan' && trimmed.length === 10) {
    return `${trimmed.slice(0, 2)}••••••${trimmed.slice(-2)}`
  }
  return `••••${trimmed.slice(-4)}`
}

// ─── GET /api/dependents ── List Citizen's Family Profiles ───────────────────
router.get('/', authenticate, async (req, res, next) => {
  try {
    const dependents = await Dependent.find({
      userId: req.user._id,
      status: 'active'
    }).sort({ createdAt: -1 }).lean()

    // Enrich with count of linked applications and documents
    const enriched = await Promise.all(
      dependents.map(async (dep) => {
        const [appCount, docCount] = await Promise.all([
          Application.countDocuments({ userId: req.user._id, dependentId: dep._id }),
          Document.countDocuments({ userId: req.user._id, dependentId: dep._id })
        ])
        return {
          ...dep,
          applicationCount: appCount,
          documentCount: docCount,
          stats: {
            applicationsCount: appCount,
            documentsCount: docCount
          }
        }
      })
    )

    res.json({
      success: true,
      dependents: enriched
    })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/dependents ── Add New Family Dependent Profile ─────────────────
router.post('/', authenticate, validateBody(dependentSchema), async (req, res, next) => {
  try {
    const { name, relationship, gender, dateOfBirth, govIdType, govIdNumber, notes } = req.body

    const govIdHash = govIdNumber ? hashGovId(govIdNumber) : null
    const govIdMasked = govIdNumber ? maskGovId(govIdType, govIdNumber) : ''

    // Prevent duplicate dependent within the same citizen account
    if (govIdHash) {
      const existing = await Dependent.findOne({
        userId: req.user._id,
        govIdHash,
        status: 'active'
      })
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `A family profile for ${existing.name} with this ID is already registered under your account.`
        })
      }
    }

    const dependent = new Dependent({
      userId: req.user._id,
      name: name.trim(),
      relationship,
      gender: gender || 'other',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      govIdType: govIdType || 'none',
      govIdMasked,
      govIdHash,
      notes: notes ? notes.trim() : '',
      status: 'active'
    })

    await dependent.save()

    res.status(201).json({
      success: true,
      message: `Family profile for ${dependent.name} added successfully.`,
      dependent: {
        ...dependent.toObject(),
        stats: { applicationsCount: 0, documentsCount: 0 }
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/dependents/:id ── Get Single Dependent (Owner Only) ──────────────
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const dependent = await Dependent.findById(req.params.id)

    if (!dependent || dependent.status === 'archived') {
      return res.status(404).json({ success: false, message: 'Family member profile not found.' })
    }

    // IDOR Protection: Must be owned by requesting citizen
    if (dependent.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this family profile.' })
    }

    const [applications, documents] = await Promise.all([
      Application.find({ userId: req.user._id, dependentId: dependent._id })
        .sort({ createdAt: -1 })
        .select('applicationNo serviceName status createdAt')
        .lean(),
      Document.find({ userId: req.user._id, dependentId: dependent._id })
        .sort({ createdAt: -1 })
        .select('documentNo verificationId title category createdAt')
        .lean()
    ])

    res.json({
      success: true,
      dependent: {
        ...dependent.toObject(),
        applications,
        documents
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── PUT /api/dependents/:id ── Update Dependent Profile (Owner Only) ──────────
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const dependent = await Dependent.findById(req.params.id)

    if (!dependent || dependent.status === 'archived') {
      return res.status(404).json({ success: false, message: 'Family member profile not found.' })
    }

    // IDOR Protection
    if (dependent.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this family profile.' })
    }

    const { name, relationship, gender, dateOfBirth, notes } = req.body

    if (name && name.trim()) dependent.name = name.trim()
    if (relationship) dependent.relationship = relationship
    if (gender) dependent.gender = gender
    if (dateOfBirth) dependent.dateOfBirth = new Date(dateOfBirth)
    if (notes !== undefined) dependent.notes = notes.trim()

    await dependent.save()

    res.json({
      success: true,
      message: 'Family profile updated successfully.',
      dependent
    })
  } catch (error) {
    next(error)
  }
})

// ─── DELETE /api/dependents/:id ── Archive Dependent Profile (Owner Only) ──────
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const dependent = await Dependent.findById(req.params.id)

    if (!dependent) {
      return res.status(404).json({ success: false, message: 'Family member profile not found.' })
    }

    // IDOR Protection
    if (dependent.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this family profile.' })
    }

    // Soft delete to preserve audit history of prior applications
    dependent.status = 'archived'
    await dependent.save()

    res.json({
      success: true,
      message: `${dependent.name}'s profile has been safely removed.`
    })
  } catch (error) {
    next(error)
  }
})

export default router
