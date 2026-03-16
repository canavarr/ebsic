import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const base = process.env.VITE_BASE || '/ebsic/'
const outDir = base === '/ebsic/' ? 'dist/ebsic' : 'dist'

export default defineConfig({
  base,
  build: { outDir },
  server: {
    port: 5176,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src/advanced') },
  },
  plugins: [
    react(),
    {
      name: 'spa-routes',
      closeBundle() {
        const src = resolve(__dirname, outDir, 'index.html')
        if (!existsSync(src)) return
        const distRoot = resolve(__dirname, 'dist')
        copyFileSync(src, resolve(distRoot, '404.html'))
        const resultsDir = resolve(distRoot, 'ebsic', 'results')
        mkdirSync(resultsDir, { recursive: true })
        copyFileSync(src, resolve(resultsDir, 'index.html'))
        if (base === '/ebsic/') {
          const redirectHtml = '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/ebsic/"><title>Redirect</title></head><body>Redirecting to <a href="/ebsic/">/ebsic/</a>...</body></html>'
          writeFileSync(resolve(distRoot, 'index.html'), redirectHtml)
        }
      },
    },
  ],
})
