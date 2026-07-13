import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['date-fns'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['date-fns', 'react-day-picker'],
  },
});
