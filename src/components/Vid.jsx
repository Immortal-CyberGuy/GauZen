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
