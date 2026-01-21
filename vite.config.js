import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Only use /numble/ base for GitHub Pages (when GITHUB_PAGES env is set)
  const isGitHubPages = process.env.GITHUB_PAGES === 'true'
  
  return {
    plugins: [react()],
    base: isGitHubPages ? '/numble/' : '/',
    server: {
      host: true,
      port: 5173
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})
