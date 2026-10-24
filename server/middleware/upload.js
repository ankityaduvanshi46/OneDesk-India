import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import crypto from 'crypto'

// ─── Cloudinary config ───────────────────────────────────────────────────────
const isConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

// ─── Allowed MIME types ───────────────────────────────────────────────────────
const ALLOWED_MIMES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const ALLOWED_FORMATS = ['pdf', 'jpg', 'jpeg', 'png', 'webp']

// ─── Storage backend ─────────────────────────────────────────────────────────
let storage

if (isConfigured) {
  // Real Cloudinary storage — files stored privately, served via signed URLs
  storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const randomId = crypto.randomBytes(8).toString('hex')
      const userId   = req.user?._id?.toString() || 'anon'
      return {
        folder:         `onedesk/${userId}`,
        public_id:      `${Date.now()}-${randomId}`,
        resource_type:  file.mimetype === 'application/pdf' ? 'raw' : 'image',
        type:           'private',        // private — requires signed URL to access
        allowed_formats: ALLOWED_FORMATS
      }
    }
  })
} else {
  // Fallback: memory storage for local dev / when Cloudinary not configured
  console.warn(
    '⚠  [upload] CLOUDINARY credentials not set — using in-memory storage.\n' +
    '   File URLs will be placeholder paths. Set CLOUDINARY_* env vars for real uploads.'
  )
  storage = multer.memoryStorage()
}

// ─── File filter ─────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error('Invalid file format. Only PDF, JPG, PNG, and WebP files are permitted.'),
      false
    )
  }
}

// ─── Multer instance ─────────────────────────────────────────────────────────
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }   // 5 MB
})

// ─── Helper: generate a short-lived signed Cloudinary URL ────────────────────
export function getSignedUrl(publicId, resourceType = 'image', expiresInSec = 3600) {
  if (!isConfigured) return null
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type:          'private',
    sign_url:      true,
    expires_at:    Math.floor(Date.now() / 1000) + expiresInSec
  })
}

// ─── Helper: delete a file from Cloudinary ────────────────────────────────────
export async function deleteCloudinaryFile(publicId, resourceType = 'image') {
  if (!isConfigured || !publicId) return
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: 'private'
    })
  } catch (err) {
    console.error('[upload] Cloudinary delete error:', err.message)
  }
}

export { isConfigured as cloudinaryEnabled }
