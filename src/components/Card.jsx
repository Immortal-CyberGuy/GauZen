import React, { useState } from "react";
import { motion } from "framer-motion";
import "../style/Card.css";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import developerImage from "../images/me.jpg";

const Card = () => {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="background-container">
      {/* Background Animation */}
      <motion.div
        initial={{ backgroundPosition: "0 50%" }}
        animate={{ backgroundPosition: ["0 50%", "100% 50%", "0 50%"] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        className="background-gradient blur"
      />
      <motion.div
        initial={{ backgroundPosition: "0 50%" }}
        animate={{ backgroundPosition: ["0 50%", "100% 50%", "0 50%"] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        className="background-gradient"
      />

      {/* Developer Card */}
      <div className={`developer-card ${showQuote ? "active" : ""}`} onClick={() => setShowQuote(!showQuote)}>
        <div className="developer-image-container">
          <img src={developerImage} alt="Developer" className="developer-image" />
        </div>

        {/* Quote Box (Appears on Click) */}
        {showQuote && (
          <motion.div 
            className="quote-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            "I'm Shubham Garg, the mind behind GauZen. Passionate about AI & agriculture, I strive to make cattle farming smarter and more accessible."
          </motion.div>
        )}
      </div>

      {/* Floating Dock (Toolbar) */}
      <div className="floating-dock">
        <a href="https://github.com/Immortal-CyberGuy/" target="_blank" rel="noopener noreferrer" className="dock-item">
          <FaGithub className="dock-icon" />
        </a>
        <a href="https://www.linkedin.com/in/real-shubham-garg/" target="_blank" rel="noopener noreferrer" className="dock-item">
          <FaLinkedin className="dock-icon" />
        </a>
        <a href="https://instagram.com/cyberzenith57" target="_blank" rel="noopener noreferrer" className="dock-item">
          <FaInstagram className="dock-icon" />
        </a>
      </div>
    </div>
  );
};

export default Card;
