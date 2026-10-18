import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="tricolour-bar" />
      <Navbar />
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
