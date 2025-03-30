import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { GiCow, GiFarmTractor } from "react-icons/gi";
import { TbArrowsExchange } from "react-icons/tb";
import "../style/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      {/* Premium Logo */}
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

      {/* Navigation Links with Icons */}
      <nav className="navbar-links">
        <Link to="/cow-pedia" className="nav-link"><GiCow className="nav-icon" /> CowPedia</Link>
        <Link to="/breed-matching" className="nav-link"><TbArrowsExchange className="nav-icon" /> Breed Matching</Link>
        <Link to="/marketplace" className="nav-link"><GiFarmTractor className="nav-icon" /> Marketplace</Link>
      </nav>

      {/* Authentication Buttons */}
      <div className="auth-buttons">
        <Link to="/login" className="login-link"><FiLogIn className="nav-icon" /> Login</Link>
        <Link to="/signup" className="signup-button"><FaUserPlus className="nav-icon" /> Sign Up</Link>
      </div>
    </header>
  );
}

export default Navbar;
