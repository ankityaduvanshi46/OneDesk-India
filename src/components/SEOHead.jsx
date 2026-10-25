import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const SITE_URL = 'https://onedesk-india.vercel.app'
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`

export default function SEOHead({
  title,
  description,
  canonical,
  noIndex = false,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  schema = null,
  keywords = []
}) {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'

  // Standardize title (< 60 chars)
  const fullTitle = title
    ? `${title.slice(0, 48)} | OneDesk India`
    : 'OneDesk India – 80+ Indian Government Portals Directory'

  // Standardize description (< 160 chars)
  const cleanDescription = (description ||
    'Single-window directory of verified direct links to 80+ official Indian government services. Aadhaar, PAN, Passport, Ration Card, Driving Licence, and EPFO.'
  ).slice(0, 158)

  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
    : SITE_URL

  const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'

  // Default schemas: Organization & WebSite
  const defaultSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'OneDesk India',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/logo.png`,
      description: 'Unified citizen facilitation desk providing verified direct access to official Indian government portals.',
      foundingLocation: 'Lucknow, Uttar Pradesh, India',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Citizen Support & Grievance',
        email: 'support@onedesk.in',
        availableLanguage: ['English', 'Hindi']
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'OneDesk India',
      alternateName: ['OneDesk', 'OneDeskIndia', 'OneDesk India Portal'],
      url: `${SITE_URL}/`,
      publisher: {
        '@id': `${SITE_URL}/#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/services?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  ]

  const schemaArray = schema ? (Array.isArray(schema) ? schema : [schema]) : []
  const allSchemas = [...defaultSchemas, ...schemaArray]

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      <meta name="application-name" content="OneDesk India" />
      <meta name="apple-mobile-web-app-title" content="OneDesk India" />
      <meta name="description" content={cleanDescription} />
      <meta name="robots" content={robotsContent} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang Alternates */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi" href={`${canonicalUrl}${canonicalUrl.includes('?') ? '&' : '?'}lang=hi`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="OneDesk India" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang === 'hi' ? 'hi_IN' : 'en_IN'} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data (JSON-LD) */}
      {allSchemas.map((sch, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(sch)}
        </script>
      ))}
    </Helmet>
  )
}
