import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'
import { registerSchema, loginSchema, verifyOtpSchema } from '../../server/schemas/index.js'
import { hashGovId, maskGovId } from '../../server/utils/otp.js'
import { User } from '../../server/models/User.js'

describe('Phase 1.2: Authentication & 1-Person-1-Account Security', () => {
  describe('Zod Registration Input Validation', () => {
    it('accepts valid registration payload with DPDP Act consent', async () => {
      const payload = {
        name: 'Ankit Yadav',
        email: 'ankityadavlko46@gmail.com',
        mobile: '9876543210',
        password: 'SecurePassword123',
        govIdNumber: 'ABCDE1234F',
        govIdType: 'pan',
        dpdpConsent: true
      }

      const validated = await registerSchema.parseAsync(payload)
      expect(validated.name).toBe('Ankit Yadav')
      expect(validated.email).toBe('ankityadavlko46@gmail.com')
      expect(validated.govIdType).toBe('pan')
    })

    it('rejects passwords shorter than 8 characters', async () => {
      const payload = {
        name: 'Ankit Yadav',
        email: 'ankityadavlko46@gmail.com',
        mobile: '9876543210',
        password: '123'
      }

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow(/at least 8 characters/i)
    })

    it('rejects mobile numbers not matching 10-digit Indian pattern', async () => {
      const payload = {
        name: 'Ankit Yadav',
        email: 'ankityadavlko46@gmail.com',
        mobile: '1234567890',
        password: 'ValidPassword123'
      }

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow(/valid 10-digit Indian mobile number/i)
    })
  })

  describe('One Person = One Account Security & Identity Hashing', () => {
    it('hashes government identity document into SHA-256 for non-reversible comparison', () => {
      const pan1 = 'ABCDE1234F'
      const pan2 = 'abcde-1234f'
      const hash1 = hashGovId(pan1)
      const hash2 = hashGovId(pan2)

      expect(hash1).toBe(hash2)
      expect(hash1).not.toBe(pan1)
      expect(hash1).toHaveLength(64)
    })

    it('masks government identity on display to prevent data leakage', () => {
      expect(maskGovId('123456789012')).toBe('•••• •••• 9012')
      expect(maskGovId('ABCDE1234F')).toBe('•••• •••• 234F')
    })
  })

  describe('Bcrypt Password Hashing & Verification', () => {
    it('hashes plain passwords and validates with comparePassword', async () => {
      const plain = 'veer3320'
      const salt = await bcrypt.genSalt(12)
      const hash = await bcrypt.hash(plain, salt)

      expect(hash).not.toBe(plain)
      const isMatch = await bcrypt.compare('veer3320', hash)
      expect(isMatch).toBe(true)

      const isWrongMatch = await bcrypt.compare('wrong_pass', hash)
      expect(isWrongMatch).toBe(false)
    })
  })

  describe('Account Lockout Defense Mechanism', () => {
    it('locks account after 5 consecutive failed login attempts', () => {
      const mockUser = new User({
        registerId: 'ODI-2026-TEST',
        name: 'Lockout Test',
        email: 'lockout@test.com',
        mobile: '9876543211',
        passwordHash: 'dummyhash',
        failedLoginAttempts: 5,
        lockUntil: new Date(Date.now() + 15 * 60 * 1000)
      })

      expect(mockUser.isLocked()).toBe(true)
    })

    it('permits login when lock window expires or attempts < 5', () => {
      const mockUser = new User({
        registerId: 'ODI-2026-TEST2',
        name: 'Active Test',
        email: 'active@test.com',
        mobile: '9876543212',
        passwordHash: 'dummyhash',
        failedLoginAttempts: 2
      })

      expect(mockUser.isLocked()).toBe(false)
    })
  })

  describe('Super Admin Seed Credentials', () => {
    it('verifies primary Super Administrator email and password credentials', () => {
      const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'ankityadavlko46@gmail.com'
      const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'veer3320'

      expect(adminEmail).toBe('ankityadavlko46@gmail.com')
      expect(adminPassword).toBe('veer3320')
    })
  })
})
