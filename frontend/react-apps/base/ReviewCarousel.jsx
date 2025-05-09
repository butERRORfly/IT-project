import React from 'react';
import { useState, useEffect, useRef } from 'react';

const reviews = [
  {
    id: 1,
    text: "Спланировали маршрут по Кавказу за вечер! Всё продумано до мелочей — перевалы, ночёвки, даже где душ принять.",
    author: "Иван К.",
    location: "Маршрут: Домбай — Архыз"
  },
  {
    id: 2,
    text: "Впервые за 10 лет путешествий нашёл сервис, где можно сразу увидеть бюджет поездки. Сэкономил 15% на логистике!",
    author: "Михаил С.",
    location: "Маршрут: Золотое кольцо"
  },
  {
    id: 3,
    text: "Мечтала проехать по Скандинавии, но боялась забыть что-то важное. Ваш конструктор буквально держал за руку на каждом этапе.",
    author: "Ольга Т.",
    location: "Маршрут: Норвегия — Швеция"
  }
];

const ReviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="reviews-section">
      <h2 className="section-title">Отзывы путешественников</h2>
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-text">"{review.text}"</div>
              <div className="review-meta">
                <div className="review-author">{review.author}</div>
                <div className="review-location">{review.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Показать отзыв ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;