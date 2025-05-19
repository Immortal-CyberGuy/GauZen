// import { useState, useEffect } from "react";
// import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
// import "../style/VetDoc.css";

// const mapContainerStyle = { width: "100%", height: "500px" };
// const defaultCenter = { lat: 20.5937, lng: 78.9629 };
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

// const VetDoc = () => {
//   const [location, setLocation] = useState(null);
//   const [vetDoctors, setVetDoctors] = useState([]);
//   const [selectedVet, setSelectedVet] = useState(null);
//   const [error, setError] = useState("");
//   const [sortType, setSortType] = useState("rating");
//   const [isLoading, setIsLoading] = useState(false);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//   });

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//         () => setError("Unable to fetch location.")
//       );
//     } else {
//       setError("Geolocation not supported.");
//     }
//   }, []);

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const toRad = deg => (deg * Math.PI) / 180;
//     const R = 6371;
//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const fetchVetDoctors = async () => {
//     if (!location) {
//       setError("Location not available.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         `${BACKEND_URL}/api/vets?lat=${location.lat}&lng=${location.lng}`,
//         {
//           method: 'GET',
//           headers: {
//             'Accept': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.results) {
//         setVetDoctors(data.results);
//       } else {
//         throw new Error(data.status || 'Failed to fetch vet data');
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError(
//         "Unable to fetch vet data. Please ensure the backend server is running and try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sortedVets = [...vetDoctors].sort((a, b) => {
//     if (sortType === "rating") {
//       return (b.rating || 0) - (a.rating || 0);
//     } else if (sortType === "distance" && location) {
//       const distA = calculateDistance(location.lat, location.lng, a.geometry.location.lat, a.geometry.location.lng);
//       const distB = calculateDistance(location.lat, location.lng, b.geometry.location.lat, b.geometry.location.lng);
//       return distA - distB;
//     }
//     return 0;
//   });

//   if (loadError) return <p className="error">Error loading maps.</p>;
//   if (!isLoaded) return <p className="loading">Loading Maps...</p>;

//   return (
//     <div className="vet-container">
//       <h2>Smart Vet Locator</h2>
//       <button
//         className="fetch-button"
//         onClick={fetchVetDoctors}
//         disabled={isLoading}
//       >
//         {isLoading ? "Loading..." : "Find Nearby Vets"}
//       </button>
//       {error && <p className="error">{error}</p>}

//       <div className="map-container">
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           zoom={12}
//           center={location || defaultCenter}
//         >
//           {location && <Marker position={location} title="Your Location" />}
//           {vetDoctors.map((vet, index) => (
//             <Marker
//               key={index}
//               position={{
//                 lat: vet.geometry.location.lat,
//                 lng: vet.geometry.location.lng
//               }}
//               onClick={() => setSelectedVet(vet)}
//             />
//           ))}
//           {selectedVet && (
//             <InfoWindow
//               position={{
//                 lat: selectedVet.geometry.location.lat,
//                 lng: selectedVet.geometry.location.lng
//               }}
//               onCloseClick={() => setSelectedVet(null)}
//             >
//               <div>
//                 <h3>{selectedVet.name}</h3>
//                 <p>{selectedVet.vicinity}</p>
//                 <p><strong>Rating:</strong> {selectedVet.rating || "N/A"}</p>
//                 {selectedVet.formatted_phone_number && (
//                   <p>
//                     <strong>Phone:</strong>{" "}
//                     <a href={`tel:${selectedVet.formatted_phone_number}`}>
//                       {selectedVet.formatted_phone_number}
//                     </a>
//                   </p>
//                 )}
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       </div>

//       <div className="sort-container">
//         <span className="sort-title">Sort By:</span>
//         <button className="sort-button" onClick={() => setSortType("rating")}>
//            Rating
//         </button>
//         <button className="sort-button" onClick={() => setSortType("distance")}>
//            Distance
//         </button>
//       </div>

//       <div className="vet-list">
//         {sortedVets.map((vet, index) => (
//           <div key={index} className="vet-card">
//             <h3 className="vet-name">{vet.name}</h3>
//             <p className="vet-info">
//               <strong> Address:</strong> {vet.vicinity}
//             </p>
//             <p className="vet-info">
//               <strong> Rating:</strong> {vet.rating || "N/A"}
//             </p>
//             <p className="vet-info">
//               <strong> Phone:</strong>{" "}
//               {vet.formatted_phone_number ? (
//                 <a href={`tel:${vet.formatted_phone_number}`} className="phone-link">
//                   {vet.formatted_phone_number}
//                 </a>
//               ) : (
//                 "Not Available"
//               )}
//             </p>
//             <a
//               className="vet-link"
//               href={`https://www.google.com/maps/search/?api=1&query=${vet.geometry.location.lat},${vet.geometry.location.lng}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//                View on Google Maps
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VetDoc;

import { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import "../style/VetDoc.css";

const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 };
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:10000";

const VetDoc = () => {
  const [location, setLocation] = useState(null);
  const [vetDoctors, setVetDoctors] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [error, setError] = useState("");
  const [sortType, setSortType] = useState("rating");
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

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
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchVetDoctors = async () => {
    if (!location) {
      setError("Location not available.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      console.log(`Fetching vets from backend: ${BACKEND_URL}/api/vets?lat=${location.lat}&lng=${location.lng}`);
      const response = await fetch(`${BACKEND_URL}/api/vets?lat=${location.lat}&lng=${location.lng}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Error status: ${response.status}`);
      const data = await response.json();

      if (data.results) {
        setVetDoctors(data.results);
      } else {
        setError("No vets found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vet data.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedVets = [...vetDoctors].sort((a, b) => {
    if (sortType === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortType === "distance" && location) {
      return (
        calculateDistance(location.lat, location.lng, a.geometry.location.lat, a.geometry.location.lng) -
        calculateDistance(location.lat, location.lng, b.geometry.location.lat, b.geometry.location.lng)
      );
    }
    return 0;
  });

  if (loadError) return <p className="error">Error loading maps.</p>;
  if (!isLoaded) return <p className="loading">Loading Maps...</p>;

  return (
    <div className="vet-container">
      <h2>Smart Vet Locator</h2>
      <button className="fetch-button" onClick={fetchVetDoctors} disabled={isLoading}>
        {isLoading ? "Loading..." : "Find Nearby Vets"}
      </button>
      {error && <p className="error">{error}</p>}

      <div className="map-container">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={location || defaultCenter}>
          {location && <Marker position={location} title="Your Location" />}
          {vetDoctors.map((vet, i) => (
            <Marker
              key={i}
              position={{ lat: vet.geometry.location.lat, lng: vet.geometry.location.lng }}
              onClick={() => setSelectedVet(vet)}
            />
          ))}
          {selectedVet && (
            <InfoWindow
              position={{ lat: selectedVet.geometry.location.lat, lng: selectedVet.geometry.location.lng }}
              onCloseClick={() => setSelectedVet(null)}
            >
              <div>
                <h3>{selectedVet.name}</h3>
                <p>{selectedVet.vicinity}</p>
                <p><strong>Rating:</strong> {selectedVet.rating || "N/A"}</p>
                {selectedVet.formatted_phone_number && (
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${selectedVet.formatted_phone_number}`}>{selectedVet.formatted_phone_number}</a>
                  </p>
                )}
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

      <div className="vet-list">
        {sortedVets.map((vet, i) => (
          <div key={i} className="vet-card">
            <h3 className="vet-name">{vet.name}</h3>
            <p className="vet-info"><strong>📍 Address:</strong> {vet.vicinity}</p>
            <p className="vet-info"><strong>⭐ Rating:</strong> {vet.rating || "N/A"}</p>
            <p className="vet-info">
              <strong>📞 Phone:</strong>{" "}
              {vet.formatted_phone_number ? (
                <a href={`tel:${vet.formatted_phone_number}`} className="phone-link">{vet.formatted_phone_number}</a>
              ) : (
                "Not Available"
              )}
            </p>
            <a
              className="vet-link"
              href={`https://www.google.com/maps/search/?api=1&query=${vet.geometry.location.lat},${vet.geometry.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 View on Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetDoc;
