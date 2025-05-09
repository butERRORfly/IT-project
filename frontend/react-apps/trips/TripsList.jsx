import React from 'react';

const TripsList = ({ routes, isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <div className="auth-message">
        <p>Авторизуйтесь для просмотра маршрутов</p>
        <a href="/auth" className="auth-link">Войти</a>
      </div>
    );
  }

  if (routes.length === 0) {
    return <p className="no-routes">Нет сохранённых путешествий</p>;
  }

  return (
    <div className="trips-list">
      <h2 className="list-title">Мои путешествия</h2>
      <div className="routes-container">
        {routes.map((routeId, index) => (
          <a
            key={routeId}
            href={`/api/v1/app/saved_trips/${routeId}`}
            className="route-card"
          >
            <span className="route-number">Путешествие #{index + 1}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TripsList;