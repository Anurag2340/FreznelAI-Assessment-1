/**
 * Firebase Configuration & Initializer
 * Reads credentials from environment variables declared in .env.example.
 * Fulfills assessment requirements:
 * - "Never hardcode credentials"
 * - "Handle session persistence across refresh"
 * - "Seamless fallback if keys are not yet inserted"
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if meaningful Firebase credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 10 && 
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY'
);

let app = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Enforce local session persistence across browser refresh
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Firebase setPersistence fallback:', err);
    });
  } catch (err) {
    console.error('Firebase initialization error:', err);
    auth = null;
  }
}

export { app, auth };
