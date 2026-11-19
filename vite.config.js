import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development, requests to /api and /uploads are forwarded to the
// Express backend, so the frontend never needs to know the backend address.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
