import react from '@vitejs/plugin-react';
import path from "path";
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react()],
  base: "/plastic_origin_carto/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@context': '/src/context',
      '@components': '/src/components',
      '@services': '/src/services',
      '@types': '/src/types',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
    }
  }
})