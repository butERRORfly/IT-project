import './PanoramaContainer.css'
import React, { useState, useEffect } from 'react';

const PanoramaContainer = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Массив с путями к вашим изображениям
  const images = [
    'https://cdn.tripster.ru/photos/7e7d0bc8-93de-40e7-89ab-af1cc08feca5.jpg',
    'https://cdn.tripster.ru/photos/49cdcd9c-bcc7-428a-abcc-5cb7ffc4b4a5.jpg',
    'https://cdn.tripster.ru/photos/6effcd8b-c793-49f4-8245-da2bbb391edc.jpg',
    'https://cdn.tripster.ru/photos/2260b570-9059-4ce7-8233-8c24920420c7.jpg',
    'https://cdn.tripster.ru/photos/206a2bc5-34d5-48d6-892b-651e392c792b.jpg',
  ];

  // Автоматическая смена изображений каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hero-slider">
      {images.map((image, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      <div className="hero-overlay">
        <h1 className="hero-grand-text">Adventures</h1>
        <p className="hero-text">Ваше путешествие начинается здесь</p>
      </div>
    </div>
  );
};

export default PanoramaContainer;