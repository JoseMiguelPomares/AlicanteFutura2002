import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/models': {
        target: 'https://huggingface.co/datasets/Xenova/transformers.js/resolve/main/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/models/, ''),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@xenova/transformers']
  }
});