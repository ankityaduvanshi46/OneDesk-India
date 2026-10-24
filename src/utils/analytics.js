/**
 * analytics.js
 * Google Analytics 4 (GA4) & Vercel Analytics tracking utility.
 * Safe for client-side and server-side execution.
 */

// Initialize GA4 script tag dynamically if VITE_GA_MEASUREMENT_ID is defined
export function initAnalytics() {
  if (typeof window === 'undefined') return

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ONEDESK2026'

  // Avoid injecting multiple times
  if (document.getElementById('ga4-script')) return

  const script = document.createElement('script')
  script.id = 'ga4-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', gaId, {
    send_page_view: true,
    anonymize_ip: true
  })
}

// Track pageviews on SPA route changes
export function trackPageView(path, title) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ONEDESK2026'
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      send_to: gaId
    })
  }
}

// Track custom citizen interactions
export function trackEvent(action, category = 'Engagement', label = '', value = 0) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

// Pre-defined event helpers
export function trackApplyClick(serviceId, serviceName) {
  trackEvent('apply_click', 'Conversion', `${serviceId} - ${serviceName}`)
}

export function trackOfficialPortalClick(serviceId, officialUrl) {
  trackEvent('official_portal_click', 'Outbound', `${serviceId}: ${officialUrl}`)
}

export function trackRegistrationInitiated() {
  trackEvent('registration_initiated', 'Auth', 'Step 1 Form Submitted')
}

export function trackRegistrationCompleted() {
  trackEvent('registration_completed', 'Conversion', 'Citizen OTP Verified')
}

export function trackSearchQuery(query, resultCount) {
  if (!query || query.length < 2) return
  trackEvent('search', 'Search', query, resultCount)
}
