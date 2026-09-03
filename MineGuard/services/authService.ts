/**
 * Authentication Service
 *
 * Connects to Firebase Authentication & Firestore.
 * Automatically loads inspector profile and allocated mine registered from the web dashboard.
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/lib/firebase';
import { DEFAULT_MINE, MINES, MineInfo } from '@/constants/mines';

const MINE_STORAGE_KEY = '@mineguard_active_mine';
const PROFILE_STORAGE_KEY = '@mineguard_user_profile';

const isDemoFallbackEnabled =
  process.env.EXPO_PUBLIC_ENABLE_DEMO_FALLBACK === 'true' ||
  process.env.NEXT_PUBLIC_ENABLE_DEMO_FALLBACK === 'true' ||
  true;

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'inspector' | 'mine_manager' | 'corporate_admin' | string;
  phone?: string;
  officialId?: string;
  designation?: string;
  allocatedMine: string;
  mineId: string;
  mineName: string;
  subsidiary?: string;
  state?: string;
  mineType?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface InspectorRecord extends UserProfile {
  inspectorId: string;
  subsidiary: string;
  mineType: string;
  state: string;
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

/**
 * Match an allocated mine name from Firestore against the local MINES directory
 */
export function resolveMineInfo(allocatedMineName?: string): MineInfo {
  if (!allocatedMineName) return DEFAULT_MINE;

  const cleanQuery = allocatedMineName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Exact or contains match in predefined MINES
  const found = MINES.find((m) => {
    const cleanMineName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanMineLabel = m.fullLabel.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = m.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      cleanMineName.includes(cleanQuery) ||
      cleanQuery.includes(cleanMineName) ||
      cleanMineLabel.includes(cleanQuery) ||
      cleanQuery.includes(cleanMineLabel) ||
      cleanId === cleanQuery
    );
  });

  if (found) return found;

  // Synthesize MineInfo if custom registered mine
  const code = allocatedMineName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 4);

  return {
    id: allocatedMineName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: allocatedMineName,
    fullLabel: allocatedMineName,
    subsidiary: 'SECL / CIL',
    state: 'Chhattisgarh',
    type: 'Opencast',
    code: `MINE-${code}`,
    defaultArea: 'General Pit Area',
    defaultLevel: '+140m RL',
    defaultPanel: 'Panel 01',
  };
}

/**
 * Log in inspector with Email & Password.
 * Automatically loads all inspector info & allocated mine from Firebase.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: User | { email: string; uid: string };
  profile?: UserProfile;
  mine?: MineInfo;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Attempt real Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    // Fetch full inspector profile & allocated mine from Firestore
    const profile = await fetchOrEnsureProfile(user);
    const mine = resolveMineInfo(profile.allocatedMine || profile.mineName);

    // Cache locally for offline session resilience
    await saveActiveMineLocally(mine);
    await saveUserProfileLocally(profile);

    return { success: true, user, profile, mine };
  } catch (error: any) {
    console.warn('[Firebase Auth] Login error:', error?.code, error?.message);
    
    let friendlyError = 'Authentication failed. Please verify your credentials.';
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      friendlyError = 'Invalid email or password. Please check your credentials in Firebase.';
    } else if (error?.code === 'auth/wrong-password') {
      friendlyError = 'Incorrect password. Please try again.';
    } else if (error?.code === 'auth/invalid-email') {
      friendlyError = 'Please enter a valid official email address.';
    } else if (error?.code === 'auth/network-request-failed') {
      friendlyError = 'Network error. Please check your internet connection.';
    } else if (error?.code === 'auth/too-many-requests') {
      friendlyError = 'Too many failed login attempts. Please try again later.';
    } else if (error?.message) {
      friendlyError = error.message;
    }

    return {
      success: false,
      error: friendlyError,
    };
  }
}

/**
 * Fetch inspector profile from Firestore across /inspectors, /users, or /officers collections
 */
async function fetchOrEnsureProfile(user: User): Promise<UserProfile> {
  const emailKey = (user.email || '').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
  let data: any = null;

  try {
    // 1. Try /inspectors/{uid}
    const inspSnap = await getDoc(doc(db, 'inspectors', user.uid));
    if (inspSnap.exists()) {
      data = inspSnap.data();
    } else {
      // 2. Try /users/{uid}
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        data = userSnap.data();
      } else {
        // 3. Try /inspectors_by_email/{emailKey}
        const emailSnap = await getDoc(doc(db, 'inspectors_by_email', emailKey));
        if (emailSnap.exists()) {
          data = emailSnap.data();
        } else {
          // 4. Try /officers/{emailKey}
          const offSnap = await getDoc(doc(db, 'officers', emailKey));
          if (offSnap.exists()) {
            data = offSnap.data();
          }
        }
      }
    }
  } catch (e) {
    console.warn('Firestore profile fetch notice:', e);
  }

  const allocatedMineName = data?.allocatedMine || data?.mineName || DEFAULT_MINE.name;
  const mine = resolveMineInfo(allocatedMineName);

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    name: data?.name || user.displayName || user.email?.split('@')[0] || 'Field Inspector',
    role: data?.role || 'inspector',
    phone: data?.phone || '',
    officialId: data?.officialId || 'DGMS-INSP-4011',
    designation: data?.designation || 'Statutory Mining Compliance Inspector',
    allocatedMine: mine.name,
    mineId: mine.id,
    mineName: mine.name,
    subsidiary: mine.subsidiary,
    state: mine.state,
    mineType: mine.type,
    createdAt: data?.createdAt || data?.registeredAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  // Keep Firestore in sync
  try {
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    await setDoc(doc(db, 'inspectors', user.uid), { ...profile, inspectorId: user.uid, status: 'ACTIVE' }, { merge: true });
  } catch (e) {
    console.warn('Firestore profile update notice:', e);
  }

  return profile;
}

/**
 * Store assigned mine locally
 */
export async function saveActiveMineLocally(mine: MineInfo): Promise<void> {
  try {
    await AsyncStorage.setItem(MINE_STORAGE_KEY, JSON.stringify(mine));
  } catch (e) {
    console.warn('Could not save active mine locally:', e);
  }
}

/**
 * Retrieve active assigned mine locally
 */
export async function getActiveMineLocally(): Promise<MineInfo> {
  try {
    const stored = await AsyncStorage.getItem(MINE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const found = MINES.find((m) => m.id === parsed.id);
      if (found) return found;
      return parsed;
    }
  } catch (e) {
    console.warn('Could not read active mine locally:', e);
  }
  return DEFAULT_MINE;
}

/**
 * Store user profile locally
 */
export async function saveUserProfileLocally(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not save user profile locally:', e);
  }
}

/**
 * Retrieve user profile locally
 */
export async function getUserProfileLocally(): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not read user profile locally:', e);
  }
  return null;
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.warn('Sign out error:', error);
    return { success: true };
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Fetch user profile from `/users/{userId}`
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch user profile:', error);
    return null;
  }
}
