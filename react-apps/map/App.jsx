import { useState } from 'react'
import MapContainer from './MapContainer';
import PointList from './PointList';
import TotalPrice from './TotalPrice';
import SaveButton from './SaveButton';
import ScriptLoader from './ScriptLoader';
import './App.css'

export default function App({ data }) {
  const [timeData, setTimeData] = useState([]); // Состояние для времени
  if (!data || !Array.isArray(data.loc)) {
    return (
      <div className="error-message">
        Данные не загружены или имеют неверный формат
      </div>
    );
  }

  return (
    <div className="map-page">
      <MapContainer locations={data.loc} connectionTypes={data.typic} onTimeDataUpdate={setTimeData}/>
      <div className="sidebar-grid">
        <TotalPrice totalScore={data.total_score} />
        <div className="overlay-container">
            <PointList data={data} timeData={timeData}/>
        </div>
      </div>
      <SaveButton />
    </div>
  );
}
