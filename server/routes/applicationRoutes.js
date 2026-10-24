import express from 'express'
import { Application } from '../models/Application.js'
import { Dependent } from '../models/Dependent.js'
import { Notification } from '../models/Notification.js'
import { AuditLog } from '../models/AuditLog.js'
import { generateApplicationNo } from '../utils/idGenerator.js'
import { sendApplicationStatusEmail } from '../utils/mailer.js'
import { authenticate } from '../middleware/auth.js'
import { upload, getSignedUrl, cloudinaryEnabled } from '../middleware/upload.js'

const router = express.Router()

router.post('/upload-file', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was provided.' })
    }

    const { documentType = 'general_doc' } = req.body

    // Cloudinary path is in req.file.path (full URL) and req.file.filename (public_id)
    // Memory-storage fallback: req.file.path is undefined, build a placeholder
    let fileUrl   = null
    let publicId  = null
    let cloudUrl  = null

    if (cloudinaryEnabled && req.file.path) {
      // CloudinaryStorage sets req.file.path = delivery URL and req.file.filename = public_id
      fileUrl  = req.file.path    // raw delivery URL (private — do not expose directly)
      publicId = req.file.filename
      // Generate a 1-hour signed URL for immediate preview
      const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image'
      cloudUrl = getSignedUrl(publicId, resourceType, 3600)
    } else {
      // No cloud storage — mock URL for local dev
      fileUrl  = `/api/uploads/mock/${req.file.originalname}`
      publicId = null
      cloudUrl = null
    }

    res.json({
      success: true,
      file: {
        documentType,
        originalName: req.file.originalname,
        publicId,       // stored in MongoDB, used to regenerate signed URLs
        fileUrl: cloudUrl || fileUrl,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        uploadedAt: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/apply', authenticate, async (req, res, next) => {
  try {
    const { serviceId, serviceName, formData = {}, uploadedFiles = [], dependentId } = req.body

    if (!serviceId || !serviceName) {
      return res.status(400).json({
        success: false,
        message: 'Service identifier and Service Name are required.'
      })
    }

    // If a dependentId is supplied, verify it belongs to this citizen (IDOR guard)
    if (dependentId) {
      const dep = await Dependent.findOne({ _id: dependentId, userId: req.user._id, status: 'active' })
      if (!dep) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or inaccessible dependent profile.'
        })
      }
    }

    let applicationNo = generateApplicationNo('ODI')
    let existingApp = await Application.findOne({ applicationNo })
    while (existingApp) {
      applicationNo = generateApplicationNo('ODI')
      existingApp = await Application.findOne({ applicationNo })
    }

    const application = new Application({
      applicationNo,
      userId: req.user._id,
      serviceId,
      serviceName,
      formData,
      uploadedFiles,
      dependentId: dependentId || null,
      isForDependent: !!dependentId,
      status: 'submitted',
      history: [
        {
          status: 'submitted',
          updatedBy: req.user.name,
          role: 'citizen',
          remarks: 'Application submitted successfully on OneDesk India platform.'
        }
      ]
    })

    await application.save()

    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted Successfully',
      message: `Your application for ${serviceName} has been submitted with reference #${applicationNo}.`,
      type: 'success',
      link: `/dashboard/application/${application._id}`
    })

    await sendApplicationStatusEmail({
      email: req.user.email,
      name: req.user.name,
      applicationNo,
      serviceName,
      status: 'submitted',
      remarks: 'Application received and queued for administrative review.'
    })

    await AuditLog.create({
      userId: req.user._id,
      userRole: req.user.role,
      action: 'APPLICATION_SUBMITTED',
      resource: 'Application',
      resourceId: application._id.toString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      details: { applicationNo, serviceId, serviceName }
    })

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    })
  } catch (error) {
    next(error)
  }
})

router.get('/my', authenticate, async (req, res, next) => {
  try {
    const { status, limit = 20, page = 1 } = req.query
    const filter = { userId: req.user._id }

    if (status && status !== 'all') {
      filter.status = status
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
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

router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user._id

    const [total, pending, approved, ready, rejected] = await Promise.all([
      Application.countDocuments({ userId }),
      Application.countDocuments({ userId, status: { $in: ['submitted', 'in_review'] } }),
      Application.countDocuments({ userId, status: 'approved' }),
      Application.countDocuments({ userId, status: 'ready' }),
      Application.countDocuments({ userId, status: 'rejected' })
    ])

    res.json({
      success: true,
      stats: {
        total,
        pending,
        approved,
        ready,
        rejected
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email mobile registerId')
      .populate('issuedDocumentId')

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' })
    }

    const isOwner = application.userId._id.toString() === req.user._id.toString()
    const isStaff = ['staff', 'super_admin'].includes(req.user.role)

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this application.'
      })
    }

    res.json({
      success: true,
      application
    })
  } catch (error) {
    next(error)
  }
})

export default router
