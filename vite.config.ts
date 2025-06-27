// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],

//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4173,
    allowedHosts: [
      'swapspot-tl8c.onrender.com',  // Your specific Render domain
      '.onrender.com'                // Allow all onrender.com subdomains
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})