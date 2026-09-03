/**
 * Inspection Firebase Service
 *
 * Provides functions to read and write inspection records to Cloud Firestore (`inspections` collection).
 * Complies with Firestore Security Rules and formats compliance payloads for seamless consumption
 * by Mine Managers and Inspector Web Dashboards.
 */
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { CompletedInspection, SeverityLevel } from '@/context/InspectionContext';

const INSPECTIONS_COLLECTION = 'inspections';

/**
 * Normalizes any Firestore document into a valid CompletedInspection record.
 */
export function normalizeFirestoreInspection(d: any): CompletedInspection {
  const inspectionId = d.inspectionId || d.id || `INS-${Math.floor(10000 + Math.random() * 90000)}`;
  
  let sev: SeverityLevel = 'Medium';
  const rawSev = (d.severity || d.observation?.severity || 'Medium').toString().toUpperCase();
  if (rawSev === 'HIGH' || rawSev === 'CRITICAL') sev = 'High';
  else if (rawSev === 'LOW') sev = 'Low';
  else sev = 'Medium';

  const timeString = d.timestamp || d.createdAt || d.submittedAt || new Date().toISOString();

  return {
    inspectionId,
    timestamp: timeString,
    setup: d.setup || {
      mine: d.mineName || d.mine || 'Active Colliery Project',
      mineId: d.mineId || 'BCCL-JHR-01',
      area: d.area || d.section || 'General Pit Area',
      level: d.level || '+140m RL',
      panel: d.panel || 'Panel 01',
      inspectionType: d.inspectionType || 'Statutory Shift Inspection',
    },
    observation: d.observation || {
      category: d.category || 'General Safety',
      description: d.description || d.findingsNote || d.notes || 'Inspection recorded via field client.',
      severity: sev,
      actionRequired: d.actionRequired || 'Standard Compliance Review',
    },
    location: d.location || {
      zone: d.area || 'Zone A',
      subLocation: d.level || '',
      coordinates: d.coordinates || { latitude: 23.7957, longitude: 86.4304 },
      gpsAccuracy: d.gpsAccuracy || 'High (GPS Locked)',
    },
    evidence: Array.isArray(d.evidence) ? d.evidence : [],
    submittedAt: timeString,
    status: d.status === 'Pending Sync' ? 'Pending Sync' : 'Synced',
    inspectorEmail: d.inspectorEmail || d.inspector || '',
    inspectorName: d.inspectorName || d.inspector || '',
  };
}

/**
 * Save or sync a completed inspection to Firestore.
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
      inspectionId: inspection.inspectionId,
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
      createdAt: inspection.submittedAt || nowIso,
    };

    await setDoc(docRef, firestorePayload, { merge: true });
    console.log('[Firestore] Successfully saved inspection:', inspection.inspectionId, 'Mine:', inspection.setup.mine);
    return { success: true };
  } catch (error: any) {
    console.warn('[Firestore] Failed to save inspection:', error?.message || error);
    return { success: false, error: error?.message || 'Failed to save to database' };
  }
}

/**
 * Fetch latest inspections from Cloud Firestore, optionally filtered by mine.
 */
export async function fetchInspectionsFromFirestore(
  maxCount: number = 30,
  mineIdOrName?: string
): Promise<{ success: boolean; data: CompletedInspection[]; error?: string }> {
  try {
    const q = query(
      collection(db, INSPECTIONS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxCount)
    );

    const snapshot = await getDocs(q);
    const rawInspections: CompletedInspection[] = [];

    snapshot.forEach((d) => {
      rawInspections.push(normalizeFirestoreInspection(d.data()));
    });

    if (mineIdOrName && mineIdOrName.trim()) {
      const cleanFilter = mineIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const filtered = rawInspections.filter((item) => {
        const mId = (item.setup.mineId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const mName = (item.setup.mine || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return mId.includes(cleanFilter) || cleanFilter.includes(mId) || mName.includes(cleanFilter) || cleanFilter.includes(mName);
      });
      return { success: true, data: filtered };
    }

    return { success: true, data: rawInspections };
  } catch (error: any) {
    console.warn('[Firestore] Failed to fetch inspections:', error?.message || error);
    return { success: false, data: [], error: error?.message || 'Failed to fetch from database' };
  }
}

/**
 * Subscribe to real-time live inspections from Cloud Firestore.
 */
export function subscribeToFirestoreInspections(
  callback: (inspections: CompletedInspection[]) => void,
  mineIdOrName?: string,
  maxCount: number = 30
): () => void {
  try {
    const q = query(
      collection(db, INSPECTIONS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxCount)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: CompletedInspection[] = [];
        snapshot.forEach((d) => {
          items.push(normalizeFirestoreInspection(d.data()));
        });

        if (mineIdOrName && mineIdOrName.trim()) {
          const cleanFilter = mineIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
          const filtered = items.filter((item) => {
            const mId = (item.setup.mineId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const mName = (item.setup.mine || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return mId.includes(cleanFilter) || cleanFilter.includes(mId) || mName.includes(cleanFilter) || cleanFilter.includes(mName);
          });
          callback(filtered);
        } else {
          callback(items);
        }
      },
      (error) => {
        console.warn('[Firestore] Realtime subscription notice:', error?.message || error);
      }
    );
  } catch (error: any) {
    console.warn('[Firestore] Failed to setup realtime subscription:', error?.message || error);
    return () => {};
  }
}
