import { motion } from 'framer-motion'
import { ShieldCheck, Lock, CheckCircle2, FileText, AlertTriangle } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <SEOHead
        title="Privacy Policy & DPDP Act 2023 Compliance"
        description="OneDesk India citizen data privacy policy. Full compliance with the Digital Personal Data Protection (DPDP) Act 2023, zero data selling, and salted hash storage."
        canonical="/privacy"
        keywords={['privacy policy', 'dpdp act 2023 compliance', 'data protection india', 'citizen privacy']}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DPDP Act 2023 & ISO 27001 Certified Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight">
          Citizen Privacy Policy & Data Governance Charter
        </h1>
        <p className="text-xs text-gray-500">Effective Date: October 24, 2026 • Version 2.4</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-6 leading-relaxed">
        <section className="space-y-3 p-5 rounded-2xl bg-gray-50 dark:bg-royal-850 border border-gray-200 dark:border-royal-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">1. Core Sovereign Privacy Commitment</h2>
          <p>
            OneDesk India operates strictly as a <strong>Data Fiduciary</strong> under the provisions of the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> (Republic of India). We believe citizen privacy is fundamental. We collect only the minimum data required to facilitate official services and <strong>we never sell, monetize, rent, or trade citizen personal data to any third party, broker, or advertiser.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">2. Categorization of Data Collected</h2>
          <p>We process the following categories strictly based on your explicit consent:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Identity & Demographic Data</strong>: Full legal name, verified mobile number, email address, residential state, and district.</li>
            <li><strong>Cryptographically Hashed Identifiers</strong>: If you enter an Aadhaar or PAN number for duplicate account prevention or verification, the plaintext number is salted and cryptographically hashed with SHA-256. <em>Plaintext Aadhaar numbers are never stored in our permanent databases.</em></li>
            <li><strong>Document Locker Uploads</strong>: Citizen application attachments (e.g., electricity bills, income proofs) stored in encrypted AWS/GCP buckets with 256-bit AES encryption at rest.</li>
            <li><strong>Device & Telemetry Data</strong>: Anonymized IP addresses for rate limiting, browser user-agent for responsive rendering, and session logs.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">3. Statutory Citizen Rights under DPDP Act 2023</h2>
          <p>As a sovereign citizen registered on OneDesk India, you possess irrevocable rights:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white dark:bg-royal-900 border border-gray-200 dark:border-royal-750">
              <div className="font-bold text-gray-900 dark:text-white text-xs">Right to Access Summary</div>
              <div className="text-[11px] text-gray-500 mt-1">Download all personal data, active applications, and locker files in machine-readable JSON format.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-royal-900 border border-gray-200 dark:border-royal-750">
              <div className="font-bold text-gray-900 dark:text-white text-xs">Right to Correction & Erasure</div>
              <div className="text-[11px] text-gray-500 mt-1">Request rectification of inaccurate data or trigger complete account and document erasure from your profile.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-royal-900 border border-gray-200 dark:border-royal-750">
              <div className="font-bold text-gray-900 dark:text-white text-xs">Right of Grievance Redressal</div>
              <div className="text-[11px] text-gray-500 mt-1">Direct recourse to our designated Grievance Officer, with guaranteed resolution within 7 working days.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-royal-900 border border-gray-200 dark:border-royal-750">
              <div className="font-bold text-gray-900 dark:text-white text-xs">Right to Nominate</div>
              <div className="text-[11px] text-gray-500 mt-1">Designate a family member or legal heir to manage locker records in case of emergency or incapacitation.</div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">4. Data Retention and Erasure Schedule</h2>
          <p>
            - Temporary OTP codes expire and are permanently purged within 10 minutes.
            <br />
            - Completed application drafts without activity for 180 days are automatically archived.
            <br />
            - When an account deletion is requested, all database records, document locker files, and audit entries are scrubbed within 72 hours.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-gray-200 dark:border-royal-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">5. Grievance Redressal Officer Contact</h2>
          <p className="text-xs">
            In compliance with Rule 3(2) of the Information Technology Rules, 2021 and DPDP 2023:
            <br />
            <strong>Officer</strong>: Sunita Sharma
            <br />
            <strong>Email</strong>: <a href="mailto:grievance@onedesk.in" className="text-saffron underline">grievance@onedesk.in</a>
            <br />
            <strong>Address</strong>: Suite 402, Royal Civic Plaza, Hazratganj, Lucknow, UP 226001, India.
          </p>
        </section>
      </div>
    </div>
  )
}
