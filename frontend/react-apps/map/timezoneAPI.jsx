import React from 'react';
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const spliter = (time) => {
  return time?.split(' ')[1] || '';
};
export const useTimezoneAPI = () => {
  const getDataByRegion = async (latitude, longitude) => {
    try {
      // Вместо прямого запроса к timezonedb, используем наш бэкенд
      const response = await fetch('/api/v1/app/location/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during data retrieval:', error);
      return { error: error.message };
    }
  };

  return { getDataByRegion, spliter };
};