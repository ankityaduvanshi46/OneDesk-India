import crypto from 'crypto'

export function generateOTP(digits = 6) {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return crypto.randomInt(min, max + 1).toString()
}

/**
 * Hash an OTP code with SHA-256 before storing it in the database.
 * Never store the plain-text OTP.
 */
export function hashOTP(code) {
  return crypto.createHash('sha256').update(code.trim()).digest('hex')
}

/**
 * Verify an OTP input against the stored hash using a timing-safe comparison.
 */
export function verifyOTP(input, storedHash) {
  const inputHash = hashOTP(input)
  // Both buffers must be the same length for timingSafeEqual
  const a = Buffer.from(inputHash, 'hex')
  const b = Buffer.from(storedHash, 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function hashGovId(govIdNumber) {
  if (!govIdNumber) return null
  const cleanId = govIdNumber.toString().replace(/[\s-]/g, '').toUpperCase()
  return crypto.createHash('sha256').update(cleanId).digest('hex')
}

export function maskGovId(govIdNumber) {
  if (!govIdNumber) return ''
  const clean = govIdNumber.toString().replace(/[\s-]/g, '')
  if (clean.length <= 4) return '••••' + clean
  const last4 = clean.slice(-4)
  return '•••• •••• ' + last4
}
