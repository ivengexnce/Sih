// Firebase Client Configuration & Cloud Storage Connection
// In Demo mode, storage falls back gracefully to LocalStorageAdapter.
// In Production, provide your Firebase credentials in .env.local to activate live Firestore & Cloud Storage.

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mineguard-sih-2026.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mineguard-sih-2026",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mineguard-sih-2026.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "882194019283",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:882194019283:web:a91fb402bca7e8"
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== ""
  );
};

export const getStorageEngineMode = (): "firebase" | "local_storage_demo" => {
  if (typeof window !== "undefined") {
    const forcedLocal = localStorage.getItem("mineguard_force_local");
    if (forcedLocal === "true") return "local_storage_demo";
  }
  return isFirebaseConfigured() ? "firebase" : "local_storage_demo";
};
