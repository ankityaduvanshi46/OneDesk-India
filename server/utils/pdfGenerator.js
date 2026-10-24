import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import fs from 'fs'
import path from 'path'

export async function generateCertificatePDF({
  verificationId,
  documentNo,
  applicationNo,
  serviceTitle,
  applicantName,
  registerId,
  mobile,
  govIdMasked,
  dateOfIssue,
  officerRemarks,
  clientUrl = 'https://onedesk-india.vercel.app'
}) {
  const qrTargetUrl = `${clientUrl}/verify-document?id=${encodeURIComponent(verificationId)}`
  const qrCodeDataUrl = await QRCode.toDataURL(qrTargetUrl, {
    margin: 1,
    width: 140,
    color: {
      dark: '#0B132B',
      light: '#FFFFFF'
    }
  })
  const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 36, bottom: 36, left: 36, right: 36 }
    })

    const buffers = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers)
      resolve(pdfData)
    })
    doc.on('error', (err) => reject(err))

    doc.rect(36, 36, 523, 770).lineWidth(2).stroke('#0B132B')
    doc.rect(42, 42, 511, 758).lineWidth(0.75).stroke('#D4AF37')

    doc.rect(42, 42, 511, 4).fill('#FF9933')
    doc.rect(42, 46, 511, 4).fill('#FFFFFF')
    doc.rect(42, 50, 511, 4).fill('#138808')

    doc.moveDown(2)
    doc.fillColor('#0B132B').fontSize(11).font('Helvetica-Bold').text('GOVERNMENT CITIZEN SERVICES ASSISTANCE HUB', { align: 'center', characterSpacing: 1 })
    doc.fillColor('#D4AF37').fontSize(22).font('Helvetica-Bold').text('OneDesk India (वनडेस्क इंडिया)', { align: 'center' })
    doc.fillColor('#475569').fontSize(9).font('Helvetica').text('Digital Verification & Citizen Services Facilitation Directorate', { align: 'center' })

    doc.moveDown(1)
    doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(60, doc.y).lineTo(535, doc.y).stroke()

    doc.moveDown(1.5)
    doc.fillColor('#059669').fontSize(14).font('Helvetica-Bold').text('OFFICIAL DIGITAL CERTIFICATE / SERVICE ATTESTATION', { align: 'center' })
    doc.fillColor('#64748b').fontSize(9).font('Helvetica-Oblique').text(`Issued under Verification Reference: ${verificationId}`, { align: 'center' })

    doc.moveDown(1.8)
    const startY = doc.y

    doc.rect(60, startY, 475, 230).fillAndStroke('#F8FAFC', '#E2E8F0')

    const leftCol = 76
    let rowY = startY + 16

    const addField = (label, value) => {
      doc.fillColor('#64748B').fontSize(9).font('Helvetica-Bold').text(label.toUpperCase(), leftCol, rowY)
      doc.fillColor('#0B132B').fontSize(10).font('Helvetica').text(value || 'N/A', leftCol + 150, rowY, { width: 290 })
      rowY += 22
    }

    addField('Certificate / Service:', serviceTitle)
    addField('Applicant Name:', applicantName)
    addField('Citizen Register ID:', registerId)
    addField('Application Number:', applicationNo)
    addField('Registered Mobile:', mobile ? `+91 ${mobile}` : 'N/A')
    addField('Identity Document:', govIdMasked || 'Verified UID/PAN Token')
    addField('Document Number:', documentNo)
    addField('Date of Issuance:', dateOfIssue || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }))
    addField('Status & Validity:', 'Digitally Authenticated (Lifetime Valid)')

    doc.y = startY + 245
    doc.moveDown(0.5)

    const remarkStartY = doc.y
    doc.rect(60, remarkStartY, 475, 45).fillAndStroke('#FFFFFF', '#E2E8F0')
    doc.fillColor('#475569').fontSize(8.5).font('Helvetica-Bold').text('OFFICER ATTESTATION & REMARKS:', 74, remarkStartY + 8)
    doc.fillColor('#0B132B').fontSize(9).font('Helvetica').text(officerRemarks || 'Application processed and approved in accordance with citizen verification standards.', 74, remarkStartY + 22, { width: 445 })

    const footerBlockY = remarkStartY + 60
    doc.image(qrBuffer, 70, footerBlockY, { width: 90, height: 90 })

    doc.fillColor('#0B132B').fontSize(10).font('Helvetica-Bold').text('Scan to Verify Legitimacy', 180, footerBlockY + 10)
    doc.fillColor('#475569').fontSize(8).font('Helvetica').text('Point any camera or QR scanner to inspect instant cryptographic audit details on the official OneDesk portal.', 180, footerBlockY + 26, { width: 220 })
    doc.fillColor('#059669').fontSize(8.5).font('Helvetica-Bold').text(`Verification ID: ${verificationId}`, 180, footerBlockY + 54)
    doc.fillColor('#64748b').fontSize(7.5).font('Helvetica').text(`Direct URL: ${qrTargetUrl}`, 180, footerBlockY + 68, { width: 230 })

    const signX = 420
    doc.strokeColor('#0B132B').lineWidth(1).moveTo(signX, footerBlockY + 55).lineTo(525, footerBlockY + 55).stroke()
    doc.fillColor('#0B132B').fontSize(9).font('Helvetica-Bold').text('Authorized Signatory', signX, footerBlockY + 60, { align: 'center', width: 105 })
    doc.fillColor('#64748B').fontSize(7.5).font('Helvetica').text('OneDesk Verification Authority', signX, footerBlockY + 72, { align: 'center', width: 105 })

    doc.rect(42, 775, 511, 20).fill('#0B132B')
    doc.fillColor('#FFFFFF').fontSize(7.5).font('Helvetica').text('This is a computer-generated electronically signed document and does not require a physical signature.', 42, 781, { align: 'center', width: 511 })

    doc.end()
  })
}
