import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env.VITE_API_DOMAIN': JSON.stringify(process.env.VITE_API_DOMAIN || ''),
  },
  plugins: [react()],
})
