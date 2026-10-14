import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    preview: { allowedHosts: env.VITE_PREVIEW_HOST ? [env.VITE_PREVIEW_HOST] : [] },
  }
})
