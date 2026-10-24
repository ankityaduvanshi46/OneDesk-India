# OneDesk India (वनडेस्क इंडिया) 🇮🇳

[![Tests](https://img.shields.io/badge/tests-110%2F110%20passing-brightgreen.svg)](https://github.com/ankityaduvanshi46/OneDesk-India)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Vercel%20Serverless-black.svg)](https://onedesk-india.vercel.app)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)

**OneDesk India** is a modern, production-ready, full-stack citizen documents and public services platform. It unifies 80+ official government services across India into a single secure window with digital applications, status tracking, biometric-safe 1-person-1-account validation, cryptographic PDF certificate generation with tamper-proof QR verification, and automated email/SMS delivery.

Live Production: [https://onedesk-india.vercel.app](https://onedesk-india.vercel.app)

---

## 🏛 Platform Capabilities

### 1. Unified Directory & Single-Window Apply
- **80+ Official Government Portals**: Categorized under Identity, Transport, Certificates, Taxes & Finance, Education, Healthcare, Jobs, Land & Property, Utilities, and Grievance redressal.
- **Dual Application Modes**: Open verified government portals directly, or apply via the OneDesk Single-Window Digital Hub with auto-filled profile details.
- **Smart Multilingual Search**: Fuzzy search (Fuse.js) across English, Hindi (Devanagari), and Hinglish with voice search.
- **Interactive Checklists**: Document readiness checklists, fees, processing times, and helplines.

### 2. Authentication & 1-Person-1-Account Architecture
- **2-Step Verification**: Name, email, mobile number, and password with email & mobile OTP verification.
- **Unique Citizen Register ID**: Generated automatically (`ODI-YYYY-XXXXXX`).
- **1-Person-1-Account Enforcement**: Strict uniqueness indexes on email, mobile, and SHA-256 hashed government ID (`govIdHash`), blocking duplicate registrations.
- **Bcrypt & Argon2 Hashing**: High-cost password encryption with automated failed-attempt lockout defense.
- **DPDP Act 2023 Compliance**: Includes Right to Data Portability (`GET /api/auth/export-data`) and Permanent Account Erasure (`DELETE /api/auth/delete-account`).

### 3. Citizen Command Dashboard & Document Locker
- **Real-Time Status Tracking**: Live milestones (`Submitted`, `In Review`, `Action Required`, `Approved`, `Ready`, `Rejected`).
- **Encrypted Document Locker**: Permanent access to issued certificates with 1-hour signed expiring URLs.
- **IDOR Protection**: All database queries strictly isolated by authenticated user ID (`req.user._id`).

### 4. Automated Certificate Delivery Engine
- **Vector PDF Generator**: Generates digitally authenticated A4 certificates with tricolor national borders, metadata, and officer attestations.
- **Tamper-Proof QR Code**: Embedded QR code linking directly to public verification (`/verify-document?id=VER-XXXX-XXXX-XXXX`).
- **Private Cloud Storage**: Certificates stored as private assets on Cloudinary, served only via signed URLs.
- **Email & Notification Dispatch**: Automatically dispatches status emails and PDF attachments upon approval.

### 5. Administrative Command Desk
- **Role-Based Access Control (RBAC)**: Supports `super_admin`, `staff`, and `user`.
- **Review & Adjudication**: Inspect citizen forms, examine uploaded identity proofs, approve, reject with feedback, or issue signed certificates with one click.
- **One-Click CSV Export**: Download complete citizen application datasets for governance and analytics.
- **Citizen Directory & Governance**: Super Admin controls to suspend or activate accounts.
- **Immutable Audit Trails**: Logs every administrative and financial transaction with IP address and timestamp.

### 6. Growth Features & Security
- **Payment Verification (Razorpay)**: Server-side HMAC-SHA256 signature verification (`crypto.createHmac('sha256', secret)`) and idempotency anti-replay guards.
- **Vercel Cron Scheduled Reminders**: Daily automated background digests for applications pending review for >3 days (`/api/cron/reminders`).
- **Citizen Feedback & Ratings**: Public reviews and 5-star ratings for transparency.
- **Refund & Fee Policy**: Statutory government fee transparency and cancellation terms (`/refund-policy`).

### 7. Extras
- **Citizen AI Chatbot**: Interactive bilingual floating assistant widget for common government service inquiries.
- **Installable PWA**: One-click install prompt banner and offline-first Service Worker caching.
- **Multi-Channel Dispatch**: SMS OTP gateway (MSG91 / Fast2SMS) and WhatsApp notification gateway.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti, react-i18next
- **Backend / API**: Express 5 on Vercel Serverless Functions (`/api/index.js` bridge)
- **Database**: MongoDB Atlas with Mongoose (cached global connection pooling `maxPoolSize: 10`)
- **Validation**: Zod server-side validation middleware on all API routes
- **Security**: Helmet, Express Mongo Sanitize, Rate Limiting, HttpOnly Cookies, CSRF/XSS defenses
- **File Storage**: Cloudinary private storage with signed expiring URLs
- **Testing**: Vitest (110 automated unit and integration tests)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas free cluster)

### Installation
```bash
git clone https://github.com/ankityaduvanshi46/OneDesk-India.git
cd OneDesk-India
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials (MongoDB Atlas URI, Cloudinary, Razorpay, and Brevo/SMTP).

### Seed Services Catalog & Super Admin
```bash
# Seed 80+ government services into MongoDB
node scripts/seed-services.js

# Provision initial Super Admin account
node scripts/seed-admin.js
```

### Running Locally
```bash
# Runs concurrently: Express backend on :5000 + Vite frontend on :5173
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Test Suite
```bash
npm test
```
Executes all 110 tests across the 11 test suites.

### Building for Production
```bash
npm run build
```

---

## 🔐 Super Admin Credentials

The initial Super Admin account is provisioned via `scripts/seed-admin.js` or auto-bootstrapped on server startup:
- **Email**: `ankityadavlko46@gmail.com`
- **Password**: `veer3320`
- **Role**: `super_admin`
- **Desk Access**: `/admin`

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

## ⚖️ Disclaimer

OneDesk India is an independent citizen facilitation platform and directory created for public utility. It is not affiliated with, endorsed by, or sponsored by the Government of India or any state government.
