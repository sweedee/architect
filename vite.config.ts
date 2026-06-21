import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://<owner>.github.io/architect/ on GitHub Pages, but from
// the root path during local dev/preview.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/architect/' : '/',
  plugins: [react()],
}))
