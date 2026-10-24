import express from 'express'
import { Service } from '../models/Service.js'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'
import { validateBody } from '../middleware/validate.js'
import { AuditLog } from '../models/AuditLog.js'
import { z } from 'zod'

const router = express.Router()

// ─── Schema ───────────────────────────────────────────────────────────────────
const serviceSchema = z.object({
  serviceId:    z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name:         z.string().min(2).max(200),
  nameHi:       z.string().max(200).optional(),
  category:     z.enum([
    'identity', 'transport', 'certificates', 'tax-finance',
    'education', 'health', 'jobs', 'land-property', 'utilities', 'grievance'
  ]),
  description:  z.string().max(500).optional(),
  descriptionHi: z.string().max(500).optional(),
  url:          z.string().url().optional().or(z.literal('')),
  helpline:     z.string().max(30).optional(),
  fees:         z.string().max(100).default('Free'),
  processingTime: z.string().max(100).default('Varies'),
  documents:    z.array(z.string().max(200)).default([]),
  steps:        z.array(z.string().max(500)).default([]),
  applyEnabled: z.boolean().default(true),
  applyFee:     z.string().max(50).default('Free'),
  applyTime:    z.string().max(100).default('Varies'),
  isActive:     z.boolean().default(true),
  isTrending:   z.boolean().default(false),
  isVerified:   z.boolean().default(true)
})

// ─── PUBLIC: GET /api/services ── list active services ──────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { category, trending, limit = 100, page = 1 } = req.query
    const filter = { isActive: true }

    if (category && category !== 'all') filter.category = category
    if (trending === 'true')            filter.isTrending = true

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort({ isTrending: -1, createdAt: 1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .select('-__v -createdBy -updatedBy')
        .lean(),
      Service.countDocuments(filter)
    ])

    res.json({
      success: true,
      services,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── PUBLIC: GET /api/services/:serviceId ── single service detail ───────────
router.get('/:serviceId', async (req, res, next) => {
  try {
    const service = await Service.findOne({
      serviceId: req.params.serviceId.toLowerCase(),
      isActive: true
    }).select('-__v').lean()

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' })
    }

    res.json({ success: true, service })
  } catch (error) {
    next(error)
  }
})

// ─── ADMIN: POST /api/services ── create service ─────────────────────────────
router.post(
  '/',
  authenticate,
  requireRole('staff', 'super_admin'),
  validateBody(serviceSchema),
  async (req, res, next) => {
    try {
      const existing = await Service.findOne({ serviceId: req.body.serviceId })
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Service with ID "${req.body.serviceId}" already exists.`
        })
      }

      const service = new Service({ ...req.body, createdBy: req.user._id })
      await service.save()

      await AuditLog.create({
        userId:    req.user._id,
        userRole:  req.user.role,
        action:    'SERVICE_CREATED',
        resource:  'Service',
        resourceId: service._id.toString(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || '',
        details:   { serviceId: service.serviceId, name: service.name }
      })

      res.status(201).json({ success: true, message: 'Service created.', service })
    } catch (error) {
      next(error)
    }
  }
)

// ─── ADMIN: PATCH /api/services/:serviceId ── update service ─────────────────
router.patch(
  '/:serviceId',
  authenticate,
  requireRole('staff', 'super_admin'),
  validateBody(serviceSchema.partial()),
  async (req, res, next) => {
    try {
      const service = await Service.findOneAndUpdate(
        { serviceId: req.params.serviceId.toLowerCase() },
        { ...req.body, updatedBy: req.user._id },
        { new: true, runValidators: true }
      )

      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found.' })
      }

      await AuditLog.create({
        userId:    req.user._id,
        userRole:  req.user.role,
        action:    'SERVICE_UPDATED',
        resource:  'Service',
        resourceId: service._id.toString(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || '',
        details:   req.body
      })

      res.json({ success: true, message: 'Service updated.', service })
    } catch (error) {
      next(error)
    }
  }
)

// ─── ADMIN: DELETE /api/services/:serviceId ── soft-delete (isActive=false) ──
router.delete(
  '/:serviceId',
  authenticate,
  requireRole('super_admin'),
  async (req, res, next) => {
    try {
      const service = await Service.findOneAndUpdate(
        { serviceId: req.params.serviceId.toLowerCase() },
        { isActive: false, updatedBy: req.user._id },
        { new: true }
      )

      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found.' })
      }

      await AuditLog.create({
        userId:    req.user._id,
        userRole:  req.user.role,
        action:    'SERVICE_DEACTIVATED',
        resource:  'Service',
        resourceId: service._id.toString(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || '',
        details:   { serviceId: service.serviceId }
      })

      res.json({ success: true, message: 'Service deactivated.', service })
    } catch (error) {
      next(error)
    }
  }
)

export default router
