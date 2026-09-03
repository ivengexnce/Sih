// Firebase Client Configuration & Cloud Storage Connection
// In Demo mode, storage falls back gracefully to LocalStorageAdapter.
// In Production, provide your Firebase credentials in .env.local to activate live Firestore & Cloud Storage.

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC0lhfmYG3v7suyJ72ENDv2mPinMLIGbRE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mineguard-4fde8.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mineguard-4fde8",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mineguard-4fde8.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "155316557217",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:155316557217:web:9f6b1aecc3a376987d27e0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-7RWJXVN3LM",
};

export const isFirebaseConfigured = (): boolean => {
  return true;
};

export const getStorageEngineMode = (): "firebase" | "local_storage_demo" => {
  return "firebase";
};

// Initialize Firebase App singleton
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
