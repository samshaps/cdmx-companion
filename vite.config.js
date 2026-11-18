import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Trip Companion',
        short_name: 'Trip',
        description: 'Everything your group needs for the trip, in one place',
        theme_color: '#1A535C',
        background_color: '#FFF5E6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,json,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/open\.er-api\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'exchange-rate',
              expiration: { maxAgeSeconds: 14400 }
            }
          }
        ]
      }
    })
  ]
})
