import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../static/react', // Куда складывать сборку (в папку static FastAPI)
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        entryFileNames: `bundle.js`, // Единый бандл
      },
    },
  },
});