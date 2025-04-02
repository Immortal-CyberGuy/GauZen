import { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import "../style/VetDoc.css";

const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default center (India)

const VetDoc = () => {
  const [location, setLocation] = useState(null);
  const [vetDoctors, setVetDoctors] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [error, setError] = useState("");
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: "AIzaSyBYXkGIdJJOcfNciG6olnZGOSz7TcT_oP8" });

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

  const fetchVetDoctors = async () => {
    if (!location) {
      setError("Location not available.");
      return;
    }

    setError("");
    const apiKey = "AIzaSyBYXkGIdJJOcfNciG6olnZGOSz7TcT_oP8";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=veterinary_care&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (data.results) {
        setVetDoctors(data.results);
      } else {
        setError(`API Error: ${data.status}`);
      }
    } catch (err) {
      setError("Error fetching data. Check API keys and restrictions.");
      console.error("Fetch error:", err);
    }
  };

  if (loadError) return <p className="error">Error loading maps.</p>;
  if (!isLoaded) return <p className="loading">Loading Maps...</p>;

  return (
    <div className="vet-container">
      <h2>Smart Vet Locator</h2>
      <button onClick={fetchVetDoctors}>Find Nearby Vets</button>

      {error && <p className="error">{error}</p>}

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

      <div className="vet-list">
        {vetDoctors.map((vet, index) => (
          <div key={index} className="vet-card">
            <h3>{vet.name}</h3>
            <p><strong>Address:</strong> {vet.vicinity}</p>
            <p><strong>Phone:</strong> {vet.formatted_phone_number || "Not Available"}</p>
            <p><strong>Email:</strong> {vet.email || "Not Available"}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${vet.geometry.location.lat},${vet.geometry.location.lng}`} target="_blank" rel="noopener noreferrer">
              View on Map
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetDoc;
