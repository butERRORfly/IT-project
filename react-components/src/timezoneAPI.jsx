export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const spliter = (time) => {
  return time?.split(' ')[1] || '';
};

export const useTimezoneAPI = () => {
  const getDataByRegion = async (latitude, longitude) => {
    try {
      const apiKey = '17EMDDSCAKIF'; //  будем получать от сервера, пока храним в открытом виде
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;

      const response = await fetch(url);
      const data = await response.json();

      await delay(2000); // Искусственная задержка
      return data;
    } catch (error) {
      console.error('Error during data retrieval:', error);
      return null;
    }
  };

  return { getDataByRegion, spliter };
};