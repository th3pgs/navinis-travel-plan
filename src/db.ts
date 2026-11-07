/**
 * Navini Travel Vault - Native IndexedDB Storage Engine
 * Provides multi-gigabyte client storage on iPadOS/Chrome/Safari without 5MB quota limits.
 */
import { WardrobeItem } from './data';
import { AppMasterState } from './cloudSync';

const DB_NAME = 'navini_travel_vault';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getIDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('wardrobe')) {
        db.createObjectStore('wardrobe', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('master_state')) {
        db.createObjectStore('master_state', { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains('media_cache')) {
        db.createObjectStore('media_cache', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

/**
 * Save all wardrobe items to IndexedDB
 */
export async function saveWardrobeItemsIDB(items: WardrobeItem[]): Promise<void> {
  try {
    const db = await getIDB();
    const tx = db.transaction('wardrobe', 'readwrite');
    const store = tx.objectStore('wardrobe');

    // Clear old records in this store to keep mirror exact
    store.clear();

    for (const item of items) {
      store.put(item);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted'));
    });
  } catch (err) {
    console.warn('IndexedDB saveWardrobeItemsIDB warning:', err);
  }
}

/**
 * Retrieve all wardrobe items from IndexedDB
 */
export async function getWardrobeItemsIDB(): Promise<WardrobeItem[] | null> {
  try {
    const db = await getIDB();
    const tx = db.transaction('wardrobe', 'readonly');
    const store = tx.objectStore('wardrobe');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const items = request.result as WardrobeItem[];
        resolve(Array.isArray(items) && items.length > 0 ? items : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB getWardrobeItemsIDB warning:', err);
    return null;
  }
}

/**
 * Save the entire master plan state to IndexedDB
 */
export async function saveMasterStateIDB(state: AppMasterState): Promise<void> {
  try {
    const db = await getIDB();
    const tx = db.transaction('master_state', 'readwrite');
    const store = tx.objectStore('master_state');
    store.put({ key: 'main_plan', payload: state, savedAt: new Date().toISOString() });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB saveMasterStateIDB warning:', err);
  }
}

/**
 * Retrieve the master plan state from IndexedDB
 */
export async function getMasterStateIDB(): Promise<AppMasterState | null> {
  try {
    const db = await getIDB();
    const tx = db.transaction('master_state', 'readonly');
    const store = tx.objectStore('master_state');
    const request = store.get('main_plan');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const res = request.result;
        resolve(res && res.payload ? (res.payload as AppMasterState) : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB getMasterStateIDB warning:', err);
    return null;
  }
}

export interface DiscoveredIDBData {
  dbName: string;
  storeName: string;
  count: number;
  items: any[];
}

/**
 * Scan all available IndexedDB databases in the browser looking for any wardrobe/travel items
 */
export async function scanAllIDBDatabases(): Promise<DiscoveredIDBData[]> {
  const results: DiscoveredIDBData[] = [];
  if (typeof window === 'undefined' || !window.indexedDB) return results;

  try {
    // Check if indexedDB.databases is supported (Chrome/Safari 14+)
    const dbs = window.indexedDB.databases ? await window.indexedDB.databases() : [{ name: DB_NAME, version: DB_VERSION }];

    for (const dbInfo of dbs) {
      if (!dbInfo.name) continue;
      try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const req = window.indexedDB.open(dbInfo.name!);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });

        const storeNames = Array.from(db.objectStoreNames);
        for (const storeName of storeNames) {
          try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const items = await new Promise<any[]>((resolve) => {
              const req = store.getAll();
              req.onsuccess = () => resolve(req.result || []);
              req.onerror = () => resolve([]);
            });

            if (items.length > 0) {
              results.push({
                dbName: dbInfo.name,
                storeName,
                count: items.length,
                items,
              });
            }
          } catch {}
        }
        db.close();
      } catch {}
    }
  } catch (e) {
    console.warn('IndexedDB global scan warning:', e);
  }

  return results;
}
