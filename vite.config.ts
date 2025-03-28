import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api/v1': {
        target: "http://localhost:9999",
        changeOrigin: true,
        rewrite: (path) => path
      }
    },
    cors: true,
    port: 4728,
  },
  resolve: {
    alias: {
      '@/pages': resolve(__dirname, '.', 'src/pages'),
      '@/components': resolve(__dirname, '.','src/components'),
      '@/assets': resolve(__dirname, '.','src/assets'),
      '@/utils': resolve(__dirname, '.','src/utils'),
      '@/hooks': resolve(__dirname, '.','src/hooks'),
      '@/router': resolve(__dirname, '.','src/router'),
      '@/store': resolve(__dirname, '.','src/store'),
      '@/types': resolve(__dirname, '.','src/types'),
    }
  }
})
