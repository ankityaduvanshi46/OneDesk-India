import { ZodError } from 'zod'

export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err)

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }))
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: formattedErrors[0]?.message || 'Input validation failed. Please check the submitted fields.',
      errors: formattedErrors
    })
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the 5MB limit. Please compress your document and try again.'
      })
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    let friendlyMessage = `A record with this ${field} already exists.`

    if (field === 'email') {
      friendlyMessage = 'An account with this email address is already registered. Please log in or use forgot password.'
    } else if (field === 'mobile') {
      friendlyMessage = 'An account with this mobile number is already registered. Each citizen is limited to one account.'
    } else if (field === 'govIdHash') {
      friendlyMessage = 'An account is already linked to this Government Identity Number. Strict 1-Person-1-Account rule is enforced.'
    } else if (field === 'registerId') {
      friendlyMessage = 'Citizen ID generation collision. Please submit again.'
    }

    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_ENTRY',
      field,
      message: friendlyMessage
    })
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message)
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors
    })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid session authentication. Please log in again.'
    })
  }

  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred. Please try again later.'
  })
}
