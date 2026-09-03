/**
 * Firebase Configuration & Service Initializer
 *
 * Configures Firebase Auth, Firestore, and Storage for MineGuard / CoalGuard Inspector.
 * Uses AsyncStorage for React Native persistence to eliminate Auth persistence warnings
 * and maintain persistent authentication sessions.
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyBqIycMpAUhAL0I_hqZPGajAWmwfc8oUI4',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'mineguard-1f956.firebaseapp.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'mineguard-1f956',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'mineguard-1f956.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    '651191051109',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:651191051109:web:bd806d57dee713c594378c',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    'G-4EHCLHFHFM',
};

// Initialize Firebase App singleton
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native AsyncStorage persistence
// Prevents duplicate initializations during Expo fast refresh / hot reload
function getOrInitializeAuth(firebaseApp: FirebaseApp): Auth {
  if (Platform.OS === 'web') {
    try {
      return initializeAuth(firebaseApp);
    } catch {
      return getAuth(firebaseApp);
    }
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

const auth: Auth = getOrInitializeAuth(app);

// Initialize Cloud Firestore & Storage
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage, firebaseConfig };
