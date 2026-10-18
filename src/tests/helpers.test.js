import { describe, it, expect } from 'vitest'
import { isValidUrl, isOfficialDomain, checkUrlDomain, sanitizeInput } from '../utils/helpers'
import Fuse from 'fuse.js'
import { services } from '../data/services'

describe('URL and Domain Security Validation', () => {
  it('validates legitimate HTTPS URLs', () => {
    expect(isValidUrl('https://uidai.gov.in')).toBe(true)
    expect(isValidUrl('https://parivahan.gov.in/parivahan/')).toBe(true)
  })

  it('blocks dangerous protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
    expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    expect(isValidUrl('file:///etc/passwd')).toBe(false)
    expect(isValidUrl('vbscript:msgbox(1)')).toBe(false)
  })

  it('rejects invalid URL structures', () => {
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('not-a-url')).toBe(false)
  })

  it('verifies whitelisted official domains', () => {
    expect(isOfficialDomain('https://uidai.gov.in')).toBe(true)
    expect(isOfficialDomain('https://subdomain.nic.in')).toBe(true)
    expect(isOfficialDomain('https://parivahan.gov.in/service')).toBe(true)
    expect(isOfficialDomain('https://tin.tin-nsdl.com')).toBe(true)
    expect(isOfficialDomain('https://www.incometax.gov.in')).toBe(true)
  })

  it('flags unverified or spoofed domains', () => {
    expect(isOfficialDomain('https://fake-aadhaar.com')).toBe(false)
    expect(isOfficialDomain('https://uidai.gov.in.fraud.com')).toBe(false)
    expect(isOfficialDomain('https://sarkariseva.xyz')).toBe(false)
    expect(isOfficialDomain('https://pmkisan-fake.net')).toBe(false)
  })

  it('returns accurate domain check diagnostics', () => {
    const verified = checkUrlDomain('https://uidai.gov.in')
    expect(verified.valid).toBe(true)
    expect(verified.official).toBe(true)

    const scam = checkUrlDomain('https://fake-gov-portal.com')
    expect(scam.valid).toBe(true)
    expect(scam.official).toBe(false)
  })
})

describe('Input Sanitization', () => {
  it('removes harmful HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>hello')).toBe('hello')
    expect(sanitizeInput('<b>bold text</b>')).toBe('bold text')
  })

  it('trims whitespace and handles edge cases', () => {
    expect(sanitizeInput('   aadhaar card   ')).toBe('aadhaar card')
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(123)).toBe('')
  })
})

describe('Fuzzy Search and Multilingual Queries', () => {
  const fuse = new Fuse(services, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'nameHi', weight: 3 },
      { name: 'keywords', weight: 2 },
      { name: 'description', weight: 1 }
    ],
    threshold: 0.4
  })

  it('finds services by English queries', () => {
    const res = fuse.search('passport')
    expect(res.length).toBeGreaterThan(0)
    expect(res[0].item.id).toBe('passport')
  })

  it('finds services by acronyms', () => {
    const res = fuse.search('DL')
    expect(res.some((r) => r.item.id === 'driving-licence')).toBe(true)
  })

  it('finds services by Hindi Devanagari script', () => {
    const res = fuse.search('आधार')
    expect(res.some((r) => r.item.id === 'aadhaar')).toBe(true)
  })

  it('finds services by Hinglish colloquial terms', () => {
    const gaadiRes = fuse.search('gaadi')
    expect(gaadiRes.some((r) => r.item.category === 'transport')).toBe(true)

    const voterRes = fuse.search('voter id kaise nikale')
    expect(voterRes.some((r) => r.item.id === 'voter-id')).toBe(true)
  })
})
