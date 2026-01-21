import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use /numble/ base only in production (for GitHub Pages)
  base: mode === 'production' ? '/numble/' : '/',
  server: {
    host: true,
    port: 5173
  }
}))
