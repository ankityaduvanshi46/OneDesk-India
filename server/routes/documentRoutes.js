import express from 'express'
import path from 'path'
import fs from 'fs'
import { Document } from '../models/Document.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { upload, getSignedUrl, deleteCloudinaryFile, cloudinaryEnabled } from '../middleware/upload.js'
import { generateDocumentNo, generateVerificationId } from '../utils/idGenerator.js'

const router = express.Router()

// ─── GET /api/documents/my ────────────────────────────────────────────────────
// Returns authenticated citizen's document locker contents with signed expiring URLs
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const { category, isSelfUploaded } = req.query
    const query = { userId: req.user._id }

    if (category && category !== 'all') {
      query.category = category
    }
    if (isSelfUploaded !== undefined) {
      query.isSelfUploaded = isSelfUploaded === 'true'
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .populate('applicationId', 'applicationNo serviceName status')
      .lean()

    // Attach fresh 1-hour signed download URLs
    const enriched = documents.map((doc) => ({
      ...doc,
      signedDownloadUrl: doc.publicId
        ? getSignedUrl(doc.publicId, doc.mimeType?.startsWith('image/') ? 'image' : 'raw', 3600)
        : (doc.fileUrl || `/api/documents/download/${doc._id}`)
    }))

    res.json({ success: true, documents: enriched })
  } catch (error) {
    next(error)
  }
})

// ─── POST /api/documents/upload ── Citizen Locker Self-Upload ──────────────────
router.post('/upload', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a file to upload.' })
    }

    const { title, category, docType, notes } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Document title is required.' })
    }

    const documentNo = generateDocumentNo()
    const verificationId = generateVerificationId()

    // In Cloudinary storage, req.file.filename / req.file.path holds the uploaded asset info
    // In multer memory storage, generate local or fallback URL
    const publicId = req.file.filename || null
    let fileUrl = req.file.path || null
    let fileName = req.file.originalname

    if (!fileUrl) {
      // Local fallback file writing
      const uploadsDir = path.resolve('server/uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      const safeName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const targetPath = path.join(uploadsDir, safeName)
      if (req.file.buffer) {
        fs.writeFileSync(targetPath, req.file.buffer)
      }
      fileName = safeName
      fileUrl = `/api/uploads/${safeName}`
    }

    const clientUrl = process.env.CLIENT_URL || 'https://onedesk-india.vercel.app'
    const qrCodeData = `${clientUrl}/verify-document?ref=${verificationId}`

    const newDoc = new Document({
      documentNo,
      verificationId,
      userId: req.user._id,
      applicationId: null,
      serviceId: 'locker',
      category: category || 'identity',
      docType: docType || 'custom',
      isSelfUploaded: true,
      title: title.trim(),
      fileName,
      publicId,
      fileUrl,
      mimeType: req.file.mimetype,
      fileSizeBytes: req.file.size || 0,
      qrCodeData,
      notes: notes ? notes.trim() : '',
      status: 'active'
    })

    await newDoc.save()

    res.status(201).json({
      success: true,
      message: 'Document stored securely in your Digital Locker.',
      document: {
        ...newDoc.toObject(),
        signedDownloadUrl: publicId
          ? getSignedUrl(publicId, req.file.mimetype.startsWith('image/') ? 'image' : 'raw', 3600)
          : fileUrl
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── PUT /api/documents/:id ── Update Document Metadata (Owner Only) ───────────
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' })
    }

    // IDOR protection
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this document.' })
    }

    const { title, category, notes, docType } = req.body
    if (title && title.trim()) document.title = title.trim()
    if (category) document.category = category
    if (docType) document.docType = docType
    if (notes !== undefined) document.notes = notes.trim()

    await document.save()

    res.json({
      success: true,
      message: 'Document details updated successfully.',
      document
    })
  } catch (error) {
    next(error)
  }
})

// ─── DELETE /api/documents/:id ── Delete Document from Locker (Owner Only) ─────
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' })
    }

    // IDOR protection
    const isOwner = document.userId.toString() === req.user._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(req.user.role)

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this document.' })
    }

    // Clean up file if needed
    if (document.publicId && cloudinaryEnabled) {
      const resourceType = document.mimeType?.startsWith('image/') ? 'image' : 'raw'
      await deleteCloudinaryFile(document.publicId, resourceType)
    } else if (document.fileName) {
      const localFilePath = path.resolve('server/uploads', document.fileName)
      if (fs.existsSync(localFilePath)) {
        try { fs.unlinkSync(localFilePath) } catch { /* ignore */ }
      }
    }

    await Document.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Document safely deleted from your Digital Locker.'
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/documents/verify/:verificationId ── Public verification ─────────
router.get('/verify/:verificationId', optionalAuth, async (req, res, next) => {
  try {
    const { verificationId } = req.params

    const document = await Document.findOne({ verificationId: verificationId.trim().toUpperCase() })
      .populate('userId', 'name registerId govIdMasked')
      .populate('applicationId', 'applicationNo serviceName createdAt')

    if (!document) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'No record found matching this Verification Reference ID. Please check the ID or contact OneDesk Support.'
      })
    }

    res.json({
      success: true,
      verified: true,
      document: {
        verificationId:  document.verificationId,
        documentNo:      document.documentNo,
        title:           document.title,
        applicantName:   document.userId?.name       || 'Authorized Citizen',
        registerId:      document.userId?.registerId || 'N/A',
        govIdMasked:     document.userId?.govIdMasked || 'Verified UID/PAN',
        applicationNo:   document.applicationId?.applicationNo || 'N/A (Locker Asset)',
        serviceTitle:    document.applicationId?.serviceName  || document.title,
        category:        document.category,
        isSelfUploaded:  document.isSelfUploaded,
        status:          document.status,
        issuedAt:        document.issuedAt
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/documents/download/:id ── Authenticated, owner-only, signed URL ─
router.get('/download/:id', authenticate, async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' })
    }

    // IDOR guard — citizen can only download their own documents
    const isOwner = document.userId.toString() === req.user._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(req.user.role)

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this document.'
      })
    }

    const wantsJson = req.headers.accept?.includes('application/json') && req.query.direct !== 'true'

    if (document.publicId && cloudinaryEnabled) {
      const resourceType = document.mimeType?.startsWith('image/') ? 'image' : 'raw'
      const signedUrl = getSignedUrl(document.publicId, resourceType, 3600)
      if (wantsJson) {
        return res.json({ success: true, downloadUrl: signedUrl, expiresInSeconds: 3600 })
      }
      return res.redirect(signedUrl)
    }

    // Local file fallback if exists on disk
    if (document.fileName) {
      const localFilePath = path.resolve('server/uploads', document.fileName)
      if (fs.existsSync(localFilePath)) {
        if (wantsJson) {
          return res.json({ success: true, downloadUrl: `/api/uploads/${document.fileName}` })
        }
        return res.download(localFilePath, `${(document.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`)
      }
    }

    if (wantsJson) {
      return res.json({
        success: true,
        downloadUrl: document.fileUrl,
        expiresInSeconds: null
      })
    }
    return res.redirect(document.fileUrl)
  } catch (error) {
    next(error)
  }
})

export default router
