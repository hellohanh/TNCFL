import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Strips the `crossorigin` attribute Vite adds by default to the built
// <script>/<link> tags. Not the fix for the real blank-page bug (that was
// BrowserRouter missing a `basename` — see App.tsx) — this was a dead end
// investigated and ruled out along the way (manually importing the module
// in CORS mode from the console still succeeded). Left in as a legitimate,
// harmless simplification: this is a same-origin site, so there's no real
// reason for these same-origin asset requests to run in CORS mode.
function stripCrossorigin(): Plugin {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(=""|="[^"]*")?/g, '')
    },
  }
}

// base: '/TNCFL/' — this is a project-page GitHub Pages repo (hellohanh/TNCFL),
// served at https://hellohanh.github.io/TNCFL/, not a username.github.io root
// repo. Every asset path Vite emits needs this prefix or they 404 once deployed.
export default defineConfig({
  base: '/TNCFL/',
  plugins: [
    react(),
    stripCrossorigin(),
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
