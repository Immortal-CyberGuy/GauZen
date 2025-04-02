import { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import "../style/VetDoc.css";

const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const VetDoc = () => {
  const [location, setLocation] = useState(null);
  const [vetDoctors, setVetDoctors] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [error, setError] = useState("");
  const [sortType, setSortType] = useState("rating"); // Default sorting by rating

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setError("Unable to fetch location.")
      );
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchVetDoctors = async () => {
    if (!location) {
      setError("Location not available.");
      return;
    }

    console.log("Fetching vets for:", location);

    try {
      const response = await fetch(`http://localhost:5000/api/vets?lat=${location.lat}&lng=${location.lng}`);
      const data = await response.json();
      console.log("API Response:", data);

      if (data.results) {
        setVetDoctors(data.results);
      } else {
        setError(`API Error: ${data.status}`);
      }
    } catch (err) {
      setError("Error fetching data. Check backend.");
      console.error("Fetch error:", err);
    }
  };

  const sortedVets = [...vetDoctors].sort((a, b) => {
    if (sortType === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else if (sortType === "distance" && location) {
      const distA = calculateDistance(location.lat, location.lng, a.geometry.location.lat, a.geometry.location.lng);
      const distB = calculateDistance(location.lat, location.lng, b.geometry.location.lat, b.geometry.location.lng);
      return distA - distB;
    }
    return 0;
  });

  if (loadError) return <p className="error">Error loading maps.</p>;
  if (!isLoaded) return <p className="loading">Loading Maps...</p>;

  return (
    <div className="vet-container">
      <h2>Smart Vet Locator</h2>
      <button className="fetch-button" onClick={fetchVetDoctors}>Find Nearby Vets</button>

      {error && <p className="error">{error}</p>}

      {/* Sorting Options */}
     

      <div className="map-container">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={location || defaultCenter}>
          {location && <Marker position={location} title="Your Location" />}
          {vetDoctors.map((vet, index) => (
            <Marker
              key={index}
              position={{ lat: vet.geometry.location.lat, lng: vet.geometry.location.lng }}
              onClick={() => setSelectedVet(vet)}
            />
          ))}
          {selectedVet && (
            <InfoWindow position={{ lat: selectedVet.geometry.location.lat, lng: selectedVet.geometry.location.lng }} onCloseClick={() => setSelectedVet(null)}>
              <div>
                <h3>{selectedVet.name}</h3>
                <p>{selectedVet.vicinity}</p>
                <p><strong>Rating:</strong> {selectedVet.rating || "N/A"}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${selectedVet.geometry.location.lat},${selectedVet.geometry.location.lng}`} target="_blank" rel="noopener noreferrer">
                  View on Map
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
      <div className="sort-container">
  <span className="sort-title">Sort By:</span>
  <button className="sort-button" onClick={() => setSortType("rating")}>⭐ Rating</button>
  <button className="sort-button" onClick={() => setSortType("distance")}>📍 Distance</button>
</div>


      {/* Professional Vet List */}
      <div className="vet-list">
        {sortedVets.map((vet, index) => (
          <div key={index} className="vet-card">
            <h3 className="vet-name">{vet.name}</h3>
            <p className="vet-info"><strong>📍 Address:</strong> {vet.vicinity}</p>
            <p className="vet-info"><strong>⭐ Rating:</strong> {vet.rating || "N/A"}</p>
            <p className="vet-info"><strong>📞 Phone:</strong> {vet.formatted_phone_number || "Not Available"}</p>
            <a className="vet-link" href={`https://www.google.com/maps/search/?api=1&query=${vet.geometry.location.lat},${vet.geometry.location.lng}`} target="_blank" rel="noopener noreferrer">
              🔗 View on Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetDoc;
