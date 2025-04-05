import { useState } from 'react'
import MapContainer from './MapContainer';
import PointList from './PointList';
import TotalPrice from './TotalPrice';
import SaveButton from './SaveButton';
import './App.css'

export default function App({ data }) {
  // Проверка наличия данных
  if (!data || !Array.isArray(data.loc)) {
    return (
      <div className="error-message">
        Данные не загружены или имеют неверный формат
      </div>
    );
  }

  return (
    <div className="map-page">
      <MapContainer locations={data.loc} />
      <div className="sidebar-grid">
        <TotalPrice totalScore={data.total_score} />
        <div className="overlay-container">
            <PointList data={data} />
        </div>
      </div>
      <SaveButton />
    </div>
  );
}
