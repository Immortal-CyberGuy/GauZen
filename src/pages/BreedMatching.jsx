import React, { useState, useEffect, useRef } from "react";
import "../style/BreedMatching.css";

const breedCompatibility = {
  "Gir": ["Sahiwal", "Tharparkar", "Red Sindhi"],
  "Sahiwal": ["Gir", "Kankrej", "Hariana"],
  "Holstein": ["Jersey", "Brown Swiss", "Normande"],
  "Jersey": ["Holstein", "Ayrshire", "Brown Swiss"],
  "Rathi": ["Gir", "Kankrej", "Tharparkar"],
  "Tharparkar": ["Gir", "Sahiwal", "Rathi"],
  "Red Sindhi": ["Gir", "Sahiwal", "Hariana"],
  "Ongole": ["Kankrej", "Hallikar", "Amrit Mahal"],
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
          <div className="loading-glow"></div>
          <div className="loading-circle"></div>
          <span className="loading-text">Analyzing Data...</span>
        </div>
      )}

      {matchingBreeds.length > 0 && !loading && (
        <div className="results-container">
          <h3>Best Breeding Partners for {query}:</h3>
          <ul>
            {matchingBreeds.map((partner, index) => (
              <li key={index}>{partner}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BreedMatching;
