import express from 'express'
import path from 'path'
import fs from 'fs'
import { Document } from '../models/Document.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/my', authenticate, async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('applicationId', 'applicationNo serviceName status')
      .lean()

    res.json({
      success: true,
      documents
    })
  } catch (error) {
    next(error)
  }
})

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
        verificationId: document.verificationId,
        documentNo: document.documentNo,
        title: document.title,
        applicantName: document.userId?.name || 'Authorized Citizen',
        registerId: document.userId?.registerId || 'N/A',
        govIdMasked: document.userId?.govIdMasked || 'Verified UID/PAN',
        applicationNo: document.applicationId?.applicationNo || 'N/A',
        serviceTitle: document.applicationId?.serviceName || document.title,
        status: document.status,
        issuedAt: document.issuedAt,
        downloadUrl: document.fileUrl
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/download/:id', authenticate, async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' })
    }

    const isOwner = document.userId.toString() === req.user._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(req.user.role)

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not own this document.'
      })
    }

    const filePath = path.resolve('server/uploads', document.fileName)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Document file is temporarily unavailable on storage.'
      })
    }

    res.download(filePath, `${document.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`)
  } catch (error) {
    next(error)
  }
})

export default router
