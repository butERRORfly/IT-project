import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        map: path.resolve(__dirname, 'react-apps/map/index.jsx'),
        base: path.resolve(__dirname, 'react-apps/base/index.jsx'),
        trips: path.resolve(__dirname, 'react-apps/trips/index.jsx'),
        // Можно добавить ещё шаблонов
      },
      output: {
        entryFileNames: 'bundle-[name].js',  // Итоговые файлы
        format: 'esm',
        dir: 'static',  // Папка для бандлов
      },
    },
  },
});