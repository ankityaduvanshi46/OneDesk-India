import mongoose from 'mongoose'

mongoose.set('bufferCommands', false)

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn('[MongoDB Atlas] Warning: MONGODB_URI is not set in environment variables.')
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }

    cached.promise = mongoose.connect(uri, options).then((mongooseInstance) => {
      console.log(`[MongoDB Atlas] Successfully established connection (DB: ${mongooseInstance.connection.name})`)
      return mongooseInstance
    }).catch((err) => {
      console.error('[MongoDB Atlas] Connection failed:', err.message)
      cached.promise = null
      throw err
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    cached.conn = null
    console.error('[MongoDB Atlas] Reconnection exception:', error.message)
  }

  return cached.conn
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1
}

export function getDBStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }
  return states[mongoose.connection.readyState] || 'unknown'
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect()
    cached.conn = null
    cached.promise = null
    console.log('[MongoDB Atlas] Cleanly disconnected.')
  }
}
