import { useState, useEffect } from 'react';
import './App.css';
import { TimeDisplayComponent } from './TimeDisplayer';

export default function MapContainer({ locations, connectionTypes, onTimeDataUpdate }) {
  const [validator, setValidator] = useState([]);

  useEffect(() => {
    if (!window.ymaps) return;
    connectionTypes.pop();
    const initMap = () => {
      const map = new window.ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 3,
        controls: ["zoomControl", "searchControl"]
      });
      const coordinates = [];
      const tempValidator = [];

      const logAndSetValidator = (validator) => {
        console.log('Setting validator:', validator);
        setValidator(validator);
      };

      const geocodeLocation = (location) => {
        return new Promise((resolve, reject) => {
          const geocoder = window.ymaps.geocode(location);
          geocoder.then(
            (res) => {
              const geoObject = res.geoObjects.get(0);
              if (geoObject) {
                const coords = geoObject.geometry.getCoordinates();
                console.log(`Geocoded ${location}:`, coords);
                resolve(coords);
              } else {
                reject(`Не удалось получить координаты для ${location}`);
              }
            },
            (err) => {
              console.error(`Geocoding failed for ${location}:`, err);
              reject(`Ошибка геокодирования для адреса: ${location}, ${err}`);
            }
          );
        });
      };

      const createCarRoute = (startPoint, endPoint) => {
      let cnt = 0;
      if (startPoint && endPoint) {
        const multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [startPoint, endPoint],
          params: {
            routingMode: 'auto'
          }
        }, {
          boundsAutoApply: true
        });

        map.geoObjects.add(multiRoute);
        multiRoute.model.events.add('requestsuccess', function() {
          const route = multiRoute.getActiveRoute();
          try {
            const dis = route.properties.get("distance").value;
          } catch(error) {
            drawPolyline(startPoint, endPoint);
          }
        });
      } else {
        console.error("Невозможно построить маршрут, так как одна из точек не имеет координат.");
      }
    };

    const drawPolyline = (startPoint, endPoint) => {
      if (startPoint && endPoint) {
        const polyline = new ymaps.Polyline(
          [startPoint, endPoint],
          {
            hintContent: 'Линия между точками'
          },
          {
            strokeColor: "#0000FF",
            strokeWidth: 4,
            strokeOpacity: 0.7
          }
        );
        map.geoObjects.add(polyline);
      } else {
        console.error("Невозможно построить полилинию, так как одна из точек не имеет координат.");
      }
    };

    // Основная логика построения маршрутов
    if (locations.length > 1) {
      for (let i = 0; i < locations.length - 1; i++) {
        const startPoint = locations[i];
        const endPoint = locations[i + 1];
        const connectionType = connectionTypes[i];

        if (startPoint && endPoint) {
          if (connectionType === "car") {
            createCarRoute(startPoint, endPoint);
          } else if (connectionType === "poliline") {
            drawPolyline(startPoint, endPoint);
          }
        } else {
          console.error("Невозможно построить маршрут, так как одна из точек не имеет координат.");
        }
      }
    } else {
      console.error("Недостаточно точек для построения маршрута");
    }

      let promiseChain = Promise.resolve();
      locations.forEach((location) => {
        promiseChain = promiseChain
          .then(() => geocodeLocation(location))
          .then((coords) => {
            coordinates.push(coords);
            tempValidator.push(coords);
            const placemark = new window.ymaps.Placemark(coords, {
              balloonContent: location
            });
            map.geoObjects.add(placemark);
          })
          .catch((err) => {
            console.error('Error in geocoding chain:', err);
            tempValidator.push(0);
            console.error('Geocoding error for location:', location, err);
          });
      });

      promiseChain.finally(() => {
        console.log('All geocoding completed, tempValidator:', tempValidator); // Логируем финальный validator
        logAndSetValidator(tempValidator); // Используем нашу функцию для установки
      });
    };

    window.ymaps.ready(initMap);
  }, [locations, connectionTypes]);

  return (
    <>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <TimeDisplayComponent validator={validator} onTimeDataUpdate={onTimeDataUpdate}/>
    </>
  );
}