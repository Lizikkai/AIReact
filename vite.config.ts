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
      '@': resolve(__dirname, './src'),
    }
  }
})
