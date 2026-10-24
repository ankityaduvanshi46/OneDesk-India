import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Sparkles, ExternalLink, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const KNOWLEDGE_BASE = [
  {
    triggers: ['aadhaar', 'aadhar', 'आधार', 'uidai', 'biometric', 'address update'],
    replyEn: 'For Aadhaar services: New enrolments and biometric updates require visiting an Aadhaar Seva Kendra. Address updates can be done online at myaadhaar.uidai.gov.in with proof of address or Head of Family consent.',
    replyHi: 'आधार सेवाओं के लिए: नया नामांकन और बायोमेट्रिक अपडेट के लिए आधार सेवा केंद्र जाना आवश्यक है। पता सुधार myaadhaar.uidai.gov.in पर ऑनलाइन किया जा सकता है।',
    link: '/service/aadhaar',
    linkText: 'View Aadhaar Guide'
  },
  {
    triggers: ['pan', 'pan card', 'पैन', 'income tax', 'nsdl', 'uti'],
    replyEn: 'To apply for a new PAN Card (Form 49A) or corrections, you need Proof of Identity, Address, and Date of Birth. Free instant e-PAN is available with Aadhaar OTP on the Income Tax e-Filing portal.',
    replyHi: 'नए पैन कार्ड (फॉर्म 49A) या सुधार के लिए पहचान, पता और जन्म प्रमाण पत्र आवश्यक है। आधार OTP के साथ आयकर पोर्टल पर मुफ्त तत्काल ई-पैन उपलब्ध है।',
    link: '/service/pan-card',
    linkText: 'View PAN Guide'
  },
  {
    triggers: ['voter', 'election', 'epic', 'वोटर', 'nvsp', 'eci'],
    replyEn: 'To register as a new voter or download e-EPIC card, visit voterportal.eci.gov.in (Form 6). You need an age proof, address proof, and passport photo. Processing time is usually 30 days.',
    replyHi: 'नए मतदाता के रूप में पंजीकरण या ई-एपिक डाउनलोड करने के लिए voterportal.eci.gov.in (फॉर्म 6) पर जाएं। आयु और पते का प्रमाण आवश्यक है।',
    link: '/service/voter-id',
    linkText: 'View Voter ID Guide'
  },
  {
    triggers: ['driving', 'licence', 'license', 'dl', 'ड्राइविंग', 'parivahan', 'rto', 'gaadi'],
    replyEn: 'Driving Licence process: 1) Apply for Learner Licence online at parivahan.gov.in, 2) Appear for LL test, 3) After 30 days, book driving test slot for permanent DL at your RTO.',
    replyHi: 'ड्राइविंग लाइसेंस प्रक्रिया: 1) parivahan.gov.in पर लर्नर लाइसेंस हेतु आवेदन, 2) टेस्ट उत्तीर्ण करें, 3) 30 दिनों बाद स्थाई DL का स्लॉट बुक करें।',
    link: '/service/driving-licence',
    linkText: 'View Driving Licence Guide'
  },
  {
    triggers: ['ration', 'food', 'राशन', 'nfsa', 'rashan'],
    replyEn: 'Ration cards (NFSA) are issued by State Food & Civil Supplies departments based on income criteria (APL/BPL/Antyodaya). Required documents include Aadhaar of all family members, gas connection slip, and income certificate.',
    replyHi: 'राशन कार्ड (NFSA) राज्य खाद्य विभाग द्वारा आय के आधार पर जारी किए जाते हैं। परिवार के सभी सदस्यों का आधार और आय प्रमाण पत्र आवश्यक है।',
    link: '/service/ration-card',
    linkText: 'View Ration Card Guide'
  },
  {
    triggers: ['pf', 'epfo', 'provident fund', 'uan', 'भविष्य निधि'],
    replyEn: 'Check EPF balance by sending SMS "EPFOHO UAN ENG" to 7738299899 or through the EPFO Unified Member Portal (unifiedportal-mem.epfindia.gov.in). Ensure your UAN is linked with Aadhaar and bank details.',
    replyHi: 'EPF बैलेंस 7738299899 पर "EPFOHO UAN HIN" SMS भेजकर या EPFO एकीकृत पोर्टल से जांचा जा सकता है। UAN का आधार और बैंक से लिंक होना अनिवार्य है।',
    link: '/service/epfo',
    linkText: 'View EPFO Guide'
  },
  {
    triggers: ['status', 'track', 'application', 'ट्रैक', 'स्थिति'],
    replyEn: 'You can track all your submitted applications in real-time under your OneDesk Citizen Dashboard. If you have an issued document, enter its Verification Reference in our public verification portal.',
    replyHi: 'आप अपने वनडेस्क सिटिजन डैशबोर्ड में सभी आवेदनों को लाइव ट्रैक कर सकते हैं। सत्यापन के लिए वेरिफिकेशन रेफरेंस दर्ज करें।',
    link: '/dashboard',
    linkText: 'Open Citizen Dashboard'
  }
]

export default function Chatbot() {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: isHindi
        ? 'नमस्ते! मैं वनडेस्क सिटिजन असिस्टेंट हूँ। आप सरकारी सेवाओं, दस्तावेज़ों या आवेदन स्थिति के बारे में पूछ सकते हैं।'
        : 'Namaste! I am your OneDesk Citizen Assistant. Ask me about any government service, required documents, or application status.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const quickQuestions = isHindi
    ? ['आधार अपडेट कैसे करें?', 'पैन कार्ड आवश्यक दस्तावेज़', 'ड्राइविंग लाइसेंस प्रक्रिया', 'आवेदन की स्थिति']
    : ['How to update Aadhaar?', 'PAN card documents required', 'Driving licence process', 'Track application']

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query) return

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Rule-based instant answer resolution
    const lower = query.toLowerCase()
    const matched = KNOWLEDGE_BASE.find((k) =>
      k.triggers.some((t) => lower.includes(t))
    )

    setTimeout(() => {
      let botResponse
      if (matched) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isHindi ? matched.replyHi : matched.replyEn,
          link: matched.link,
          linkText: matched.linkText,
          timestamp: new Date()
        }
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isHindi
            ? 'मैं समझ गया। आप हमारी सेवाओं की पूरी सूची देख सकते हैं या नागरिक सहायता टिकट दर्ज कर सकते हैं।'
            : 'I can assist you with that. You can explore our catalog of 80+ official portals or open a citizen support ticket for personalized assistance.',
          link: '/services',
          linkText: isHindi ? 'सभी सेवाएं देखें' : 'Browse All Services',
          timestamp: new Date()
        }
      }
      setMessages((prev) => [...prev, botResponse])
    }, 450)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-saffron via-amber-500 to-gold-500 text-white shadow-luxury hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/30"
          aria-label="Open OneDesk Citizen AI Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
        </button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-w-sm h-[520px] bg-white dark:bg-royal-850 rounded-2xl shadow-2xl border border-gold-500/30 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-royal-900 text-white p-4 border-b border-gold-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/40">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                    <span>OneDesk Citizen Assistant</span>
                    <Sparkles className="w-3 h-3 text-gold-400" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Helpdesk</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${
                    m.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center shrink-0 mt-0.5 border border-gold-500/30">
                      <Bot className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-saffron to-gold-500 text-white rounded-tr-none shadow-sm'
                        : 'bg-gray-100 dark:bg-royal-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/50 dark:border-royal-700/60'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.link && (
                      <Link
                        to={m.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-600 dark:text-gold-400 hover:underline mt-2 pt-1 border-t border-gray-200/60 dark:border-royal-700 block"
                      >
                        <span>{m.linkText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-royal-800 text-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-1.5 border-t border-gray-100 dark:border-royal-800 bg-gray-50 dark:bg-royal-900/60 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-royal-800 border border-gray-200 dark:border-royal-700 text-gray-700 dark:text-gray-300 whitespace-nowrap hover:border-gold-500/50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-2.5 border-t border-gray-100 dark:border-royal-800 bg-white dark:bg-royal-850 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isHindi ? 'पूछें (हिंदी या English)...' : 'Ask anything...'}
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-gold-500 text-royal-950 font-bold hover:bg-gold-400 disabled:opacity-40 transition-all shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
