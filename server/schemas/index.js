import { z } from 'zod'

// ─── Auth: Passwordless OTP flow ────────────────────────────────────────────

/**
 * Step 1 for both Register and Login: just send an email, optionally name (for registration).
 * type = 'login' | 'register'
 */
export const sendOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .optional(),
  type: z.enum(['login', 'register']).default('login')
})

/**
 * Step 2: verify the 6-digit OTP.
 * type = 'login' | 'register'
 */
export const verifyOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Valid email address required'),
  code: z
    .string({ required_error: 'Verification code is required' })
    .trim()
    .regex(/^\d{6}$/, 'Verification code must be exactly 6 numeric digits'),
  type: z.enum(['login', 'register']).default('login'),
  // Name is only required when type='register' and the user is new
  name: z.string().trim().min(2).max(80).optional()
})

export const resendOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Valid email address required'),
  type: z.enum(['login', 'register']).default('login')
})

// Kept for backward-compat (admin 2FA, legacy routes). Not used in main auth flow.
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Full legal name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9')
    .optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
  govIdNumber: z.string().trim().optional().nullable(),
  govIdType: z
    .enum(['aadhaar_last4', 'pan', 'voter_id', 'driving_licence', 'other'])
    .default('aadhaar_last4'),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  dpdpConsent: z.boolean().optional().default(true)
})

export const loginSchema = z.object({
  // Allow legacy identifier-based login gracefully (will be redirected to OTP flow)
  identifier: z.string().trim().min(1).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.string().optional()
})

// ─── Other schemas (unchanged) ───────────────────────────────────────────────

export const applyServiceSchema = z.object({
  serviceId: z
    .string({ required_error: 'Service identifier is required' })
    .trim()
    .min(1, 'Service identifier cannot be empty'),
  serviceName: z
    .string({ required_error: 'Service Name is required' })
    .trim()
    .min(2, 'Service name must be at least 2 characters'),
  formData: z.record(z.any()).default({}),
  uploadedFiles: z
    .array(
      z.object({
        documentType: z.string(),
        originalName: z.string(),
        fileName: z.string(),
        fileUrl: z.string(),
        mimeType: z.string(),
        sizeBytes: z.number(),
        uploadedAt: z.any().optional()
      })
    )
    .default([])
})

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  profilePhoto: z.string().optional(),
  address: z
    .object({
      street: z.string().trim().max(120).optional(),
      city: z.string().trim().max(60).optional(),
      state: z.string().trim().max(50).optional(),
      pincode: z.string().trim().regex(/^\d{6}$/, 'Invalid 6-digit PIN code').optional().or(z.literal(''))
    })
    .optional()
})

export const ticketCreateSchema = z.object({
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject cannot exceed 150 characters'),
  category: z
    .enum(['application_status', 'document_correction', 'payment_issue', 'technical_help', 'other'])
    .default('application_status'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  message: z
    .string({ required_error: 'Message content is required' })
    .trim()
    .min(5, 'Message must be at least 5 characters'),
  applicationId: z.string().optional().nullable()
})
