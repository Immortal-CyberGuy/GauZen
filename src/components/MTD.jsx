import React, { useEffect, useState } from "react";
import Card from "./Card";
import "../style/MTD.css";

const MTD = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(".meet-developer");
      if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={`meet-developer ${visible ? "show" : ""}`}>
      <h2 className="tagline">Meet the Developer</h2>
      <p className="description">
        A dedicated developer, passionate about crafting seamless applications and solving real-world challenges with precision.
      </p>
      <Card className="developer-card">
        <img src="/images/me.jpg" alt="Developer" className="developer-image" />
      </Card>
    </section>
  );
};

export default MTD;
