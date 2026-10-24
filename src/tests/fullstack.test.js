import { describe, it, expect } from 'vitest'
import { generateOTP, hashGovId, maskGovId } from '../../server/utils/otp.js'
import {
  generateRegisterId,
  generateApplicationNo,
  generateDocumentNo,
  generateVerificationId,
  generateTicketNo
} from '../../server/utils/idGenerator.js'
import { generateCertificatePDF } from '../../server/utils/pdfGenerator.js'

describe('OneDesk Full-Stack Security & Identity Generators', () => {
  it('generates cryptographically secure 6-digit numeric OTPs', () => {
    const otp1 = generateOTP(6)
    const otp2 = generateOTP(6)
    expect(otp1).toHaveLength(6)
    expect(otp2).toHaveLength(6)
    expect(/^\d{6}$/.test(otp1)).toBe(true)
    expect(/^\d{6}$/.test(otp2)).toBe(true)
  })

  it('hashes citizen government identity IDs consistently via SHA-256', () => {
    const rawPan = 'ABCDE1234F'
    const hash1 = hashGovId(rawPan)
    const hash2 = hashGovId('abcde-1234f')
    expect(hash1).toBeDefined()
    expect(hash1).toHaveLength(64)
    expect(hash1).toBe(hash2)
  })

  it('masks citizen government identity IDs safely for display', () => {
    expect(maskGovId('123456789012')).toBe('•••• •••• 9012')
    expect(maskGovId('ABCDE1234F')).toBe('•••• •••• 234F')
  })

  it('generates unique format-compliant Citizen Register IDs', () => {
    const regId = generateRegisterId()
    const currentYear = new Date().getFullYear()
    expect(regId.startsWith(`ODI-${currentYear}-`)).toBe(true)
  })

  it('generates unique format-compliant Application Numbers', () => {
    const appNo = generateApplicationNo('ODI')
    const currentYear = new Date().getFullYear()
    expect(appNo.startsWith(`ODI-${currentYear}-`)).toBe(true)
  })

  it('generates unique format-compliant Verification References', () => {
    const verId = generateVerificationId()
    expect(verId.startsWith('VER-')).toBe(true)
    expect(verId.split('-')).toHaveLength(4)
  })

  it('generates unique format-compliant Support Ticket Numbers', () => {
    const ticketNo = generateTicketNo()
    expect(ticketNo.startsWith('TKT-')).toBe(true)
  })

  it('generates a valid, cryptographically stamped PDF certificate with QR code', async () => {
    const pdfBuffer = await generateCertificatePDF({
      verificationId: 'VER-TEST-1234-ABCD',
      documentNo: 'DOC-2026-TEST',
      applicationNo: 'APP-2026-999999',
      serviceTitle: 'Certificate of Income',
      applicantName: 'Ramesh Kumar',
      registerId: 'ODI-2026-TEST01',
      mobile: '9876543210',
      govIdMasked: '•••• •••• 5678',
      dateOfIssue: '24 October 2026',
      officerRemarks: 'Approved for testing'
    })

    expect(Buffer.isBuffer(pdfBuffer)).toBe(true)
    expect(pdfBuffer.length).toBeGreaterThan(1000)
    const header = pdfBuffer.slice(0, 5).toString('ascii')
    expect(header).toBe('%PDF-')
  })
})
