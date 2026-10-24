import { Link } from 'react-router-dom'
import { FileText, ShieldAlert, CheckCircle2 } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <SEOHead
        title="Terms & Conditions of Citizen Facilitation"
        description="Terms and conditions governing the use of OneDesk India civic directory, digital locker, and facilitation services."
        canonical="/terms"
        keywords={['terms and conditions', 'onedesk terms', 'citizen service agreement']}
      />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight">
          Terms of Service & Citizen Facilitation Agreement
        </h1>
        <p className="text-xs text-gray-500">Last Revised: October 2026 • Valid Across India</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">1. Nature of OneDesk Services</h2>
          <p>
            OneDesk India operates as an independent civic documentation facilitation and public portal directory. We assist citizens in formatting, verifying, and tracking applications destined for statutory government departments. <strong>OneDesk India does not manufacture, issue, adjudicate, or guarantee the approval of any government certificate, license, or benefit. Sovereign discretion rests exclusively with the relevant statutory authority (e.g., UIDAI, RTO, Revenue Department).</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">2. User Accounts & "One Person, One Account" Rule</h2>
          <p>
            To prevent fraud and duplicate subsidy claims, each citizen is entitled to register only one verified personal account tied to their verified mobile number. Impersonation of another citizen, uploading forged documents, or submitting fraudulent information will result in immediate permanent account termination and referral to the Cyber Crime Cell under the IT Act 2000.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">3. Transparent Fee Structure</h2>
          <p>
            Browsing the portal directory, verifying official links, and reading citizen guides is <strong>100% free of charge</strong>. For optional assisted service facilitation, fees are divided transparently:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Official Statutory Government Fee</strong>: 100% remitted directly to the relevant state or central treasury without markup.</li>
            <li><strong>Facilitation Convenience Fee</strong>: Clearly disclosed in the application summary prior to payment, covering document validation and tracking.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">4. Refund Policy</h2>
          <p>
            Our facilitation fees are fully protected by our citizen-first refund charter. If an application cannot be submitted due to technical failure on our platform, a 100% refund of the facilitation fee is processed within 5 to 7 business days. Please refer to our detailed <Link to="/refund-policy" className="text-saffron underline">Refund Policy</Link> for complete terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">5. Governing Law and Jurisdiction</h2>
          <p>
            These Terms are governed by the laws of the Republic of India. Any legal dispute or proceeding arising out of or related to OneDesk India shall be subject to the exclusive jurisdiction of the competent courts in Lucknow, Uttar Pradesh.
          </p>
        </section>
      </div>
    </div>
  )
}
