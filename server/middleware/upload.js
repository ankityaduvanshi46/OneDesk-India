import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const uploadDir = path.resolve('server/uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const randomName = crypto.randomBytes(16).toString('hex')
    cb(null, `${Date.now()}-${randomName}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file format. Only PDF, JPG, PNG, and WebP files are permitted.'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
