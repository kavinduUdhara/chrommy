import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: './index.html',
        background: './src/background.js', // Ensure correct path here
        content: './src/content-script.jsx' // Ensure correct path here
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  },
});
