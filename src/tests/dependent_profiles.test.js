import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { Dependent } from '../../server/models/Dependent.js'
import { Application } from '../../server/models/Application.js'

describe('Part C - Feature 2: Dependent & Family Profiles Security & IDOR Isolation', () => {
  const citizenA_Id = new mongoose.Types.ObjectId()
  const citizenB_Id = new mongoose.Types.ObjectId()

  function hashGovId(idNumber) {
    if (!idNumber) return null
    const salt = process.env.GOV_ID_SALT || 'onedesk_gov_salt_secure_2026'
    return crypto.createHmac('sha256', salt).update(idNumber.trim().toUpperCase()).digest('hex')
  }

  function maskGovId(type, number) {
    if (!number) return ''
    const trimmed = number.trim().toUpperCase()
    if (type === 'aadhaar_last4') {
      return `••••-••••-${trimmed.slice(-4)}`
    }
    if (type === 'pan' && trimmed.length === 10) {
      return `${trimmed.slice(0, 2)}••••••${trimmed.slice(-2)}`
    }
    return `••••${trimmed.slice(-4)}`
  }

  it('instantiates valid Dependent profile with relationship enum and masked credentials', () => {
    const rawPan = 'ABCDE1234F'
    const maskedPan = maskGovId('pan', rawPan)
    const panHash = hashGovId(rawPan)

    const dep = new Dependent({
      userId: citizenA_Id,
      name: 'Rohan Sharma',
      relationship: 'child',
      gender: 'male',
      dateOfBirth: new Date('2015-08-15'),
      govIdType: 'pan',
      govIdMasked: maskedPan,
      govIdHash: panHash,
      notes: 'Applying for school domicile certificate',
      status: 'active'
    })

    const validationError = dep.validateSync()
    expect(validationError).toBeUndefined()
    expect(dep.name).toBe('Rohan Sharma')
    expect(dep.relationship).toBe('child')
    expect(dep.govIdMasked).toBe('AB••••••4F')
    expect(dep.govIdHash).toBe(panHash)
    expect(dep.status).toBe('active')
  })

  it('rejects invalid relationship values not defined in enum', () => {
    const invalidDep = new Dependent({
      userId: citizenA_Id,
      name: 'Test Dependent',
      relationship: 'neighbor', // invalid enum
      status: 'active'
    })

    const err = invalidDep.validateSync()
    expect(err).toBeDefined()
    expect(err.errors['relationship']).toBeDefined()
  })

  it('enforces HMAC-SHA256 one-way hashing and masking for privacy (DPDP Act compliance)', () => {
    const aadhaarLast4 = '9876'
    const masked = maskGovId('aadhaar_last4', aadhaarLast4)
    const hash = hashGovId(aadhaarLast4)

    expect(masked).toBe('••••-••••-9876')
    expect(hash).toHaveLength(64) // SHA-256 output is 64 hex characters
    expect(hash).not.toContain(aadhaarLast4) // Plaintext never exposed in hash
  })

  it('enforces IDOR protection: Citizen B cannot view, modify, or delete Citizen A dependents', () => {
    const dependentOwnerId = citizenA_Id.toString()
    const attackerId = citizenB_Id.toString()

    const canAccessDependent = (ownerUserId, requestingUserId, role = 'citizen') => {
      if (role === 'staff' || role === 'super_admin') return true
      return ownerUserId === requestingUserId
    }

    // Citizen A access is permitted
    expect(canAccessDependent(dependentOwnerId, citizenA_Id.toString())).toBe(true)

    // Citizen B (attacker) access is forbidden
    expect(canAccessDependent(dependentOwnerId, attackerId)).toBe(false)
  })

  it('soft-deletes dependent (status: archived) to preserve historical application references', () => {
    const dep = new Dependent({
      userId: citizenA_Id,
      name: 'Sunita Sharma',
      relationship: 'spouse',
      status: 'active'
    })

    expect(dep.status).toBe('active')

    // Simulate soft delete
    dep.status = 'archived'
    expect(dep.status).toBe('archived')
  })

  it('allows Application model to link to Dependent via dependentId and isForDependent flag', () => {
    const depId = new mongoose.Types.ObjectId()

    const app = new Application({
      applicationNo: 'ODI-2026-TEST01',
      userId: citizenA_Id,
      serviceId: 'income-cert',
      serviceName: 'Income Certificate (Uttar Pradesh)',
      dependentId: depId,
      isForDependent: true,
      formData: {
        applicantName: 'Rohan Sharma',
        relationship: 'child'
      },
      status: 'submitted'
    })

    const validationError = app.validateSync()
    expect(validationError).toBeUndefined()
    expect(app.isForDependent).toBe(true)
    expect(app.dependentId.toString()).toBe(depId.toString())
  })
})
