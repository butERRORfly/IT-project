import React from 'react';
import { useState, useEffect } from 'react'
import MapContainer from './MapContainer';
import PointList from './PointList';
import TotalPrice from './TotalPrice';
import SaveButton from './SaveButton';
import ScriptLoader from './ScriptLoader';


export default function App({ data }) {
  const [timeData, setTimeData] = useState([]); // Состояние для времени
  const [creatingNewPoint, setCreatingNewPoint] = useState(false);
  const [pointsData, setPointsData] = useState(data); // Состояние для данных точек
  const [totalScoreUSD, setTotalScoreUSD] = useState(0);

  useEffect(() => {
    // Если в данных уже есть total_score, используем его как начальное значение
    const initialTotal = parseFloat(data.total_score) || 0;
    setTotalScoreUSD(initialTotal);

    // Дополнительно пересчитываем сумму из всех точек для точности
    calculateTotalScore(data).then(sum => {
      // Используем бОльшую из сумм (из total_score или рассчитанную)
      setTotalScoreUSD(prev => Math.max(prev, sum));
    });
  }, []);

  const normalizedData = {
    loc: data.loc || [],
    date_to: data.date_to || [],
    date_out: data.date_out || [],
    gost: data.gost || [],
    wait: data.wait || [],
    cost: data.cost || [],
    rec: data.rec || [],
    air: data.air || [],
    air2: data.air2 || [],
    icao: data.icao || [],
    icao2: data.icao2 || [],
    typic: data.typic || [],
    total_score: totalScoreUSD.toString()
  };

  const calculateTotalScore = async (data) => {
    let total = 0;

    if (data.cost) {
      for (let i = 0; i < data.cost.length; i++) {
        if (data.cost[i]) {
          const [amountStr, currency] = data.cost[i].split('-');
          const amount = parseFloat(amountStr) || 0;

          if (currency.toUpperCase() === 'USD') {
            total += amount;
          } else {
            const converted = await convert(currency.toUpperCase(), 'USD', amount);
            total += parseFloat(converted) || 0;
          }
        }
      }
    }

    return total;
  };

  // Функция для обновления данных точки
  const handlePointUpdate = async (index, updatedData) => {
    const updatedPointsData = {
      ...pointsData,
      loc: [...pointsData.loc],
      typic: [...pointsData.typic],
      date_to: [...pointsData.date_to],
      date_out: [...pointsData.date_out],
      air: [...pointsData.air],
      air2: [...pointsData.air2],
      icao: [...pointsData.icao],
      icao2: [...pointsData.icao2],
      gost: [...pointsData.gost],
      cost: [...pointsData.cost],
    };
    updatedPointsData.loc[index] = updatedData.loc;
    updatedPointsData.typic[index] = updatedData.typic;
    updatedPointsData.date_to[index] = updatedData.date_to;
    updatedPointsData.date_out[index] = updatedData.date_out;
    updatedPointsData.air[index] = updatedData.air;
    updatedPointsData.air2[index] = updatedData.air2;
    updatedPointsData.icao[index] = updatedData.icao;
    updatedPointsData.icao2[index] = updatedData.icao2;
    updatedPointsData.gost[index] = updatedData.gost;
    updatedPointsData.cost[index] = updatedData.cost;

    const newTotal = await calculateTotalScore(updatedPointsData);
    setTotalScoreUSD(newTotal);
    setPointsData(updatedPointsData);
  };

  if (!data || !Array.isArray(normalizedData.loc)) {
    return <div className="error-message">Данные не загружены или имеют неверный формат</div>;
  }

  async function convert(from, to, amount) {
  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
    const data = await response.json();
    const convertedAmount = (amount * data.rates[to]).toFixed(2);
    return convertedAmount;
  } catch (error) {
    console.error('Ошибка при конвертации:', error);
    return null;
  }
}

const handleSave = async () => {
    try {
      // Подготовка данных для отправки
      const serverData = pointsData.loc.map((_, index) => ({
        place: pointsData.loc[index] || '!',
        to: pointsData.date_to[index] || '!',
        out: pointsData.date_out[index] || '!',
        airto: pointsData.air[index] || '!',
        airout: pointsData.air2[index] || '!',
        icao: pointsData.icao[index] || '!',
        icao1: pointsData.icao2[index] ||  null,
        hotel: pointsData.gost[index] || '!',
        price: pointsData.cost[index] || '0-USD',
        type: pointsData.typic[index] || 'poliline'
      }));

      // Отправка на сервер
      const response = await fetch('http://127.0.0.1:8000/api/v1/app/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData)
      });

      if (response.ok) {
        window.location.href = '/api/v1/';
      } else {
        console.error('Ошибка при сохранении');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className="map-page">
      <MapContainer
        locations={pointsData.loc}
        connectionTypes={pointsData.typic}
        onTimeDataUpdate={setTimeData}
        creatingNewPoint={creatingNewPoint}
        setCreatingNewPoint={setCreatingNewPoint}
      />
      <div className="sidebar-grid">
        <TotalPrice totalScore={normalizedData.total_score} />
        <div className="overlay-container">
          <PointList data={normalizedData} timeData={timeData} onPointUpdate={handlePointUpdate}/>
          <button
            className="booking-btn"
            onClick={() => setCreatingNewPoint(true)}
            disabled={creatingNewPoint}
            style={{ cursor: creatingNewPoint ? 'not-allowed' : 'pointer' }}
          >
            Добавить точку →
          </button>
        </div>
      </div>
      <SaveButton onSave={handleSave} />
    </div>
  );
}
