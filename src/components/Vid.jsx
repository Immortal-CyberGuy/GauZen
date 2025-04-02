import React from "react";
import "../style/Vid.css";

const Vid = () => {
  return (
    <div className="video-section">
      <h2 className="video-heading">Getting Started</h2>
      <p className="video-subtext">
        Take your learning to the next level with GauZen's powerful features.
        Start transforming your experience today.
      </p>
      <div className="video-container">
        <iframe
          className="video-player"
          src="https://www.youtube.com/embed/r6zIGXun57U"
          title="GauSeva Introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Vid;
