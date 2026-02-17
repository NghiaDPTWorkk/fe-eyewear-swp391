import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/api': path.resolve(__dirname, './src/api'),
        '@/store': path.resolve(__dirname, './src/store'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/routes': path.resolve(__dirname, './src/routes'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/components': path.resolve(__dirname, './src/components')
      }
    }
  }
})
