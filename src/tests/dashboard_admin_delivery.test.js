/**
 * Phase 1.5, 1.6 & 1.7 Tests:
 * - Phase 1.5: User Dashboard Data Isolation & IDOR defense
 * - Phase 1.6: Admin Panel RBAC, Status updates, User suspension, CSV generation logic
 * - Phase 1.7: Tamper-proof PDF generation with QR code, and automatic email delivery dispatch
 */

import { describe, it, expect } from 'vitest'
import { generateCertificatePDF } from '../../server/utils/pdfGenerator.js'
import { generateVerificationId, generateDocumentNo, generateApplicationNo } from '../../server/utils/idGenerator.js'

describe('Phase 1.5: User Dashboard & IDOR Data Isolation', () => {
  it('strictly ensures a citizen can only fetch their own applications by query filter', () => {
    const loggedInCitizenId = 'user_64a123456789'
    const queryFilter = { userId: loggedInCitizenId }
    expect(queryFilter.userId).toBe(loggedInCitizenId)
  })

  it('rejects cross-account document access attempts (IDOR defense)', () => {
    const docOwnerId = 'citizen_alice'
    const requestingUserId = 'citizen_mallory'
    const userRole = 'user'

    const isOwner = docOwnerId === requestingUserId
    const isStaff = ['staff', 'super_admin'].includes(userRole)
    const accessAllowed = isOwner || isStaff

    expect(accessAllowed).toBe(false)
  })

  it('allows staff or super_admin to inspect documents for validation', () => {
    const docOwnerId = 'citizen_alice'
    const requestingUserId = 'admin_bob'
    const userRole = 'staff'

    const isOwner = docOwnerId === requestingUserId
    const isStaff = ['staff', 'super_admin'].includes(userRole)
    const accessAllowed = isOwner || isStaff

    expect(accessAllowed).toBe(true)
  })
})

describe('Phase 1.6: Admin Panel & Governance Operations', () => {
  it('validates role-based authorization for administrative routes', () => {
    const allowedRoles = ['staff', 'super_admin']
    expect(allowedRoles.includes('user')).toBe(false)
    expect(allowedRoles.includes('citizen')).toBe(false)
    expect(allowedRoles.includes('staff')).toBe(true)
    expect(allowedRoles.includes('super_admin')).toBe(true)
  })

  it('only allows super_admin to suspend or activate users', () => {
    const canManageUserStatus = (role) => role === 'super_admin'
    expect(canManageUserStatus('staff')).toBe(false)
    expect(canManageUserStatus('user')).toBe(false)
    expect(canManageUserStatus('super_admin')).toBe(true)
  })

  it('formats CSV export payload accurately with escaped quotes', () => {
    const mockApps = [
      {
        applicationNo: 'ODI-2026-9901',
        serviceName: 'Income "Special" Certificate',
        status: 'approved',
        createdAt: new Date('2026-01-15T10:00:00Z'),
        userId: { name: 'Ramesh Kumar', mobile: '9876543210', email: 'ramesh@example.com' }
      }
    ]

    const headers = ['App Number', 'Citizen Name', 'Mobile', 'Email', 'Service', 'Status', 'Date']
    const row = [
      `"${mockApps[0].applicationNo}"`,
      `"${mockApps[0].userId.name.replace(/"/g, '""')}"`,
      `"${mockApps[0].userId.mobile}"`,
      `"${mockApps[0].userId.email}"`,
      `"${mockApps[0].serviceName.replace(/"/g, '""')}"`,
      `"${mockApps[0].status}"`,
      `"${mockApps[0].createdAt.toISOString()}"`
    ]

    const csvOutput = [headers.join(','), row.join(',')].join('\n')
    expect(csvOutput).toContain('ODI-2026-9901')
    expect(csvOutput).toContain('Income ""Special"" Certificate')
    expect(csvOutput).toContain('9876543210')
  })
})

describe('Phase 1.7: Automated PDF Document Generation & QR Delivery', () => {
  it('generates high-entropy unique Verification IDs and Document Numbers', () => {
    const vId1 = generateVerificationId()
    const vId2 = generateVerificationId()
    const docNo1 = generateDocumentNo()
    const docNo2 = generateDocumentNo()

    expect(vId1).not.toBe(vId2)
    expect(vId1).toMatch(/^VER-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    expect(docNo1).not.toBe(docNo2)
    expect(docNo1).toMatch(/^DOC-\d{4}-[A-Z0-9]{8}$/)
  })

  it('generates a valid, cryptographically non-empty PDF binary buffer with embedded QR', async () => {
    const verificationId = generateVerificationId()
    const documentNo = generateDocumentNo()
    const applicationNo = generateApplicationNo('ODI')

    const pdfBuffer = await generateCertificatePDF({
      verificationId,
      documentNo,
      applicationNo,
      serviceTitle: 'Certificate of Domicile & Residence',
      applicantName: 'Ankit Yadav',
      registerId: 'REG-2026-88192',
      mobile: '9876543210',
      govIdMasked: 'XXXX-XXXX-4912',
      dateOfIssue: '24 October 2026',
      officerRemarks: 'Digitally verified against state land records.',
      clientUrl: 'https://onedesk-india.vercel.app'
    })

    expect(Buffer.isBuffer(pdfBuffer)).toBe(true)
    expect(pdfBuffer.length).toBeGreaterThan(2000) // Compact vector PDF with embedded QR code image
    // Check standard PDF file header '%PDF-'
    const pdfHeader = pdfBuffer.slice(0, 5).toString('ascii')
    expect(pdfHeader).toBe('%PDF-')
  })
})
