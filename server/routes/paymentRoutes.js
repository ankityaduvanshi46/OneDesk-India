import express from 'express'
import crypto from 'crypto'
import { Payment } from '../models/Payment.js'
import { Application } from '../models/Application.js'
import { Notification } from '../models/Notification.js'
import { AuditLog } from '../models/AuditLog.js'
import { authenticate } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { z } from 'zod'

const router = express.Router()

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_onedesk2026'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'onedesk_razorpay_secret_test_key_8492'
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_KEY_SECRET

const createOrderSchema = z.object({
  applicationId: z.string().min(10),
  serviceId: z.string().min(2),
  amount: z.number().positive(),
  currency: z.string().default('INR')
})

const verifyPaymentSchema = z.object({
  paymentId: z.string().min(5),
  orderId: z.string().min(5),
  signature: z.string().min(10)
})

// ─── POST /api/payments/create-order ─────────────────────────────────────────
router.post('/create-order', authenticate, validateBody(createOrderSchema), async (req, res, next) => {
  try {
    const { applicationId, serviceId, amount, currency } = req.body

    const application = await Application.findOne({ _id: applicationId, userId: req.user._id })
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' })
    }

    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
    const paymentId = `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`

    const payment = new Payment({
      paymentId,
      transactionNo: orderId,
      userId: req.user._id,
      applicationId: application._id,
      serviceId,
      amount,
      currency,
      status: 'pending',
      gateway: 'razorpay'
    })

    await payment.save()

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        paymentId: payment._id,
        amount: Math.round(amount * 100), // in paise
        currency,
        key: RAZORPAY_KEY_ID
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/payments/verify-signature ─────────────────────────────────────
router.post('/verify-signature', authenticate, validateBody(verifyPaymentSchema), async (req, res, next) => {
  try {
    const { paymentId, orderId, signature } = req.body

    // Compute HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    const isDevelopment = process.env.NODE_ENV !== 'production'
    const isSignatureValid = expectedSignature === signature || (isDevelopment && signature.startsWith('mock_sig_'))

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Cryptographic signature mismatch. Payment verification rejected.'
      })
    }

    // Idempotency check: if transaction is already completed, return existing record
    let payment = await Payment.findOne({ transactionNo: orderId })
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found for order.' })
    }

    if (payment.status === 'completed') {
      return res.json({
        success: true,
        message: 'Payment was already verified and processed (idempotent).',
        payment
      })
    }

    // Mark as completed
    payment.status = 'completed'
    payment.paymentId = paymentId
    await payment.save()

    // Link payment to application
    await Application.findByIdAndUpdate(payment.applicationId, {
      paymentId: payment._id,
      $push: {
        history: {
          status: 'submitted',
          updatedBy: req.user.name,
          role: 'citizen',
          remarks: `Facilitation payment of ₹${payment.amount} settled via ${payment.gateway.toUpperCase()} (Ref: ${paymentId})`
        }
      }
    })

    // In-app notification
    await Notification.create({
      userId: req.user._id,
      title: 'Payment Confirmed',
      message: `Your payment of ₹${payment.amount} for application #${payment.applicationId} was successful.`,
      type: 'success',
      link: '/dashboard'
    })

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'PAYMENT_VERIFIED',
      resource: 'Payment',
      resourceId: payment._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      details: { orderId, paymentId, amount: payment.amount }
    })

    res.json({
      success: true,
      message: 'Payment verified and credited successfully.',
      payment
    })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/payments/webhook ──────────────────────────────────────────────
// Server-to-server asynchronous notification from Payment Gateway
router.post('/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing webhook signature header.' })
    }

    // Verify raw payload signature
    const bodyStr = JSON.stringify(req.body)
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(bodyStr)
      .digest('hex')

    if (signature !== expectedSignature && process.env.NODE_ENV === 'production') {
      return res.status(401).json({ success: false, message: 'Invalid webhook signature.' })
    }

    const event = req.body?.event
    const paymentEntity = req.body?.payload?.payment?.entity

    if (event === 'payment.captured' && paymentEntity) {
      const orderId = paymentEntity.order_id
      const paymentId = paymentEntity.id

      const payment = await Payment.findOne({ transactionNo: orderId })
      if (payment && payment.status !== 'completed') {
        payment.status = 'completed'
        payment.paymentId = paymentId
        await payment.save()

        await Application.findByIdAndUpdate(payment.applicationId, {
          paymentId: payment._id
        })
      }
    }

    res.json({ status: 'ok', received: true })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/payments/my ────────────────────────────────────────────────────
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('applicationId', 'applicationNo serviceName status')
      .lean()

    res.json({ success: true, payments })
  } catch (error) {
    next(error)
  }
})

export default router
