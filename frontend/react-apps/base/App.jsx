import React from 'react';
import PanoramaContainer from './PanoramaContainer';
import TrapezoidBlock from './TrapezoidBlock';
import HeroWithTrapezoid from './HeroWithTrapezoid';
import Belt from './Belt';
import ReviewCarousel from './ReviewCarousel';

export default function App({ data }) {
  return (
    <div className="container">
      <PanoramaContainer />
      <Belt
        title="Готовы проложить свой путь?"
        buttonText="Вперед!"
        texture="stripes"
        overlap="30px"
      />
      <HeroWithTrapezoid
        imageUrl="https://33ways.ru/wp-content/uploads/2024/12/%D0%9B%D0%B5%D0%B2%D0%B0%D1%8F-%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%BD%D0%B0-%D0%BF%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D1%8B-%D0%A1%D0%B0%D0%BC%D0%B5%D1%82-%D0%9D%D0%B0%D0%BD%D0%B3%D1%88%D0%B5.jpg"
        imageCut="6%"
        imageOffsetX="0%"
        imageOffsetY="40%"
        trapezoidProps={{
          title: "Путешествовать – просто",
          subtitle: "С нами все этапы планирования вашего приключения покажутся отдыхом: отмечайте на карте точки маршрута, аэропорты, гостиницы и мы нарисуем вам карту вашего путешествия!",
          position: "left",
        }}
      />
      <HeroWithTrapezoid
        imageUrl="https://fs.tonkosti.ru/sized/c1600x600/cr/5y/cr5y2q59s9skwk8kc0gsg0kwg.jpg"
        imageCut="6%"
        imageOffsetX="0%"
        imageOffsetY="20%"
        trapezoidProps={{
          title: "Ваш лучший помощник",
          subtitle: "С нами вы ничего не забудете, ведь мы поможем вам с ориентированием путешествия по времени и бюджету, а также покажем лучшие пути от одной точки карты до другой.",
          position: "right",
        }}
      />
      <HeroWithTrapezoid
        imageUrl="https://silvercity.ru/upload/medialibrary/d48/rt594i05xt695q1g3o0iljcx37vbudm8.jpg"
        imageCut="6%"
        imageOffsetX="300px"
        imageOffsetY="20%"
        trapezoidProps={{
          title: "Всегда с собой",
          subtitle: "Вы можете сохранить план своего путешествия, или поменять его в любой момент: мы подстроимся под ваши нужды с нашим удобным интерфейсом!",
          position: "left",
        }}
      />
      <ReviewCarousel />
    </div>
  );
}