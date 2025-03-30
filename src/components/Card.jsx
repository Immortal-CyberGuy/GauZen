import React from "react";
import { motion } from "framer-motion";
import "../style/Card.css";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import developerImage from "../images/me.jpg";


const Card = ({ image }) => {
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

      {/* Image */}
      <div className="developer-image-container">
        <img src={developerImage} alt="Developer" className="developer-image" />
      </div>

      {/* Floating Dock (Toolbar) */}
      <div className="floating-dock">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="dock-item">
          <FaGithub className="dock-icon" />
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="dock-item">
          <FaLinkedin className="dock-icon" />
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="dock-item">
          <FaInstagram className="dock-icon" />
        </a>
      </div>
    </div>
  );
};

export default Card;