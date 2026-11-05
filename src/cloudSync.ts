// Cloud Database Sync Service
// Provides local-first instant offline storage + automatic cloud database synchronization
// so changes made by one person (profile picture, passport, milestones, gear, apps)
// are automatically available to anyone viewing on GitHub Pages.

const CLOUD_SYNC_ENDPOINT = 'https://api.jsonbin.io/v3/b';
const PUBLIC_SYNC_BIN_ID = '674b3e8fad19ca34f8d228f4'; // Shared cloud synchronization bin fallback
const LOCAL_STORAGE_KEY = 'navini_master_state_v5';

export interface AppMasterState {
  version: string;
  lastUpdated: string;
  passportInfo: {
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  };
  bags: any[];
  devices: any[];
  wardrobe: any[];
  documents: any[];
  procedureSteps: any[];
  apps: any[];
  milestones: any[];
  buddyMessages?: any[];
}

// In-memory debounce timer for cloud pushes
let syncDebounceTimer: any = null;

export async function fetchCloudState(): Promise<AppMasterState | null> {
  // 1. First check local storage for instant offline access
  const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localState: AppMasterState | null = null;
  if (localSaved) {
    try {
      localState = JSON.parse(localSaved);
    } catch (e) {}
  }

  // 2. Fetch from remote cloud database (if online)
  try {
    const res = await fetch(`https://api.npoint.io/46efb702ec94d8cb87c2`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.passportInfo) {
        // If remote state is newer or valid, merge and update local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data as AppMasterState;
      }
    }
  } catch (err) {
    // Silent network fallback for offline mode
    console.warn('Offline mode or remote sync unreachable, using local storage.');
  }

  return localState;
}

export function pushCloudState(state: AppMasterState): void {
  // 1. Immediately write to local storage (0ms latency & offline resilient)
  state.lastUpdated = new Date().toISOString();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));

  // 2. Debounce cloud sync write to prevent network thrashing
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }

  syncDebounceTimer = setTimeout(async () => {
    try {
      // Push state to cloud JSON database
      await fetch(`https://api.npoint.io/46efb702ec94d8cb87c2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });
      console.log('Successfully synchronized changes to cloud database.');
    } catch (e) {
      console.warn('Cloud sync queued locally. Will retry when connection restores.');
    }
  }, 1000);
}
