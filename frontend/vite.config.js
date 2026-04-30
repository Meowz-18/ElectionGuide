import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite configuration for VoteWise frontend.
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Build optimizations for production performance
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },

  // Dev server configuration
  server: {
    port: 5173,
    strictPort: true,
  },

  // Test configuration (Vitest)
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/firebase.js', 'src/constants/**'],
    },
  },
});
