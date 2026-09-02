import React, { useState } from "react";
import soundStepData from "../data/SoundStepData";
import "../styles/SectionSpinner.css";

const groupedData = soundStepData.reduce((acc, entry) => {
  if (!acc[entry.area]) acc[entry.area] = [];
  acc[entry.area].push(entry);
  return acc;
}, {});

const areaList = Object.keys(groupedData);

function SectionSpinner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRotate = (direction) => {
    setCurrentIndex((prev) =>
      direction === "left"
        ? (prev - 1 + areaList.length) % areaList.length
        : (prev + 1) % areaList.length
    );
  };

  return (
    <div className="spinner-container">
      <h1 className="spinner-title">Sound Step</h1>

      <div className="spinner-carousel">
        {areaList.map((area, i) => {
          const position = i - currentIndex;
          let className = "card";

          if (position === 0) className += " active";
          else if (position === -1 || position === areaList.length - 1) className += " left";
          else if (position === 1 || (currentIndex === areaList.length - 1 && i === 0)) className += " right";
          else className += " hidden";

          return (
            <div key={area} className={className} onClick={() => setCurrentIndex(i)}>
              <h2>{area}</h2>
              {position === 0 && (
                <div className="card-buttons">
                  {groupedData[area].map((spot, index) => (
                    <button key={index} onClick={() => alert(`Jump to ${spot.time}`)}>
                      {spot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="spinner-controls">
        <button onClick={() => handleRotate("left")}>&larr;</button>
        <button onClick={() => handleRotate("right")}>&rarr;</button>
      </div>
    </div>
  );
}

export default SectionSpinner;
