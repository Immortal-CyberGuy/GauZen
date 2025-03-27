import React, { useState } from "react";
import "../style/LoginSignup.css";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const LoginSignup = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData); // Future Firebase Integration Here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to GauSeva</h2>
        <p>Join us to access expert cow breeding insights, marketplace, and more.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FaUser className="icon" />
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          </div>
          <div className="input-container">
            <FaPhone className="icon" />
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          </div>
          <div className="input-container">
            <FaMapMarkerAlt className="icon" />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className="separator">OR</div>
        <button className="google-btn">Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginSignup;
