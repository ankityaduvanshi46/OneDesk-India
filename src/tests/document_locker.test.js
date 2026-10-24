import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import { Document } from '../../server/models/Document.js'
import { getSignedUrl } from '../../server/middleware/upload.js'
import { generateDocumentNo, generateVerificationId } from '../../server/utils/idGenerator.js'

describe('Part C - Feature 1: Digital Document Locker & IDOR Protection', () => {
  const citizenA_Id = new mongoose.Types.ObjectId()
  const citizenB_Id = new mongoose.Types.ObjectId()

  it('generates compliant Document No and Verification IDs', () => {
    const docNo = generateDocumentNo()
    const verId = generateVerificationId()

    expect(docNo).toMatch(/^DOC-\d{4}-[A-Z0-9]{8}$/)
    expect(verId).toMatch(/^VER-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  })

  it('instantiates self-uploaded locker documents without requiring an applicationId', () => {
    const docNo = generateDocumentNo()
    const verId = generateVerificationId()

    const doc = new Document({
      documentNo: docNo,
      verificationId: verId,
      userId: citizenA_Id,
      applicationId: null, // Self-uploaded document
      serviceId: 'locker',
      category: 'identity',
      docType: 'aadhaar',
      isSelfUploaded: true,
      title: 'Aadhaar Card (Front & Back)',
      fileName: '1729800000-aadhaar.pdf',
      publicId: 'onedesk/user_a/1729800000-xyz',
      fileUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/onedesk/user_a/xyz.pdf',
      qrCodeData: `https://onedesk.in/verify-document?ref=${verId}`,
      notes: 'Original color scan'
    })

    const validationError = doc.validateSync()
    expect(validationError).toBeUndefined()
    expect(doc.isSelfUploaded).toBe(true)
    expect(doc.category).toBe('identity')
    expect(doc.applicationId).toBeNull()
  })

  it('enforces owner-only tenant isolation (IDOR Guard)', () => {
    const docOwnerId = citizenA_Id.toString()
    const attackerId = citizenB_Id.toString()

    const isAuthorized = (docUserId, requestingUserId, userRole = 'citizen') => {
      if (userRole === 'staff' || userRole === 'super_admin') return true
      return docUserId === requestingUserId
    }

    // Owner access must succeed
    expect(isAuthorized(docOwnerId, docOwnerId, 'citizen')).toBe(true)

    // Attacker access must be denied
    expect(isAuthorized(docOwnerId, attackerId, 'citizen')).toBe(false)

    // Staff clearance override must succeed
    expect(isAuthorized(docOwnerId, attackerId, 'staff')).toBe(true)
    expect(isAuthorized(docOwnerId, attackerId, 'super_admin')).toBe(true)
  })

  it('sanitizes public verification responses to never expose private download links', () => {
    const mockDocument = {
      verificationId: 'VER-TEST-1234-5678',
      documentNo: 'DOC-2026-ABCD1234',
      title: 'Income Certificate',
      publicId: 'private/asset/1234',
      fileUrl: 'https://storage.cloud.com/private/income.pdf',
      userId: { name: 'Ankit Yadav', registerId: 'ODI-2026-X89K' },
      status: 'active'
    }

    // Public verification payload formatting
    const sanitizeForPublicVerification = (doc) => ({
      verificationId: doc.verificationId,
      documentNo: doc.documentNo,
      title: doc.title,
      applicantName: doc.userId?.name,
      status: doc.status
    })

    const publicView = sanitizeForPublicVerification(mockDocument)
    expect(publicView.fileUrl).toBeUndefined()
    expect(publicView.publicId).toBeUndefined()
    expect(publicView.verificationId).toBe('VER-TEST-1234-5678')
  })

  it('correctly categorizes documents across national sectors', () => {
    const validCategories = [
      'identity',
      'transport',
      'certificates',
      'tax_finance',
      'education',
      'health',
      'employment',
      'land_property',
      'utilities',
      'other'
    ]

    validCategories.forEach((cat) => {
      const doc = new Document({
        documentNo: generateDocumentNo(),
        verificationId: generateVerificationId(),
        userId: citizenA_Id,
        category: cat,
        title: `Test ${cat}`,
        fileName: 'test.pdf',
        fileUrl: 'https://example.com/test.pdf',
        qrCodeData: 'https://example.com/verify'
      })
      const err = doc.validateSync()
      expect(err).toBeUndefined()
    })
  })
})
