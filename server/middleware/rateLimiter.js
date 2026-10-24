import rateLimit from 'express-rate-limit'

// validate.xForwardedForHeader: false suppresses ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
// on Vercel/serverless where trust proxy is configured at app level
const defaultValidate = { xForwardedForHeader: false }

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  validate: defaultValidate,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  validate: defaultValidate,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
  }
})

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: defaultValidate,
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait a few minutes before requesting another code.'
  }
})
