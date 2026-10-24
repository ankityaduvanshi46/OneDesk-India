import { AlertTriangle, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <SEOHead
        title="Statutory Non-Governmental Disclaimer"
        description="Official sovereign disclaimer: OneDesk India is an independent citizen facilitation directory and NOT affiliated with the Government of India or State Governments."
        canonical="/disclaimer"
        keywords={['disclaimer onedesk india', 'non government disclaimer', 'independent facilitation desk']}
      />

      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Statutory Sovereign Disclaimer</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
          Disclaimer of Non-Government Affiliation
        </h1>
        <p className="text-xs text-gray-500">Notice to Citizens, Visitors, and Public Authorities</p>
      </div>

      {/* Prominent High-Contrast Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-600/60 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-black text-base uppercase tracking-wider">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <span>IMPORTANT PUBLIC NOTICE</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
          <strong>OneDesk India (onedesk-india.vercel.app) is an independent private facilitation platform and public portal directory operated by OneDesk Technologies. OneDesk India is NOT an official agency, department, statutory body, or affiliate of the Government of India, the Unique Identification Authority of India (UIDAI), the Ministry of Road Transport and Highways (MoRTH), or any State Government.</strong>
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">1. Direct Linking to Official Sovereign Websites</h2>
          <p>
            OneDesk India indexes, organizes, and provides direct navigational hyperlinks to official Indian government portals ending in verified domains such as <code>.gov.in</code> and <code>.nic.in</code>. All users retain the right and ability to navigate directly to these public sovereign portals for free without using any paid facilitation features on OneDesk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">2. Trademarks, Emblems & Copyrights</h2>
          <p>
            All names, logos, acronyms, and trademarks referenced on this platform—including but not limited to <em>Aadhaar, PAN, Parivahan, DigiLocker, Ayushman Bharat, EPFO, Bhulekh, and CPGRAMS</em>—remain the exclusive intellectual property of their respective government ministries and statutory custodians. Their reference on OneDesk India is strictly for informational identification and public guidance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">3. Discretion of Sovereign Authorities</h2>
          <p>
            The issuance, verification, approval, rejection, or renewal of any official certificate, identity card, or welfare entitlement is solely governed by sovereign civil servants and authorized government officers according to applicable statutory rules. OneDesk India does not exercise any administrative power or influence over government turnaround times.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">4. Reporting Inaccuracies or Changed Links</h2>
          <p>
            If you represent a government department or identify an outdated link, broken URL, or statutory policy update, please notify our compliance officer immediately at <a href="mailto:support@onedesk.in" className="text-saffron underline font-semibold">support@onedesk.in</a>. Corrections are typically validated and deployed within 24 hours.
          </p>
        </section>
      </div>
    </div>
  )
}
