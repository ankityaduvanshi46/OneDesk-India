import express from 'express'
import { Application } from '../models/Application.js'
import { Notification } from '../models/Notification.js'
import { AuditLog } from '../models/AuditLog.js'
import { sendApplicationStatusEmail } from '../utils/mailer.js'

const router = express.Router()

// ─── GET /api/cron/reminders ─────────────────────────────────────────────────
// Triggered on a schedule (e.g., daily at 09:00 IST) via Vercel Cron
router.get('/reminders', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const cronSecret = process.env.CRON_SECRET

    // Verify Vercel Cron invocation or secret header
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && req.headers['x-vercel-cron'] !== '1') {
      return res.status(401).json({ success: false, message: 'Unauthorized cron request.' })
    }

    // Find active applications pending for more than 3 days
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const pendingApps = await Application.find({
      status: { $in: ['submitted', 'in_review', 'action_required'] },
      updatedAt: { $lt: threeDaysAgo }
    })
      .populate('userId', 'name email')
      .limit(50)

    let remindersSent = 0

    for (const app of pendingApps) {
      if (app.userId?.email) {
        // Send citizen update reminder
        await sendApplicationStatusEmail({
          email: app.userId.email,
          name: app.userId.name,
          applicationNo: app.applicationNo,
          serviceName: app.serviceName,
          status: app.status,
          remarks: 'Automated status digest: Your application is currently progressing through official departmental verifications.'
        }).catch(() => null)

        await Notification.create({
          userId: app.userId._id,
          title: `Status Update: #${app.applicationNo}`,
          message: `Your request for ${app.serviceName} is actively in progress. No additional actions needed.`,
          type: 'info',
          link: `/dashboard`
        }).catch(() => null)

        remindersSent++
      }
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      remindersSent,
      scannedCount: pendingApps.length
    })
  } catch (error) {
    next(error)
  }
})

export default router
