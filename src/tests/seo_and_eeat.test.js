import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { BLOG_STRATEGY_ROADMAP, PUBLISHED_BLOG_ARTICLES } from '../data/blogPosts.js'
import { services } from '../data/services.js'

describe('SEO Technical & On-Page Architecture', () => {
  it('robots.txt contains correct allow/disallow directives and sitemap URL', () => {
    const robotsPath = path.resolve('public/robots.txt')
    expect(fs.existsSync(robotsPath)).toBe(true)
    const content = fs.readFileSync(robotsPath, 'utf8')
    expect(content).toContain('User-agent: *')
    expect(content).toContain('Disallow: /admin')
    expect(content).toContain('Disallow: /dashboard')
    expect(content).toContain('Disallow: /apply')
    expect(content).toContain('Disallow: /documents')
    expect(content).toContain('Sitemap: https://onedesk-india.vercel.app/sitemap.xml')
  })

  it('sitemap.xml covers all services, blog posts, and public pages', () => {
    const sitemapPath = path.resolve('public/sitemap.xml')
    expect(fs.existsSync(sitemapPath)).toBe(true)
    const xml = fs.readFileSync(sitemapPath, 'utf8')
    expect(xml).toContain('https://onedesk-india.vercel.app/')
    expect(xml).toContain('https://onedesk-india.vercel.app/services')
    expect(xml).toContain('https://onedesk-india.vercel.app/blog')
    expect(xml).toContain('https://onedesk-india.vercel.app/about')
    expect(xml).toContain('https://onedesk-india.vercel.app/contact')
    expect(xml).toContain('https://onedesk-india.vercel.app/privacy')
    expect(xml).toContain('https://onedesk-india.vercel.app/terms')
    expect(xml).toContain('https://onedesk-india.vercel.app/disclaimer')

    // Check services are indexed with clean slugs
    expect(xml).toContain('https://onedesk-india.vercel.app/services/aadhaar')
    expect(xml).toContain('https://onedesk-india.vercel.app/services/pan-card')
    expect(xml).toContain('https://onedesk-india.vercel.app/services/passport')

    // Check published blog articles are indexed
    PUBLISHED_BLOG_ARTICLES.forEach((post) => {
      expect(xml).toContain(`https://onedesk-india.vercel.app/blog/${post.slug}`)
    })
  })

  it('validates 20-article Strategic Content Plan integrity', () => {
    expect(BLOG_STRATEGY_ROADMAP.length).toBe(20)
    BLOG_STRATEGY_ROADMAP.forEach((item) => {
      expect(item.title).toBeTruthy()
      expect(item.targetKeyword).toBeTruthy()
      expect(item.slug).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(item.searchVolume).toBeTruthy()
    })

    const published = BLOG_STRATEGY_ROADMAP.filter((item) => item.status === 'published')
    expect(published.length).toBeGreaterThanOrEqual(5)
  })

  it('enforces Google title (<60 chars) and meta description (<160 chars) on published guides', () => {
    expect(PUBLISHED_BLOG_ARTICLES.length).toBeGreaterThanOrEqual(5)

    PUBLISHED_BLOG_ARTICLES.forEach((post) => {
      expect(post.metaTitle.length).toBeLessThanOrEqual(60)
      expect(post.metaDescription.length).toBeLessThanOrEqual(160)
      expect(post.faqs.length).toBeGreaterThanOrEqual(2)
      expect(post.author.name).toBeTruthy()
      expect(post.author.role).toBeTruthy()
    })
  })

  it('verifies 301 redirects configured in vercel.json', () => {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
    expect(vercelConfig.redirects).toBeDefined()
    const legacyRedirect = vercelConfig.redirects.find((r) => r.source === '/service/:id')
    expect(legacyRedirect).toBeDefined()
    expect(legacyRedirect.destination).toBe('/services/:id')
    expect(legacyRedirect.permanent).toBe(true)
  })
})
