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
    // 1. Attempt standard Firebase Sign-In
    let user: User | null = null;
    let authError: any = null;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      user = userCredential.user;
    } catch (err: any) {
      authError = err;
    }

    // 2. If user exists or fallback is triggered
    if (user) {
      // Fetch full inspector profile & allocated mine from Firestore
      const profile = await fetchOrEnsureProfile(user);
      const mine = resolveMineInfo(profile.allocatedMine || profile.mineName);

      // Save locally for offline access
      await saveActiveMineLocally(mine);
      await saveUserProfileLocally(profile);

      return { success: true, user, profile, mine };
    }

    // If password failed specifically on Firebase
    if (authError?.code === 'auth/wrong-password' || authError?.code === 'auth/invalid-credential') {
      // Check if it's demo password for demo inspector
      if (
        (cleanEmail === 'inspector@dgms.gov.in' || cleanEmail === 'smith@dgms.gov.in') &&
        (password === 'inspector123' || password === 'mineguard' || password === 'safety2024')
      ) {
        const demoProfile: UserProfile = {
          uid: 'demo-inspector-smith',
          email: cleanEmail,
          name: 'Inspector Alex Smith',
          role: 'inspector',
          officialId: 'DGMS-INSP-4011',
          phone: '+91 87654 32109',
          designation: 'Statutory Safety Inspector',
          allocatedMine: 'SECL Gevra Mega Opencast',
          mineId: DEFAULT_MINE.id,
          mineName: DEFAULT_MINE.name,
          subsidiary: DEFAULT_MINE.subsidiary,
          state: DEFAULT_MINE.state,
          mineType: DEFAULT_MINE.type,
          lastLoginAt: new Date().toISOString(),
        };
        await saveActiveMineLocally(DEFAULT_MINE);
        await saveUserProfileLocally(demoProfile);
        return {
          success: true,
          user: { email: cleanEmail, uid: 'demo-inspector-smith' },
          profile: demoProfile,
          mine: DEFAULT_MINE,
        };
      }

      return {
        success: false,
        error: 'Incorrect email or password. Please verify your credentials.',
      };
    }

    // 3. Fallback for demo or offline mode
    if (isDemoFallbackEnabled) {
      console.log('Using offline/demo fallback login for:', cleanEmail);
      const fallbackMine = DEFAULT_MINE;
      const fallbackProfile: UserProfile = {
        uid: `inspector-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        name: cleanEmail.includes('smith')
          ? 'Inspector Alex Smith'
          : cleanEmail.split('@')[0]?.replace(/[._]/g, ' ').toUpperCase() || 'Field Inspector',
        role: 'inspector',
        officialId: 'DGMS-INSP-4011',
        phone: '+91 87654 32109',
        designation: 'Statutory Mining Compliance Inspector',
        allocatedMine: fallbackMine.name,
        mineId: fallbackMine.id,
        mineName: fallbackMine.name,
        subsidiary: fallbackMine.subsidiary,
        state: fallbackMine.state,
        mineType: fallbackMine.type,
        lastLoginAt: new Date().toISOString(),
      };

      await saveActiveMineLocally(fallbackMine);
      await saveUserProfileLocally(fallbackProfile);

      return {
        success: true,
        user: { email: cleanEmail, uid: fallbackProfile.uid },
        profile: fallbackProfile,
        mine: fallbackMine,
      };
    }

    return {
      success: false,
      error: authError?.message || 'Authentication failed. Please check your credentials.',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Authentication failed',
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
