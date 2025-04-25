import React from 'react';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Adventures
        </p>
        <button
          className={`footer-scroll-button ${isVisible ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          ⬆
        </button>
      </div>
    </footer>
  );
};

export default Footer;