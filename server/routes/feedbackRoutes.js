import express from 'express'
import { Feedback } from '../models/Feedback.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { z } from 'zod'

const router = express.Router()

const feedbackSchema = z.object({
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(600)
})

// ─── POST /api/feedback ──────────────────────────────────────────────────────
router.post('/', authenticate, validateBody(feedbackSchema), async (req, res, next) => {
  try {
    const { serviceId, serviceName, rating, comment } = req.body

    const feedback = new Feedback({
      userId: req.user._id,
      citizenName: req.user.name,
      serviceId: serviceId || null,
      serviceName: serviceName || 'General Platform',
      rating,
      comment: comment.trim(),
      status: 'approved'
    })

    await feedback.save()

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable citizen feedback!',
      feedback
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/feedback ───────────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { serviceId, limit = 10 } = req.query
    const filter = { status: 'approved', isPublic: true }

    if (serviceId) {
      filter.serviceId = serviceId
    }

    const reviews = await Feedback.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit, 10))
      .select('-__v -userId')
      .lean()

    res.json({ success: true, reviews })
  } catch (error) {
    next(error)
  }
})

export default router
