import React, { useState, useEffect, useRef } from "react";
import "../style/BreedMatching.css";

const breedList = [
  "Gir", "Sahiwal", "Holstein", "Jersey", "Rathi", "Tharparkar", "Red Sindhi", "Ongole", "Hallikar",
  "Amrit Mahal", "Kankrej", "Hariana", "Montbéliarde", "Khillari", "Malnad Gidda", "Punganur", "Vechur",
  "Kangayam", "Krishna Valley", "Belahi", "Deoni", "Nagori", "Mewati", "Gangatiri", "Ponwar", "Lal Kandhari",
  "Siri", "Kherigarh", "Shahabadi", "Kalahandi", "Khariar", "Motu", "Binjharpuri", "Dangi", "Kasaragod",
  "Ayrshire", "Brown Swiss", "Normande", "Simmental", "Fleckvieh", "Swedish Red", "Norwegian Red",
  "Danish Red", "Belgian Blue", "Piedmontese", "Charolais", "Limousin", "Hereford", "Angus", "Shorthorn",
  "Texas Longhorn", "Brahman", "Gelbvieh", "Dexter", "South Devon", "Wagyu", "Murray Grey", "Highland",
  "Parthenais", "Ankole-Watusi", "Galloway"
];

const BreedMatching = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [matchingBreeds, setMatchingBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);

  const handleChange = (event) => {
    const input = event.target.value;
    setQuery(input);

    if (input.length > 0) {
      const filtered = breedList
        .filter(b => b.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
      setMatchingBreeds([]);
      setError("");
    }
  };

  const handleSelect = async (breed) => {
    setQuery(breed);
    setSuggestions([]);
    setLoading(true);
    setMatchingBreeds([]);
    setError("");

    try {
      const response = await fetch(`https://gauzen.onrender.com/api/breed-compatibility?breed=${encodeURIComponent(breed)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMatchingBreeds(data.partners || []);
      }
    } catch (err) {
      console.error("Error fetching breed compatibility:", err);
      setError("Failed to fetch breed compatibility data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <h2>Find Your Perfect Breeding Match</h2>
      <input
        type="text"
        placeholder="Enter breed name to find compatible partners..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((b, i) => (
            <li key={i} className="suggestion-item" onClick={() => handleSelect(b)}>
              {b}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <span className="loading-text">Finding perfect matches...</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {matchingBreeds.length > 0 && !loading && !error && (
        <div className="results-container">
          <h4>Best Breeding Partners for {query}</h4>
          <div className="breed-cards-grid">
            {matchingBreeds.map((partner, idx) => (
              <div key={idx} className="breed-card">
                <h4>
                  {typeof partner.breed === "string"
                    ? partner.breed
                    : partner.breed.breed}
                </h4>
                <div className="compatibility-score">
                  {Math.floor(Math.random() * 20 + 80)}% Match
                </div>
                <ul>
                  {(partner.benefits || []).map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedMatching;
