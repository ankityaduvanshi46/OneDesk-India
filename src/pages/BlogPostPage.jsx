import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Share2,
  ChevronDown,
  FileText,
  AlertTriangle,
  Sparkles,
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'
import SEOHead from '../components/SEOHead'
import { PUBLISHED_BLOG_ARTICLES } from '../data/blogPosts'
import { useAppStore } from '../store/useAppStore'

export default function BlogPostPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getAllServices } = useAppStore()

  const article = PUBLISHED_BLOG_ARTICLES.find((p) => p.slug === slug)
  const [openFaq, setOpenFaq] = useState(null)

  if (!article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">📄</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Citizen Guide Not Found</h1>
        <p className="text-gray-500">The guide you are looking for has been updated or moved.</p>
        <Link to="/blog" className="btn-luxury inline-block">
          Browse All Guides
        </Link>
      </div>
    )
  }

  const relatedService = article.relatedServiceId
    ? getAllServices().find((s) => s.id === article.relatedServiceId)
    : null

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Guide link copied to clipboard!')
    }
  }

  // Schema for Article, BreadcrumbList, FAQPage
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.lastUpdated,
    author: {
      '@type': 'Organization',
      name: article.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: 'OneDesk India',
      logo: {
        '@type': 'ImageObject',
        url: 'https://onedesk-india.vercel.app/logo.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://onedesk-india.vercel.app/blog/${article.slug}`
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://onedesk-india.vercel.app/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Citizen Guides',
        item: 'https://onedesk-india.vercel.app/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://onedesk-india.vercel.app/blog/${article.slug}`
      }
    ]
  }

  const faqSchema = article.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    : null

  const pageSchemas = [articleSchema, breadcrumbSchema, faqSchema].filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonical={`/blog/${article.slug}`}
        ogType="article"
        keywords={[article.targetKeyword, article.category, 'how to', 'online process', 'government portal']}
        schema={pageSchemas}
      />

      {/* Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-saffron transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/blog" className="hover:text-saffron transition-colors">Guides</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-xs">{article.category}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] bg-saffron/10 text-saffron border border-saffron/20">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last Updated: {article.lastUpdated}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          {article.summary}
        </p>

        {/* E-E-A-T Author & Verification Card */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-royal-850 border border-gray-100 dark:border-royal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-royal-900 dark:bg-royal-800 text-gold-400 font-bold flex items-center justify-center text-sm border border-gold-500/30">
              ⚖️
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>{article.author.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">{article.author.role}</div>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-royal-800 border border-gray-200 dark:border-royal-700 text-xs font-semibold hover:border-saffron/40 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Guide</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <article className="prose dark:prose-invert max-w-none text-sm sm:text-base text-gray-700 dark:text-gray-300 space-y-6 leading-relaxed">
        {article.content.split('\n\n').map((block, i) => {
          const trimmed = block.trim()
          if (!trimmed) return null

          if (trimmed.startsWith('### ')) {
            return (
              <h2 key={i} className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white pt-4 border-t border-gray-100 dark:border-royal-800">
                {trimmed.replace('### ', '')}
              </h2>
            )
          }

          if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- '))
            return (
              <ul key={i} className="space-y-2 my-3 pl-4 list-disc marker:text-saffron">
                {items.map((it, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <span dangerouslySetInnerHTML={{ __html: it.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ul>
            )
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const steps = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()))
            return (
              <ol key={i} className="space-y-3 my-4 pl-4 list-decimal marker:font-bold marker:text-saffron">
                {steps.map((st, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pl-1">
                    <span dangerouslySetInnerHTML={{ __html: st.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </li>
                ))}
              </ol>
            )
          }

          return (
            <p key={i} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/`([^`]+)`/g, '<code class="font-mono bg-gray-100 dark:bg-royal-800 px-1 py-0.5 rounded text-xs text-saffron">$1</code>') }} />
            </p>
          )
        })}
      </article>

      {/* Direct Service Facilitation CTA */}
      {relatedService && (
        <div className="p-6 rounded-3xl luxury-glass border border-gold-500/30 shadow-luxury space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gold-500 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Official Portal Link & Facilitation</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{relatedService.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Verified official domain: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{new URL(relatedService.url).hostname}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-col sm:flex-row">
              <Link
                to={`/services/${relatedService.id}`}
                className="w-full sm:w-auto btn-luxury px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>View Full Service Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={relatedService.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto btn-luxury-outline px-5 py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Open Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      {article.faqs?.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-gray-100 dark:border-royal-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {article.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-royal-750 rounded-2xl overflow-hidden bg-white dark:bg-royal-850/60"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:text-saffron transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-saffron' : 'text-gray-400'}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-royal-800 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sovereign Legal Disclaimer */}
      <footer className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-300/90 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <span className="font-bold">Official Disclaimer: </span>
          This citizen guide is published by OneDesk India for educational and legal literacy purposes. OneDesk India is an independent private facilitation platform and is not affiliated with UIDAI, Parivahan, NHA, or the Government of India. Official rules and fees are governed by the respective sovereign ministries.
        </div>
      </footer>
    </div>
  )
}
