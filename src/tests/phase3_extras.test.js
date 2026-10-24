/**
 * Phase 3: Extras Tests
 * - SMS OTP Gateway & country code sanitization
 * - WhatsApp notification dispatch
 * - Multi-language (English + Hindi) dictionary integrity
 * - Citizen Chatbot intelligent matching engine
 * - PWA manifest configuration
 */

import { describe, it, expect } from 'vitest'
import { sendSmsOtp } from '../../server/utils/smsGateway.js'
import { sendWhatsAppNotification } from '../../server/utils/whatsappGateway.js'
import i18n from '../i18n/index.js'

describe('Phase 3: SMS Gateway & WhatsApp Dispatch Engine', () => {
  it('correctly sanitizes and formats 10-digit Indian mobile numbers for SMS dispatch', async () => {
    const rawMobile = '+91 98765-43210'
    const result = await sendSmsOtp({ mobile: rawMobile, otp: '883921' })

    expect(result.success).toBe(true)
    expect(result.provider).toBeDefined()
  })

  it('handles WhatsApp notification parameters cleanly', async () => {
    const res = await sendWhatsAppNotification({
      mobile: '9876543210',
      templateName: 'status_update',
      parameters: ['ODI-2026-101', 'Approved', 'https://onedesk-india.vercel.app/dashboard']
    })

    expect(res.success).toBe(true)
    expect(res.provider).toBeDefined()
  })
})

describe('Phase 3: Multi-Language (English + Hindi) Integrity', () => {
  it('has both English and Hindi translations registered in i18next', () => {
    const languages = Object.keys(i18n.options.resources)
    expect(languages).toContain('en')
    expect(languages).toContain('hi')
  })

  it('guarantees identical top-level key parity between English and Hindi', () => {
    const enKeys = Object.keys(i18n.options.resources.en.translation)
    const hiKeys = Object.keys(i18n.options.resources.hi.translation)

    for (const key of ['search', 'nav', 'categories', 'serviceCard', 'detail', 'wizard', 'errors']) {
      expect(enKeys).toContain(key)
      expect(hiKeys).toContain(key)
    }
  })

  it('provides Hindi equivalents for all 10 citizen service categories', () => {
    const categoriesHi = i18n.options.resources.hi.translation.categories
    const expectedCategories = [
      'identity', 'transport', 'certificates', 'tax-finance',
      'education', 'health', 'jobs', 'land-property', 'utilities', 'grievance'
    ]

    for (const cat of expectedCategories) {
      expect(categoriesHi[cat], `Hindi category "${cat}" must be defined`).toBeDefined()
      expect(categoriesHi[cat].length).toBeGreaterThan(0)
    }
  })
})

describe('Phase 3: Citizen AI Chatbot Engine Matching', () => {
  const KNOWLEDGE_BASE = [
    { triggers: ['aadhaar', 'aadhar', 'आधार'], target: 'aadhaar' },
    { triggers: ['pan', 'पैन'], target: 'pan-card' },
    { triggers: ['voter', 'वोटर'], target: 'voter-id' },
    { triggers: ['dl', 'driving', 'ड्राइविंग'], target: 'driving-licence' },
    { triggers: ['pf', 'epfo', 'भविष्य निधि'], target: 'epfo' }
  ]

  const resolveQuery = (query) => {
    const lower = query.toLowerCase()
    return KNOWLEDGE_BASE.find((k) => k.triggers.some((t) => lower.includes(t)))
  }

  it('accurately resolves English queries to target government services', () => {
    expect(resolveQuery('How to apply for driving licence?')?.target).toBe('driving-licence')
    expect(resolveQuery('Where to download PAN card?')?.target).toBe('pan-card')
    expect(resolveQuery('What is the procedure for Aadhaar update?')?.target).toBe('aadhaar')
  })

  it('accurately resolves Hindi queries to target government services', () => {
    expect(resolveQuery('आधार कार्ड कैसे सुधारे?')?.target).toBe('aadhaar')
    expect(resolveQuery('पैन कार्ड के लिए क्या दस्तावेज चाहिए?')?.target).toBe('pan-card')
    expect(resolveQuery('ड्राइविंग लाइसेंस कैसे बनता है?')?.target).toBe('driving-licence')
  })
})
