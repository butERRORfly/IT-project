import React, { useState, useEffect, useRef } from 'react';
import { TimeDisplayComponent } from './TimeDisplayer';

export default function MapContainer({ locations = [], connectionTypes = [], onTimeDataUpdate, creatingNewPoint, setCreatingNewPoint }) {
  const [validator, setValidator] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geoObjects = useRef([]);
  const [clickCoords, setClickCoords] = useState(null);

  // Инициализация карты
  useEffect(() => {
    if (!window.ymaps || mapInstance.current) return;

    window.ymaps.ready(() => {
      try {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [55.76, 37.64],
          zoom: 3,
          controls: ["zoomControl", "searchControl"]
        });

        mapInstance.current = map;
        geoObjects.current = [];

        processLocations(map);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    });

    return () => {
      if (mapInstance.current) {
        // Удаляем все объекты с карты
        geoObjects.current.forEach(obj => {
          mapInstance.current.geoObjects.remove(obj);
        });
        // Уничтожаем экземпляр карты
        mapInstance.current.destroy();
        mapInstance.current = null;
        geoObjects.current = [];
      }
    };
  }, []);
  // ОБРАБОТЧИК КЛИКОВ ПО КАРТЕ
  useEffect(() => {
    if (!mapInstance.current) return;
    const handleMapClick = (e) => {
      if (creatingNewPoint) {
        setClickCoords(e.get('coords'));
        setCreatingNewPoint(false);
      }
    };
    mapInstance.current.events.add('click', handleMapClick);
    return () => {
      mapInstance.current.events.remove('click', handleMapClick);
    };
  }, [creatingNewPoint]);

  // Добавка точки
  useEffect(() => {
    if (!clickCoords) return;
    const processClick = async () => {
      try {
        console.log('Clicked on map:', clickCoords);
        const res = await ymaps.geocode(clickCoords);
        const first = res.geoObjects.get(0);
        const adr = first.getAddressLine();
        locations.push(adr);
        console.log('Deleting old bullshit...');
        geoObjects.current.forEach(obj => {
          mapInstance.current.geoObjects.remove(obj);
        });
        geoObjects.current = [];
        console.log('goint to start process locations');
        processLocations(mapInstance.current);
        console.log('ENDED ADDING POINT');
      } catch (error) {
        console.error('Error processing click:', error);
      } finally {
        setClickCoords(null);
      }
    }
  processClick();
}, [clickCoords]);

  // Обработка изменений в locations или connectionTypes
  useEffect(() => {
    if (!mapInstance.current) return;

    // Очищаем старые объекты
    geoObjects.current.forEach(obj => {
      mapInstance.current.geoObjects.remove(obj);
    });
    geoObjects.current = [];

    processLocations(mapInstance.current);
  }, [locations, connectionTypes]);

  // Функция для обработки локаций
  const processLocations = async (map) => {
    if (!locations.length) return;
    console.log('Processing locations: ', locations);
    const tempValidator = [];
    const coordinates = [];

    for (let i = 0; i < locations.length; i++) {
      try {
        const coords = await geocodeLocation(locations[i]);
        coordinates.push(coords);
        tempValidator.push(coords);

        // Добавляем метку
        const placemark = new window.ymaps.Placemark(coords, {
          balloonContent: locations[i]
        });
        map.geoObjects.add(placemark);
        geoObjects.current.push(placemark);
      } catch (error) {
        console.error(`Error geocoding location ${locations[i]}:`, error);
        tempValidator.push(0);
      }
    }

    // Строим маршруты между точками
    if (coordinates.length > 1) {
      console.log(connectionTypes);
      for (let i = 0; i < coordinates.length - 1; i++) {
        const start = coordinates[i];
        const end = coordinates[i + 1];
        const type = connectionTypes[i] || 'poliline';

        if (start && end) {
          createRoute(map, start, end, type);
        }
      }
    }

    setValidator(tempValidator);
  };

  // Функция геокодирования
  const geocodeLocation = (address) => {
    return new Promise((resolve, reject) => {
      window.ymaps.geocode(address, {
        results: 1
      }).then(
        (res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            resolve(firstGeoObject.geometry.getCoordinates());
          } else {
            reject(`No results for address: ${address}`);
          }
        },
        (err) => {
          reject(`Geocoding error for address: ${address}, ${err}`);
        }
      );
    });
  };

  // Функция создания маршрута
  const createRoute = (map, start, end, type) => {
    if (type === 'car') {
      const multiRoute = new window.ymaps.multiRouter.MultiRoute({
        referencePoints: [start, end],
        params: { routingMode: 'auto' }
      }, {
        boundsAutoApply: true
      });

      map.geoObjects.add(multiRoute);
      geoObjects.current.push(multiRoute);

      multiRoute.model.events.add('requestsuccess', function() {
        try {
          const route = multiRoute.getActiveRoute();
          const distance = route.properties.get("distance").value;
          console.log(`Route distance: ${distance} meters`);
        } catch (error) {
          console.warn('Failed to get route info, drawing polyline instead');
          drawPolyline(map, start, end);
        }
      });
    } else {
      drawPolyline(map, start, end);
    }
  };

  // Функция рисования линии
  const drawPolyline = (map, start, end) => {
    const polyline = new window.ymaps.Polyline(
      [start, end],
      { hintContent: 'Route' },
      {
        strokeColor: "#0000FF",
        strokeWidth: 4,
        strokeOpacity: 0.7
      }
    );

    map.geoObjects.add(polyline);
    geoObjects.current.push(polyline);
  };

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
      <TimeDisplayComponent validator={validator} onTimeDataUpdate={onTimeDataUpdate} />
    </>
  );
}