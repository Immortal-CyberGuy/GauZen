// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebaseConfig";

// import Home from "./pages/Home";
// import CowPedia from "./pages/CowPedia";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import BreedMatching from "./pages/BreedMatching";
// import VetDoc from "./pages/VetDoc";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Marketplace from "./components/MarketPlace";
// import ChatBot from "./components/Chatbot/ChatBot";

// import "./App.css";

// function App() {
//   const [user, setUser] = useState(null);
//   const [isMarketplaceOpen, setMarketplaceOpen] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="app-container">
//       <Router>
//         <Navbar user={user} openMarketplace={() => setMarketplaceOpen(true)} />

//         <div className="main-content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/cow-pedia" element={<CowPedia />} />
//             <Route path="/breed-matching" element={<BreedMatching />} />
//             <Route path="/vet" element={<VetDoc />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<SignUp />} />
//           </Routes>
//         </div>
//       </Router>

//       <ChatBot />
//       <Footer />

//       <Marketplace
//         isOpen={isMarketplaceOpen}
//         onClose={() => setMarketplaceOpen(false)}
//       />
//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Home from "./pages/Home";
import CowPedia from "./pages/CowPedia";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BreedMatching from "./pages/BreedMatching";
import VetDoc from "./pages/VetDoc";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Marketplace from "./components/MarketPlace";
import ChatBot from "./components/Chatbot/ChatBot";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isMarketplaceOpen, setMarketplaceOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <Router>
        {/* ✅ Move Navbar into main layout flow */}
        <Navbar user={user} openMarketplace={() => setMarketplaceOpen(true)} />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cow-pedia" element={<CowPedia />} />
            <Route path="/breed-matching" element={<BreedMatching />} />
            <Route path="/vet" element={<VetDoc />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>

      <ChatBot />
      <Footer />

      <Marketplace
        isOpen={isMarketplaceOpen}
        onClose={() => setMarketplaceOpen(false)}
      />
    </div>
  );
}

export default App;


