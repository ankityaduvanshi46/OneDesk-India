import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables.')
    return
  }

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  }

  try {
    const conn = await mongoose.connect(uri, options)
    isConnected = true
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`)

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error event:', err.message)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost. Attempting auto-reconnect...')
      isConnected = false
    })

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Connection re-established.')
      isConnected = true
    })
  } catch (error) {
    console.error('[MongoDB] Initial connection failure:', error.message)
    console.warn('[MongoDB] Server will continue running in resilient mode.')
  }
}

export function isDBConnected() {
  return isConnected && mongoose.connection.readyState === 1
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect()
    isConnected = false
    console.log('[MongoDB] Connection closed cleanly.')
  }
}
