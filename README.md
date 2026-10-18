# OneDesk India (वनडेस्क इंडिया)

A modern, production-ready, unofficial directory of direct links to 80+ Indian government service portals with verified domain security, official branding, and an accessible interface designed for people of all ages and digital literacy levels.

## Features

- **Direct Official Portals**: 80+ services covering Identity, Transport, Certificates, Taxes & Finance, Education, Healthcare, Jobs, Land & Property, Utilities, and Grievance redressal.
- **Official Domain Whitelist**: Strict validation against verified `.gov.in`, `.nic.in`, and official statutory domains.
- **Smart Multilingual Search**: Instant fuzzy matching (Fuse.js) with typo tolerance across Hindi (Devanagari), English, and Hinglish.
- **Voice Search**: Native Web Speech API integration in Hindi and English.
- **Guided Wizard ("What Do I Need?")**: Interactive step-by-step assistant that recommends exact government services based on user goals.
- **Service Detail Portals**: Interactive document readiness checkboxes, step-by-step guides, fees, processing times, helplines, and QR code sharing.
- **Scam Awareness & URL Verifier**: Instant checker for citizens to test if a website is an authentic official portal or a fraudulent scam link.
- **Zero-Login Personalization**: Favourites, recently viewed, and drag-and-drop Quick Links stored strictly in the user's local browser storage.
- **Accessible & Responsive**: High-contrast light and dark modes, adjustable font sizing, mobile bottom navigation bar, and keyboard shortcuts (`Ctrl+K`).
- **Installable PWA**: Offline caching with Workbox Service Worker.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Animation**: Framer Motion
- **Search**: Fuse.js
- **State Management**: Zustand
- **Internationalization**: react-i18next (English & Hindi)
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/ankityaduvanshi46/OneDesk-India.git
cd OneDesk-India
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Unit Tests

```bash
npm test
```

### Checking Government URL Health

```bash
node scripts/check-links.js
```

### Building for Production

```bash
npm run build
```

The production assets will be output to the `dist/` directory.

## Deployment to Vercel

### Option 1: Automatic Deployment via GitHub (Recommended)

1. Push your repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your `OneDesk-India` repository.
4. Framework preset will automatically detect **Vite**.
5. Click **Deploy**. All security headers in `vercel.json` and client-side rewrites will be configured automatically.

### Option 2: Deploying via Vercel CLI

```bash
npx vercel --prod
```

## Security & Privacy

- **No Cookies / Zero PII**: No personal user data or tracking cookies are collected or transmitted.
- **Safe Outbound Links**: All external official links are enforced with `rel="noopener noreferrer"` and `target="_blank"`.
- **Strict Headers**: Hardened with Content Security Policy (`CSP`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `HSTS`.

## Disclaimer

OneDesk India is an independent, unofficial directory created for public utility. It is not affiliated with, endorsed by, or sponsored by the Government of India or any state government.
