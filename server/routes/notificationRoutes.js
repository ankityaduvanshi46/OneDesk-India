import express from 'express'
import { Notification } from '../models/Notification.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false })

    res.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (error) {
    next(error)
  }
})

router.put('/mark-read/:id', authenticate, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    )
    res.json({ success: true, notification })
  } catch (error) {
    next(error)
  }
})

router.put('/mark-all-read', authenticate, async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true })
    res.json({ success: true, message: 'All notifications marked as read.' })
  } catch (error) {
    next(error)
  }
})

export default router
