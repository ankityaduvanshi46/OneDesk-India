import express from 'express'
import fs from 'fs'
import path from 'path'
import { Application } from '../models/Application.js'
import { User } from '../models/User.js'
import { Document } from '../models/Document.js'
import { AuditLog } from '../models/AuditLog.js'
import { Notification } from '../models/Notification.js'
import { authenticate } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'
import { generateVerificationId, generateDocumentNo } from '../utils/idGenerator.js'
import { generateCertificatePDF } from '../utils/pdfGenerator.js'
import { sendApplicationStatusEmail, sendDocumentDeliveryEmail } from '../utils/mailer.js'

const router = express.Router()

router.use(authenticate)
router.use(requireRole(['staff', 'super_admin']))

router.get('/overview', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalApplications,
      totalDocuments,
      submittedCount,
      inReviewCount,
      approvedCount,
      readyCount,
      rejectedCount
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
        totalUsers,
        totalApplications,
        totalDocuments,
        breakdown: {
          submitted: submittedCount,
          in_review: inReviewCount,
          approved: approvedCount,
          ready: readyCount,
          rejected: rejectedCount
        }
      },
      recentApplications
    })
  } catch (error) {
    next(error)
  }
})

router.get('/applications', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const filter = {}

    if (status && status !== 'all') {
      filter.status = status
    }

    if (search && search.trim()) {
      const q = search.trim()
      filter.$or = [
        { applicationNo: { $regex: q, $options: 'i' } },
        { serviceName: { $regex: q, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('userId', 'name email mobile registerId govIdMasked')
        .populate('issuedDocumentId')
        .lean(),
      Application.countDocuments(filter)
    ])

    res.json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/applications/:id/status', async (req, res, next) => {
  try {
    const { status, remarks = '' } = req.body

    const application = await Application.findById(req.params.id).populate('userId', 'name email')
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' })
    }

    application.status = status
    if (remarks) {
      application.officerNotes = remarks
      if (status === 'rejected') {
        application.rejectionReason = remarks
      }
    }

    application.history.push({
      status,
      updatedBy: req.user.name,
      role: req.user.role,
      remarks,
      timestamp: new Date()
    })

    await application.save()

    await Notification.create({
      userId: application.userId._id,
      title: `Application #${application.applicationNo} Status Updated`,
      message: `Status changed to: ${status.toUpperCase().replace('_', ' ')}. ${remarks ? `Remarks: ${remarks}` : ''}`,
      type: status === 'rejected' ? 'warning' : 'info',
      link: `/dashboard/application/${application._id}`
    })

    await sendApplicationStatusEmail({
      email: application.userId.email,
      name: application.userId.name,
      applicationNo: application.applicationNo,
      serviceName: application.serviceName,
      status,
      remarks
    })

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'ADMIN_UPDATE_STATUS',
      resource: 'Application',
      resourceId: application._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      details: { newStatus: status, remarks }
    })

    res.json({
      success: true,
      message: `Application status updated to ${status}.`,
      application
    })
  } catch (error) {
    next(error)
  }
})

router.post('/applications/:id/issue-document', async (req, res, next) => {
  try {
    const { title, officerRemarks } = req.body

    const application = await Application.findById(req.params.id).populate('userId', 'name email mobile registerId govIdMasked address')
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' })
    }

    const verificationId = generateVerificationId()
    const documentNo = generateDocumentNo()
    const docTitle = title || `Certificate of ${application.serviceName}`

    const pdfBuffer = await generateCertificatePDF({
      verificationId,
      documentNo,
      applicationNo: application.applicationNo,
      serviceTitle: docTitle,
      applicantName: application.userId.name,
      registerId: application.userId.registerId,
      mobile: application.userId.mobile,
      govIdMasked: application.userId.govIdMasked,
      dateOfIssue: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      officerRemarks: officerRemarks || 'Verified and approved by OneDesk Citizen Facilitation Authority.',
      clientUrl: process.env.CLIENT_URL || 'https://onedesk-india.vercel.app'
    })

    const uploadDir = path.resolve('server/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileName = `cert-${verificationId.toLowerCase()}.pdf`
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, pdfBuffer)

    const fileUrl = `/api/uploads/${fileName}`

    const newDocument = new Document({
      documentNo,
      verificationId,
      userId: application.userId._id,
      applicationId: application._id,
      serviceId: application.serviceId,
      title: docTitle,
      fileName,
      fileUrl,
      fileSizeBytes: pdfBuffer.length,
      qrCodeData: `${process.env.CLIENT_URL || 'https://onedesk-india.vercel.app'}/verify-document?id=${verificationId}`,
      status: 'active'
    })

    await newDocument.save()

    application.issuedDocumentId = newDocument._id
    application.status = 'ready'
    application.history.push({
      status: 'ready',
      updatedBy: req.user.name,
      role: req.user.role,
      remarks: `Official digital document issued under Verification ID: ${verificationId}`
    })

    await application.save()

    await Notification.create({
      userId: application.userId._id,
      title: '🎉 Document Issued & Ready for Download',
      message: `Your document for ${application.serviceName} has been verified and issued. Verification ID: ${verificationId}.`,
      type: 'success',
      link: `/dashboard/documents`
    })

    await sendDocumentDeliveryEmail({
      email: application.userId.email,
      name: application.userId.name,
      serviceName: application.serviceName,
      documentTitle: docTitle,
      verificationId,
      downloadUrl: `${process.env.CLIENT_URL || 'https://onedesk-india.vercel.app'}/dashboard/documents`,
      pdfBuffer,
      pdfFileName: `${docTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    })

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'ADMIN_ISSUE_DOCUMENT',
      resource: 'Document',
      resourceId: newDocument._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      details: { verificationId, applicationNo: application.applicationNo }
    })

    res.status(201).json({
      success: true,
      message: 'Official document generated, stored, and dispatched to the citizen!',
      document: newDocument,
      application
    })
  } catch (error) {
    next(error)
  }
})

router.get('/users', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query
    const filter = { role: 'user' }

    if (search && search.trim()) {
      const q = search.trim()
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { registerId: { $regex: q, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .select('-passwordHash')
        .lean(),
      User.countDocuments(filter)
    ])

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/users/:id/status', requireRole(['super_admin']), async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    res.json({
      success: true,
      message: `User status changed to ${status}.`,
      user
    })
  } catch (error) {
    next(error)
  }
})

router.get('/audit-logs', async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('userId', 'name email role')
        .lean(),
      AuditLog.countDocuments()
    ])

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    })
  } catch (error) {
    next(error)
  }
})

export default router
