import React from 'react';
import TripsList from './TripsList';


const App = ({ data }) => {
  return (
    <div className="app-container">
      <TripsList
        routes={data.routes}
        isAuthenticated={data.isAuthenticated}
      />
    </div>
  );
};

export default App;