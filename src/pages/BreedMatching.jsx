import React, { useState, useEffect, useRef } from "react";
import "../style/BreedMatching.css";

const breedCompatibility = {
  "Gir": [
    { breed: "Sahiwal", benefits: ["Higher milk yield", "Disease resistance", "Good temperament"] },
    { breed: "Tharparkar", benefits: ["Better adaptability to hot climates", "Improved fertility"] },
    { breed: "Red Sindhi", benefits: ["Increased milk production", "Stronger immune system"] },
  ],
  "Sahiwal": [
    { breed: "Gir", benefits: ["Better hybrid vigor", "Higher fat content in milk"] },
    { breed: "Kankrej", benefits: ["Superior endurance", "Good for draught work"] },
    { breed: "Hariana", benefits: ["Stronger calves", "High disease resistance"] },
  ],
  "Holstein": [
    { breed: "Jersey", benefits: ["Higher butterfat percentage", "Adaptability"] },
    { breed: "Brown Swiss", benefits: ["Improved milk quality", "More resilience"] },
    { breed: "Normande", benefits: ["Increased protein content", "High fertility"] },
  ],
  "Jersey": [
    { breed: "Holstein", benefits: ["High milk volume", "Better lifespan"] },
    { breed: "Ayrshire", benefits: ["More robust calves", "Better heat resistance"] },
    { breed: "Brown Swiss", benefits: ["Higher cheese yield", "Strong legs & hooves"] },
  ],
  "Rathi": [
    { breed: "Gir", benefits: ["Strong disease resistance", "Long lactation period"] },
    { breed: "Kankrej", benefits: ["Dual-purpose breed (milk & draught)", "High heat tolerance"] },
    { breed: "Tharparkar", benefits: ["Resistant to common cattle diseases", "Good reproductive capacity"] },
  ],
};

const breedList = Object.keys(breedCompatibility);

const BreedMatching = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [matchingBreeds, setMatchingBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const handleChange = (event) => {
    const input = event.target.value;
    setQuery(input);

    if (input.length > 0) {
      const filteredSuggestions = breedList
        .filter(breed => breed.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 6);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
      setMatchingBreeds([]);
    }
  };

  const handleSelect = (breed) => {
    setQuery(breed);
    setSuggestions([]);
    setLoading(true);

    setTimeout(() => {
      setMatchingBreeds(breedCompatibility[breed] || []);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <h2>Find Best Breeding Partner</h2>
      <input
        type="text"
        placeholder="Enter breed name..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((breed, index) => (
            <li key={index} className="suggestion-item" onClick={() => handleSelect(breed)}>
              {breed}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <span className="loading-text">Analyzing Data...</span>
        </div>
      )}

      {matchingBreeds.length > 0 && !loading && (
        <div className="results-container">
          <h3>Best Breeding Partners for {query}:</h3>
          {matchingBreeds.map((partner, index) => (
            <div key={index} className="breed-card">
              <h4>{partner.breed}</h4>
              <ul>
                {partner.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BreedMatching;
