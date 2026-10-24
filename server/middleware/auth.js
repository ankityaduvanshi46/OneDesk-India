import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function authenticate(req, res, next) {
  try {
    let token = req.cookies?.onedesk_token

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.'
      })
    }

    const secret = process.env.JWT_SECRET || 'onedesk_super_secret_jwt_key_2026_secure_random_string_89327498'
    let decoded

    try {
      decoded = jwt.verify(token, secret)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.'
        })
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid session token. Please log in again.'
      })
    }

    const user = await User.findById(decoded.userId).select('-passwordHash')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user account associated with this session no longer exists.'
      })
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'This account has been suspended. Please contact support.'
      })
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export function optionalAuth(req, res, next) {
  let token = req.cookies?.onedesk_token
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    req.user = null
    return next()
  }

  const secret = process.env.JWT_SECRET || 'onedesk_super_secret_jwt_key_2026_secure_random_string_89327498'
  jwt.verify(token, secret, async (err, decoded) => {
    if (err || !decoded) {
      req.user = null
      return next()
    }
    try {
      const user = await User.findById(decoded.userId).select('-passwordHash')
      req.user = user || null
    } catch {
      req.user = null
    }
    next()
  })
}
