import './App.css';

export default function PointList({ data }) {
  return (
    <div className="sidebar">
      {data.loc.map((location, i) => (
        <div class="route-point" key={`point-${i}`}>
            <div class="point-header">
                <h3>📍 {location}</h3>
                <span class="badge">{data.wait[i]}</span>
            </div>

            <div class="point-dates">
                <div>
                    <span class="label">Прибытие:</span>
                    <span class="value">{data.date_to[i]}</span>
                </div>
                <div>
                    <span class="label">Отбытие:</span>
                    <span class="value">{data.date_out[i]}</span>
                </div>
            </div>

            <div class="hotel-label">
                <span class="label">Гостиница:</span>
                <span class="value">{data.gost[i]}</span>
            </div>

            <div class="point-price">
                <span class="label">Стоимость:</span>
                <span class="value">{data.cost[i]}</span>
            </div>
            <a href={data.rec[i]} class="booking-btn">Забронировать гостиницу →</a>
        </div>
      ))}
    </div>
  );
}