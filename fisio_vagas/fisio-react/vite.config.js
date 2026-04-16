import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toda chamada para /api/* é redirecionada para a API real 
      // O Vite faz a requisição server-side, contornando o CORS do browser
      '/api': {
        target: 'https://hmintranet.crefito11.gov.br',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // mantém /api/v1/... intacto
      }
    }
  }
})
