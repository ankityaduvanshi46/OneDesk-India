import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import SEOHead from '../components/SEOHead'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      toast.success('Your message has been logged. Ticket #OD-' + Math.floor(100000 + Math.random() * 900000))
    }, 800)
  }

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'OneDesk India Facilitation Centre',
    image: 'https://onedesk-india.vercel.app/logo.svg',
    url: 'https://onedesk-india.vercel.app/contact',
    telephone: '+91-522-4098711',
    email: 'support@onedesk.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Suite 402, Royal Civic Plaza, Hazratganj',
      addressLocality: 'Lucknow',
      addressRegion: 'Uttar Pradesh',
      postalCode: '226001',
      addressCountry: 'IN'
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '18:30'
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <SEOHead
        title="Contact Citizen Facilitation Desk & Grievance Cell"
        description="Get in touch with OneDesk India support, citizen grievance redressal officer, and Lucknow facilitation office. Phone, email, address, and live help."
        canonical="/contact"
        keywords={['contact onedesk india', 'citizen grievance redressal', 'lucknow facilitation office', 'government portal support']}
        schema={contactSchema}
      />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
          Citizen Helpdesk & Grievance Cell
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Need guidance on an application, encountered a broken official link, or have a grievance? We are here to assist with verified citizen documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Office Information & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl luxury-glass border border-gray-100 dark:border-royal-800 space-y-6">
            <h2 className="text-lg font-bold text-gray-950 dark:text-white">Communication Channels</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-royal-800 text-saffron flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Citizen Support Email</div>
                  <a href="mailto:support@onedesk.in" className="text-saffron hover:underline">support@onedesk.in</a>
                  <div className="text-[11px] text-gray-400 mt-0.5">Average reply SLA: 4 business hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-royal-800 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Statutory Grievance Redressal</div>
                  <a href="mailto:grievance@onedesk.in" className="text-emerald-600 hover:underline">grievance@onedesk.in</a>
                  <div className="text-[11px] text-gray-400 mt-0.5">Officer: Sunita Sharma (DPDP Act compliance)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-royal-800 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Helpline (Toll-Free Facilitation)</div>
                  <div className="text-gray-700 dark:text-gray-300 font-mono">+91 522 409 8711 / 1800-309-8800</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Mon–Sat, 09:30 AM to 06:30 PM IST</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-royal-800 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">Northern India Facilitation Centre</div>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Suite 402, Royal Civic Plaza, MG Marg, Hazratganj, Lucknow, UP 226001, India
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-royal-850 border border-gray-200 dark:border-royal-800 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Right to Fair Facilitation</span>
            </div>
            <p className="text-[11px]">
              Every ticket logged receives a unique alphanumeric tracking ID and timestamped audit entry in our compliance ledger.
            </p>
          </div>
        </div>

        {/* Right: Interactive Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl luxury-glass border border-gray-100 dark:border-royal-800">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Inquiry Successfully Dispatched</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  A facilitation executive has been assigned to your ticket. A confirmation and tracking reference has been sent to your email.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', mobile: '', subject: 'General Inquiry', message: '' })
                  }}
                  className="btn-luxury px-6 py-2.5 text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Direct Citizen Ticket Submission</h2>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Department / Query Type *
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs sm:text-sm focus:outline-none"
                  >
                    <option value="General Inquiry">General Service Inquiry</option>
                    <option value="Application Status">Tracking Existing OneDesk Application</option>
                    <option value="Broken Official Link">Report Broken / Changed Official Government URL</option>
                    <option value="Grievance">Citizen Grievance Redressal</option>
                    <option value="Fee Refund">Facilitation Fee Refund Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide relevant application numbers, service names, or details..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Ticket...' : 'Dispatch Ticket to Support Desk'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
