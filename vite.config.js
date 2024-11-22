import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: './index.html',
        background: './src/background.js',
        content: './src/scripts/content.js'
      },
      output: {
        entryFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
    },
  },
});
