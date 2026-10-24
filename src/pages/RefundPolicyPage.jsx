import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ShieldCheck, HelpCircle, ArrowLeft, RefreshCw, FileText } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Helmet>
        <title>Refund & Cancellation Policy – OneDesk India</title>
        <meta
          name="description"
          content="Official refund, cancellation, and fee return policies for citizen services facilitated through OneDesk India."
        />
      </Helmet>

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-gold-500 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-medium">Refund Policy</span>
      </nav>

      <div className="bg-gradient-to-r from-royal-850 via-royal-900 to-royal-850 text-white rounded-2xl p-6 sm:p-8 border border-gold-500/30 shadow-luxury space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-400 border border-gold-500/40 uppercase">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Transparent Citizen Guarantees</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
          OneDesk India is dedicated to complete financial transparency and citizen consumer rights. Please review the detailed terms governing fees, cancellations, and refunds below.
        </p>
      </div>

      <div className="bg-white dark:bg-royal-850 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-royal-700 shadow-sm space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-gold-500" />
            <span>1. Classification of Fees</span>
          </h2>
          <p>
            When utilizing OneDesk India to request documents, applications, or advisory services, charges consist of two components:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Official Statutory Government Fees:</strong> Mandatory fees levied directly by state or central departments (e.g., e-District, NSDL, Parivahan).</li>
            <li><strong>Platform Facilitation / Assistance Fee:</strong> Minimal charges for digitizing paperwork, automated verification tracking, and encrypted document storage.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gold-500" />
            <span>2. Eligibility for Full Refund</span>
          </h2>
          <p>A 100% refund of the platform facilitation fee will be credited when:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>An application is canceled by the applicant before administrative officer review has commenced (Status: <code>submitted</code>).</li>
            <li>A duplicate transaction was recorded due to bank server timeouts or network interruptions.</li>
            <li>The service requested is officially decommissioned or permanently unavailable by the relevant state authority.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>3. Non-Refundable Scenarios</span>
          </h2>
          <p>Refunds cannot be issued under the following conditions:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>The application has already been processed or forwarded to government officers (Status: <code>in_review</code>, <code>approved</code>, or <code>ready</code>).</li>
            <li>Rejection by government authorities due to incorrect, fraudulent, forged, or counterfeit documents provided by the applicant.</li>
            <li>Government fees already remitted to official state treasuries or treasury challans.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gold-500" />
            <span>4. Refund Processing Timeline</span>
          </h2>
          <p>
            Approved refunds are credited back to the original source payment method (UPI, Debit/Credit Card, or Net Banking) within <strong>5 to 7 business days</strong>. An official refund confirmation reference number is sent via SMS and email.
          </p>
        </section>

        <div className="p-4 bg-gray-50 dark:bg-royal-900 rounded-xl border border-gray-200 dark:border-royal-700 space-y-2 text-xs">
          <h4 className="font-bold text-gray-900 dark:text-white">Need Refund Assistance?</h4>
          <p className="text-gray-500 dark:text-gray-400">
            Citizens can initiate a refund inquiry anytime by submitting an inquiry ticket on our{' '}
            <Link to="/support" className="text-gold-500 font-semibold hover:underline">
              Citizen Support Desk
            </Link>{' '}
            or emailing us at <code>support@onedesk.india.gov.in</code>.
          </p>
        </div>
      </div>
    </div>
  )
}
