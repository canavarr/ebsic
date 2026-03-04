import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: process.env.VITE_BASE || '/ebsic/',
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        const src = resolve(__dirname, 'dist/index.html')
        const dest = resolve(__dirname, 'dist/404.html')
        if (existsSync(src)) {
          copyFileSync(src, dest)
        }
      },
    },
  ],
})
