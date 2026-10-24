import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { Application } from '../models/Application.js'
import { User } from '../models/User.js'
import { Document } from '../models/Document.js'
import { AuditLog } from '../models/AuditLog.js'
import { Notification } from '../models/Notification.js'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'
import { cloudinaryEnabled, getSignedUrl } from '../middleware/upload.js'
import { generateVerificationId, generateDocumentNo } from '../utils/idGenerator.js'
import { generateCertificatePDF } from '../utils/pdfGenerator.js'
import { sendApplicationStatusEmail, sendDocumentDeliveryEmail } from '../utils/mailer.js'
import crypto from 'crypto'

const router = express.Router()

// All admin routes require authentication + staff/super_admin role
router.use(authenticate)
router.use(requireRole(['staff', 'super_admin']))

// ─── Helper: Upload PDF buffer to Cloudinary (raw private) ───────────────────
async function uploadPdfToCloudinary(pdfBuffer, verificationId) {
  if (!cloudinaryEnabled) {
    // Local dev fallback — return a mock URL (no disk writes on Vercel)
    return {
      publicId: null,
      fileUrl: `data:application/pdf;base64,${pdfBuffer.toString('base64').slice(0, 50)}...`,
      fileSizeBytes: pdfBuffer.length
    }
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        type: 'private',
        folder: 'onedesk/issued-documents',
        public_id: `cert-${verificationId.toLowerCase()}`,
        format: 'pdf'
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({
          publicId: result.public_id,
          fileUrl: result.secure_url,   // base URL — need signed URL for access
          fileSizeBytes: pdfBuffer.length
        })
      }
    )
    uploadStream.end(pdfBuffer)
  })
}

// ─── GET /api/admin/overview ─────────────────────────────────────────────────
router.get('/overview', async (req, res, next) => {
  try {
    const [
      totalUsers, totalApplications, totalDocuments,
      submittedCount, inReviewCount, approvedCount, readyCount, rejectedCount
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Application.countDocuments(),
      Document.countDocuments(),
      Application.countDocuments({ status: 'submitted' }),
      Application.countDocuments({ status: 'in_review' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'ready' }),
      Application.countDocuments({ status: 'rejected' })
    ])

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('userId', 'name email mobile registerId')
      .lean()

    res.json({
      success: true,
      stats: {
        totalUsers, totalApplications, totalDocuments,
        breakdown: { submitted: submittedCount, in_review: inReviewCount, approved: approvedCount, ready: readyCount, rejected: rejectedCount }
      },
      recentApplications
    })
  } catch (error) { next(error) }
})

// ─── GET /api/admin/applications ─────────────────────────────────────────────
router.get('/applications', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const filter = {}

    if (status && status !== 'all') filter.status = status
    if (search?.trim()) {
      const q = search.trim()
      filter.$or = [
        { applicationNo: { $regex: q, $options: 'i' } },
        { serviceName:   { $regex: q, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10))
        .populate('userId', 'name email mobile registerId govIdMasked')
        .populate('issuedDocumentId').lean(),
      Application.countDocuments(filter)
    ])

    res.json({
      success: true, applications,
      pagination: { total, page: parseInt(page, 10), pages: Math.ceil(total / parseInt(limit, 10)) }
    })
  } catch (error) { next(error) }
})

// ─── PUT /api/admin/applications/:id/status ──────────────────────────────────
router.put('/applications/:id/status', async (req, res, next) => {
  try {
    const { status, remarks = '' } = req.body
    const VALID = ['submitted', 'in_review', 'action_required', 'approved', 'ready', 'rejected']
    if (!VALID.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }

    const application = await Application.findById(req.params.id).populate('userId', 'name email')
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' })

    application.status = status
    if (remarks) {
      application.officerNotes = remarks
      if (status === 'rejected') application.rejectionReason = remarks
    }

    application.history.push({ status, updatedBy: req.user.name, role: req.user.role, remarks, timestamp: new Date() })
    await application.save()

    await Notification.create({
      userId: application.userId._id,
      title: `Application #${application.applicationNo} Status Updated`,
      message: `Status changed to: ${status.toUpperCase().replace('_', ' ')}. ${remarks ? `Remarks: ${remarks}` : ''}`,
      type: status === 'rejected' ? 'warning' : 'info',
      link: `/dashboard/application/${application._id}`
    })

    await sendApplicationStatusEmail({
      email: application.userId.email, name: application.userId.name,
      applicationNo: application.applicationNo, serviceName: application.serviceName, status, remarks
    })

    await AuditLog.create({
      userId: req.user._id, userRole: req.user.role, action: 'ADMIN_UPDATE_STATUS',
      resource: 'Application', resourceId: application._id.toString(),
      ipAddress: req.ip, userAgent: req.get('user-agent') || '',
      details: { newStatus: status, remarks }
    })

    res.json({ success: true, message: `Application status updated to ${status}.`, application })
  } catch (error) { next(error) }
})

// ─── POST /api/admin/applications/:id/issue-document ─────────────────────────
// Generates PDF, uploads to Cloudinary (private), saves Document record,
// notifies citizen, sends email with attachment.
router.post('/applications/:id/issue-document', async (req, res, next) => {
  try {
    const { title, officerRemarks } = req.body

    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email mobile registerId govIdMasked address')
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' })

    const verificationId = generateVerificationId()
    const documentNo     = generateDocumentNo()
    const docTitle       = title || `Certificate of ${application.serviceName}`
    const clientUrl      = process.env.CLIENT_URL || 'https://onedesk-india.vercel.app'

    // Generate PDF buffer (in-memory — no disk write needed)
    const pdfBuffer = await generateCertificatePDF({
      verificationId, documentNo, applicationNo: application.applicationNo,
      serviceTitle: docTitle, applicantName: application.userId.name,
      registerId: application.userId.registerId, mobile: application.userId.mobile,
      govIdMasked: application.userId.govIdMasked,
      dateOfIssue: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      officerRemarks: officerRemarks || 'Verified and approved by OneDesk Citizen Facilitation Authority.',
      clientUrl
    })

    // Upload to Cloudinary (private, signed) — no local disk writes
    const { publicId, fileUrl, fileSizeBytes } = await uploadPdfToCloudinary(pdfBuffer, verificationId)

    // Secure download URL (expires 24h — refreshed on each dashboard visit)
    const secureDownloadUrl = publicId
      ? getSignedUrl(publicId, 'raw', 86400)
      : `${clientUrl}/api/admin/documents/${verificationId}/download`

    // Save Document record
    const newDocument = new Document({
      documentNo, verificationId,
      userId: application.userId._id,
      applicationId: application._id,
      serviceId: application.serviceId,
      title: docTitle,
      fileName: `cert-${verificationId.toLowerCase()}.pdf`,
      publicId: publicId || null,   // Cloudinary public_id
      fileUrl:  fileUrl,            // base Cloudinary URL
      fileSizeBytes: fileSizeBytes || pdfBuffer.length,
      qrCodeData: `${clientUrl}/verify-document?id=${verificationId}`,
      status: 'active'
    })
    await newDocument.save()

    // Update application → ready
    application.issuedDocumentId = newDocument._id
    application.status = 'ready'
    application.history.push({
      status: 'ready', updatedBy: req.user.name, role: req.user.role,
      remarks: `Official digital document issued. Verification ID: ${verificationId}`
    })
    await application.save()

    // In-app notification
    await Notification.create({
      userId: application.userId._id,
      title: '🎉 Document Issued & Ready for Download',
      message: `Your document for ${application.serviceName} has been verified and issued. Verification ID: ${verificationId}.`,
      type: 'success',
      link: `/dashboard/documents`
    })

    // Email delivery (attach PDF buffer)
    await sendDocumentDeliveryEmail({
      email: application.userId.email, name: application.userId.name,
      serviceName: application.serviceName, documentTitle: docTitle,
      verificationId,
      downloadUrl: secureDownloadUrl || `${clientUrl}/dashboard/documents`,
      pdfBuffer,
      pdfFileName: `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    })

    await AuditLog.create({
      userId: req.user._id, userRole: req.user.role, action: 'ADMIN_ISSUE_DOCUMENT',
      resource: 'Document', resourceId: newDocument._id.toString(),
      ipAddress: req.ip, userAgent: req.get('user-agent') || '',
      details: { verificationId, applicationNo: application.applicationNo, publicId }
    })

    res.status(201).json({
      success: true,
      message: 'Official document generated, stored in cloud, and dispatched to the citizen!',
      document: newDocument, application
    })
  } catch (error) { next(error) }
})

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query
    const filter = { role: 'user' }

    if (search?.trim()) {
      const q = search.trim()
      filter.$or = [
        { name:       { $regex: q, $options: 'i' } },
        { email:      { $regex: q, $options: 'i' } },
        { mobile:     { $regex: q, $options: 'i' } },
        { registerId: { $regex: q, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).select('-passwordHash').lean(),
      User.countDocuments(filter)
    ])

    res.json({ success: true, users, pagination: { total, page: parseInt(page, 10), pages: Math.ceil(total / parseInt(limit, 10)) } })
  } catch (error) { next(error) }
})

// ─── PUT /api/admin/users/:id/status ─────────────────────────────────────────
router.put('/users/:id/status', requireRole(['super_admin']), async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash')
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })

    await AuditLog.create({
      userId: req.user._id, userRole: req.user.role,
      action: status === 'suspended' ? 'ADMIN_SUSPEND_USER' : 'ADMIN_ACTIVATE_USER',
      resource: 'User', resourceId: user._id.toString(),
      ipAddress: req.ip, userAgent: req.get('user-agent') || '',
      details: { targetUserId: user._id, targetEmail: user.email, newStatus: status }
    })

    res.json({ success: true, message: `User status changed to ${status}.`, user })
  } catch (error) { next(error) }
})

// ─── GET /api/admin/audit-logs ────────────────────────────────────────────────
router.get('/audit-logs', async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [logs, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10))
        .populate('userId', 'name email role').lean(),
      AuditLog.countDocuments()
    ])

    res.json({ success: true, logs, pagination: { total, page: parseInt(page, 10), pages: Math.ceil(total / parseInt(limit, 10)) } })
  } catch (error) { next(error) }
})

export default router
