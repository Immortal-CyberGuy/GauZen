import { Link } from "react-router-dom";
import "../style/Navbar.css";
import logo from "../images/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="GauSeva Logo" className="logo-img" />
        GauSeva
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/cow-pedia" className="nav-link">CowPedia</Link>
        <Link to="/breed-matching" className="nav-link">Breed Matching</Link>
        <Link to="/marketplace" className="nav-link">Marketplace</Link>
      </div>
    </nav>
  );
}

export default Navbar;
