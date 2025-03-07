import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
  alias: {
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@contexts': path.resolve(__dirname, 'src/contexts'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  },
},
});
