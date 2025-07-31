import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Lazy import lovable-tagger only in development to avoid production build issues
  let devPlugins = [];
  if (mode === 'development') {
    try {
      const componentTagger = require('lovable-tagger/plugin');
      devPlugins.push(componentTagger());
    } catch (err) {
      console.warn('⚠ lovable-tagger not installed, skipping in dev mode');
    }
  }

  return {
    plugins: [
      react(),
      ...devPlugins
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
