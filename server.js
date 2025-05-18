import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fetch from 'node-fetch';
import { Buffer } from 'buffer';

// Load environment variables
dotenv.config();

// Decode and initialize Firebase Admin SDK
if (!process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
  console.error('🔥 FIREBASE_SERVICE_ACCOUNT_B64 is not set');
  process.exit(1);
}

let serviceAccount;
try {
  const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8');
  serviceAccount = JSON.parse(decoded);
} catch (err) {
  console.error('🔥 Failed to parse Firebase service account JSON:', err);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 10000;

// CSP Middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' data: https:; script-src 'self' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:;"
  );
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint: Get nearby veterinary clinics
app.get('/api/vets', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude required' });
  }
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Maps API Key not configured' });
  }

  const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=veterinary_care&key=${apiKey}`;
  try {
    const response = await fetch(nearbyUrl);
    const data = await response.json();

    if (!['OK', 'ZERO_RESULTS'].includes(data.status)) {
      console.error('🔥 Google API Error:', data);
      return res.status(500).json({ error: 'Failed to fetch vet data' });
    }

    const enrichedResults = await Promise.all(
      data.results.map(async (place) => {
        if (!place.place_id) return place;

        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number&key=${apiKey}`;
        try {
          const detailRes = await fetch(detailUrl);
          const detailData = await detailRes.json();
          return {
            ...place,
            formatted_phone_number: detailData.result?.formatted_phone_number || null
          };
        } catch (e) {
          console.warn('⚠️ Detail fetch failed:', e);
          return { ...place, formatted_phone_number: null };
        }
      })
    );

    res.json({ results: enrichedResults });
  } catch (error) {
    console.error('🔥 Error fetching Google Places API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Get breed compatibility
app.get('/api/breed-compatibility', async (req, res) => {
  const { breed } = req.query;
  if (!breed) {
    return res.status(400).json({ error: 'Breed name required' });
  }

  try {
    const doc = await db.collection('breed_compatibility').doc(breed).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Breed not found' });
    }
    const data = doc.data();
    const partners = (data.compatibleBreeds || []).map((partner) => ({
      breed: partner,
      benefits: Array.isArray(data.benefits?.[partner])
        ? data.benefits[partner]
        : []
    }));
    res.json({ partners });
  } catch (error) {
    console.error('🔥 Error fetching compatibility:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
