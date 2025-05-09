import React from 'react';
import { useEffect } from 'react';
import { useTimezoneAPI, delay } from './timezoneAPI';

export const TimeDisplayComponent = ({ validator, onTimeDataUpdate }) => {
  const { getDataByRegion, spliter } = useTimezoneAPI();

  useEffect(() => {
    if (!validator || validator.length === 0) {
      console.warn('Validator is empty');
      onTimeDataUpdate([]);
      return;
    }

    const fetchTimeData = async () => {
      const results = [];
      const REQUEST_DELAY = 2000; // 2 секунды между запросами

      for (let i = 0; i < validator.length; i++) {
        try {
          if (validator[i] === 0) {
            results.push({ id: i, time: '00:00:00', error: 'Geocoding failed' });
            continue;
          }

          // Добавляем задержку между запросами
          if (i > 0) await delay(REQUEST_DELAY);

          const response = await getDataByRegion(validator[i][0], validator[i][1]);

          let timeStr = '00:00:00';
          let errorMsg = null;

          if (response?.formatted) {
            timeStr = spliter(response.formatted);
          } else if (response?.time) {
            timeStr = response.time;
          } else {
            errorMsg = response?.error || 'Invalid response structure';
          }

          results.push({ id: i, time: timeStr, error: errorMsg });
        } catch (error) {
          console.error(`Error processing point ${i}:`, error);
          results.push({ id: i, time: '00:00:00', error: 'API request failed' });
        }
      }

      onTimeDataUpdate(results);
    };

    fetchTimeData();
  }, [validator]);

  return null;
};