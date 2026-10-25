import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon-48x48.png',
        'apple-touch-icon.png',
        'robots.txt',
        'logo.svg',
        'logo.png',
        'icon-192.png',
        'icon-512.png'
      ],
      manifest: {
        name: 'OneDesk India',
        short_name: 'OneDesk',
        description: 'One-stop directory of direct links to Indian government services',
        theme_color: '#FF6B35',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'favicon-48x48.png', sizes: '48x48', type: 'image/png' },
          { src: 'favicon.svg', sizes: '192x192 512x512', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: { '@': '/src' }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          i18n: ['react-i18next', 'i18next'],
          search: ['fuse.js'],
          state: ['zustand']
        }
      }
    }
  }
})
