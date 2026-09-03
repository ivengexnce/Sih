/**
 * InspectionContext
 *
 * Single in-memory store for:
 *   - The ACTIVE inspection draft (configured for the inspector's assigned mine)
 *   - The active assigned Colliery / Mine
 *   - The COLLECTION of all completed inspections (seed mocks + newly submitted)
 *   - Centralized VALIDATION logic for all inspection sections
 *   - Real-time Cloud Firestore synchronization
 *
 * All inspection screens read from and write to this context.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  saveInspectionToFirestore,
  fetchInspectionsFromFirestore,
  subscribeToFirestoreInspections,
} from '@/services/inspectionService';
import { DEFAULT_MINE, MineInfo } from '@/constants/mines';
import { getActiveMineLocally, saveActiveMineLocally } from '@/services/authService';

const COMPLETED_INSPECTIONS_STORAGE_KEY = '@mineguard_completed_inspections';

async function saveCompletedInspectionsLocally(inspections: CompletedInspection[]): Promise<void> {
  try {
    await AsyncStorage.setItem(COMPLETED_INSPECTIONS_STORAGE_KEY, JSON.stringify(inspections));
  } catch (e) {
    console.warn('Failed to save completed inspections locally:', e);
  }
}

async function getCompletedInspectionsLocally(): Promise<CompletedInspection[]> {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_INSPECTIONS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as CompletedInspection[];
    }
  } catch (e) {
    console.warn('Failed to load completed inspections locally:', e);
  }
  return [];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type InspectionType = 'Safety' | 'Environment' | 'Equipment' | 'Labour' | 'General';

export type ObservationCategory =
  | 'Worker Safety'
  | 'PPE Compliance'
  | 'Equipment'
  | 'Ventilation'
  | 'Fire Safety'
  | 'Environment'
  | 'Labour'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type LocationSource = 'Mine Zone' | 'GPS' | 'GPS + Mine Zone';
export type LocationConfidence = 'High' | 'Medium' | 'Low';

export interface EvidenceItem {
  id: string;
  label: string;
  time: string;
  uri?: string;
  type?: 'camera' | 'upload' | 'sample';
}

export interface InspectionLocation {
  source: LocationSource;
  zone: string;
  level: string;
  panel: string;
  confidence: LocationConfidence;
  latitude?: string | number;
  longitude?: string | number;
  accuracy?: string;
  isOffline?: boolean;
}

export interface InspectionObservation {
  category: ObservationCategory;
  description: string;
  severity: SeverityLevel;
}

export interface InspectionSetup {
  mine: string;
  mineId?: string;
  area: string;
  level: string;
  panel: string;
  inspectionType: InspectionType;
}

export interface InspectionDraft {
  inspectionId: string;
  timestamp: string;
  setup: InspectionSetup;
  observation: InspectionObservation;
  evidence: EvidenceItem[];
  location: InspectionLocation | null;
}

/**
 * A completed/submitted inspection record.
 * Extends the draft with a sync status field.
 */
export interface CompletedInspection extends InspectionDraft {
  status: 'Pending Sync' | 'Synced';
  submittedAt?: string;
  inspectorEmail?: string;
  inspectorName?: string;
}

// ─── Validation Helpers ───────────────────────────────────────────────────────

export interface InspectionValidationErrors {
  setup?: string;
  observation?: string;
  evidence?: string;
  location?: string;
}

export interface InspectionValidationResult {
  isValid: boolean;
  errors: InspectionValidationErrors;
  firstErrorMessage?: string;
}

export function validateSetup(setup: InspectionSetup): { isValid: boolean; error?: string } {
  if (!setup.mine?.trim()) {
    return { isValid: false, error: 'Mine site is required.' };
  }
  if (!setup.area?.trim()) {
    return { isValid: false, error: 'Area / Zone is required.' };
  }
  if (!setup.level?.trim()) {
    return { isValid: false, error: 'Level is required.' };
  }
  if (!setup.panel?.trim()) {
    return { isValid: false, error: 'Panel is required.' };
  }
  if (!setup.inspectionType) {
    return { isValid: false, error: 'Inspection Type is required.' };
  }
  return { isValid: true };
}

export function validateObservation(observation: InspectionObservation): { isValid: boolean; error?: string } {
  if (!observation.category) {
    return { isValid: false, error: 'Please select an observation category.' };
  }
  if (!observation.description?.trim()) {
    return { isValid: false, error: 'Please enter an observation description before continuing.' };
  }
  if (!observation.severity) {
    return { isValid: false, error: 'Please select a severity level.' };
  }
  return { isValid: true };
}

export function validateEvidence(evidence: EvidenceItem[]): { isValid: boolean; error?: string } {
  if (!evidence || evidence.length === 0) {
    return { isValid: false, error: 'Add at least one piece of evidence before submitting.' };
  }
  return { isValid: true };
}

export function validateLocation(location: InspectionLocation | null): { isValid: boolean; error?: string } {
  if (!location) {
    return { isValid: false, error: 'Save an inspection location before submitting.' };
  }
  if (location.source === 'GPS' || location.source === 'GPS + Mine Zone') {
    const hasCoords =
      location.latitude !== undefined &&
      location.latitude !== null &&
      location.latitude !== '' &&
      location.longitude !== undefined &&
      location.longitude !== null &&
      location.longitude !== '';
    const hasZone = !!location.zone?.trim();
    if (!hasCoords && !hasZone) {
      return { isValid: false, error: 'GPS location coordinates or mine zone required.' };
    }
    return { isValid: true };
  }
  if (location.source === 'Mine Zone') {
    if (!location.zone?.trim() || !location.level?.trim() || !location.panel?.trim()) {
      return { isValid: false, error: 'Mine Zone parameters (Zone, Level, Panel) are required.' };
    }
    return { isValid: true };
  }
  return { isValid: true };
}

export function validateInspection(draft: InspectionDraft): InspectionValidationResult {
  const errors: InspectionValidationErrors = {};

  const setupRes = validateSetup(draft.setup);
  if (!setupRes.isValid) {
    errors.setup = setupRes.error;
  }

  const obsRes = validateObservation(draft.observation);
  if (!obsRes.isValid) {
    errors.observation = obsRes.error;
  }

  const evRes = validateEvidence(draft.evidence);
  if (!evRes.isValid) {
    errors.evidence = evRes.error;
  }

  const locRes = validateLocation(draft.location);
  if (!locRes.isValid) {
    errors.location = locRes.error;
  }

  const isValid = Object.keys(errors).length === 0;
  const firstErrorMessage =
    errors.observation || errors.evidence || errors.location || errors.setup;

  return {
    isValid,
    errors,
    firstErrorMessage,
  };
}


// ─── Draft Factory ────────────────────────────────────────────────────────────

function makeDefaultDraft(mine: MineInfo = DEFAULT_MINE): InspectionDraft {
  const now = new Date();
  const ts =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    ` (${now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })})`;

  return {
    inspectionId: `INS-${Math.floor(10000 + Math.random() * 89999)}`,
    timestamp: ts,
    setup: {
      mine: mine.name,
      mineId: mine.id,
      area: mine.defaultArea,
      level: mine.defaultLevel,
      panel: mine.defaultPanel,
      inspectionType: 'Safety',
    },
    observation: {
      category: 'Worker Safety',
      description: '',
      severity: 'High',
    },
    evidence: [],
    location: null,
  };
}

// ─── Context Shape ────────────────────────────────────────────────────────────

interface InspectionContextValue {
  draft: InspectionDraft;
  currentMine: MineInfo;
  setCurrentMine: (mine: MineInfo) => void;
  resetDraft: () => void;
  updateSetup: (setup: Partial<InspectionSetup>) => void;
  updateObservation: (observation: Partial<InspectionObservation>) => void;
  addEvidence: (item: EvidenceItem) => void;
  removeEvidence: (id: string) => void;
  updateLocation: (location: InspectionLocation) => void;

  completedInspections: CompletedInspection[];
  /**
   * Commit the current draft if valid, prepend to completed collection,
   * trigger background Firestore sync, then reset draft. Returns boolean indicating success.
   */
  submitDraft: () => boolean;
  /**
   * Sync all pending inspections to Cloud Firestore.
   */
  syncAllWithFirebase: () => Promise<{ success: boolean; syncedCount: number; message?: string }>;
}

const InspectionContext = createContext<InspectionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [currentMine, setCurrentMineState] = useState<MineInfo>(DEFAULT_MINE);
  const [draft, setDraft] = useState<InspectionDraft>(() => makeDefaultDraft(DEFAULT_MINE));
  const [completedInspections, setCompletedInspections] = useState<CompletedInspection[]>([]);

  // Load active mine and stored completed inspections from AsyncStorage on mount
  useEffect(() => {
    getActiveMineLocally().then((mine) => {
      if (mine) {
        setCurrentMineState(mine);
        setDraft((prev) => ({
          ...prev,
          setup: {
            ...prev.setup,
            mine: mine.name,
            mineId: mine.id,
            area: mine.defaultArea,
            level: mine.defaultLevel,
            panel: mine.defaultPanel,
          },
        }));
      }
    });

    getCompletedInspectionsLocally().then((stored) => {
      if (stored && stored.length > 0) {
        setCompletedInspections(stored);
      }
    });
  }, []);

  const setCurrentMine = useCallback((mine: MineInfo) => {
    setCurrentMineState(mine);
    saveActiveMineLocally(mine);
    setDraft((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        mine: mine.name,
        mineId: mine.id,
        area: mine.defaultArea,
        level: mine.defaultLevel,
        panel: mine.defaultPanel,
      },
    }));
  }, []);

  // Live real-time sync with Cloud Firestore for current mine
  useEffect(() => {
    const unsubscribe = subscribeToFirestoreInspections(
      (liveInspections) => {
        if (liveInspections) {
          setCompletedInspections((prev) => {
            const pendingLocal = prev.filter((i) => i.status === 'Pending Sync');
            const liveIds = new Set(liveInspections.map((i) => i.inspectionId));
            const remainingPending = pendingLocal.filter((i) => !liveIds.has(i.inspectionId));

            const mergedMap = new Map<string, CompletedInspection>();
            liveInspections.forEach((item) => {
              mergedMap.set(item.inspectionId, item);
            });
            remainingPending.forEach((item) => {
              mergedMap.set(item.inspectionId, item);
            });

            const mergedList = Array.from(mergedMap.values());
            saveCompletedInspectionsLocally(mergedList);
            return mergedList;
          });
        }
      },
      currentMine.id || currentMine.name
    );

    return () => {
      unsubscribe();
    };
  }, [currentMine.id, currentMine.name]);

  const resetDraft = useCallback(() => {
    setDraft(makeDefaultDraft(currentMine));
  }, [currentMine]);

  const updateSetup = useCallback((setup: Partial<InspectionSetup>) => {
    setDraft((prev) => ({
      ...prev,
      setup: { ...prev.setup, ...setup },
    }));
  }, []);

  const updateObservation = useCallback((observation: Partial<InspectionObservation>) => {
    setDraft((prev) => ({
      ...prev,
      observation: { ...prev.observation, ...observation },
    }));
  }, []);

  const addEvidence = useCallback((item: EvidenceItem) => {
    setDraft((prev) => ({
      ...prev,
      evidence: [...prev.evidence, item],
    }));
  }, []);

  const removeEvidence = useCallback((id: string) => {
    setDraft((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((e) => e.id !== id),
    }));
  }, []);

  const updateLocation = useCallback((location: InspectionLocation) => {
    setDraft((prev) => ({
      ...prev,
      location,
    }));
  }, []);

  const submitDraft = useCallback((): boolean => {
    const validation = validateInspection(draft);
    if (!validation.isValid) {
      return false;
    }

    const completed: CompletedInspection = {
      ...draft,
      status: 'Pending Sync',
    };

    // Update in-memory state & AsyncStorage immediately
    setCompletedInspections((prev) => {
      const updated = [completed, ...prev.filter((i) => i.inspectionId !== completed.inspectionId)];
      saveCompletedInspectionsLocally(updated);
      return updated;
    });
    setDraft(makeDefaultDraft(currentMine));

    // Only attempt online Cloud Firestore sync if internet connectivity is active
    NetInfo.fetch().then((netState) => {
      const isOnline = netState.isConnected ?? true;

      if (isOnline) {
        saveInspectionToFirestore(completed)
          .then((res) => {
            if (res.success) {
              setCompletedInspections((prev) => {
                const updated = prev.map((item) =>
                  item.inspectionId === completed.inspectionId
                    ? { ...item, status: 'Synced' as const }
                    : item
                );
                saveCompletedInspectionsLocally(updated);
                return updated;
              });
              console.log('[Online Sync] Inspection synced to Firebase:', completed.inspectionId);
            }
          })
          .catch((err) => {
            console.warn('Background sync warning:', err);
          });
      } else {
        console.log('[Offline Mode] Inspection saved locally as Pending Sync:', completed.inspectionId);
      }
    });

    return true;
  }, [draft, currentMine]);

  const syncAllWithFirebase = useCallback(async () => {
    const netState = await NetInfo.fetch();
    const isOnline = Boolean(netState.isConnected && netState.isInternetReachable !== false);

    if (!isOnline) {
      return {
        success: false,
        syncedCount: 0,
        message: 'Device is offline. Please connect to the internet to sync pending records.',
      };
    }

    let syncedCount = 0;
    const currentPending = completedInspections.filter((i) => i.status === 'Pending Sync');

    if (currentPending.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        message: 'All inspection records are already up to date with Firebase.',
      };
    }

    const updatedList = [...completedInspections];

    for (const item of currentPending) {
      const res = await saveInspectionToFirestore(item);
      if (res.success) {
        syncedCount++;
        const idx = updatedList.findIndex((rec) => rec.inspectionId === item.inspectionId);
        if (idx !== -1) {
          updatedList[idx] = { ...updatedList[idx], status: 'Synced' };
        }
      }
    }

    setCompletedInspections(updatedList);
    await saveCompletedInspectionsLocally(updatedList);

    return { success: true, syncedCount };
  }, [completedInspections]);

  return (
    <InspectionContext.Provider
      value={{
        draft,
        currentMine,
        setCurrentMine,
        resetDraft,
        updateSetup,
        updateObservation,
        addEvidence,
        removeEvidence,
        updateLocation,
        completedInspections,
        submitDraft,
        syncAllWithFirebase,
      }}>
      {children}
    </InspectionContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInspection(): InspectionContextValue {
  const ctx = useContext(InspectionContext);
  if (!ctx) {
    throw new Error('useInspection must be used inside <InspectionProvider>');
  }
  return ctx;
}
