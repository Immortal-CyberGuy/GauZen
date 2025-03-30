import React from "react";
import Card from "./Card";
import "../style/MTD.css";

const MTD = () => {
  return (
    <section className="meet-developer">
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
