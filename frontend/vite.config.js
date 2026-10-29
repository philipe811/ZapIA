import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The sandbox preview proxies port 3000 publicly and reaches the dev server with a
// rotating sandbox hostname, so that hostname has to be allowed explicitly.
// Only active inside the Base44 sandbox (BASE44_PREVIEW_MODE=1).
const sandboxHosts = []
if (process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_SANDBOX_HOST_DOMAIN) {
  sandboxHosts.push(`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`)
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['localhost', '.localhost', ...sandboxHosts],
    proxy: {
      // Single origin: the browser only ever talks to the Vite server,
      // which forwards /api/* to the FastAPI service.
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
