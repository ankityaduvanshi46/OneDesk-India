import fs from 'fs'
import path from 'path'
import { services } from '../src/data/services.js'
import { PUBLISHED_BLOG_ARTICLES } from '../src/data/blogPosts.js'

const DOMAIN = 'https://onedesk-india.vercel.app'
const today = new Date().toISOString().split('T')[0]

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/services', priority: '0.9', changefreq: 'daily' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/wizard', priority: '0.8', changefreq: 'weekly' },
  { url: '/quick-links', priority: '0.8', changefreq: 'weekly' },
  { url: '/scam-check', priority: '0.8', changefreq: 'weekly' },
  { url: '/verify-document', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/refund-policy', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.7', changefreq: 'monthly' },
  { url: '/terms', priority: '0.7', changefreq: 'monthly' },
  { url: '/disclaimer', priority: '0.7', changefreq: 'monthly' }
]

const serviceRoutes = services.map((s) => ({
  url: `/services/${s.id}`,
  priority: s.trending ? '0.9' : '0.8',
  changefreq: 'weekly'
}))

const blogRoutes = PUBLISHED_BLOG_ARTICLES.map((b) => ({
  url: `/blog/${b.slug}`,
  priority: '0.8',
  changefreq: 'weekly',
  lastmod: b.lastUpdated || today
}))

const allRoutes = [...staticRoutes, ...serviceRoutes, ...blogRoutes]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${DOMAIN}${r.url}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

const outputPath = path.resolve('public/sitemap.xml')
fs.writeFileSync(outputPath, sitemapXml.trim())
console.log(`✅  Generated sitemap with ${allRoutes.length} URLs at ${outputPath}`)
