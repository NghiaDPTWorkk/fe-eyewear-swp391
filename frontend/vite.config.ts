import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const apiTarget = env.VITE_API_URL || 'https://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: 'localhost',
      port: 3000,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/'
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
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'react-vendor'
              if (id.includes('react-router')) return 'router'
              if (id.includes('zustand')) return 'state'
              return 'vendor'
            }
          }
        }
      }
    }
  }
})
