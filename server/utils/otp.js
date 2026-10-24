import crypto from 'crypto'

export function generateOTP(digits = 6) {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return crypto.randomInt(min, max + 1).toString()
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
