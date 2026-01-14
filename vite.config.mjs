import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174, // Different from silk and backend
    proxy: {
      '/silk/dist': {
        target: 'http://localhost:5173',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  publicDir: '.', // Serve all files in root
  build: {
    outDir: 'dist',
  },
});
