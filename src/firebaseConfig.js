import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBo8coCH_SF3zOuEDcnxbUTUvcIbT5J9KU",
  authDomain: "gauseva-4fc0d.firebaseapp.com",
  projectId: "gauseva-4fc0d",
  storageBucket: "gauseva-4fc0d.appspot.com",
  messagingSenderId: "164479122826",
  appId: "1:164479122826:web:55e3dbb8d6cd7c834edc73",
  measurementId: "G-3YQ71QKZGG"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };