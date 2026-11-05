// Cloud Database Sync Service
// Provides real-time synchronization across all logged-in devices viewing on GitHub Pages,
// plus local-first instant offline storage so Navini has access even without internet.

const EXTENDSCLASS_BIN_ID = 'bbebcfe';
const SYNC_URL = `https://extendsclass.com/api/json-storage/bin/${EXTENDSCLASS_BIN_ID}`;
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

let syncDebounceTimer: any = null;

// Write-lock: when a local push is in-flight, skip incoming poll results
// so the poll doesn't overwrite the photo/state we just set locally.
let _pushInFlight = false;
let _lastPushTimestamp = 0;

export function isPushInFlight(): boolean {
  return _pushInFlight;
}

export function getLastPushTimestamp(): number {
  return _lastPushTimestamp;
}

// Compresses and downscales raw camera photos (e.g. 10MB) to ~15KB
// so they transfer in milliseconds across mobile networks and fit seamlessly in cloud storage.
export function compressImage(file: File, maxWidth = 260, maxHeight = 340, quality = 0.78): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while fitting within maxWidth x maxHeight
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (err) {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
    };
    reader.onerror = () => resolve('');
  });
}

// Fetch master state from the remote cloud database
export async function fetchCloudState(): Promise<AppMasterState | null> {
  // If a push is currently in-flight or just finished (within last 8 seconds),
  // return local state to avoid overwriting the data we just pushed.
  if (_pushInFlight || (Date.now() - _lastPushTimestamp < 8000)) {
    const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localSaved) {
      try {
        return JSON.parse(localSaved) as AppMasterState;
      } catch (e) {}
    }
    return null;
  }

  // 1. First get local state for instant rendering
  const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localState: AppMasterState | null = null;
  if (localSaved) {
    try {
      localState = JSON.parse(localSaved);
    } catch (e) {}
  }

  // 2. Fetch from cloud database
  try {
    const res = await fetch(SYNC_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.passportInfo) {
        // Only accept remote state if it's actually newer than our local state
        if (localState && localState.lastUpdated && data.lastUpdated) {
          const localTime = new Date(localState.lastUpdated).getTime();
          const remoteTime = new Date(data.lastUpdated).getTime();
          if (localTime > remoteTime) {
            // Local is newer — keep local, push it to cloud
            return localState;
          }
        }
        // Update local cache with remote data
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
        return data as AppMasterState;
      }
    }
  } catch (err) {
    console.warn('Network offline or sync unreachable, using cached state.', err);
  }

  return localState;
}

// Push master state to the remote cloud database
export function pushCloudState(state: AppMasterState, immediate = false): Promise<boolean> {
  state.lastUpdated = new Date().toISOString();
  _pushInFlight = true;
  _lastPushTimestamp = Date.now();

  // 1. Instantly save to local storage (0ms offline safe)
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Local storage write warning', e);
  }

  // 2. Push to cloud database with write-lock
  return new Promise((resolve) => {
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
    }

    const doPush = async () => {
      _pushInFlight = true;
      _lastPushTimestamp = Date.now();

      try {
        const res = await fetch(SYNC_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(state),
        });

        if (res.ok) {
          console.log('Master state synced to cloud database.');
          _lastPushTimestamp = Date.now();
          resolve(true);
        } else {
          console.warn('Cloud sync response status:', res.status);
          resolve(false);
        }
      } catch (err) {
        console.warn('Cloud sync offline. Queued locally.', err);
        resolve(false);
      } finally {
        _pushInFlight = false;
      }
    };

    if (immediate) {
      doPush();
    } else {
      syncDebounceTimer = setTimeout(doPush, 300);
    }
  });
}
