import { z } from 'zod'

export function validateBody(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        return res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: formattedErrors[0]?.message || 'Input validation failed. Please check the submitted data.',
          errors: formattedErrors
        })
      }
      next(error)
    }
  }
}

export function validateQuery(schema) {
  return async (req, res, next) => {
    try {
      req.query = await schema.parseAsync(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        return res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: formattedErrors[0]?.message || 'Invalid query parameters.',
          errors: formattedErrors
        })
      }
      next(error)
    }
  }
}

export function validateParams(schema) {
  return async (req, res, next) => {
    try {
      req.params = await schema.parseAsync(req.params)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        return res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: formattedErrors[0]?.message || 'Invalid route parameters.',
          errors: formattedErrors
        })
      }
      next(error)
    }
  }
}
