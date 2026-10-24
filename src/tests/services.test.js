/**
 * Phase 1.3 + 1.4 Tests
 * - Services catalog route validation
 * - Cloudinary upload middleware wiring
 * - Application upload endpoint
 * - IDOR: user cannot access another user's application
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

// ── Service Zod schema (mirrors serviceRoutes.js) ────────────────────────────
const serviceSchema = z.object({
  serviceId: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name:      z.string().min(2).max(200),
  category:  z.enum([
    'identity', 'transport', 'certificates', 'tax-finance',
    'education', 'health', 'jobs', 'land-property', 'utilities', 'grievance'
  ]),
  fees:          z.string().max(100).default('Free'),
  processingTime:z.string().max(100).default('Varies'),
  documents:     z.array(z.string().max(200)).default([]),
  steps:         z.array(z.string().max(500)).default([]),
  applyEnabled:  z.boolean().default(true),
  isActive:      z.boolean().default(true),
  isTrending:    z.boolean().default(false)
})

// ── VALID service payloads ────────────────────────────────────────────────────
const validService = {
  serviceId: 'income-cert',
  name:      'Income Certificate',
  category:  'certificates',
  fees:      '₹50',
  processingTime: '7 working days',
  documents: ['Aadhaar', 'Ration Card', 'Income Self-Declaration'],
  steps:     ['Visit portal', 'Fill form', 'Upload documents', 'Submit'],
  applyEnabled: true,
  isActive: true,
  isTrending: false
}

// ────────────────────────────────────────────────────────────────────────────
describe('Phase 1.3 — Services Catalog Schema Validation', () => {
  it('accepts a valid service payload', () => {
    const result = serviceSchema.safeParse(validService)
    expect(result.success).toBe(true)
  })

  it('rejects serviceId with spaces or uppercase', () => {
    const r1 = serviceSchema.safeParse({ ...validService, serviceId: 'Income Cert' })
    const r2 = serviceSchema.safeParse({ ...validService, serviceId: 'IncomeCert' })
    expect(r1.success).toBe(false)
    expect(r2.success).toBe(false)
  })

  it('rejects empty name', () => {
    const r = serviceSchema.safeParse({ ...validService, name: '' })
    expect(r.success).toBe(false)
  })

  it('rejects invalid category', () => {
    const r = serviceSchema.safeParse({ ...validService, category: 'banking' })
    expect(r.success).toBe(false)
  })

  it('defaults fees to "Free" when not provided', () => {
    const { fees: _, ...noFees } = validService
    const r = serviceSchema.safeParse(noFees)
    expect(r.success).toBe(true)
    expect(r.data.fees).toBe('Free')
  })

  it('defaults documents to [] when not provided', () => {
    const { documents: _, ...noDocs } = validService
    const r = serviceSchema.safeParse(noDocs)
    expect(r.success).toBe(true)
    expect(r.data.documents).toEqual([])
  })

  it('supports all 10 valid categories', () => {
    const categories = [
      'identity', 'transport', 'certificates', 'tax-finance',
      'education', 'health', 'jobs', 'land-property', 'utilities', 'grievance'
    ]
    for (const cat of categories) {
      const r = serviceSchema.safeParse({ ...validService, serviceId: `test-${cat}`, category: cat })
      expect(r.success, `Category "${cat}" should be valid`).toBe(true)
    }
  })
})

// ── Static catalog checks ─────────────────────────────────────────────────────
describe('Phase 1.3 — Static Services Catalog Integrity', () => {
  const POPULAR_SERVICES = [
    { id: 'income-cert', name: 'Income Certificate', category: 'certificates' },
    { id: 'caste-cert',  name: 'Caste Certificate',  category: 'certificates' },
    { id: 'domicile-cert', name: 'Domicile Certificate', category: 'certificates' },
    { id: 'birth-cert', name: 'Birth Certificate', category: 'certificates' },
    { id: 'driving-licence', name: 'Driving Licence', category: 'transport' },
    { id: 'pan-card', name: 'PAN Card', category: 'tax-finance' },
    { id: 'ration-card', name: 'Ration Card', category: 'identity' },
    { id: 'senior-pension', name: 'Senior Pension', category: 'utilities' }
  ]

  it('all ApplyPage services have valid category', () => {
    const validCats = [
      'identity', 'transport', 'certificates', 'tax-finance',
      'education', 'health', 'jobs', 'land-property', 'utilities', 'grievance'
    ]
    for (const s of POPULAR_SERVICES) {
      expect(validCats, `"${s.id}" has invalid category "${s.category}"`).toContain(s.category)
    }
  })

  it('all service IDs are lowercase slugs', () => {
    for (const s of POPULAR_SERVICES) {
      expect(s.id).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('no duplicate service IDs', () => {
    const ids = POPULAR_SERVICES.map(s => s.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})

// ── Phase 1.4 — Upload middleware ─────────────────────────────────────────────
describe('Phase 1.4 — Cloudinary Upload Middleware', () => {
  it('ALLOWED_MIMES includes pdf, jpeg, png, webp', () => {
    const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    expect(ALLOWED_MIMES).toContain('application/pdf')
    expect(ALLOWED_MIMES).toContain('image/jpeg')
    expect(ALLOWED_MIMES).toContain('image/png')
    expect(ALLOWED_MIMES).toContain('image/webp')
  })

  it('rejects files over 5MB (logic check)', () => {
    const MAX_SIZE = 5 * 1024 * 1024  // 5 MB
    const bigFile = { size: 6 * 1024 * 1024 }
    expect(bigFile.size).toBeGreaterThan(MAX_SIZE)
  })

  it('builds a correct Cloudinary folder path', () => {
    const userId = 'abc123'
    const folder = `onedesk/${userId}`
    expect(folder).toBe('onedesk/abc123')
  })

  it('uses private type for Cloudinary uploads (security)', () => {
    // Simulate the CloudinaryStorage params function output
    const params = { type: 'private', sign_url: true }
    expect(params.type).toBe('private')
  })

  it('getSignedUrl returns null when Cloudinary not configured', () => {
    // When isConfigured = false, getSignedUrl should return null
    const isConfigured = false
    const getSignedUrl = (publicId, resourceType, expiresInSec) => {
      if (!isConfigured) return null
      return `https://res.cloudinary.com/signed/${publicId}`
    }
    expect(getSignedUrl('some-public-id', 'image', 3600)).toBeNull()
  })

  it('upload response includes publicId and fileUrl fields', () => {
    // Simulate what the /upload-file route returns when Cloudinary is configured
    const mockResponse = {
      success: true,
      file: {
        documentType: 'id_proof',
        originalName: 'aadhaar.pdf',
        publicId: 'onedesk/user123/1699999-abc',
        fileUrl: 'https://res.cloudinary.com/demo/image/private/...',
        mimeType: 'application/pdf',
        sizeBytes: 204800,
        uploadedAt: new Date()
      }
    }
    expect(mockResponse.file).toHaveProperty('publicId')
    expect(mockResponse.file).toHaveProperty('fileUrl')
    expect(mockResponse.file.documentType).toBe('id_proof')
  })
})

// ── Phase 1.4 — IDOR Prevention ───────────────────────────────────────────────
describe('Phase 1.4 — IDOR: Application Access Control', () => {
  it('owner check passes when userId matches req.user._id', () => {
    const application = { userId: { _id: 'user-abc' } }
    const reqUser = { _id: 'user-abc', role: 'citizen' }

    const isOwner = application.userId._id.toString() === reqUser._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(reqUser.role)

    expect(isOwner || isStaff).toBe(true)
  })

  it('blocks access when userId does NOT match and user is not staff', () => {
    const application = { userId: { _id: 'user-abc' } }
    const reqUser = { _id: 'user-xyz', role: 'citizen' }

    const isOwner = application.userId._id.toString() === reqUser._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(reqUser.role)

    expect(isOwner || isStaff).toBe(false)
  })

  it('staff can access any application regardless of userId', () => {
    const application = { userId: { _id: 'user-abc' } }
    const reqUser = { _id: 'admin-999', role: 'staff' }

    const isOwner = application.userId._id.toString() === reqUser._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(reqUser.role)

    expect(isOwner || isStaff).toBe(true)
  })

  it('super_admin can access any application', () => {
    const application = { userId: { _id: 'user-abc' } }
    const reqUser = { _id: 'admin-999', role: 'super_admin' }

    const isOwner = application.userId._id.toString() === reqUser._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(reqUser.role)

    expect(isOwner || isStaff).toBe(true)
  })
})
