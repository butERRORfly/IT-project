import React from "react";

const Belt = ({
  title = "Заголовок",
  buttonText = "Начать!",
  texture = "stripes",
  overlap = "20px"
}) => {
  return (
      <div className="belt-content">
        <h2 className="belt-title">{title}</h2>
        <button className="belt-button" onClick={() => window.handleAppButtonClick?.()}>
            {buttonText}
        </button>
      </div>
  );
};

export default Belt;