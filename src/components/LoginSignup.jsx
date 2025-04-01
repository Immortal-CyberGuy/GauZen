import React, { useState, useEffect } from "react";
import "../style/Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginSignup = ({ type }) => {
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [passwordValid, setPasswordValid] = useState({ minLength: false, uppercase: false, number: false, specialChar: false });

  useEffect(() => {
    setTimeout(() => setDarkOverlay(true), 100);
    setTimeout(() => setShowForm(true), 500);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      validatePassword(e.target.value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*]/.test(password);
    
    setPasswordValid({
      minLength,
      uppercase,
      number,
      specialChar,
    });
  };

  return (
    <div className="auth-container">
      <div className={`auth-overlay ${darkOverlay ? "dark" : ""}`}></div>
      {showForm && (
        <div className="auth-box visible">
          <h2>{type === "login" ? "Login" : "Sign Up"}</h2>
          <p>{type === "login" ? "Welcome back, please login to continue." : "Join us to get started!"}</p>
          <form>
            {type === "signup" && (
              <div className="input-container">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  onChange={handleChange}
                  value={formData.fullName}
                  required
                />
              </div>
            )}

            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Password Checklist */}
            {type === "signup" && formData.password && (
              <div className="password-checklist">
                <ul>
                  <li>
                    <input type="checkbox" checked={passwordValid.minLength} disabled />
                    Minimum 8 characters
                  </li>
                  <li>
                    <input type="checkbox" checked={passwordValid.uppercase} disabled />
                    At least 1 uppercase letter
                  </li>
                  <li>
                    <input type="checkbox" checked={passwordValid.number} disabled />
                    At least 1 number
                  </li>
                  <li>
                    <input type="checkbox" checked={passwordValid.specialChar} disabled />
                    At least 1 special character
                  </li>
                </ul>
              </div>
            )}

            <button type="submit">
              {type === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="separator">or</div>
          <button className="google-btn">
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <div className="switch-auth">
            {type === "login" ? (
              <>
                Don't have an account? <a href="/signup">Sign Up</a>
              </>
            ) : (
              <>
                Already a user? <a href="/login">Login</a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
