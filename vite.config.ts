import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Supports custom base path via env (for repo subpaths like /navinis-travel-plan/ or /china-plan/) or relative './'
const base = process.env.VITE_BASE_PATH || './';

// https://vite.dev/config/
export default defineConfig({
  base: base,
  plugins: [
    react(),
    tailwindcss(),
  ],
})
