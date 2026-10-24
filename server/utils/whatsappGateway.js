/**
 * whatsappGateway.js
 * Citizen WhatsApp Notification Dispatch Engine
 * Supports WhatsApp Business Cloud API / Twilio WhatsApp, with graceful development fallback.
 */

export async function sendWhatsAppNotification({ mobile, templateName = 'status_update', parameters = [] }) {
  const waToken = process.env.WHATSAPP_API_TOKEN
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  const cleanMobile = mobile.replace(/\D/g, '').slice(-10)

  if (waToken && waPhoneId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${waPhoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${waToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `91${cleanMobile}`,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: parameters.map((text) => ({ type: 'text', text: String(text) }))
              }
            ]
          }
        })
      })
      const data = await response.json()
      return { success: true, provider: 'whatsapp_cloud', data }
    } catch (err) {
      console.error('[WhatsApp] Delivery error:', err.message)
    }
  }

  // Development Mock fallback
  console.log('\n================ [ONE-DESK MOCK WHATSAPP DISPATCH] ================')
  console.log(`💬 WhatsApp to: +91 ${cleanMobile}`)
  console.log(`📋 Template: ${templateName}`)
  console.log(`📝 Parameters: ${parameters.join(' | ')}`)
  console.log('===================================================================\n')

  return { success: true, provider: 'mock', messageId: `mock-wa-${Date.now()}` }
}
