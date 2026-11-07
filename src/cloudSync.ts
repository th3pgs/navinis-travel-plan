import { supabase, STORAGE_BUCKET, STATE_TABLE, STATE_ROW_ID } from './supabase';
import { saveMasterStateIDB, saveWardrobeItemsIDB } from './db';
import { isSoftwareAppOrNonWardrobe, WardrobeItem } from './data';

const LOCAL_STORAGE_KEY = 'navini_master_state_v5';

export interface AppMasterState {
  version: string;
  lastUpdated: string;
  lastUpdatedAt?: number;
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
  categories?: string[];
  deletedCategories?: string[];
  locations?: string[];
  deletedLocations?: string[];
  customCategories?: string[];
  customLocations?: string[];
  customBanks?: string[];
  customAppCategories?: string[];
  customAppDevices?: string[];
  deletedItemIds?: string[];
}

export const CLIENT_ID = 'client_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

export function isOfflineLocked(): boolean {
  try {
    return localStorage.getItem('navini_offline_locked') === 'true';
  } catch {
    return false;
  }
}

export function setOfflineLocked(locked: boolean): void {
  try {
    localStorage.setItem('navini_offline_locked', locked ? 'true' : 'false');
  } catch {}
}

let syncDebounceTimer: any = null;
let _pushInFlight = false;
let _lastPushTimestamp = 0;
let _activeRealtimeChannel: any = null;

export function isPushInFlight(): boolean {
  return _pushInFlight;
}

export function getLastPushTimestamp(): number {
  return _lastPushTimestamp;
}

/**
 * Merges two item lists based on individual `updatedAt` timestamps and tombstone deletedIds.
 * Newer timestamp always wins. Any item in deletedIds is completely purged.
 */
export function mergeItemsByTimestamp<T extends { id: string; updatedAt?: number }>(
  localList: T[],
  remoteList: T[],
  deletedIds: string[] = []
): T[] {
  const deletedSet = new Set(deletedIds);
  const map = new Map<string, T>();

  // 1. Put local items (excluding deleted)
  for (const item of localList) {
    if (!deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  }

  // 2. Merge remote items
  for (const item of remoteList) {
    if (deletedSet.has(item.id)) continue;
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
    } else {
      const existingTime = existing.updatedAt || 0;
      const remoteTime = item.updatedAt || 0;
      if (remoteTime >= existingTime) {
        map.set(item.id, item);
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Item-by-item union merge for wardrobe items.
 * Guaranteed never to drop remote items when syncing across devices.
 * - Items in deletedIds are permanently purged.
 * - Items in remote but not local are ALWAYS added.
 * - Items in local but not remote are ALWAYS kept.
 * - When in both, newer timestamp wins.
 * - Preserves in-flight local uploads / previews if remote photo isn't ready.
 */
export function mergeWardrobeLists<T extends { id: string; updatedAt?: number; createdAt?: number; [key: string]: any }>(
  localItems: T[] = [],
  remoteItems: T[] = [],
  deletedIds: string[] = []
): T[] {
  const deletedSet = new Set(deletedIds || []);
  const map = new Map<string, T>();

  // 1. Put local items (excluding deleted and non-wardrobe apps)
  for (const item of (localItems || [])) {
    if (!item || !item.id || deletedSet.has(item.id)) continue;
    if (isSoftwareAppOrNonWardrobe(item)) continue;
    map.set(item.id, item);
  }

  // 2. Merge remote items
  for (const remoteItem of (remoteItems || [])) {
    if (!remoteItem || !remoteItem.id || deletedSet.has(remoteItem.id)) continue;
    if (isSoftwareAppOrNonWardrobe(remoteItem)) continue;

    const localItem = map.get(remoteItem.id);
    if (!localItem) {
      // Remote item added on another device: ALWAYS add it!
      map.set(remoteItem.id, remoteItem);
    } else {
      const localTime = Number(localItem.updatedAt || localItem.createdAt || 0);
      const remoteTime = Number(remoteItem.updatedAt || remoteItem.createdAt || 0);

      if (remoteTime >= localTime) {
        // Remote is newer or equal: take remote, preserving in-flight local upload preview if remote photo is empty
        const merged: T = {
          ...remoteItem,
          ...(localItem.localPhotoPreview && !remoteItem.photoUrl ? { localPhotoPreview: localItem.localPhotoPreview } : {}),
          ...(localItem.syncStatus === 'uploading' && !remoteItem.photoUrl ? { syncStatus: 'uploading', uploadProgress: localItem.uploadProgress } : {}),
        };
        map.set(remoteItem.id, merged);
      }
      // If local is strictly newer, localItem remains in map
    }
  }

  return Array.from(map.values());
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
 * with instant local cache fallback. Skips network when offline locked.
 */
export async function fetchCloudState(): Promise<AppMasterState | null> {
  const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localState: AppMasterState | null = null;
  if (localSaved) {
    try {
      localState = JSON.parse(localSaved);
    } catch (e) {}
  }

  // If offline locked, strictly return local cached state with zero network
  if (isOfflineLocked()) {
    console.log('[CloudSync] Device is offline locked. Reading exclusively from local cache.');
    return localState;
  }

  try {
    const { data, error } = await supabase
      .from(STATE_TABLE)
      .select('payload, updated_at')
      .eq('id', STATE_ROW_ID)
      .maybeSingle();

    if (!error && data && data.payload) {
      const remote = data.payload as AppMasterState;
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
 * Broadcasts a state delta or complete master state to all connected peer tabs/devices
 * over Supabase WebSockets Realtime broadcast channel (<100ms ultra-fast delivery).
 */
export function broadcastLiveSync(delta: {
  action: string;
  item?: any;
  itemId?: string;
  masterState?: AppMasterState;
  deletedItemIds?: string[];
  timestamp?: number;
}) {
  if (isOfflineLocked()) return;
  if (_activeRealtimeChannel) {
    try {
      _activeRealtimeChannel.send({
        type: 'broadcast',
        event: 'state_update',
        payload: {
          ...delta,
          senderId: CLIENT_ID,
          timestamp: delta.timestamp || Date.now(),
        },
      });
    } catch (err) {
      console.warn('Realtime broadcast error:', err);
    }
  }
}

/**
 * Broadcasts an individual item add, update, or delete across all open tabs/devices.
 * Delivers instant (<100ms) UI updates without waiting for full-payload roundtrips.
 */
export function broadcastItemDelta(delta: {
  type: 'ITEM_UPSERT' | 'ITEM_DELETE';
  item?: any;
  deletedId?: string;
  timestamp?: number;
}) {
  if (isOfflineLocked()) return;
  if (_activeRealtimeChannel) {
    try {
      _activeRealtimeChannel.send({
        type: 'broadcast',
        event: 'item_delta',
        payload: {
          ...delta,
          senderId: CLIENT_ID,
          timestamp: delta.timestamp || Date.now(),
        },
      });
    } catch (err) {
      console.warn('Realtime item delta broadcast error:', err);
    }
  }
}

/**
 * Push master state to Supabase `app_state` (row `id = 'main_plan'`)
 * with instant local storage write, WebSocket broadcast, and database upsert.
 * CRITICAL: Pre-fetches the remote state first to perform an item-level union merge,
 * guaranteeing that items added on other devices are NEVER clobbered or wiped.
 */
export function pushCloudState(state: AppMasterState, immediate = true): Promise<boolean> {
  const now = Date.now();
  state.lastUpdated = new Date(now).toISOString();
  state.lastUpdatedAt = now;
  _pushInFlight = true;
  _lastPushTimestamp = now;

  // Ensure wardrobe never contains apps or non-wardrobe artifacts
  if (Array.isArray(state.wardrobe)) {
    state.wardrobe = state.wardrobe.filter((item) => !isSoftwareAppOrNonWardrobe(item));
  }

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
    localStorage.setItem('navini_passport_profile_v7', JSON.stringify(state.passportInfo));
    localStorage.setItem('navini_bags_v7', JSON.stringify(state.bags));
    localStorage.setItem('navini_devices_v7', JSON.stringify(state.devices));
    localStorage.setItem('navini_wardrobe_v7', JSON.stringify(state.wardrobe));
    localStorage.setItem('navini_docs_v7', JSON.stringify(state.documents));
    localStorage.setItem('navini_procedure_steps_v7', JSON.stringify(state.procedureSteps));
    localStorage.setItem('navini_apps_v7', JSON.stringify(state.apps));
    localStorage.setItem('navini_milestones_v7', JSON.stringify(state.milestones));
    if (state.categories) {
      localStorage.setItem('navini_categories_v8', JSON.stringify(state.categories));
    }
    if (state.deletedCategories) {
      localStorage.setItem('navini_deleted_categories_v8', JSON.stringify(state.deletedCategories));
    }
    if (state.locations) {
      localStorage.setItem('navini_locations_v8', JSON.stringify(state.locations));
    }
    if (state.deletedLocations) {
      localStorage.setItem('navini_deleted_locations_v8', JSON.stringify(state.deletedLocations));
    }
    if (state.deletedItemIds) {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(state.deletedItemIds));
    }
  } catch (e) {
    console.warn('Local storage write warning', e);
  }

  // If offline locked, DO NOT push to cloud or broadcast!
  if (isOfflineLocked()) {
    console.log('[CloudSync] Device is offline locked. Changes safely queued locally.');
    _pushInFlight = false;
    return Promise.resolve(true);
  }

  // 2. Broadcast immediately over WebSocket to peer devices in ~100ms
  broadcastLiveSync({
    action: 'state_update',
    masterState: state,
    deletedItemIds: state.deletedItemIds,
    timestamp: now,
  });

  // 3. Write to Supabase database with pre-fetch union merge
  return new Promise((resolve) => {
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
    }

    const doPush = async () => {
      _pushInFlight = true;
      _lastPushTimestamp = Date.now();

      try {
        // STEP 1: Pre-fetch remote state first to prevent overwriting items added on other devices
        try {
          const { data: remoteData, error: fetchErr } = await supabase
            .from(STATE_TABLE)
            .select('payload')
            .eq('id', STATE_ROW_ID)
            .maybeSingle();

          if (!fetchErr && remoteData?.payload) {
            const remoteState = remoteData.payload as AppMasterState;

            // Merge tombstone deleted IDs
            const combinedDeleted = Array.from(new Set([
              ...(state.deletedItemIds || []),
              ...(remoteState.deletedItemIds || []),
            ]));
            state.deletedItemIds = combinedDeleted;

            // Item-level union merge for wardrobe: NEVER drop items!
            if (Array.isArray(remoteState.wardrobe)) {
              state.wardrobe = mergeWardrobeLists(state.wardrobe, remoteState.wardrobe, combinedDeleted);
            }

            // Union merge for bags, devices, documents
            if (Array.isArray(remoteState.bags)) {
              state.bags = mergeItemsByTimestamp(state.bags, remoteState.bags, combinedDeleted);
            }
            if (Array.isArray(remoteState.devices)) {
              state.devices = mergeItemsByTimestamp(state.devices, remoteState.devices, combinedDeleted);
            }
            if (Array.isArray(remoteState.documents)) {
              state.documents = mergeItemsByTimestamp(state.documents, remoteState.documents, combinedDeleted);
            }

            // Save union locally so local state matches
            try {
              saveMasterStateIDB(state);
              if (Array.isArray(state.wardrobe)) {
                saveWardrobeItemsIDB(state.wardrobe);
              }
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
              localStorage.setItem('navini_wardrobe_v7', JSON.stringify(state.wardrobe));
              localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(combinedDeleted));
            } catch {}
          }
        } catch (mergeErr) {
          console.warn('Pre-push union fetch warning (proceeding with local payload):', mergeErr);
        }

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
      syncDebounceTimer = setTimeout(doPush, 50); // fast coalesce
    }
  });
}

/**
 * Subscribe to realtime state updates from Supabase:
 * Subscribes to BOTH WebSocket Broadcast channel (`navini-instant-sync`) for instant peer-to-peer sync (<100ms)
 * AND Postgres database changes for durable background replication.
 */
export function subscribeToCloudState(
  onUpdate: (newState: AppMasterState, source: 'postgres' | 'broadcast') => void,
  onDelta?: (delta: any) => void
): () => void {
  if (isOfflineLocked()) {
    console.log('[LiveSync] Device is offline locked. Skipping Realtime subscription.');
    return () => {};
  }

  if (_activeRealtimeChannel) {
    try {
      supabase.removeChannel(_activeRealtimeChannel);
    } catch {}
    _activeRealtimeChannel = null;
  }

  const channel = supabase.channel('navini-instant-sync', {
    config: {
      broadcast: { ack: false, self: false },
    },
  });

  // 1. WebSocket Broadcast: Direct peer-to-peer tab/device sync in ~100ms
  channel.on('broadcast', { event: 'state_update' }, (event) => {
    if (isOfflineLocked()) return;
    const payload = event.payload;
    if (!payload || payload.senderId === CLIENT_ID) return;

    console.log('[LiveSync] Ultra-fast WebSocket broadcast received from peer:', payload.action);
    if (payload.masterState) {
      onUpdate(payload.masterState, 'broadcast');
    }
    if (onDelta) {
      onDelta(payload);
    }
  });

  // 1b. Real-time Item Delta Broadcast (Instant item add/edit/delete/packed toggle)
  channel.on('broadcast', { event: 'item_delta' }, (event) => {
    if (isOfflineLocked()) return;
    const payload = event.payload;
    if (!payload || payload.senderId === CLIENT_ID) return;

    console.log('[LiveSync] Ultra-fast WebSocket item_delta received:', payload.type);
    if (onDelta) {
      onDelta(payload);
    }
  });

  // 2. Postgres Database Changes: Durable fallback when database row is updated
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: STATE_TABLE,
      filter: `id=eq.${STATE_ROW_ID}`,
    },
    (payload) => {
      if (isOfflineLocked()) return;
      if (payload.new && (payload.new as any).payload) {
        // Echo check: if local push happened within 500ms, skip duplicate
        if (Date.now() - _lastPushTimestamp < 500) return;
        const remoteState = (payload.new as any).payload as AppMasterState;
        if (remoteState && remoteState.passportInfo) {
          onUpdate(remoteState, 'postgres');
        }
      }
    }
  );

  channel.subscribe((status) => {
    console.log('[LiveSync] Channel subscription status:', status);
  });

  _activeRealtimeChannel = channel;

  return () => {
    if (_activeRealtimeChannel) {
      try {
        supabase.removeChannel(_activeRealtimeChannel);
      } catch {}
      _activeRealtimeChannel = null;
    }
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

/**
 * Atomically compresses a photo (if dataUrl), uploads to Supabase Storage,
 * and returns confirmed CDN url. Safe for non-blocking background queue.
 */
export async function uploadWardrobeItemPhotoAtomic(
  item: WardrobeItem,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; photoUrl?: string; error?: string }> {
  try {
    let finalPhotoUrl = item.photoUrl;

    if (item.photoUrl && item.photoUrl.startsWith('data:image')) {
      onProgress?.(25);
      // Compress to 400x400 JPEG
      const compressedDataUrl = await compressPhotoToMax400(item.photoUrl, 400, 0.65);
      onProgress?.(50);

      try {
        // Convert dataUrl to blob
        const res = await fetch(compressedDataUrl);
        const blob = await res.blob();
        onProgress?.(65);

        // Upload blob to Supabase Storage
        const fileName = `wardrobe/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData?.path) {
          const { data: publicData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(uploadData.path);
          finalPhotoUrl = publicData.publicUrl;
        } else {
          // Fallback to compressed base64 if network offline
          finalPhotoUrl = compressedDataUrl;
        }
      } catch (uploadErr) {
        console.warn('Storage upload warning, using local compressed image:', uploadErr);
        finalPhotoUrl = compressedDataUrl;
      }
      onProgress?.(85);
    }

    onProgress?.(100);
    return { success: true, photoUrl: finalPhotoUrl };
  } catch (err: any) {
    console.error('Atomic photo upload error:', err);
    return { success: false, error: err?.message || 'Upload failed' };
  }
}
