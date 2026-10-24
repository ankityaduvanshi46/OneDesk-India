import React from 'react'

/**
 * High-definition, thematic SVG Vector Illustrations
 * Design Language: Imperial Republic (Ashoka Navy, Sovereign Gold, Radiant Saffron, Attestation Emerald)
 */

export function IdentityIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="idCardBg" x1="10" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B132B" />
          <stop offset="1" stopColor="#1C2541" />
        </linearGradient>
        <linearGradient id="goldHolo" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F5D15A" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#996515" />
        </linearGradient>
        <linearGradient id="saffronAccent" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#FF6B35" />
          <stop offset="1" stopColor="#FFA07A" />
        </linearGradient>
      </defs>
      {/* Background card drop shadow */}
      <rect x="14" y="24" width="92" height="72" rx="10" fill="#000" fillOpacity="0.25" filter="blur(4px)" />
      {/* Card body */}
      <rect x="14" y="22" width="92" height="72" rx="10" fill="url(#idCardBg)" stroke="url(#goldHolo)" strokeWidth="1.5" />
      {/* Top tricolour accent line */}
      <rect x="14" y="22" width="92" height="4" rx="2" fill="url(#saffronAccent)" />
      {/* Photo frame */}
      <rect x="24" y="36" width="24" height="28" rx="4" fill="#2A3663" stroke="#D4AF37" strokeWidth="0.8" />
      <circle cx="36" cy="46" r="6" fill="#D4AF37" fillOpacity="0.8" />
      <path d="M26 62C26 57 31 56 36 56C41 56 46 57 46 62" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
      {/* Holographic EMV Smart Chip */}
      <rect x="56" y="38" width="16" height="12" rx="2" fill="url(#goldHolo)" />
      <line x1="56" y1="44" x2="72" y2="44" stroke="#7B4A12" strokeWidth="0.75" />
      <line x1="64" y1="38" x2="64" y2="50" stroke="#7B4A12" strokeWidth="0.75" />
      {/* Text lines */}
      <rect x="56" y="56" width="38" height="3" rx="1.5" fill="#E2E8F0" fillOpacity="0.7" />
      <rect x="56" y="63" width="28" height="3" rx="1.5" fill="#94A3B8" fillOpacity="0.6" />
      <rect x="24" y="74" width="70" height="2" rx="1" fill="#D4AF37" fillOpacity="0.5" />
      <rect x="24" y="80" width="50" height="3" rx="1.5" fill="#F8FAFC" fillOpacity="0.9" />
      {/* Ashoka Chakra symbol watermark */}
      <circle cx="88" cy="44" r="7" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.6" />
    </svg>
  )
}

export function TransportIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="transportBg" x1="15" y1="20" x2="105" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F1B5E" />
          <stop offset="1" stopColor="#1B4FD8" />
        </linearGradient>
        <linearGradient id="goldPlate" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFE082" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      {/* Card base */}
      <rect x="16" y="24" width="88" height="68" rx="8" fill="url(#transportBg)" stroke="#38BDF8" strokeWidth="1.2" />
      {/* IND registration plate header */}
      <rect x="24" y="32" width="72" height="18" rx="3" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
      <rect x="26" y="34" width="10" height="14" rx="1.5" fill="#0284C7" />
      <text x="31" y="44" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">IND</text>
      <text x="58" y="45" fill="#0F172A" fontSize="9" fontWeight="800" letterSpacing="1.5">DL 01 AB 2026</text>
      {/* Car silhouette */}
      <path
        d="M32 74L38 62H72L78 74H90C92 74 94 76 94 78V82H26V78C26 76 28 74 30 74H32Z"
        fill="#070B19"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      {/* Wheels */}
      <circle cx="40" cy="82" r="5" fill="#D4AF37" stroke="#0B132B" strokeWidth="1.5" />
      <circle cx="70" cy="82" r="5" fill="#D4AF37" stroke="#0B132B" strokeWidth="1.5" />
      {/* Speed lines */}
      <line x1="84" y1="62" x2="96" y2="62" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="67" x2="92" y2="67" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function CertificatesIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="certBg" x1="30" y1="15" x2="90" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF5" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#EF4444" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      {/* Parchment scroll */}
      <rect x="25" y="16" width="70" height="88" rx="5" fill="url(#certBg)" stroke="#D4AF37" strokeWidth="1.5" />
      <rect x="29" y="20" width="62" height="80" rx="3" stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="2 2" />
      {/* Top ornamental header */}
      <circle cx="60" cy="29" r="5" fill="#D4AF37" />
      <line x1="36" y1="40" x2="84" y2="40" stroke="#0B132B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Content lines */}
      <line x1="36" y1="48" x2="84" y2="48" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="55" x2="78" y2="55" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="62" x2="84" y2="62" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="69" x2="68" y2="69" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Official Golden Seal & Ribbons */}
      <circle cx="60" cy="85" r="10" fill="#D4AF37" stroke="#7B4A12" strokeWidth="1" />
      <path d="M57 93L53 104L60 100L67 104L63 93" fill="url(#ribbonGrad)" />
      <path d="M56 85L59 88L65 82" stroke="#0B132B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TaxFinanceIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5D15A" />
          <stop offset="0.6" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="30" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B132B" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      {/* Background Security Shield */}
      <path
        d="M60 18L92 30V56C92 76 78 94 60 102C42 94 28 76 28 56V30L60 18Z"
        fill="url(#shieldGrad)"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      {/* Golden Rupee Medallion */}
      <circle cx="60" cy="56" r="22" fill="url(#coinGrad)" stroke="#7B4A12" strokeWidth="1.2" />
      <circle cx="60" cy="56" r="19" stroke="#FFF" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
      {/* Indian Rupee Symbol (₹) */}
      <path
        d="M52 46H68M52 51H66M52 46V56C54 58 57 59 61 59C66 59 67 56 67 56L54 68M61 59L68 68"
        stroke="#070B19"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Laurel wreath accents */}
      <path d="M42 78C38 72 38 64 40 58" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 78C82 72 82 64 80 58" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function EducationIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="capGrad" x1="20" y1="30" x2="100" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      {/* Mortarboard Cap */}
      <polygon points="60,26 102,44 60,62 18,44" fill="url(#capGrad)" stroke="#D4AF37" strokeWidth="1.5" />
      <polygon points="36,54 36,72 60,82 84,72 84,54 60,64" fill="#0B132B" stroke="#D4AF37" strokeWidth="1.2" />
      {/* Tassel */}
      <circle cx="60" cy="44" r="2" fill="#FF6B35" />
      <path d="M60 44L28 54V70" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="26,70 30,70 31,76 25,76" fill="#D4AF37" />
      {/* Open Book */}
      <path
        d="M24 94C34 88 48 88 60 92C72 88 86 88 96 94V80C86 74 72 74 60 78C48 74 34 74 24 80V94Z"
        fill="#FEF3C7"
        stroke="#B45309"
        strokeWidth="1.2"
      />
      <line x1="60" y1="78" x2="60" y2="92" stroke="#B45309" strokeWidth="1.2" />
    </svg>
  )
}

export function HealthIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="healthBg" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064E3B" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Protective circle / badge */}
      <circle cx="60" cy="60" r="44" fill="url(#healthBg)" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="60" cy="60" r="48" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      {/* Medical Cross */}
      <path
        d="M52 38H68V52H82V68H68V82H52V68H38V52H52V38Z"
        fill="#FFFFFF"
        stroke="#064E3B"
        strokeWidth="1"
      />
      {/* Heartbeat pulse overlay */}
      <path
        d="M32 60H46L52 48L60 72L66 54L72 64L76 60H88"
        stroke="#FF6B35"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EmploymentIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="briefcaseGrad" x1="20" y1="30" x2="100" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      {/* Cog of Industry */}
      <circle cx="60" cy="56" r="38" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.4" />
      {/* Briefcase */}
      <rect x="24" y="44" width="72" height="48" rx="8" fill="url(#briefcaseGrad)" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Handle */}
      <path d="M46 44V34C46 31 49 28 52 28H68C71 28 74 31 74 34V44" stroke="#D4AF37" strokeWidth="2" fill="none" />
      {/* Lock clasp and leather straps */}
      <line x1="24" y1="62" x2="96" y2="62" stroke="#D4AF37" strokeWidth="1.2" />
      <rect x="54" y="58" width="12" height="10" rx="2" fill="#F5D15A" stroke="#7B4A12" strokeWidth="1" />
      <circle cx="60" cy="63" r="1.5" fill="#0B132B" />
    </svg>
  )
}

export function AgricultureIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Rising Sun */}
      <circle cx="60" cy="52" r="24" fill="url(#sunGrad)" opacity="0.9" />
      {/* Rolling Green Fields */}
      <path d="M12 88C32 72 54 86 78 76C94 70 102 78 108 88V98H12V88Z" fill="#15803D" />
      <path d="M12 94C40 84 64 94 92 86C102 83 106 88 108 94V98H12V94Z" fill="#166534" />
      {/* Golden Wheat Stalks */}
      <path d="M60 84V42" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="55" cy="46" rx="4" ry="2.5" transform="rotate(-30 55 46)" fill="#F5D15A" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="65" cy="46" rx="4" ry="2.5" transform="rotate(30 65 46)" fill="#F5D15A" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="54" cy="54" rx="4" ry="2.5" transform="rotate(-30 54 54)" fill="#F5D15A" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="66" cy="54" rx="4" ry="2.5" transform="rotate(30 66 54)" fill="#F5D15A" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="55" cy="62" rx="4" ry="2.5" transform="rotate(-30 55 62)" fill="#F5D15A" stroke="#B45309" strokeWidth="0.8" />
      <ellipse cx="65" cy="62" rx="4" ry="2.5" transform="rotate(30 65 62)" fill="#F5D15A" stroke="#B45309" strokeWidth="0.8" />
    </svg>
  )
}

export function UtilitiesIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      {/* Municipal Tower / Grid */}
      <circle cx="60" cy="60" r="44" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      {/* Water Droplet */}
      <path
        d="M48 64C48 72 54 78 60 78C66 78 72 72 72 64C72 56 60 42 60 42C60 42 48 56 48 64Z"
        fill="url(#waterGrad)"
      />
      {/* Electric Bolt */}
      <polygon
        points="62,32 46,58 58,58 54,82 74,52 62,52"
        fill="url(#boltGrad)"
        stroke="#78350F"
        strokeWidth="1"
      />
    </svg>
  )
}

export function WelfareIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      {/* Gentle supporting hands base */}
      <circle cx="60" cy="60" r="44" fill="#1C1917" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Protective Heart */}
      <path
        d="M60 42C56 34 46 34 40 40C32 48 34 60 60 80C86 60 88 48 80 40C74 34 64 34 60 42Z"
        fill="url(#heartGrad)"
        stroke="#FFF"
        strokeWidth="1"
      />
      {/* Golden Coin in Heart */}
      <circle cx="60" cy="56" r="8" fill="#F5D15A" stroke="#7B4A12" strokeWidth="1" />
      <text x="60" y="60" fill="#7B4A12" fontSize="9" fontWeight="bold" textAnchor="middle">₹</text>
    </svg>
  )
}

export const SERVICE_ILLUSTRATIONS_MAP = {
  // Title-case keys (legacy)
  Identity: IdentityIllustration,
  Transport: TransportIllustration,
  Certificates: CertificatesIllustration,
  'Tax & Finance': TaxFinanceIllustration,
  Education: EducationIllustration,
  Health: HealthIllustration,
  'Employment & Labour': EmploymentIllustration,
  'Agriculture & Land': AgricultureIllustration,
  'Utilities & Civic': UtilitiesIllustration,
  'Social Welfare & Pension': WelfareIllustration,
  // Lowercase slug keys (from services.js data)
  identity: IdentityIllustration,
  transport: TransportIllustration,
  certificates: CertificatesIllustration,
  'tax-finance': TaxFinanceIllustration,
  education: EducationIllustration,
  health: HealthIllustration,
  jobs: EmploymentIllustration,
  'land-property': AgricultureIllustration,
  utilities: UtilitiesIllustration,
  grievance: WelfareIllustration
}

export function ServiceIllustration({ category, className = 'w-20 h-20' }) {
  const Component = SERVICE_ILLUSTRATIONS_MAP[category] ?? SERVICE_ILLUSTRATIONS_MAP[category?.toLowerCase()] ?? IdentityIllustration
  return <Component className={className} />
}

export default ServiceIllustration
