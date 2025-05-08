import React from 'react';
import RoutePoint from './RoutePoint';

export default function PointList({ data, timeData = [], onPointUpdate }) {
  return (
    <div className="sidebar">
      {data.loc.map((location, i) => (
        <RoutePoint
          key={`point-${i}`}
          location={location}
          i={i}
          timeData={timeData}
          data={data}
          onPointUpdate={onPointUpdate}
          prevTypic={i > 0 ? data.typic?.[i-1] : null}
        />
      ))}
    </div>
  );
}
