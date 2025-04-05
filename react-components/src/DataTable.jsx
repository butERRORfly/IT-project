export default function DataTable({ data }) {
  return (
    <div className="react-data-table">
      <h2>Результаты (React):</h2>
      <ul>
        {data.loc.map((point, index) => (
          <li key={index}>
            📍 {point} — ⏳ {data.wait[index]} дней
          </li>
        ))}
      </ul>
    </div>
  );
}