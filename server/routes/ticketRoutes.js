import express from 'express'
import { Ticket } from '../models/Ticket.js'
import { generateTicketNo } from '../utils/idGenerator.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { subject, category, priority, message, applicationId } = req.body

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' })
    }

    const ticketNo = generateTicketNo()

    const ticket = new Ticket({
      ticketNo,
      userId: req.user._id,
      applicationId: applicationId || null,
      subject: subject.trim(),
      category: category || 'application_status',
      priority: priority || 'medium',
      status: 'open',
      messages: [
        {
          senderId: req.user._id,
          senderRole: req.user.role,
          senderName: req.user.name,
          message: message.trim()
        }
      ]
    })

    await ticket.save()

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      ticket
    })
  } catch (error) {
    next(error)
  }
})

router.get('/my', authenticate, async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('applicationId', 'applicationNo serviceName')
      .lean()

    res.json({
      success: true,
      tickets
    })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/reply', authenticate, async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' })
    }

    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' })
    }

    const isOwner = ticket.userId.toString() === req.user._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(req.user.role)

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Access denied.' })
    }

    ticket.messages.push({
      senderId: req.user._id,
      senderRole: req.user.role,
      senderName: req.user.name,
      message: message.trim()
    })

    if (isStaff && ticket.status === 'open') {
      ticket.status = 'in_progress'
    } else if (isOwner && ticket.status === 'resolved') {
      ticket.status = 'open'
    }

    await ticket.save()

    res.json({
      success: true,
      message: 'Reply sent successfully.',
      ticket
    })
  } catch (error) {
    next(error)
  }
})

export default router
