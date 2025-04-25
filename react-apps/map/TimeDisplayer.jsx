import { useEffect } from 'react';
import { useTimezoneAPI } from './timezoneAPI';

export const TimeDisplayComponent = ({ validator, onTimeDataUpdate }) => {
  const { getDataByRegion, spliter } = useTimezoneAPI();

  useEffect(() => {
    if (!validator || validator.length === 0) {
      console.warn('Validator is empty');
      return;
    }

    const fetchTimeData = async () => {
      const results = [];

      for (let i = 0; i < validator.length; i++) {
        try {
          // 1. Обработка ошибок геокодирования
          if (validator[i] === 0) {
            results.push({ id: i, time: '00:00:00', error: 'Geocoding failed' });
            continue;
          }

          // 2. Запрос к API с задержкой
          if (i > 0) await new Promise(r => setTimeout(r, 800));

          const response = await getDataByRegion(validator[i][0], validator[i][1]);
          console.log('Raw API response:', response); // Логируем полный ответ

          // 3. Универсальная проверка ответа
          let timeStr = '00:00:00';
          let errorMsg = null;

          if (response?.formatted) {
            // Если API вернуло поле formatted
            timeStr = spliter(response.formatted);
          } else if (response?.time) {
            // Если ответ уже содержит time (как в вашем логе)
            timeStr = response.time;
          } else {
            errorMsg = 'Invalid response structure';
          }

          // 4. Проверка формата времени
          if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(timeStr)) {
            errorMsg = 'Invalid time format';
            timeStr = '00:00:00';
          }

          results.push({
            id: i,
            time: timeStr,
            error: errorMsg
          });

        } catch (error) {
          console.error(`Error processing point ${i}:`, error);
          results.push({
            id: i,
            time: '00:00:00',
            error: 'API request failed'
          });
        }
      }

      console.log('Final results:', results);
      onTimeDataUpdate(results);
    };

    fetchTimeData();
  }, [validator]);

  return null;
};