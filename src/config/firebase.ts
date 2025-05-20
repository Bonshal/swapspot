// Firebase configuration for SwapSpot
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
// Replace with your actual Firebase config values from the Firebase console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "swapspot-marketplace.firebaseapp.com",
  projectId: "swapspot-marketplace",
  storageBucket: "swapspot-marketplace.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
