import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { LifeBuoy, PlusCircle, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'

export default function SupportPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuthStore()

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('application_status')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [activeTicket, setActiveTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }

    if (isAuthenticated) {
      loadTickets()
    }
  }, [isAuthenticated, authLoading, navigate])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const res = await api.tickets.getMy()
      if (res?.success && res.tickets) {
        setTickets(res.tickets)
      }
    } catch {
      toast.error('Failed to load support inquiries.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Subject and message are required.')
      return
    }

    try {
      setSubmitting(true)
      const res = await api.tickets.create({ subject, category, message })
      if (res?.success) {
        toast.success('Support ticket created successfully!')
        setShowCreate(false)
        setSubject('')
        setMessage('')
        loadTickets()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim() || !activeTicket) return

    try {
      setSendingReply(true)
      const res = await api.tickets.reply(activeTicket._id, replyMessage.trim())
      if (res?.success && res.ticket) {
        setActiveTicket(res.ticket)
        setReplyMessage('')
        toast.success('Reply submitted.')
        loadTickets()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send reply.')
    } finally {
      setSendingReply(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Helmet>
        <title>Citizen Support Desk – OneDesk India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-gold-500" />
            <span>Citizen Facilitation & Helpdesk</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Submit inquiries, request document corrections, or receive assistance from support officers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="btn-luxury text-xs flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCreate ? 'Close Form' : 'Open Inquire Ticket'}</span>
        </button>
      </div>

      {showCreate && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateTicket}
          className="bg-white dark:bg-royal-850 p-6 rounded-2xl border border-gold-500/30 shadow-luxury space-y-4 max-w-xl mx-auto"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">Create New Inquiry</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Query regarding Income Certificate processing SLA"
              className="w-full px-3.5 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
            >
              <option value="application_status">Application Status</option>
              <option value="document_correction">Document Correction</option>
              <option value="payment_issue">Payment & Fees</option>
              <option value="technical_help">Technical Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Detailed Description *</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide your application number and clear details..."
              className="w-full px-3.5 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="btn-luxury-outline text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-luxury text-xs px-4 py-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white dark:bg-royal-850 rounded-2xl p-8 text-center border border-gray-100 dark:border-royal-700 space-y-2">
          <MessageSquare className="w-8 h-8 mx-auto text-gray-400" />
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">No active tickets</h4>
          <p className="text-xs text-gray-400">All your communications with verification officers will be logged here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((tkt) => (
            <div
              key={tkt._id}
              onClick={() => setActiveTicket(tkt)}
              className="bg-white dark:bg-royal-850 p-5 rounded-2xl border border-gray-100 dark:border-royal-700 hover:border-gold-500/40 cursor-pointer shadow-sm space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-400">#{tkt.ticketNo}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 dark:bg-royal-800 text-gray-700 dark:text-gray-300">
                  {tkt.status}
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">{tkt.subject}</h3>
              <p className="text-[11px] text-gray-400">
                {tkt.messages?.length || 0} message(s) • Last activity: {new Date(tkt.updatedAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-royal-850 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-royal-700 max-h-[85vh] flex flex-col space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-royal-700 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-gold-500">#{activeTicket.ticketNo}</span>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">{activeTicket.subject}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {activeTicket.messages?.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[85%] ${
                    msg.senderRole === 'user'
                      ? 'ml-auto bg-gold-500/15 dark:bg-royal-800 border border-gold-500/20 text-gray-800 dark:text-gray-200'
                      : 'mr-auto bg-gray-100 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span className="font-bold">{msg.senderName} ({msg.senderRole})</span>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div>{msg.message}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="pt-2 border-t border-gray-100 dark:border-royal-800 flex gap-2">
              <input
                type="text"
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
              />
              <button
                type="submit"
                disabled={sendingReply}
                className="btn-luxury py-2 px-3 text-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
