import { defineConfig } from 'vite';

export default defineConfig({
  // Относительные пути: сайт работает на GitHub Pages в любой подпапке.
  base: './',
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
});
