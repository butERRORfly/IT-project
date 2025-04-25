import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        map: path.resolve(__dirname, 'react-apps/map/index.jsx'),
        base: path.resolve(__dirname, 'react-apps/base/index.jsx'),
        // Добавьте другие шаблоны: login, profile и т.д.
      },
      output: {
        entryFileNames: 'bundle-[name].js',  // Итоговые файлы: bundle-map.js, bundle-base.js
        format: 'esm',
        dir: 'static',  // Папка для бандлов (совместимо с вашей текущей структурой)
      },
    },
  },
});