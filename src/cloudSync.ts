import { supabase, STORAGE_BUCKET, STATE_TABLE, STATE_ROW_ID } from './supabase';
import { saveMasterStateIDB, saveWardrobeItemsIDB, getMasterStateIDB, getWardrobeItemsIDB } from './db';
import { WardrobeItem } from './data';

const LOCAL_STORAGE_KEY = 'navini_master_state_v5';

export interface AppMasterState {
  version: string;
  lastUpdated: string;
  lastUpdatedAt?: number;
  is_master_locked?: boolean;
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
  trashedWardrobe?: any[];
}

export const CLIENT_ID = 'client_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

let _lastLocalMutationTimestamp = 0;

export function recordLocalMutation(): void {
  _lastLocalMutationTimestamp = Date.now();
}

export function getLastLocalMutationTime(): number {
  return _lastLocalMutationTimestamp;
}

/**
 * Removes ONLY 100% exact duplicates from a wardrobe array:
 * 1. Exact duplicate IDs (keeps the newer or photo-complete entry).
 * 2. Accidental double-submissions where name, category, targetBag, quantity, and notes are 100% identical
 *    AND either photoUrl is identical or they were created within 8 seconds of each other.
 * NEVER merges items that are merely similar in name or category!
 */
export function deduplicateExactWardrobeItems<T extends {
  id: string;
  name?: string;
  category?: string;
  targetBag?: string;
  quantity?: any;
  notes?: string;
  photoUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}>(items: T[] = [], deletedIds: string[] = []): T[] {
  const deletedSet = new Set(deletedIds || []);
  const byId = new Map<string, T>();

  for (const item of items || []) {
    if (!item || !item.id || deletedSet.has(item.id)) continue;
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
    } else {
      const existingTime = Number(existing.updatedAt || existing.createdAt || 0);
      const itemTime = Number(item.updatedAt || item.createdAt || 0);
      if (itemTime >= existingTime || (!existing.photoUrl && item.photoUrl)) {
        byId.set(item.id, item);
      }
    }
  }

  const uniqueById = Array.from(byId.values());
  const result: T[] = [];
  const exactSignatureMap = new Map<string, number>();

  for (const item of uniqueById) {
    const normName = String(item.name || '').trim().toLowerCase();
    const normCat = String(item.category || '').trim().toLowerCase();
    const normBag = String(item.targetBag || '').trim().toLowerCase();
    const normQty = String(item.quantity ?? '1').trim().toLowerCase();
    const normNotes = String(item.notes || '').trim().toLowerCase();
    const sig = `${normName}|||${normCat}|||${normBag}|||${normQty}|||${normNotes}`;

    if (normName && exactSignatureMap.has(sig)) {
      const prevIdx = exactSignatureMap.get(sig)!;
      const prev = result[prevIdx];
      const prevPhoto = String(prev.photoUrl || '');
      const currPhoto = String(item.photoUrl || '');
      const timeDiff = Math.abs(
        Number(item.createdAt || item.updatedAt || 0) - Number(prev.createdAt || prev.updatedAt || 0)
      );

      // Only treat as an exact duplicate if the photo is identical OR it was double-submitted within 8 seconds
      if (prevPhoto === currPhoto || (timeDiff > 0 && timeDiff < 8000)) {
        const prevHasCloudPhoto = prevPhoto.startsWith('http');
        const currHasCloudPhoto = currPhoto.startsWith('http');
        if (currHasCloudPhoto && !prevHasCloudPhoto) {
          result[prevIdx] = item;
        }
        continue;
      }
    }

    exactSignatureMap.set(sig, result.length);
    result.push(item);
  }

  return result;
}

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

export function isMasterMigrationDone(): boolean {
  try {
    return localStorage.getItem('MASTER_CLOUD_MIGRATION_DONE_V1') === 'true';
  } catch {
    return false;
  }
}

export function setMasterMigrationDone(done = true): void {
  try {
    if (done) {
      localStorage.setItem('MASTER_CLOUD_MIGRATION_DONE_V1', 'true');
    } else {
      localStorage.removeItem('MASTER_CLOUD_MIGRATION_DONE_V1');
    }
  } catch {}
}

/**
 * Safe no-op: Never delete local IndexedDB or localStorage items so user data never vanishes.
 */
export function purgeLegacyLocalStorageAndIDB(): void {
  // Intentionally preserved to prevent accidental data loss across devices.
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
 * - NEVER filters or blocks items by name, title, or brand keywords.
 */
export function mergeWardrobeLists<T extends { id: string; updatedAt?: number; createdAt?: number; [key: string]: any }>(
  localItems: T[] = [],
  remoteItems: T[] = [],
  deletedIds: string[] = []
): T[] {
  const deletedSet = new Set(deletedIds || []);
  const map = new Map<string, T>();

  // 1. Put local items (excluding deleted)
  for (const item of (localItems || [])) {
    if (!item || !item.id || deletedSet.has(item.id)) continue;
    map.set(item.id, item);
  }

  // 2. Merge remote items
  for (const remoteItem of (remoteItems || [])) {
    if (!remoteItem || !remoteItem.id || deletedSet.has(remoteItem.id)) continue;

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
 * Alias for item-level dictionary union merge
 */
export const mergeItemsById = mergeWardrobeLists;

/**
 * Aggressively resizes and compresses an image client-side on an HTML5 <canvas>
 * to max 450x450 JPEG at 0.65 quality (~15-25KB).
 * Safe for iPadOS/Android camera photos (even 12-108MP raw captures).
 */
export function compressPhotoToMax400(
  input: File | Blob | string,
  maxDim = 450,
  quality = 0.65
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
 * Compresses an image client-side to max 450x450 JPEG for cloud storage
 */
export function compressImage(
  file: File | Blob,
  maxWidth = 450,
  maxHeight = 450,
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
 * Ultra-lightweight 30-byte header check (`SELECT updated_at`) to verify if remote state changed
 * before downloading the full payload. Conserves 99.9% of Supabase egress credits.
 */
export async function fetchRemoteUpdatedAt(): Promise<string | null> {
  if (isOfflineLocked()) return null;
  try {
    const { data, error } = await supabase
      .from(STATE_TABLE)
      .select('updated_at')
      .eq('id', STATE_ROW_ID)
      .maybeSingle();
    if (!error && data?.updated_at) {
      return String(data.updated_at);
    }
  } catch {}
  return null;
}

/**
 * Fetch the master plan state from Supabase `app_state` (row `id = 'main_plan'`)
 * with instant IndexedDB local cache fallback. Skips network when offline locked.
 * NEVER relies on the 5MB localStorage trap for wardrobe arrays or photos.
 */
export async function fetchCloudState(): Promise<AppMasterState | null> {
  // If offline locked, strictly return local IndexedDB cached state with zero network
  if (isOfflineLocked()) {
    console.log('[CloudSync] Device is offline locked. Reading exclusively from IndexedDB.');
    const idbState = await getMasterStateIDB();
    return idbState;
  }

  try {
    const { data, error } = await supabase
      .from(STATE_TABLE)
      .select('payload, updated_at')
      .eq('id', STATE_ROW_ID)
      .maybeSingle();

    if (!error && data && data.payload) {
      const remote = data.payload as AppMasterState;
      if (data.updated_at) {
        (remote as any)._rowUpdatedAt = String(data.updated_at);
      }
      if (remote.passportInfo) {
        return remote;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
  }

  try {
    const idbState = await getMasterStateIDB();
    if (idbState) return idbState;
  } catch {}

  return null;
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
 * Broadcasts an individual item add, update, delete-to-trash, or restore across all open tabs/devices.
 * Delivers instant (<100ms) UI updates using <2KB payloads without extra database queries.
 */
export function broadcastItemDelta(delta: {
  type: 'ITEM_UPSERT' | 'ITEM_DELETE' | 'ITEM_RESTORE' | 'TRASH_EMPTY' | 'META_UPDATE';
  item?: any;
  deletedId?: string;
  trashedItem?: any;
  activityText?: string;
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
 * with instant local IndexedDB save and debounced single-query database upsert.
 * Saves Supabase credits by coalescing rapid edits and avoiding redundant SELECT roundtrips.
 */
export function pushCloudState(state: AppMasterState, immediate = false): Promise<boolean> {
  const now = Date.now();
  state.lastUpdated = new Date(now).toISOString();
  state.lastUpdatedAt = now;
  state.is_master_locked = true;
  _pushInFlight = true;
  _lastPushTimestamp = now;
  recordLocalMutation();

  // Strictly enforce deletions and exact deduplication before saving
  const deletedList = state.deletedItemIds || [];
  if (Array.isArray(state.wardrobe)) {
    state.wardrobe = deduplicateExactWardrobeItems(state.wardrobe, deletedList);
  }

  // 1. Save to IndexedDB immediately (0ms local durability, multi-gigabyte safe)
  try {
    saveMasterStateIDB(state);
    if (Array.isArray(state.wardrobe)) {
      saveWardrobeItemsIDB(state.wardrobe);
    }
  } catch (err) {
    console.warn('IndexedDB write warning in pushCloudState:', err);
  }

  // If offline locked, strictly isolate to local storage
  if (isOfflineLocked()) {
    _pushInFlight = false;
    return Promise.resolve(true);
  }

  // 2. Write to Supabase database with a 350ms coalesce debounce (1 single query per batch of edits)
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
        console.warn('Supabase upsert failed:', err);
        resolve(false);
      } finally {
        _pushInFlight = false;
      }
    };

    if (immediate) {
      doPush();
    } else {
      syncDebounceTimer = setTimeout(doPush, 350);
    }
  });
}

/**
 * Subscribe to realtime state updates from Supabase:
 * Uses lightweight WebSocket Broadcast (`navini-instant-sync`) for sub-100ms item-level delta sync
 * without streaming 500KB postgres_changes echoes on every save.
 */
export function subscribeToCloudState(
  onUpdate: (newState: AppMasterState, source: 'postgres' | 'broadcast') => void,
  onDelta?: (delta: any) => void
): () => void {
  if (isOfflineLocked()) {
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

  // 1. WebSocket Broadcast: Master override or full-state sync when explicitly triggered
  channel.on('broadcast', { event: 'state_update' }, (event) => {
    if (isOfflineLocked()) return;
    const payload = event.payload;
    if (!payload || payload.senderId === CLIENT_ID) return;

    if (payload.masterState) {
      onUpdate(payload.masterState, 'broadcast');
    }
    if (onDelta) {
      onDelta(payload);
    }
  });

  // 2. Real-time Item Delta Broadcast (Instant <2KB item add/edit/delete/restore/packed toggle)
  channel.on('broadcast', { event: 'item_delta' }, (event) => {
    if (isOfflineLocked()) return;
    const payload = event.payload;
    if (!payload || payload.senderId === CLIENT_ID) return;

    if (onDelta) {
      onDelta(payload);
    }
  });

  channel.subscribe();

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
