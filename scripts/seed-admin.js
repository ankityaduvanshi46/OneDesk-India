import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDB, disconnectDB } from '../server/config/db.js'
import { User } from '../server/models/User.js'
import { generateRegisterId } from '../server/utils/idGenerator.js'

dotenv.config()

async function seedSuperAdmin() {
  console.log('[Seed] Initializing Super Admin provisioning...')

  await connectDB()

  const adminEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || 'ankityadavlko46@gmail.com').trim().toLowerCase()
  const rawPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || 'veer3320'
  const adminName = process.env.ADMIN_BOOTSTRAP_NAME || 'Ankit Yadav (Super Admin)'
  const mobile = process.env.ADMIN_BOOTSTRAP_MOBILE || '9876543210'

  try {
    let user = await User.findOne({ email: adminEmail })

    if (user) {
      console.log(`[Seed] Existing account found for ${adminEmail}. Elevating to Super Admin & updating credentials...`)
      const salt = await bcrypt.genSalt(12)
      user.passwordHash = await bcrypt.hash(rawPassword, salt)
      user.role = 'super_admin'
      user.status = 'active'
      user.isEmailVerified = true
      user.isMobileVerified = true
      user.name = adminName
      await user.save()
      console.log(`[Seed] Successfully elevated ${adminEmail} to super_admin.`)
    } else {
      const registerId = generateRegisterId()
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(rawPassword, salt)

      user = new User({
        registerId,
        name: adminName,
        email: adminEmail,
        mobile,
        passwordHash,
        role: 'super_admin',
        isEmailVerified: true,
        isMobileVerified: true,
        status: 'active',
        address: {
          city: 'Lucknow',
          state: 'Uttar Pradesh'
        }
      })

      await user.save()
      console.log(`[Seed] New Super Admin created successfully: ${adminEmail} (Register ID: ${registerId})`)
    }
  } catch (error) {
    console.error('[Seed Error] Failed to provision Super Admin:', error.message)
  } finally {
    await disconnectDB()
    console.log('[Seed] Execution finished.')
  }
}

seedSuperAdmin()
