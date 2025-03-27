import React, { useState, useEffect, useRef } from "react";
import "../style/BreedSearchBar.css";

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

const BreedSearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Handle input change & filter suggestions
  const handleChange = (event) => {
    const input = event.target.value;
    setQuery(input);

    if (input.length > 0) {
      const filteredSuggestions = breedList
        .filter(breed => breed.toLowerCase().includes(input.toLowerCase())) // Case-insensitive search
        .slice(0, 6); // Show top 6 suggestions
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle selection from suggestions
  const handleSelect = (breed) => {
    setQuery(breed);
    setSuggestions([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        placeholder="Search for a breed..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list active">
          {suggestions.map((breed, index) => (
            <li key={index} className="suggestion-item" onClick={() => handleSelect(breed)}>
              {breed}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BreedSearchBar;
