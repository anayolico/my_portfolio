import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://anayolico.name.ng',
      dynamicRoutes: [
        '/',
        '/about',
        '/projects',
        '/skills',
        '/contact'
      ]
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
