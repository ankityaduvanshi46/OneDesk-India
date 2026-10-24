import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2
} from 'lucide-react'
import SEOHead from '../components/SEOHead'
import { PUBLISHED_BLOG_ARTICLES, BLOG_STRATEGY_ROADMAP } from '../data/blogPosts'

export default function BlogPage() {
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')

  const categories = ['All', 'Identity', 'Tax & Finance', 'Welfare', 'Transport', 'Healthcare']

  const filteredArticles = useMemo(() => {
    return PUBLISHED_BLOG_ARTICLES.filter((post) => {
      const matchCat = selectedCat === 'All' || post.category === selectedCat
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase()) ||
        post.targetKeyword.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [query, selectedCat])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <SEOHead
        title="Citizen Guides & Government Portal Procedures"
        description="Comprehensive, verified step-by-step citizen guides for Indian public services. Aadhaar update, PAN linking, Ration card, Driving Licence, and Ayushman Bharat."
        canonical="/blog"
        keywords={['government portal guides', 'aadhaar address update online', 'pan aadhaar link guide', 'ration card online apply 2026', 'parivahan dl renewal']}
      />

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official Procedure Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tight">
          Indian Citizen Guides & Legal Procedures
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Clear, jargon-free step-by-step walkthroughs to help you navigate India’s public portals without scams, middleman commissions, or confusing bureaucracy.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl luxury-glass border border-gray-100 dark:border-royal-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-royal-900 text-white dark:bg-gold-500 dark:text-royal-950 shadow-md'
                  : 'bg-white dark:bg-royal-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides (e.g. Aadhaar, PAN)..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
          />
        </div>
      </div>

      {/* Published Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, idx) => (
          <motion.article
            key={article.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="flex flex-col justify-between p-6 rounded-3xl luxury-glass border border-gray-100 dark:border-royal-800 hover:border-saffron/40 hover:shadow-xl transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-saffron transition-colors leading-snug">
                <Link to={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-royal-800 flex items-center justify-between">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Updated Oct 2026</span>
              </div>
              <Link
                to={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-royal-900 dark:text-gold-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {/* 20-Article Strategic Content Plan for Google Ranking */}
      <section className="pt-10 border-t border-gray-200 dark:border-royal-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-saffron" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white">
                National Content Plan & Search Query Index
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Top 20 high-volume search queries mapped to verified government service procedures.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 bg-blue-50 dark:bg-royal-800 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-royal-700">
            5 Published • 15 in Active Queue
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-royal-800 luxury-glass">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-royal-850 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-royal-800">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">Target Citizen Query</th>
                <th className="p-3.5">Target Keyword</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Est. Monthly Searches</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-royal-800 text-gray-700 dark:text-gray-300">
              {BLOG_STRATEGY_ROADMAP.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-royal-800/40">
                  <td className="p-3.5 font-mono text-gray-400">{item.id}</td>
                  <td className="p-3.5 font-medium text-gray-900 dark:text-white">
                    {item.status === 'published' ? (
                      <Link to={`/blog/${item.slug}`} className="hover:text-saffron underline decoration-dotted">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-gray-500 dark:text-gray-400">{item.targetKeyword}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-royal-800 font-semibold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{item.searchVolume}</td>
                  <td className="p-3.5">
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">In Pipeline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
