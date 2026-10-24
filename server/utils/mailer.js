import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (user && pass && host) {
    transporter = nodemailer.createTransporter({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    })
  } else {
    transporter = {
      sendMail: async (options) => {
        console.log('\n================== [ONE-DESK MOCK EMAIL DISPATCH] ==================')
        console.log(`To: ${options.to}`)
        console.log(`Subject: ${options.subject}`)
        if (options.text) console.log(`Text: ${options.text}`)
        if (options.attachments?.length) {
          console.log(`Attachments: ${options.attachments.map((a) => a.filename).join(', ')}`)
        }
        console.log('===================================================================\n')
        return { messageId: 'mock-' + Date.now() }
      }
    }
  }

  return transporter
}

export async function sendOtpEmail({ email, name, code, type }) {
  const t = getTransporter()
  const from = process.env.SMTP_FROM || 'OneDesk India <noreply@onedesk.india.gov.in>'

  let title = 'Verification Code'
  let description = 'Use the 6-digit one-time password below to complete your verification.'

  if (type === 'password_reset') {
    title = 'Password Reset Request'
    description = 'Use the one-time code below to reset your OneDesk account password.'
  } else if (type === 'admin_2fa') {
    title = 'Administrative Two-Factor Code'
    description = 'Security verification code for administrative panel access.'
  }

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0B132B; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">OneDesk India</h1>
        <p style="color: #D4AF37; margin: 4px 0 0; font-size: 13px;">Official Citizen Services & Document Platform</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="color: #1e293b; font-size: 16px; margin-top: 0;">Namaste <strong>${name || 'Citizen'}</strong>,</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">${description}</p>
        
        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; background: #F8FAFC; border: 2px dashed #D4AF37; padding: 14px 32px; border-radius: 10px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0B132B;">${code}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 8px;">Valid for 10 minutes. Do not share this code with anyone.</p>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">If you did not request this verification code, please ignore this email or contact OneDesk Support immediately.</p>
      </div>
      <div style="background: #F1F5F9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        OneDesk India Citizen Hub • Unofficial National Direct Gateway • Verified Official Portals
      </div>
    </div>
  `

  return t.sendMail({
    from,
    to: email,
    subject: `OneDesk India: ${title} [${code}]`,
    text: `Your OneDesk India ${title} is: ${code}. Valid for 10 minutes.`,
    html
  })
}

export async function sendApplicationStatusEmail({ email, name, applicationNo, serviceName, status, remarks }) {
  const t = getTransporter()
  const from = process.env.SMTP_FROM || 'OneDesk India <noreply@onedesk.india.gov.in>'

  const statusColors = {
    submitted: '#0284c7',
    in_review: '#d97706',
    approved: '#059669',
    ready: '#16a34a',
    rejected: '#dc2626',
    action_required: '#ea580c'
  }

  const statusLabels = {
    submitted: 'Application Submitted',
    in_review: 'Under Officer Review',
    approved: 'Application Approved',
    ready: 'Document Issued & Ready for Download',
    rejected: 'Application Rejected',
    action_required: 'Correction / Document Re-upload Needed'
  }

  const badgeColor = statusColors[status] || '#475569'
  const badgeLabel = statusLabels[status] || status.toUpperCase()

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0B132B; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">OneDesk India</h1>
        <p style="color: #D4AF37; margin: 4px 0 0; font-size: 13px;">Application Status Notification</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="color: #1e293b; font-size: 16px; margin-top: 0;">Namaste <strong>${name}</strong>,</p>
        <p style="color: #475569; font-size: 14px;">Your application for <strong>${serviceName}</strong> has been updated:</p>
        
        <div style="background: #F8FAFC; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 13px; color: #64748b;">Application Number:</span>
            <strong style="font-size: 14px; color: #0B132B;">${applicationNo}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 13px; color: #64748b;">Current Status:</span>
            <span style="display: inline-block; background: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 20px;">
              ${badgeLabel}
            </span>
          </div>
          ${
            remarks
              ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #334155;">
                   <strong>Officer Notes:</strong> ${remarks}
                 </div>`
              : ''
          }
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.5;">You can check the live timeline, track updates, and download your documents anytime from your Citizen Dashboard.</p>
      </div>
    </div>
  `

  return t.sendMail({
    from,
    to: email,
    subject: `OneDesk India: Application ${applicationNo} – ${badgeLabel}`,
    text: `Your application ${applicationNo} for ${serviceName} is now: ${badgeLabel}. Remarks: ${remarks || 'None'}`,
    html
  })
}

export async function sendDocumentDeliveryEmail({ email, name, serviceName, documentTitle, verificationId, downloadUrl, pdfBuffer, pdfFileName }) {
  const t = getTransporter()
  const from = process.env.SMTP_FROM || 'OneDesk India <noreply@onedesk.india.gov.in>'

  const attachments = []
  if (pdfBuffer && pdfFileName) {
    attachments.push({
      filename: pdfFileName,
      content: pdfBuffer,
      contentType: 'application/pdf'
    })
  }

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0B132B; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">OneDesk India</h1>
        <p style="color: #10B981; margin: 4px 0 0; font-weight: bold; font-size: 14px;">✓ Document Issued & Verified</p>
      </div>
      <div style="padding: 32px 24px;">
        <p style="color: #1e293b; font-size: 16px; margin-top: 0;">Namaste <strong>${name}</strong>,</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Congratulations! Your request for <strong>${serviceName}</strong> has been successfully processed and your official digital certificate/document is ready.</p>
        
        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <h3 style="color: #166534; margin: 0 0 8px; font-size: 18px;">${documentTitle}</h3>
          <p style="color: #15803d; font-size: 13px; margin: 0 0 16px;">Tamper-Proof Verification ID: <strong>${verificationId}</strong></p>
          ${
            downloadUrl
              ? `<a href="${downloadUrl}" style="display: inline-block; background: #0B132B; color: #D4AF37; text-decoration: none; font-weight: bold; padding: 12px 28px; border-radius: 8px; font-size: 14px; border: 1px solid #D4AF37;">Download Digital Certificate (PDF)</a>`
              : ''
          }
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">This certificate has been issued with an official digital signature and a secure QR code that can be verified by any authority at <strong>${process.env.CLIENT_URL || 'https://onedesk-india.vercel.app'}/verify-document</strong>.</p>
      </div>
    </div>
  `

  return t.sendMail({
    from,
    to: email,
    subject: `OneDesk India: Your Official Document [${verificationId}] is Ready`,
    text: `Your ${documentTitle} (Verification ID: ${verificationId}) has been issued. Download it from your dashboard.`,
    html,
    attachments
  })
}
