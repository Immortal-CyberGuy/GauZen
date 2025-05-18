import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus, FaStethoscope } from "react-icons/fa";
import { GiCow, GiFarmTractor } from "react-icons/gi";
import { TbArrowsExchange } from "react-icons/tb";
import { getAuth, signOut } from "firebase/auth";
import "../style/Navbar.css";

export default function Navbar({ user, openMarketplace }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <div className="logo-circle">
              <GiCow className="logo-icon" />
            </div>
            <span className="logo-text">GauZen</span>
          </div>
        </Link>
      </div>

      <nav className="navbar-links">
        <Link to="/cow-pedia" className="nav-link">
          <GiCow className="nav-icon" /> CowPedia
        </Link>
        <Link to="/breed-matching" className="nav-link">
          <TbArrowsExchange className="nav-icon" /> Breed Matching
        </Link>
        <button className="nav-link" onClick={openMarketplace}>
          <GiFarmTractor className="nav-icon" /> Marketplace
        </button>
        <Link to="/vet" className="nav-link">
          <FaStethoscope className="nav-icon" /> Smart Vet Locator
        </Link>
      </nav>

      <div className="auth-buttons">
        {!user ? (
          <>
            <Link to="/login" className="login-link">
              <FiLogIn className="nav-icon" /> Login
            </Link>
            <Link to="/signup" className="signup-button">
              <FaUserPlus className="nav-icon" /> Sign Up
            </Link>
          </>
        ) : (
          <div
            className="profile-container"
            onClick={handleLogout}
            title="Click to Logout"
            style={{ cursor: "pointer" }}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-icon"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                  // fallback will be shown automatically
                }}
              />
            ) : (
              <div className="profile-fallback">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : "G"}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
