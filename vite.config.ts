import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000
  },
  build: {
    rollupOptions: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          const vendor = id.split("node_modules/")[1].split("/")[0];
          return `vendor.${vendor}`;
        }
      }
    }
  }
})
