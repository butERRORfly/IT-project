import React from "react";

const TrapezoidBlock = ({
  title,
  subtitle,
  position,
  height = "350px",
  backgroundColor = "#111",
  textColor = "#fff",
}) => {
  return (
    <div
      className={`trapezoid-block ${position}`}
      style={{
        height,
        color: textColor,
        '--bg-color': backgroundColor // Передаём цвет в CSS переменной
      }}
    >
      <div className="trapezoid-text">
        <h3 className="trapezoid-title">{title}</h3>
        <div className="trapezoid-divider"></div>
        <p className="trapezoid-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default TrapezoidBlock;