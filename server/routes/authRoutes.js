import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { OTP } from '../models/OTP.js'
import { AuditLog } from '../models/AuditLog.js'
import { generateOTP, hashGovId, maskGovId } from '../utils/otp.js'
import { generateRegisterId } from '../utils/idGenerator.js'
import { sendOtpEmail } from '../utils/mailer.js'
import { authenticate } from '../middleware/auth.js'
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

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
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return token
}

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, mobile, password, govIdNumber, govIdType = 'aadhaar_last4', state, city } = req.body

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile number, and password are required fields.'
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanMobile = mobile.trim()

    const existingEmail = await User.findOne({ email: cleanEmail })
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        field: 'email',
        message: 'An account with this email address already exists. Please log in instead.'
      })
    }

    const existingMobile = await User.findOne({ mobile: cleanMobile })
    if (existingMobile) {
      return res.status(409).json({
        success: false,
        field: 'mobile',
        message: 'An account with this mobile number already exists. Each citizen is allowed only one account.'
      })
    }

    let govHash = null
    let govMask = null
    if (govIdNumber) {
      govHash = hashGovId(govIdNumber)
      govMask = maskGovId(govIdNumber)

      const existingGovId = await User.findOne({ govIdHash: govHash })
      if (existingGovId) {
        return res.status(409).json({
          success: false,
          field: 'govId',
          message: 'An account is already linked to this Government Identity Number. Duplicate registrations are prohibited.'
        })
      }
    }

    let registerId = generateRegisterId()
    let duplicateCheck = await User.findOne({ registerId })
    while (duplicateCheck) {
      registerId = generateRegisterId()
      duplicateCheck = await User.findOne({ registerId })
    }

    const newUser = new User({
      registerId,
      name: name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      govIdHash: govHash,
      govIdMasked: govMask,
      govIdType,
      passwordHash: password,
      role: 'user',
      address: {
        state: state || '',
        city: city || ''
      }
    })

    await newUser.save()

    const otpCode = generateOTP(6)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await OTP.deleteMany({ identifier: cleanEmail, type: 'email_verification' })
    await OTP.create({
      identifier: cleanEmail,
      code: otpCode,
      type: 'email_verification',
      expiresAt
    })

    await sendOtpEmail({
      email: cleanEmail,
      name: newUser.name,
      code: otpCode,
      type: 'email_verification'
    })

    await AuditLog.create({
      userId: newUser._id,
      userRole: newUser.role,
      action: 'USER_REGISTER',
      resource: 'User',
      resourceId: newUser._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || ''
    })

    res.status(201).json({
      success: true,
      message: 'Registration successful! A 6-digit verification code has been dispatched to your email.',
      registerId: newUser.registerId,
      email: newUser.email
    })
  } catch (error) {
    next(error)
  }
})

router.post('/verify-otp', otpLimiter, async (req, res, next) => {
  try {
    const { email, code, type = 'email_verification' } = req.body

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required.'
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const otpRecord = await OTP.findOne({
      identifier: cleanEmail,
      type,
      verified: false
    }).sort({ createdAt: -1 })

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active verification code found or it has already expired. Please request a new code.'
      })
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      })
    }

    if (otpRecord.attempts >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Maximum attempts reached for this code. Please request a new verification code.'
      })
    }

    if (otpRecord.code !== code.trim()) {
      otpRecord.attempts += 1
      await otpRecord.save()
      return res.status(400).json({
        success: false,
        message: `Incorrect verification code. ${3 - otpRecord.attempts} attempt(s) remaining.`
      })
    }

    otpRecord.verified = true
    await otpRecord.save()

    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    if (type === 'email_verification') {
      user.isEmailVerified = true
      user.status = 'active'
      await user.save()
    }

    const token = generateTokenAndSetCookie(res, user)

    await AuditLog.create({
      userId: user._id,
      userRole: user.role,
      action: 'OTP_VERIFIED',
      resource: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      details: { verificationType: type }
    })

    res.json({
      success: true,
      message: 'Account verified successfully!',
      token,
      user
    })
  } catch (error) {
    next(error)
  }
})

router.post('/resend-otp', otpLimiter, async (req, res, next) => {
  try {
    const { email, type = 'email_verification' } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found with this email.' })
    }

    const otpCode = generateOTP(6)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await OTP.deleteMany({ identifier: cleanEmail, type })
    await OTP.create({
      identifier: cleanEmail,
      code: otpCode,
      type,
      expiresAt
    })

    await sendOtpEmail({
      email: cleanEmail,
      name: user.name,
      code: otpCode,
      type
    })

    res.json({
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Email, Mobile, or Register ID and password.'
      })
    }

    const cleanId = identifier.trim()
    const user = await User.findOne({
      $or: [
        { email: cleanId.toLowerCase() },
        { mobile: cleanId },
        { registerId: cleanId.toUpperCase() }
      ]
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No registered account matches these details.'
      })
    }

    if (user.isLocked()) {
      const waitMinutes = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000))
      return res.status(403).json({
        success: false,
        message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${waitMinutes} minute(s).`
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      await user.incrementLoginAttempts()
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please verify and try again.'
      })
    }

    if (user.failedLoginAttempts > 0) {
      await user.resetLoginAttempts()
    }

    user.lastLoginAt = new Date()
    await user.save()

    const token = generateTokenAndSetCookie(res, user)

    await AuditLog.create({
      userId: user._id,
      userRole: user.role,
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || ''
    })

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user
    })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    res.clearCookie('onedesk_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax'
    })

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'USER_LOGOUT',
      resource: 'User',
      resourceId: req.user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || ''
    })

    res.json({
      success: true,
      message: 'Logged out successfully.'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  })
})

router.put('/profile', authenticate, async (req, res, next) => {
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

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user
    })
  } catch (error) {
    next(error)
  }
})

router.post('/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const { identifier } = req.body
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email or mobile.' })
    }

    const clean = identifier.trim()
    const user = await User.findOne({
      $or: [{ email: clean.toLowerCase() }, { mobile: clean }]
    })

    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with these details, a password reset code has been sent.'
      })
    }

    const otpCode = generateOTP(6)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await OTP.deleteMany({ identifier: user.email, type: 'password_reset' })
    await OTP.create({
      identifier: user.email,
      code: otpCode,
      type: 'password_reset',
      expiresAt
    })

    await sendOtpEmail({
      email: user.email,
      name: user.name,
      code: otpCode,
      type: 'password_reset'
    })

    res.json({
      success: true,
      message: 'Password reset code has been sent to your registered email.',
      email: user.email
    })
  } catch (error) {
    next(error)
  }
})

router.post('/reset-password', authLimiter, async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, reset code, and new password are required.'
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const otpRecord = await OTP.findOne({
      identifier: cleanEmail,
      type: 'password_reset',
      verified: false
    }).sort({ createdAt: -1 })

    if (!otpRecord || otpRecord.code !== code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset code.'
      })
    }

    otpRecord.verified = true
    await otpRecord.save()

    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    user.passwordHash = newPassword
    await user.save()

    await AuditLog.create({
      userId: user._id,
      userRole: user.role,
      action: 'PASSWORD_RESET',
      resource: 'User',
      resourceId: user._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || ''
    })

    res.json({
      success: true,
      message: 'Password has been successfully updated. You may now log in with your new password.'
    })
  } catch (error) {
    next(error)
  }
})

export default router
