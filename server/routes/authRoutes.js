import express from 'express'
import jwt from 'jsonwebtoken'
import { isDBConnected } from '../config/db.js'
import { User } from '../models/User.js'
import { OTP } from '../models/OTP.js'
import { Application } from '../models/Application.js'
import { Document } from '../models/Document.js'
import { AuditLog } from '../models/AuditLog.js'
import { generateOTP, hashOTP, verifyOTP, hashGovId, maskGovId } from '../utils/otp.js'
import { generateRegisterId } from '../utils/idGenerator.js'
import { sendOtpEmail } from '../utils/mailer.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js'
import { validateBody } from '../middleware/validate.js'
import {
  sendOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  updateProfileSchema
} from '../schemas/index.js'

const router = express.Router()

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateTokenAndSetCookie(res, user) {
  const secret = process.env.JWT_SECRET || 'onedesk_super_secret_jwt_key_2026_secure_random_string_89327498'
  const token = jwt.sign(
    { userId: user._id, role: user.role, registerId: user.registerId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  const isProduction = process.env.NODE_ENV === 'production'
  res.cookie('onedesk_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return token
}

function dbCheck(res) {
  if (!isDBConnected()) {
    res.status(503).json({
      success: false,
      message: 'Database connection is temporarily unavailable. Please verify MONGODB_URI configuration in Vercel settings.'
    })
    return false
  }
  return true
}

// Max OTPs allowed per email per hour (prevents brute-force OTP spam)
const OTP_HOURLY_LIMIT = 5
// Minimum seconds between resend requests
const OTP_RESEND_COOLDOWN_SECS = 60
// OTP validity in milliseconds
const OTP_EXPIRY_MS = 5 * 60 * 1000

// ─── POST /auth/send-otp ────────────────────────────────────────────────────
// Unified: handles both 'login' and 'register' OTP dispatch.
// Does NOT reveal whether an email is already registered.
router.post('/send-otp', authLimiter, validateBody(sendOtpSchema), async (req, res, next) => {
  try {
    if (!dbCheck(res)) return

    const { email, name, type } = req.body
    const cleanEmail = email.trim().toLowerCase()
    const ipAddress = req.ip || ''

    // ── Resend cooldown check ──────────────────────────────────────────────
    const existing = await OTP.findOne({ identifier: cleanEmail, type }).sort({ createdAt: -1 })

    if (existing) {
      const secondsSinceLast = (Date.now() - new Date(existing.lastSentAt).getTime()) / 1000
      if (secondsSinceLast < OTP_RESEND_COOLDOWN_SECS) {
        const waitSec = Math.ceil(OTP_RESEND_COOLDOWN_SECS - secondsSinceLast)
        return res.status(429).json({
          success: false,
          code: 'RESEND_COOLDOWN',
          message: `Please wait ${waitSec} second(s) before requesting a new code.`,
          retryAfterSeconds: waitSec
        })
      }

      // ── Hourly rate limit ────────────────────────────────────────────────
      const windowAge = Date.now() - new Date(existing.hourlyWindowStart).getTime()
      if (windowAge < 60 * 60 * 1000 && existing.hourlySendCount >= OTP_HOURLY_LIMIT) {
        return res.status(429).json({
          success: false,
          code: 'HOURLY_LIMIT',
          message: 'You have requested too many verification codes. Please try again after an hour.'
        })
      }
    }

    // ── Generate & hash OTP ────────────────────────────────────────────────
    const plainCode = generateOTP(6)
    const hashedCode = hashOTP(plainCode)
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS)

    // ── Delete old OTPs for this email+type, create fresh one ─────────────
    await OTP.deleteMany({ identifier: cleanEmail, type })

    const hourlyWindowStart = existing && (Date.now() - new Date(existing.hourlyWindowStart).getTime()) < 60 * 60 * 1000
      ? existing.hourlyWindowStart
      : new Date()

    const hourlySendCount = existing && (Date.now() - new Date(existing.hourlyWindowStart).getTime()) < 60 * 60 * 1000
      ? existing.hourlySendCount + 1
      : 1

    await OTP.create({
      identifier: cleanEmail,
      hashedCode,
      type,
      expiresAt,
      lastSentAt: new Date(),
      hourlyWindowStart,
      hourlySendCount,
      ipAddress
    })

    // ── Resolve display name for email ────────────────────────────────────
    let displayName = name
    if (!displayName) {
      const user = await User.findOne({ email: cleanEmail }).select('name').lean()
      displayName = user?.name || 'Citizen'
    }

    // ── Send OTP email ────────────────────────────────────────────────────
    try {
      await sendOtpEmail({ email: cleanEmail, name: displayName, code: plainCode, type })
    } catch (mailErr) {
      console.warn('[send-otp] Email dispatch error:', mailErr.message)
      // Still continue — in dev mode the OTP is printed to console by mock transporter
    }

    return res.json({
      success: true,
      message: 'A 6-digit verification code has been sent to your email. It is valid for 5 minutes.',
      email: cleanEmail
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /auth/verify-otp ──────────────────────────────────────────────────
// Verifies the OTP. On success: creates/finds user and issues JWT cookie.
// type = 'login' | 'register'
router.post('/verify-otp', otpLimiter, validateBody(verifyOtpSchema), async (req, res, next) => {
  try {
    if (!dbCheck(res)) return

    const { email, code, type, name } = req.body
    const cleanEmail = email.trim().toLowerCase()

    const otpRecord = await OTP.findOne({ identifier: cleanEmail, type }).sort({ createdAt: -1 })

    if (!otpRecord || otpRecord.verified) {
      return res.status(400).json({
        success: false,
        code: 'OTP_NOT_FOUND',
        message: 'No active verification code found. Please request a new code.'
      })
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({
        success: false,
        code: 'OTP_EXPIRED',
        message: 'Verification code has expired. Please request a new code.'
      })
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(429).json({
        success: false,
        code: 'OTP_BLOCKED',
        message: 'Too many incorrect attempts. This code has been invalidated. Please request a new one.'
      })
    }

    // Timing-safe hash comparison
    if (!verifyOTP(code, otpRecord.hashedCode)) {
      otpRecord.attempts += 1
      await otpRecord.save()
      const remaining = otpRecord.maxAttempts - otpRecord.attempts
      return res.status(400).json({
        success: false,
        code: 'OTP_WRONG',
        message: `Incorrect verification code. ${remaining} attempt(s) remaining.`,
        attemptsRemaining: remaining
      })
    }

    // ── OTP is correct — delete it immediately (single-use) ───────────────
    await OTP.deleteOne({ _id: otpRecord._id })

    // ── Upsert user ───────────────────────────────────────────────────────
    let user = await User.findOne({ email: cleanEmail })

    if (!user) {
      // New user — create account
      let registerId = generateRegisterId()
      while (await User.findOne({ registerId })) {
        registerId = generateRegisterId()
      }

      const newName = name?.trim() || cleanEmail.split('@')[0]

      user = new User({
        registerId,
        name: newName,
        email: cleanEmail,
        role: 'user',
        isEmailVerified: true,
        status: 'active',
        consentGivenAt: new Date(),
        consentVersion: 'DPDP-2023-v1'
      })
      await user.save()

      await AuditLog.create({
        userId: user._id,
        userRole: user.role,
        action: 'USER_REGISTER',
        resource: 'User',
        resourceId: user._id.toString(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || '',
        details: { method: 'otp_passwordless' }
      })
    } else {
      // Existing user — mark email verified, update last login
      if (!user.isEmailVerified) {
        user.isEmailVerified = true
        user.status = 'active'
      }
      user.lastLoginAt = new Date()
      await user.save()
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended. Please contact support.'
      })
    }

    const token = generateTokenAndSetCookie(res, user)

    await AuditLog.create({
      userId: user._id,
      userRole: user.role,
      action: type === 'register' ? 'USER_REGISTER_OTP' : 'USER_LOGIN_OTP',
      resource: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      details: { method: 'otp_passwordless', type }
    })

    return res.json({
      success: true,
      message: type === 'register' ? 'Account created and verified successfully!' : `Welcome back, ${user.name}!`,
      token,
      user
    })
  } catch (err) {
    next(err)
  }
})

// ─── POST /auth/resend-otp ───────────────────────────────────────────────────
// Delegates to /send-otp logic (same cooldown/limit rules apply).
router.post('/resend-otp', otpLimiter, validateBody(resendOtpSchema), async (req, res, next) => {
  // Re-use send-otp handler — just proxy the request body
  req.body.type = req.body.type || 'login'
  return router.handle(
    Object.assign(req, { url: '/send-otp', path: '/send-otp' }),
    res,
    next
  )
})

// ─── POST /auth/register ─────────────────────────────────────────────────────
// Backward-compat shim: maps old register call to the new send-otp flow.
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    if (!dbCheck(res)) return

    const { name, email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' })
    }

    // Delegate to send-otp with type='register'
    req.body = { email: email.trim().toLowerCase(), name: name?.trim(), type: 'register' }
    return router.handle(
      Object.assign(req, { url: '/send-otp', path: '/send-otp' }),
      res,
      next
    )
  } catch (err) {
    next(err)
  }
})

// ─── POST /auth/login ────────────────────────────────────────────────────────
// Backward-compat shim: maps old login call to the new send-otp flow.
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    if (!dbCheck(res)) return

    // Accept both old { identifier } and new { email }
    const email = (req.body.email || req.body.identifier || '').trim().toLowerCase()
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' })
    }

    req.body = { email, type: 'login' }
    return router.handle(
      Object.assign(req, { url: '/send-otp', path: '/send-otp' }),
      res,
      next
    )
  } catch (err) {
    next(err)
  }
})

// ─── POST /auth/logout ───────────────────────────────────────────────────────
router.post('/logout', optionalAuth, async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    res.clearCookie('onedesk_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/'
    })

    if (req.user) {
      await AuditLog.create({
        userId: req.user._id,
        userRole: req.user.role,
        action: 'USER_LOGOUT',
        resource: 'User',
        resourceId: req.user._id.toString(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || ''
      }).catch(() => null)
    }

    res.json({ success: true, message: 'Logged out successfully.' })
  } catch (err) {
    next(err)
  }
})

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  res.json({ success: true, user: req.user })
})

// ─── PUT /auth/profile ───────────────────────────────────────────────────────
router.put('/profile', authenticate, validateBody(updateProfileSchema), async (req, res, next) => {
  try {
    const { name, address, profilePhoto } = req.body
    const user = req.user

    if (name && name.trim()) user.name = name.trim()
    if (profilePhoto) user.profilePhoto = profilePhoto
    if (address && typeof address === 'object') {
      user.address = {
        street: address.street || user.address?.street || '',
        city: address.city || user.address?.city || '',
        state: address.state || user.address?.state || '',
        pincode: address.pincode || user.address?.pincode || ''
      }
    }

    await user.save()
    res.json({ success: true, message: 'Profile updated successfully.', user })
  } catch (err) {
    next(err)
  }
})

// ─── GET /auth/export-data ───────────────────────────────────────────────────
router.get('/export-data', authenticate, async (req, res, next) => {
  try {
    const userId = req.user._id
    const [applications, documents, auditLogs] = await Promise.all([
      Application.find({ userId }).lean(),
      Document.find({ userId }).lean(),
      AuditLog.find({ userId }).limit(100).lean()
    ])

    const archive = {
      platform: 'OneDesk India Citizen Directorate',
      exportDate: new Date().toISOString(),
      actCompliance: 'DPDP Act 2023 - Right to Data Portability',
      citizenProfile: req.user,
      applicationsCount: applications.length,
      applications,
      documentsCount: documents.length,
      documents,
      auditHistory: auditLogs
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="onedesk-data-export-${req.user.registerId}.json"`)
    res.json(archive)
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /auth/delete-account ─────────────────────────────────────────────
router.delete('/delete-account', authenticate, async (req, res, next) => {
  try {
    const userId = req.user._id

    const pendingApps = await Application.countDocuments({
      userId,
      status: { $in: ['submitted', 'in_review'] }
    })

    if (pendingApps > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account while you have active applications in review. Please wait for completion or cancel them first.'
      })
    }

    await Promise.all([
      User.findByIdAndDelete(userId),
      Application.deleteMany({ userId, status: 'draft' }),
      OTP.deleteMany({ identifier: req.user.email })
    ])

    const isProduction = process.env.NODE_ENV === 'production'
    res.clearCookie('onedesk_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax'
    })

    res.json({
      success: true,
      message: 'Your OneDesk citizen account and associated draft records have been permanently erased under the DPDP Act 2023.'
    })
  } catch (err) {
    next(err)
  }
})

// ─── Removed: /forgot-password and /reset-password ───────────────────────────
// The app now uses passwordless OTP login — there are no passwords to reset.
// Legacy clients hitting these routes will get a clear guidance message.
router.post('/forgot-password', (req, res) => {
  res.status(410).json({
    success: false,
    code: 'FEATURE_REMOVED',
    message: 'Password-based login has been replaced by secure email OTP. Please use /auth/send-otp to sign in.'
  })
})

router.post('/reset-password', (req, res) => {
  res.status(410).json({
    success: false,
    code: 'FEATURE_REMOVED',
    message: 'Password-based login has been replaced by secure email OTP. Please use /auth/send-otp to sign in.'
  })
})

export default router
