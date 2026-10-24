import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'
import InstallPwaBanner from './InstallPwaBanner'
import Chatbot from './Chatbot'
import CookieBanner from './CookieBanner'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-royal-900 transition-colors duration-300">
      <div className="tricolour-bar" />
      <InstallPwaBanner />
      <Navbar />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <BottomNav />
      <Chatbot />
      <CookieBanner />
    </div>
  )
}
