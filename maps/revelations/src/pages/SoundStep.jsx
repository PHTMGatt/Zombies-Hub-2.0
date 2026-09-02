import React, { useState, useRef } from "react";
import YouTube from "react-youtube";
import soundStepData from "../data/SoundStepData";
import "../styles/SoundStep.css";

const groupedData = soundStepData.reduce((acc, entry) => {
  if (!acc[entry.area]) acc[entry.area] = [];
  acc[entry.area].push(entry);
  return acc;
}, {});

const areaList = Object.keys(groupedData);

function SoundStep() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef(null);

  const handleRotate = (dir) => {
    setCurrentIndex((prev) =>
      dir === "left"
        ? (prev - 1 + areaList.length) % areaList.length
        : (prev + 1) % areaList.length
    );
  };

  const handleClick = (start) => {
    if (playerRef.current) {
      playerRef.current.seekTo(start, true);
      playerRef.current.playVideo();
    }
  };

  const opts = {
    width: "100%",
    height: "400",
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const getPosition = (i) => {
    if (i === currentIndex) return "center";
    if ((i + 1) % areaList.length === currentIndex) return "left";
    if ((i - 1 + areaList.length) % areaList.length === currentIndex) return "right";
    return "off";
  };

  return (
    <div className="rev-page">
      <div className="rev-background" />
      <div className="sk-container">
        <h1 className="sk-title">Sound Step</h1>

        <div className="rev-glow-box">
          <div className="video-card">
            <YouTube
              videoId="tt3mpH7Rrfo"
              opts={opts}
              onReady={onPlayerReady}
              className="sk-video"
            />
            <div className="video-caption">(Click a section or location to play)</div>
          </div>

          <div className="carousel-wrapper">
            {areaList.map((area, i) => {
              const pos = getPosition(i);
              if (pos === "off") return null;

              return (
                <div key={area} className={`sound-card ${pos}`} onClick={() => setCurrentIndex(i)}>
                  <div className="card-overlay" />
                  <h2 className="egg-subtitle">{area}</h2>
                  {pos === "center" && (
                    <div className="card-buttons">
                      {groupedData[area].map((spot, index) => (
                        <button key={index} onClick={() => handleClick(spot.start)}>
                          {spot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="spinner-controls">
          <button onClick={() => handleRotate("left")}>&larr;</button>
          <button onClick={() => handleRotate("right")}>&rarr;</button>
        </div>
      </div>
    </div>
  );
}

export default SoundStep;
