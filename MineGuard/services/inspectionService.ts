/**
 * Inspection Firebase Service
 *
 * Provides functions to read and write inspection records to Cloud Firestore (`inspections` collection).
 * Complies with Firestore Security Rules requiring `request.auth != null`.
 * Formats compliance payloads for seamless consumption by Mine Managers and Corporate Admins.
 */
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { CompletedInspection } from '@/context/InspectionContext';

const INSPECTIONS_COLLECTION = 'inspections';

/**
 * Save or sync a completed inspection to Firestore.
 * Requires an authenticated user session per Firestore rules.
 */
export async function saveInspectionToFirestore(
  inspection: CompletedInspection
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = auth.currentUser;
    const docRef = doc(db, INSPECTIONS_COLLECTION, inspection.inspectionId);

    const nowIso = new Date().toISOString();

    const firestorePayload = {
      ...inspection,
      id: inspection.inspectionId,
      mineId: inspection.setup.mineId || 'BCCL-JHR-01',
      mineName: inspection.setup.mine,
      area: inspection.setup.area,
      level: inspection.setup.level,
      panel: inspection.setup.panel,
      inspectionType: inspection.setup.inspectionType,
      category: inspection.observation.category,
      description: inspection.observation.description,
      severity: inspection.observation.severity.toUpperCase(),
      status: 'Pending Review',
      escalationStatus: 'PENDING_MINE_MANAGER',
      inspectorId: currentUser?.uid || 'inspector-officer-01',
      inspectorEmail: currentUser?.email || 'officer@coalmine.gov.in',
      syncedAt: nowIso,
      updatedAt: nowIso,
      createdAt: nowIso,
    };

    await setDoc(docRef, firestorePayload, { merge: true });
    console.log('Successfully saved inspection to Firestore:', inspection.inspectionId, 'Mine:', inspection.setup.mine);
    return { success: true };
  } catch (error: any) {
    console.warn('Failed to save inspection to Firestore:', error?.message || error);
    return { success: false, error: error?.message || 'Failed to save to database' };
  }
}

/**
 * Fetch latest inspections from Cloud Firestore, optionally filtered by mineId.
 */
export async function fetchInspectionsFromFirestore(
  maxCount: number = 20,
  mineId?: string
): Promise<{ success: boolean; data: CompletedInspection[]; error?: string }> {
  try {
    if (!auth.currentUser) {
      return { success: false, data: [], error: 'User is not authenticated' };
    }

    let q = query(
      collection(db, INSPECTIONS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxCount)
    );

    if (mineId) {
      q = query(
        collection(db, INSPECTIONS_COLLECTION),
        where('mineId', '==', mineId),
        orderBy('createdAt', 'desc'),
        limit(maxCount)
      );
    }

    const snapshot = await getDocs(q);
    const inspections: CompletedInspection[] = [];

    snapshot.forEach((d) => {
      inspections.push(d.data() as CompletedInspection);
    });

    return { success: true, data: inspections };
  } catch (error: any) {
    console.warn('Failed to fetch inspections from Firestore:', error?.message || error);
    return { success: false, data: [], error: error?.message || 'Failed to fetch from database' };
  }
}
