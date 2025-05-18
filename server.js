import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import admin from "firebase-admin";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ——————————————————————————
// 🔑 Firebase Admin Initialization
// ——————————————————————————
if (!process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
  console.error("❌ Missing env var: FIREBASE_SERVICE_ACCOUNT_B64");
  process.exit(1);
}

const serviceAccountJson = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_B64,
  "base64"
).toString("utf-8");

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (err) {
  console.error("❌ Failed to parse service account JSON:", err);
  process.exit(1);
}

if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ——————————————————————————
// 📜 Security Headers (CSP)
// ——————————————————————————
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://apis.google.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "font-src 'self' data:; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://*.googleapis.com; " +
      "frame-src 'self';"
  );
  next();
});

// ——————————————————————————
// 🗂️ Serve Static Files
// ——————————————————————————
app.use(express.static(resolve(__dirname, "dist")));

// ——————————————————————————
// 🔍 API Endpoints
// ——————————————————————————

app.get("/api/breed", async (req, res) => {
  const { breedName } = req.query;
  if (!breedName) {
    return res.status(400).json({ error: "Breed name required" });
  }

  try {
    const collections = ["cow_breed_general", "cow_breed_specific"];
    const [generalDoc, specificDoc] = await Promise.all(
      collections.map((col) => db.collection(col).doc(breedName).get())
    );

    const generalData = generalDoc.exists ? Object.values(generalDoc.data()) : [];
    const specificData = specificDoc.exists
      ? [
          specificDoc.data().g1,
          specificDoc.data().g2,
          specificDoc.data().g3,
          specificDoc.data().g4,
          specificDoc.data().g5,
        ]
      : [];

    res.json({ general: generalData, specific: specificData });
  } catch (error) {
    console.error("🔥 Error fetching breed data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/vets", async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!lat || !lng) return res.status(400).json({ error: "Latitude and Longitude required" });
  if (!apiKey) return res.status(500).json({ error: "Google Maps API Key not configured" });

  const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=veterinary_care&key=${apiKey}`;
  try {
    const response = await fetch(nearbyUrl);
    const data = await response.json();
    if (data.status !== "OK") {
      console.error("🔥 Google API Error:", data);
      return res.status(500).json({ error: "Failed to fetch vet data" });
    }

    const enrichedResults = await Promise.all(
      data.results.map(async (place) => {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number&key=${apiKey}`;
        try {
          const detailRes = await fetch(detailUrl);
          const detailData = await detailRes.json();
          return { ...place, formatted_phone_number: detailData.result.formatted_phone_number || null };
        } catch {
          return { ...place, formatted_phone_number: null };
        }
      })
    );

    res.json({ results: enrichedResults });
  } catch (error) {
    console.error("🔥 Error fetching Google Places API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/breed-compatibility", async (req, res) => {
  const { breed } = req.query;
  if (!breed) return res.status(400).json({ error: "Breed name required" });

  try {
    const doc = await db.collection("breed_compatibility").doc(breed).get();
    if (!doc.exists) return res.status(404).json({ error: "Breed not found" });
    res.json({ partners: doc.data().compatibleBreeds || [] });
  } catch (error) {
    console.error("🔥 Error fetching compatibility:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ——————————————————————————
// 🔄 SPA Fallback
// ——————————————————————————
app.get("/*", (req, res) => {
  res.sendFile(resolve(__dirname, "dist", "index.html"));
});

// ——————————————————————————
// 🚨 Global Error Handler
// ——————————————————————————
app.use((err, req, res, next) => {
  console.error("🚨 Uncaught error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// ——————————————————————————
// 🚀 Start Server
// ——————————————————————————
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
