// react-apps/base/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Минимальные данные (или оставьте пустым, если данные приходят из backend)
const baseData = window.__BASE_DATA__ || {
  title: "Главная страница",
  user: null
};

const root = createRoot(document.getElementById('base-root'));
root.render(<App data={baseData} />);