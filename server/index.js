import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import { connectDB, isDBConnected, disconnectDB } from './config/db.js'
import { User } from './models/User.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import cronRoutes from './routes/cronRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import { generateRegisterId } from './utils/idGenerator.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

await connectDB()

async function bootstrapAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@onedesk.in').toLowerCase()
    const existing = await User.findOne({ email: adminEmail })
    if (!existing) {
      const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'Admin@OneDesk2026'
      const adminName = process.env.ADMIN_BOOTSTRAP_NAME || 'Super Administrator'
      const registerId = generateRegisterId()

      const adminUser = new User({
        registerId,
        name: adminName,
        email: adminEmail,
        mobile: '9876543210',
        passwordHash: adminPassword,
        role: 'super_admin',
        isEmailVerified: true,
        isMobileVerified: true,
        status: 'active'
      })
      await adminUser.save()
      console.log(`[Bootstrap] Initial Super Admin account established: ${adminEmail}`)
    }
  } catch (err) {
    console.warn('[Bootstrap] Admin creation note:', err.message)
  }
}
await bootstrapAdmin()

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
)

app.use(
  cors({
    origin: [CLIENT_URL, 'https://onedesk-india.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
)

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Safe in-place NoSQL injection sanitizer compatible with Vercel serverless IncomingMessage
app.use((req, res, next) => {
  const sanitizeInPlace = (obj) => {
    if (!obj || typeof obj !== 'object') return
    try {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key]
        } else if (typeof obj[key] === 'object') {
          sanitizeInPlace(obj[key])
        }
      })
    } catch {
      // Ignore frozen or non-configurable properties
    }
  }
  if (req.body) sanitizeInPlace(req.body)
  if (req.params) sanitizeInPlace(req.params)
  if (req.query) sanitizeInPlace(req.query)
  next()
})

app.use('/api', apiLimiter)

const uploadsPath = path.resolve('server/uploads')
app.use('/api/uploads', express.static(uploadsPath))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    databaseConnected: isDBConnected(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'OneDesk India API Engine v2.0'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/cron', cronRoutes)
app.use('/api/feedback', feedbackRoutes)

app.use(errorHandler)

let server

if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`[OneDesk India API] Server listening on port ${PORT} (Environment: ${process.env.NODE_ENV || 'development'})`)
  })

  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Commencing graceful shutdown...')
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
  })

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Commencing graceful shutdown...')
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
  })
}

export default app
