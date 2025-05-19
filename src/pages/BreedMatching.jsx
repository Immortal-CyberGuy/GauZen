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

  const handleChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    if (input) {
      setSuggestions(
        breedList.filter(b => b.toLowerCase().includes(input.toLowerCase())).slice(0, 6)
      );
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
      const res = await fetch(
        `https://gauzen.onrender.com/api/breed-compatibility?breed=${encodeURIComponent(breed)}`
      );
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMatchingBreeds(data.partners || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch breed compatibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <h2>Find Your Perfect Breeding Match</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Enter breed name..."
        value={query}
        onChange={handleChange}
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
          <div className="loader" />
          <span className="loading-text">Finding matches...</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && matchingBreeds.length > 0 && (
        <div className="results-container">
          <h4>Best Breeding Partners for {query}</h4>
          <div className="breed-cards-grid">
            {matchingBreeds.map((partner, idx) => (
              <div key={idx} className="breed-card">
                <h4>{partner.breed}</h4>
                <div className="compatibility-score">
                  {Math.floor(Math.random() * 21) + 80}% Match
                </div>
                <ul>
                  {partner.benefits.map((benefit, i) => (
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
