import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' zodat de site onder /port010/ op GitHub Pages werkt (en later op een eigen domein)
export default defineConfig({
  plugins: [react()],
  base: './',
})
