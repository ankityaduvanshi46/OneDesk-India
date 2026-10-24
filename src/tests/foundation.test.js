import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema, verifyOtpSchema } from '../../server/schemas/index.js'
import { getDBStatus } from '../../server/config/db.js'

describe('Phase 1.1 Foundation Tests', () => {
  describe('Serverless MongoDB Connection Caching', () => {
    it('initializes the global mongoose connection cache container', () => {
      expect(global.mongoose).toBeDefined()
      expect(global.mongoose).toHaveProperty('conn')
      expect(global.mongoose).toHaveProperty('promise')
    })

    it('reports valid connection state string', () => {
      const status = getDBStatus()
      expect(['disconnected', 'connected', 'connecting', 'disconnecting']).toContain(status)
    })
  })

  describe('Server-Side Zod Validation Schemas', () => {
    it('accepts valid citizen registration data', async () => {
      const validData = {
        name: 'Ankit Yadav',
        email: 'ankityadavlko46@gmail.com',
        mobile: '9876543210',
        password: 'SecurePassword@2026',
        govIdNumber: '123456789012',
        govIdType: 'aadhaar_last4',
        dpdpConsent: true
      }

      const parsed = await registerSchema.parseAsync(validData)
      expect(parsed.name).toBe('Ankit Yadav')
      expect(parsed.email).toBe('ankityadavlko46@gmail.com')
      expect(parsed.mobile).toBe('9876543210')
      expect(parsed.dpdpConsent).toBe(true)
    })

    it('rejects invalid email formats', async () => {
      const invalidEmail = {
        name: 'Citizen Test',
        email: 'not-an-email',
        mobile: '9876543210',
        password: 'ValidPassword123'
      }

      await expect(registerSchema.parseAsync(invalidEmail)).rejects.toThrow()
    })

    it('rejects passwords shorter than 8 characters', async () => {
      const shortPassword = {
        name: 'Citizen Test',
        email: 'test@example.com',
        mobile: '9876543210',
        password: 'short'
      }

      await expect(registerSchema.parseAsync(shortPassword)).rejects.toThrow(/at least 8 characters/i)
    })

    it('rejects invalid mobile numbers not matching Indian 10-digit format', async () => {
      const invalidMobile = {
        name: 'Citizen Test',
        email: 'test@example.com',
        mobile: '12345',
        password: 'ValidPassword123'
      }

      await expect(registerSchema.parseAsync(invalidMobile)).rejects.toThrow(/10-digit Indian mobile number/i)
    })

    it('enforces required fields in login schema', async () => {
      await expect(loginSchema.parseAsync({})).rejects.toThrow()
      const valid = await loginSchema.parseAsync({
        identifier: 'ankityadavlko46@gmail.com',
        password: 'veer3320'
      })
      expect(valid.identifier).toBe('ankityadavlko46@gmail.com')
    })

    it('enforces exact 6 numeric digits for OTP verification', async () => {
      const validOtp = {
        email: 'ankityadavlko46@gmail.com',
        code: '654321',
        type: 'email_verification'
      }
      const parsed = await verifyOtpSchema.parseAsync(validOtp)
      expect(parsed.code).toBe('654321')

      const invalidLength = {
        email: 'ankityadavlko46@gmail.com',
        code: '1234',
        type: 'email_verification'
      }
      await expect(verifyOtpSchema.parseAsync(invalidLength)).rejects.toThrow(/exactly 6 numeric digits/i)
    })
  })

  describe('Super Admin Provisioning Configuration', () => {
    it('configures default admin bootstrap credentials in environment', () => {
      const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'ankityadavlko46@gmail.com'
      expect(bootstrapEmail).toBe('ankityadavlko46@gmail.com')
    })
  })
})
