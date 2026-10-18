import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { checkUrlDomain, sanitizeInput } from '../utils/helpers'
import { OFFICIAL_DOMAINS } from '../data/services'
import toast from 'react-hot-toast'

export default function ScamCheckPage() {
  const { t } = useTranslation()
  const [urlInput, setUrlInput] = useState('')
  const [result, setResult] = useState(null)

  const [reportUrl, setReportUrl] = useState('')
  const [reportIssue, setReportIssue] = useState('broken')
  const [reportNotes, setReportNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleCheck = (e) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    const res = checkUrlDomain(urlInput)
    setResult(res)
  }

  const handleReportSubmit = (e) => {
    e.preventDefault()
    if (honeypot) return
    if (!reportUrl.trim()) {
      toast.error('Please enter the URL to report')
      return
    }
    const cleanUrl = sanitizeInput(reportUrl)
    const cleanNotes = sanitizeInput(reportNotes)
    const mailSubject = encodeURIComponent(`[OneDesk India] Broken/Wrong Link Report: ${cleanUrl}`)
    const mailBody = encodeURIComponent(`URL: ${cleanUrl}\nIssue Type: ${reportIssue}\nNotes: ${cleanNotes}`)
    window.location.href = `mailto:report@sarkarisevahub.in?subject=${mailSubject}&body=${mailBody}`
    setSubmitted(true)
    toast.success('Opening your email client to submit report!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <Helmet>
        <title>{t('scamCheck.title')} – Spot Fake Government Websites | {t('siteName')}</title>
        <meta name="description" content="Check any government website URL to verify if it is an authentic .gov.in or .nic.in domain before entering your Aadhaar or PAN." />
      </Helmet>

      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold">
          <span>🛡️</span>
          <span>Official Domain Verifier</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          {t('scamCheck.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {t('scamCheck.subtitle')}
        </p>
      </div>

      <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-md space-y-6">
        <form onSubmit={handleCheck} className="space-y-4">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Enter Website Address (URL)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setResult(null) }}
              placeholder={t('scamCheck.placeholder')}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button type="submit" className="btn-primary py-3 px-8 text-sm shrink-0">
              {t('scamCheck.check')}
            </button>
          </div>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border flex items-start gap-3 ${
              result.official
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
            }`}
          >
            <span className="text-2xl shrink-0">{result.official ? '✅' : '⚠️'}</span>
            <div>
              <div className="font-bold text-sm sm:text-base">
                {result.official ? 'Verified Official Government Website' : 'Warning: Unverified or Fake Website'}
              </div>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                {result.message}
              </p>
              {!result.official && (
                <div className="mt-2 text-xs font-semibold">
                  Do not provide Aadhaar, PAN, OTP, or pay money on unverified websites!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </section>

      <section className="bg-orange-50/70 dark:bg-orange-950/20 rounded-3xl p-6 sm:p-8 border border-orange-200/60 dark:border-orange-900/50 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>💡</span>
          <span>{t('scamCheck.tips')}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { icon: '🌐', title: 'Check the domain name', text: t('scamCheck.tip1') },
            { icon: '💸', title: 'Free services are always free', text: t('scamCheck.tip2') },
            { icon: '🔒', title: 'Never share OTP over phone or WhatsApp', text: t('scamCheck.tip3') },
            { icon: '🛡️', title: 'Verify the browser padlock', text: t('scamCheck.tip4') },
            { icon: '🚫', title: 'Beware of fake social ads', text: t('scamCheck.tip5') }
          ].map((tip, i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 space-y-1">
              <div className="text-lg flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
                <span>{tip.icon}</span>
                <span>{tip.title}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📢</span>
            <span>Report a Broken or Suspicious Link</span>
          </h2>
          <p className="text-xs text-gray-500">
            Found a broken link or a fake government website targeting citizens? Report it to help keep everyone safe.
          </p>
        </div>

        <form onSubmit={handleReportSubmit} className="space-y-4 max-w-xl">
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Website URL *
            </label>
            <input
              type="url"
              required
              value={reportUrl}
              onChange={(e) => setReportUrl(e.target.value)}
              placeholder="https://example.gov.in"
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Issue Type
            </label>
            <select
              value={reportIssue}
              onChange={(e) => setReportIssue(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="broken">Broken / 404 Link</option>
              <option value="outdated">Outdated Information</option>
              <option value="fake">Fake / Phishing Portal</option>
              <option value="wrong_domain">Incorrect Official Link</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Additional Details (optional)
            </label>
            <textarea
              rows={3}
              value={reportNotes}
              onChange={(e) => setReportNotes(e.target.value)}
              placeholder="Describe what happened when you clicked the link..."
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <button type="submit" className="btn-primary text-sm px-6 py-2.5">
            Submit Report
          </button>
        </form>
      </section>
    </div>
  )
}
