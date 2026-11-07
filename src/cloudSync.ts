import { supabase, STORAGE_BUCKET, STATE_TABLE, STATE_ROW_ID } from './supabase';
import { saveMasterStateIDB, saveWardrobeItemsIDB } from './db';

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
  bankingTasks?: any[];
  gifts?: any[];
  apps: any[];
  milestones: any[];
  buddyMessages?: any[];
  confirmedCampusChat?: boolean;
  confirmedChatTopics?: Record<string, boolean>;
  customCategories?: string[];
  customLocations?: string[];
  customBanks?: string[];
  customAppCategories?: string[];
  customAppDevices?: string[];
}

let syncDebounceTimer: any = null;
let _pushInFlight = false;
let _lastPushTimestamp = 0;

export function isPushInFlight(): boolean {
  return _pushInFlight;
}

export function getLastPushTimestamp(): number {
  return _lastPushTimestamp;
}

/**
 * Aggressively resizes and compresses an image client-side on an HTML5 <canvas>
 * to max 400x400 JPEG at 0.6 quality (~15-25KB).
 * Safe for iPadOS camera photos (even 12-48MP raw captures), preventing 5MB localStorage quota crashes.
 */
export function compressPhotoToMax400(
  input: File | Blob | string,
  maxDim = 400,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve) => {
    const processImg = (src: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };

    if (typeof input === 'string') {
      processImg(input);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = (e.target?.result as string) || '';
        processImg(src);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(input);
    }
  });
}

/**
 * Compresses an image client-side to max 400x400 JPEG for mobile cloud storage
 */
export function compressImage(
  file: File | Blob,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.65
): Promise<Blob> {
  return new Promise((resolve, reject) => {
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

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file as Blob);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file as Blob);
              }
            },
            'image/jpeg',
            quality
          );
        } catch {
          resolve(file as Blob);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload a compressed camera photo or file directly to Supabase `travel-media` bucket
 * and return the public CDN URL.
 */
export async function uploadPhotoToSupabase(
  file: File | Blob,
  folder = 'wardrobe'
): Promise<string> {
  const compressedBlob = await compressImage(file, 400, 400, 0.65);
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, compressedBlob, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Fetch the master plan state from Supabase `app_state` (row `id = 'main_plan'`)
 * with instant local cache fallback.
 */
export async function fetchCloudState(): Promise<AppMasterState | null> {
  const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localState: AppMasterState | null = null;
  if (localSaved) {
    try {
      localState = JSON.parse(localSaved);
    } catch (e) {}
  }

  try {
    const { data, error } = await supabase
      .from(STATE_TABLE)
      .select('payload, updated_at')
      .eq('id', STATE_ROW_ID)
      .maybeSingle();

    if (!error && data && data.payload) {
      const remote = data.payload as AppMasterState;
      // Accept remote if it has passportInfo or newer
      if (remote.passportInfo) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remote));
        } catch (e) {}
        return remote;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed, using local cache:', err);
  }

  return localState;
}

/**
 * Push master state to Supabase `app_state` (row `id = 'main_plan'`)
 * with instant local storage write and debounced cloud upsert.
 */
export function pushCloudState(state: AppMasterState, immediate = false): Promise<boolean> {
  state.lastUpdated = new Date().toISOString();
  _pushInFlight = true;
  _lastPushTimestamp = Date.now();

  // 1. Instantly save to IndexedDB (multi-gigabyte safe on iPadOS) and localStorage
  try {
    saveMasterStateIDB(state);
    if (Array.isArray(state.wardrobe)) {
      saveWardrobeItemsIDB(state.wardrobe);
    }
  } catch (err) {
    console.warn('IndexedDB write warning in pushCloudState:', err);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem('navini_passport_profile_v5', JSON.stringify(state.passportInfo));
    localStorage.setItem('navini_bags_v5', JSON.stringify(state.bags));
    localStorage.setItem('navini_devices_v5', JSON.stringify(state.devices));
    localStorage.setItem('navini_wardrobe_v5', JSON.stringify(state.wardrobe));
    localStorage.setItem('navini_docs_v5', JSON.stringify(state.documents));
    localStorage.setItem('navini_procedure_steps_v5', JSON.stringify(state.procedureSteps));
    localStorage.setItem('navini_apps_v5', JSON.stringify(state.apps));
    localStorage.setItem('navini_milestones_v5', JSON.stringify(state.milestones));
    if (state.customCategories) {
      localStorage.setItem('navini_custom_categories_v5', JSON.stringify(state.customCategories));
    }
    if (state.customLocations) {
      localStorage.setItem('navini_custom_locations_v5', JSON.stringify(state.customLocations));
    }
    if (state.customBanks) {
      localStorage.setItem('navini_custom_banks_v5', JSON.stringify(state.customBanks));
    }
    if (state.customAppCategories) {
      localStorage.setItem('navini_custom_app_categories_v5', JSON.stringify(state.customAppCategories));
    }
    if (state.customAppDevices) {
      localStorage.setItem('navini_custom_app_devices_v5', JSON.stringify(state.customAppDevices));
    }
  } catch (e) {
    console.warn('Local storage write warning', e);
  }

  return new Promise((resolve) => {
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
    }

    const doPush = async () => {
      _pushInFlight = true;
      _lastPushTimestamp = Date.now();

      try {
        const { error } = await supabase
          .from(STATE_TABLE)
          .upsert({
            id: STATE_ROW_ID,
            payload: state,
            updated_at: new Date().toISOString(),
          });

        if (!error) {
          _lastPushTimestamp = Date.now();
          resolve(true);
        } else {
          console.warn('Supabase upsert warning:', error);
          resolve(false);
        }
      } catch (err) {
        console.warn('Supabase upsert failed, queued locally:', err);
        resolve(false);
      } finally {
        _pushInFlight = false;
      }
    };

    if (immediate) {
      doPush();
    } else {
      syncDebounceTimer = setTimeout(doPush, 400);
    }
  });
}

/**
 * Subscribe to realtime state updates from Supabase
 */
export function subscribeToCloudState(
  onUpdate: (newState: AppMasterState) => void
) {
  const channel = supabase
    .channel('app_state_live_sync')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: STATE_TABLE,
        filter: `id=eq.${STATE_ROW_ID}`,
      },
      (payload) => {
        if (payload.new && (payload.new as any).payload) {
          // If a local push just occurred within 4 seconds, ignore to prevent echo race
          if (Date.now() - _lastPushTimestamp < 4000) return;
          const remoteState = (payload.new as any).payload as AppMasterState;
          if (remoteState && remoteState.passportInfo) {
            onUpdate(remoteState);
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Ping Supabase to verify connection health
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(STATE_TABLE)
      .select('id')
      .eq('id', STATE_ROW_ID)
      .limit(1);
    return !error;
  } catch {
    return false;
  }
}
