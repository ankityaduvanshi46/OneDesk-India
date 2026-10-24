import crypto from 'crypto'

export function generateRegisterId() {
  const year = new Date().getFullYear()
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `ODI-${year}-${randomChars}`
}

export function generateApplicationNo(servicePrefix = 'APP') {
  const year = new Date().getFullYear()
  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  return `${servicePrefix.toUpperCase()}-${year}-${randomDigits}`
}

export function generateDocumentNo() {
  const year = new Date().getFullYear()
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `DOC-${year}-${randomChars}`
}

export function generateVerificationId() {
  const randomBytes = crypto.randomBytes(6).toString('hex').toUpperCase()
  return `VER-${randomBytes.slice(0, 4)}-${randomBytes.slice(4, 8)}-${randomBytes.slice(8, 12)}`
}

export function generateTicketNo() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000)
  return `TKT-${randomDigits}`
}
