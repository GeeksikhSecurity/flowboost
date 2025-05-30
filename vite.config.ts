import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      external: ['@supabase/supabase-js'],
      output: {
        manualChunks: {
          'lucide-icons': ['lucide-react']
        }
      }
    }
  }
});