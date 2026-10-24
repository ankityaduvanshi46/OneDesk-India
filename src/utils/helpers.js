import { OFFICIAL_DOMAINS } from '../data/services'

const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:']

export function isValidUrl(url) {
  try {
    const parsed = new URL(url)
    if (BLOCKED_PROTOCOLS.some((p) => url.toLowerCase().startsWith(p))) return false
    if (!['https:', 'http:'].includes(parsed.protocol)) return false
    return true
  } catch {
    return false
  }
}

export function isOfficialDomain(url) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    return OFFICIAL_DOMAINS.some((domain) => hostname === domain || hostname.endsWith('.' + domain))
  } catch {
    return false
  }
}

export function checkUrlDomain(url) {
  if (!url || !url.trim()) return { valid: false, official: false, message: 'Please enter a URL' }
  const trimmed = url.trim()
  const fullUrl = trimmed.startsWith('http') ? trimmed : 'https://' + trimmed
  if (!isValidUrl(fullUrl)) return { valid: false, official: false, message: 'Invalid URL format' }
  if (isOfficialDomain(fullUrl)) {
    return { valid: true, official: true, message: 'This is a verified official government domain ✓' }
  }
  return { valid: true, official: false, message: 'This domain is not in our verified official list. Proceed with caution.' }
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500)
}

export function getLetterAvatar(name, color) {
  const letter = name ? name.charAt(0).toUpperCase() : '?'
  return { letter, color: color || '#FF6B35' }
}

export function formatFees(fees) {
  if (!fees) return 'Varies'
  return fees
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function sanitizeReturnUrl(returnUrl, fallback = '/dashboard') {
  if (!returnUrl || typeof returnUrl !== 'string') return fallback
  const trimmed = returnUrl.trim()
  // Must start with exactly one '/' and not '//' (prevents protocol-relative open redirects)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback
  // Must not contain schemes or control chars
  if (trimmed.includes('://') || trimmed.includes('\\') || BLOCKED_PROTOCOLS.some((p) => trimmed.toLowerCase().includes(p))) {
    return fallback
  }
  return trimmed
}

export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function generateShareUrl(serviceId) {
  return `${window.location.origin}/services/${serviceId}`
}

export function generateWhatsAppUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
