import express from 'express'
import path from 'path'
import fs from 'fs'
import { Document } from '../models/Document.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { getSignedUrl, cloudinaryEnabled } from '../middleware/upload.js'

const router = express.Router()

// ─── GET /api/documents/my ────────────────────────────────────────────────────
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('applicationId', 'applicationNo serviceName status')
      .lean()

    // Attach fresh 1-hour signed download URLs for Cloudinary-stored docs
    const enriched = documents.map((doc) => ({
      ...doc,
      signedDownloadUrl: doc.publicId
        ? getSignedUrl(doc.publicId, 'raw', 3600)
        : null
    }))

    res.json({ success: true, documents: enriched })
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
        applicationNo:   document.applicationId?.applicationNo || 'N/A',
        serviceTitle:    document.applicationId?.serviceName  || document.title,
        status:          document.status,
        issuedAt:        document.issuedAt
        // NOTE: No downloadUrl in public verify — must be authenticated owner
      }
    })
  } catch (error) {
    next(error)
  }
})

// ─── GET /api/documents/download/:id ── Authenticated, owner-only, signed URL ─
// Returns a redirect to a Cloudinary signed URL (expires in 1 hour).
// Works only for the document owner or staff — IDOR protected.
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
      // Cloudinary private asset — generate a 1-hour signed URL
      const signedUrl = getSignedUrl(document.publicId, 'raw', 3600)
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

    // Fallback: if no publicId, return the stored fileUrl or redirect
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
