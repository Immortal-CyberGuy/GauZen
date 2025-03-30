import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CowPedia from "./pages/CowPedia";
import BreedMatching from "./pages/BreedMatching";
import Marketplace from "./pages/MarketPlace";
import Footer from "./components/Footer"; 
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar /> 
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cow-pedia" element={<CowPedia />} />
            <Route path="/breed-matching" element={<BreedMatching />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
