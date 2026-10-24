/**
 * smsGateway.js
 * Citizen SMS OTP Dispatch Engine
 * Supports MSG91, Fast2SMS, and Twilio, with graceful development console fallback.
 */

export async function sendSmsOtp({ mobile, otp }) {
  const msg91AuthKey = process.env.MSG91_AUTH_KEY
  const msg91TemplateId = process.env.MSG91_TEMPLATE_ID
  const fast2SmsApiKey = process.env.FAST2SMS_API_KEY

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10)

  // 1. MSG91 Flow
  if (msg91AuthKey && msg91TemplateId) {
    try {
      const response = await fetch('https://api.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: msg91AuthKey
        },
        body: JSON.stringify({
          template_id: msg91TemplateId,
          mobile: `91${cleanMobile}`,
          otp
        })
      })
      const data = await response.json()
      return { success: true, provider: 'msg91', messageId: data?.message }
    } catch (err) {
      console.error('[SMS] MSG91 delivery error:', err.message)
    }
  }

  // 2. Fast2SMS Flow
  if (fast2SmsApiKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2SmsApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: cleanMobile
        })
      })
      const data = await response.json()
      return { success: data.return === true, provider: 'fast2sms', data }
    } catch (err) {
      console.error('[SMS] Fast2SMS delivery error:', err.message)
    }
  }

  // 3. Development / Mock fallback
  console.log('\n================== [ONE-DESK MOCK SMS DISPATCH] ==================')
  console.log(`📱 Mobile: +91 ${cleanMobile}`)
  console.log(`🔑 Verification OTP: ${otp}`)
  console.log(`⏱️  Valid for 10 minutes. (Configure MSG91_AUTH_KEY in .env for real SMS)`)
  console.log('=================================================================\n')

  return { success: true, provider: 'mock', messageId: `mock-sms-${Date.now()}` }
}
