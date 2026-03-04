import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.VITE_BASE || '/ebsic/',
  plugins: [
    react(),
    // GitHub Pages: serve SPA for /leaderboard (and other 404s) so path-based routing works
    {
      name: 'copy-404',
      closeBundle() {
        const src = resolve(__dirname, 'dist/index.html')
        const dest = resolve(__dirname, 'dist/404.html')
        if (existsSync(src)) copyFileSync(src, dest)
      },
    },
  ],
})
