import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// base: '/TNCFL/' — this is a project-page GitHub Pages repo (hellohanh/TNCFL),
// served at https://hellohanh.github.io/TNCFL/, not a username.github.io root
// repo. Every asset path Vite emits needs this prefix or they 404 once deployed.
export default defineConfig({
  base: '/TNCFL/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon192.png', 'icon512.png'],
      manifest: {
        // Reuses the old hub's real icon files (icon192.png/icon512.png,
        // already in public/) and branding colors — only the name/short_name
        // changed to reflect the new Record Book, not a redesign.
        name: 'Thursday Night Curse Record Book',
        short_name: 'TNCFL Record Book',
        description: '15 seasons of Thursday Night Curse Fantasy Football — scores, records, Hall of Fame.',
        start_url: '/TNCFL/',
        display: 'standalone',
        background_color: '#111111',
        theme_color: '#111111',
        orientation: 'any',
        icons: [
          { src: 'icon192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
