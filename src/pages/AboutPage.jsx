import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Users,
  Building2,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Globe2
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import Logo from '../components/Logo'

export default function AboutPage() {
  const leadership = [
    {
      name: 'Ankit Yadav',
      role: 'Founder & Principal Systems Architect',
      desc: 'Advocate for open, transparent civic infrastructure. Specializes in cryptography, public service automation, and zero-knowledge data pipelines.'
    },
    {
      name: 'Dr. Vivek Swarup',
      role: 'Chief of Citizen Legal Research',
      desc: 'Expert in administrative law and Right to Information (RTI). Oversees government circular verification and compliance.'
    },
    {
      name: 'Sunita Sharma',
      role: 'Head of Grievance & Citizen Advocacy',
      desc: 'Former consumer forum ombudsman. Directs user support, dispute mediation, and DPDP citizen data consent enforcement.'
    }
  ]

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Verified Official Links',
      desc: 'Every portal link is cryptographically cross-verified against official .gov.in and .nic.in DNS records, preventing phishing and identity theft.'
    },
    {
      icon: Lock,
      title: 'Zero Plaintext ID Storage',
      desc: 'We strictly adhere to the Digital Personal Data Protection (DPDP) Act 2023. Aadhaar and PAN numbers are hashed with salted SHA-256.'
    },
    {
      icon: FileCheck,
      title: 'Cryptographic QR Attestations',
      desc: 'Facilitated certificates carry tamper-evident digital signatures, verifiable by universities and employers without physical stamping.'
    },
    {
      icon: Users,
      title: 'Universal Citizen Equality',
      desc: 'One citizen, one verified account. Eliminating middleman touts, hidden kickbacks, and discriminatory accessibility barriers.'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      <SEOHead
        title="About OneDesk India – Mission, Team & Standards"
        description="Learn about OneDesk India, an independent civic-tech platform bridging citizens to 80+ official Indian government portals with verified links and DPDP 2023 security."
        canonical="/about"
        keywords={['about onedesk india', 'civic tech india', 'verified government portals', 'dpdp compliant platform', 'ankit yadav']}
      />

      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/20 text-xs font-bold uppercase tracking-wider">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Sovereign Citizen Empowerment</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
          Democratizing Access to India’s Public Infrastructure
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          OneDesk India was founded with a singular conviction: access to essential government services should be direct, transparent, and completely free from extortionate middleman commissions.
        </p>
      </section>

      {/* Sovereign Entity Notice / Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm">Transparency Pledge & Non-Governmental Disclaimer</div>
          <p className="leading-relaxed text-[11px]">
            OneDesk India is an independent private facilitation desk operated by OneDesk Technologies, Lucknow, Uttar Pradesh. <strong>OneDesk India is NOT an official agency or department of the Government of India or any State Government.</strong> All government trademarks, emblems, and portal names belong to their respective statutory authorities.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Our Operational Principles</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">How we protect 1.4 billion citizens navigating digital public portals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="p-6 rounded-3xl luxury-glass border border-gray-100 dark:border-royal-800 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-royal-900 text-gold-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Leadership & E-E-A-T Team Details */}
      <section className="space-y-8 pt-8 border-t border-gray-100 dark:border-royal-800">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Our Leadership & Legal Experts</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Experienced professionals dedicated to civic transparency and digital rights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((person, idx) => (
            <div key={idx} className="p-6 rounded-3xl luxury-glass border border-gray-100 dark:border-royal-800 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-royal-900 to-royal-800 text-gold-400 font-bold flex items-center justify-center text-xl shadow-md border-2 border-gold-500/40">
                {person.name.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{person.name}</h3>
              <div className="text-xs text-saffron font-semibold">{person.role}</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{person.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities & Address */}
      <section className="p-8 rounded-3xl bg-gray-50 dark:bg-royal-850 border border-gray-200 dark:border-royal-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Headquarters & Facilitation Centre</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Physically accessible civic guidance desk for Northern India.</p>
          </div>
          <Link to="/contact" className="btn-luxury px-5 py-2.5 text-xs font-bold flex items-center gap-2">
            <span>Contact Facilitation Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-300 pt-4 border-t border-gray-200 dark:border-royal-800">
          <div>
            <div className="font-bold text-gray-900 dark:text-white">Registered Office:</div>
            <div className="mt-1">Suite 402, Royal Civic Plaza, Hazratganj, Lucknow, UP 226001</div>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">Public Support Hours:</div>
            <div className="mt-1">Monday – Saturday, 09:30 AM – 06:30 PM IST</div>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">Citizen Grievance Officer:</div>
            <div className="mt-1">Sunita Sharma (grievance@onedesk.in)</div>
          </div>
        </div>
      </section>
    </div>
  )
}
