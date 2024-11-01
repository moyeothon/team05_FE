import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/diary': {
        target: 'http://junyeongan.store',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
