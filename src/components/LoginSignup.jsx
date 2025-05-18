import React, { useState, useEffect } from "react";
import "../style/Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, provider } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginSignup = ({ type }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [darkOverlay, setDarkOverlay] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setDarkOverlay(true), 100);
    setTimeout(() => setShowForm(true), 500);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, fullName } = formData;
    try {
      if (type === "signup") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: fullName });
        alert("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Google sign-in successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-overlay ${darkOverlay ? "dark" : ""}`}></div>
      {showForm && (
        <div className="auth-box visible">
          <h2>{type === "login" ? "Login" : "Sign Up"}</h2>
          <p>
            {type === "login"
              ? "Welcome back, please login to continue."
              : "Join us to get started!"}
          </p>
          <form onSubmit={handleSubmit}>
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
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit">
              {type === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="separator">or</div>
          <button className="google-btn" onClick={handleGoogleSignIn}>
            <span className="google-icon">G</span> Continue with Google
          </button>

          <div className="switch-auth">
            {type === "login" ? "Don't have an account? " : "Already a user? "}
            <a href={type === "login" ? "/signup" : "/login"}>
              {type === "login" ? "Sign Up" : "Login"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
