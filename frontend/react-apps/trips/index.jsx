import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Получаем данные из data-атрибутов
const rootElement = document.getElementById('trips-root');
const tripsData = {
  routes: JSON.parse(rootElement?.dataset?.routes || '[]'),
  isAuthenticated: rootElement?.dataset?.isAuthenticated === 'true'
};

const root = createRoot(rootElement);
root.render(<App data={tripsData} />);