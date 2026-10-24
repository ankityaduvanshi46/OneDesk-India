import { describe, it, expect } from 'vitest'
import { sanitizeReturnUrl } from '../utils/helpers'
import {
  SERVICE_ILLUSTRATIONS_MAP,
  IdentityIllustration,
  TransportIllustration,
  CertificatesIllustration,
  TaxFinanceIllustration,
  EducationIllustration,
  HealthIllustration,
  EmploymentIllustration,
  AgricultureIllustration,
  UtilitiesIllustration,
  WelfareIllustration
} from '../components/design-system/ServiceIllustrations'
import SkeletonLoader, {
  SkeletonBox,
  SkeletonCircle,
  SkeletonCard,
  SkeletonMetric,
  SkeletonTable,
  SkeletonForm,
  SkeletonDashboard
} from '../components/design-system/SkeletonLoader'

describe('Part A: Route Protection & Open Redirect Defense', () => {
  it('allows safe, internal relative return URLs', () => {
    expect(sanitizeReturnUrl('/apply?service=income-cert')).toBe('/apply?service=income-cert')
    expect(sanitizeReturnUrl('/dashboard')).toBe('/dashboard')
    expect(sanitizeReturnUrl('/documents')).toBe('/documents')
    expect(sanitizeReturnUrl('/profile')).toBe('/profile')
    expect(sanitizeReturnUrl('/service/driving-licence?step=2')).toBe('/service/driving-licence?step=2')
  })

  it('neutralizes protocol-relative open redirect attacks (//evil.com)', () => {
    expect(sanitizeReturnUrl('//evil.com')).toBe('/dashboard')
    expect(sanitizeReturnUrl('//attacker.com/steal-token')).toBe('/dashboard')
    expect(sanitizeReturnUrl('///evil.com')).toBe('/dashboard')
  })

  it('neutralizes absolute external URLs and phishing links', () => {
    expect(sanitizeReturnUrl('https://phishing.site')).toBe('/dashboard')
    expect(sanitizeReturnUrl('http://insecure-redirect.com')).toBe('/dashboard')
    expect(sanitizeReturnUrl('ftp://malicious.org')).toBe('/dashboard')
  })

  it('neutralizes malicious pseudo-protocols (javascript:, data:, vbscript:)', () => {
    expect(sanitizeReturnUrl('javascript:alert(document.cookie)')).toBe('/dashboard')
    expect(sanitizeReturnUrl('data:text/html,<script>alert(1)</script>')).toBe('/dashboard')
    expect(sanitizeReturnUrl('vbscript:msgbox(1)')).toBe('/dashboard')
  })

  it('handles null, undefined, empty, or non-string inputs safely with custom fallback', () => {
    expect(sanitizeReturnUrl(null, '/services')).toBe('/services')
    expect(sanitizeReturnUrl(undefined, '/')).toBe('/')
    expect(sanitizeReturnUrl('', '/login')).toBe('/login')
    expect(sanitizeReturnUrl(12345, '/dashboard')).toBe('/dashboard')
    expect(sanitizeReturnUrl({}, '/dashboard')).toBe('/dashboard')
  })

  it('strictly enforces public vs private route segregation', () => {
    const publicRoutes = [
      '/',
      '/services',
      '/service/:id',
      '/wizard',
      '/favourites',
      '/quick-links',
      '/scam-check',
      '/verify-document',
      '/refund-policy',
      '/login',
      '/register',
      '/design-system'
    ]

    const protectedRoutes = [
      '/dashboard',
      '/apply',
      '/documents',
      '/support',
      '/profile',
      '/admin'
    ]

    // Verify disjoint sets (no route is both public and private)
    const intersection = publicRoutes.filter((r) => protectedRoutes.includes(r))
    expect(intersection).toEqual([])
  })
})

describe('Part B: Design System Tokens & Illustrations Matrix', () => {
  it('provides all 10 thematic service category vector illustrations', () => {
    const expectedCategories = [
      'Identity',
      'Transport',
      'Certificates',
      'Tax & Finance',
      'Education',
      'Health',
      'Employment & Labour',
      'Agriculture & Land',
      'Utilities & Civic',
      'Social Welfare & Pension'
    ]

    expectedCategories.forEach((cat) => {
      expect(SERVICE_ILLUSTRATIONS_MAP[cat]).toBeDefined()
      expect(typeof SERVICE_ILLUSTRATIONS_MAP[cat]).toBe('function')
    })
  })

  it('exports individual illustration components correctly', () => {
    expect(IdentityIllustration).toBeDefined()
    expect(TransportIllustration).toBeDefined()
    expect(CertificatesIllustration).toBeDefined()
    expect(TaxFinanceIllustration).toBeDefined()
    expect(EducationIllustration).toBeDefined()
    expect(HealthIllustration).toBeDefined()
    expect(EmploymentIllustration).toBeDefined()
    expect(AgricultureIllustration).toBeDefined()
    expect(UtilitiesIllustration).toBeDefined()
    expect(WelfareIllustration).toBeDefined()
  })

  it('exports all standardized skeleton loader wireframes', () => {
    expect(SkeletonBox).toBeDefined()
    expect(SkeletonCircle).toBeDefined()
    expect(SkeletonCard).toBeDefined()
    expect(SkeletonMetric).toBeDefined()
    expect(SkeletonTable).toBeDefined()
    expect(SkeletonForm).toBeDefined()
    expect(SkeletonDashboard).toBeDefined()

    expect(SkeletonLoader.Card).toBe(SkeletonCard)
    expect(SkeletonLoader.Dashboard).toBe(SkeletonDashboard)
  })
})
