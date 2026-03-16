import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.VITE_BASE || '/ebsic/',
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
        const src = resolve(__dirname, 'dist/index.html')
        if (!existsSync(src)) return
        copyFileSync(src, resolve(__dirname, 'dist/404.html'))
        const resultsDir = resolve(__dirname, 'dist/results')
        mkdirSync(resultsDir, { recursive: true })
        copyFileSync(src, resolve(resultsDir, 'index.html'))
      },
    },
  ],
})
