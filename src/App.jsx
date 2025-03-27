import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FarmerEducation from "./pages/FarmerEducation";
// import ChatBot from "./pages/ChatBot";
import BreedMatching from "./pages/BreedMatching";
import Marketplace from "./pages/MarketPlace";
import Navbar from "./components/Navbar"; 
// import Chatbot from "./components/Chatbot/Chatbot";  // Import Chatbot

function App() {
  return (
    <Router>
      <Navbar /> {/* Include Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer-education" element={<FarmerEducation />} />
        <Route path="/breed-matching" element={<BreedMatching />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
      {/* <Chatbot /> */}
    </Router>
  );
}

export default App;
