import React, { useEffect, useState } from "react";
import "../style/Vid.css";

const Vid = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".video-section");
      if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`video-section ${visible ? "show" : ""}`}>
      <h2 className="video-heading">Getting Started</h2>
      <p className="video-subtext">
        Take your learning to the next level with GauZen's powerful features.
        Start transforming your experience today.
      </p>
      <div className="video-container">
        <video
          className="video-player"
          src="/vdo%20(1)%20(1)%20(1).mp4"
          controls
          preload="metadata"
        />
      </div>
    </div>
  );
};

export default Vid;
