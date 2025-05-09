import React from "react";
import { useRef, useEffect } from 'react';
import TrapezoidBlock from './TrapezoidBlock';

const HeroWithTrapezoid = ({ imageUrl, trapezoidProps, imageCut = "20%", imageOffsetX = "0%",
  imageOffsetY = "0%" }) => {
  const imageRef = useRef();
  const trapezoidRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trapezoidRef.current.classList.add('animate-in');
        }
      },
      { threshold: 0.5 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const shouldMirrorImage = trapezoidProps.position === 'right';

  return (
    <div className="hero-container" style={{ '--image-cut': imageCut }}>
      <div
        ref={imageRef}
        className={`hero-image ${shouldMirrorImage ? 'mirrored' : ''}`}
        style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: `${imageOffsetX} ${imageOffsetY}` }}
      />

      <div
        ref={trapezoidRef}
        className={`trapezoid-wrapper ${trapezoidProps.position || 'left'}`}
      >
        <TrapezoidBlock {...trapezoidProps} />
      </div>
    </div>
  );
};

export default HeroWithTrapezoid;