import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In local dev, mimic the /api serverless functions with a proxy that adds the
// key server-side. WEATHER_API_KEY has no VITE_ prefix, so it is never bundled.
function weatherProxy(endpoint, key) {
  return {
    target: 'https://api.weatherapi.com',
    changeOrigin: true,
    rewrite: (path) => {
      const url = new URL(path, 'http://localhost')
      url.pathname = `/v1/${endpoint}.json`
      url.searchParams.set('key', key)
      return url.pathname + url.search
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/current': weatherProxy('current', env.WEATHER_API_KEY),
        '/api/search': weatherProxy('search', env.WEATHER_API_KEY),
      },
    },
  }
})
