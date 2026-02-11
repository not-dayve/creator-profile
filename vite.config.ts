import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from '@bangjelkoski/vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    minify: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
  },
});
