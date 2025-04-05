import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const reactData = window.__REACT_DATA__ || {
  loc: [],
  date_to: [],
  date_out: [],
  gost: [],
  wait: [],
  cost: [],
  rec: [],
  total_score: "0"
};

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App data={reactData} />);