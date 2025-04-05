import { useEffect } from 'react';
import './App.css';

export default function MapContainer({ locations }) {
  useEffect(() => {
    if (!window.ymaps) return;

    const initMap = () => {
      const map = new window.ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 3,
        controls: ["zoomControl", "searchControl"]
      });

      const coordinates = [];

      const addPolyline = () => {
        if (coordinates.length > 1) {
          const polyline = new window.ymaps.Polyline(
            coordinates,
            { hintContent: 'Линия между городами' },
            {
              strokeColor: "#0000FF",
              strokeWidth: 4,
              strokeOpacity: 0.7
            }
          );
          map.geoObjects.add(polyline);
        }
      };

      const geocodeLocation = (location) => {
        return new Promise((resolve, reject) => {
          const geocoder = window.ymaps.geocode(location);
          geocoder.then(
            (res) => {
              const geoObject = res.geoObjects.get(0);
              if (geoObject) {
                const coords = geoObject.geometry.getCoordinates();
                resolve(coords);
              } else {
                reject(`Не удалось получить координаты для ${location}`);
              }
            },
            (err) => {
              reject(`Ошибка геокодирования для адреса: ${location}, ${err}`);
            }
          );
        });
      };

      let promiseChain = Promise.resolve();
      locations.forEach((location, index) => {
        promiseChain = promiseChain
          .then(() => geocodeLocation(location))
          .then((coords) => {
            coordinates.push(coords);
            const placemark = new window.ymaps.Placemark(coords, {
              balloonContent: location
            });
            map.geoObjects.add(placemark);
            addPolyline();
          })
          .catch(console.error);
      });
    };

    window.ymaps.ready(initMap);
  }, [locations]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}