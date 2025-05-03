import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mapData = window.__MAP_DATA__ || {
  loc: [],
  date_to: [],
  date_out: [],
  gost: [],
  wait: [],
  cost: [],
  rec: [],
  total_score: "0"
};

const root = ReactDOM.createRoot(document.getElementById('map-root'));
root.render(<App data={mapData} />);