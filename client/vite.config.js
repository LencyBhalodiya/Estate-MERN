import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
      },
    },
  },
  build: { chunkSizeWarningLimit: 1600},
  plugins: [react()],
  resolve: {
    alias: [{ find: '@components', replacement: '/src/components' }, { find: '@pages', replacement: '/src/pages' }],
  },
})
