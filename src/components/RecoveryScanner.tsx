import React, { useState, useEffect } from 'react';
import {
  Shield,
  RotateCw,
  HardDrive,
  Database,
  Cloud,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
  Download,
  Eye,
  X,
  Search,
  Check,
  Tag,
  Wand2,
} from 'lucide-react';
import {
  WardrobeItem,
  normalizeCategoryName,
  normalizeBagLocation,
} from '../data';
import { supabase, STORAGE_BUCKET, STATE_TABLE } from '../supabase';
import { scanAllIDBDatabases } from '../db';

interface ScannedStorageKey {
  key: string;
  sizeKB: number;
  itemCount: number;
  sampleNames: string[];
  items: WardrobeItem[];
}

interface ScannedCloudPhoto {
  name: string;
  url: string;
  created_at?: string | null;
  sizeKB?: number;
}

interface RecoveryScannerProps {
  isOpen: boolean;
  onClose: () => void;
  currentWardrobe: WardrobeItem[];
  onRestoreItems: (restoredItems: WardrobeItem[]) => Promise<void> | void;
}

export const RecoveryScanner: React.FC<RecoveryScannerProps> = ({
  isOpen,
  onClose,
  currentWardrobe,
  onRestoreItems,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCloudPhotos, setShowCloudPhotos] = useState(false);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState<string | null>(null);

  // Scan results
  const [localStorageKeys, setLocalStorageKeys] = useState<ScannedStorageKey[]>([]);
  const [idbResults, setIdbResults] = useState<Array<{ dbName: string; storeName: string; count: number; items: WardrobeItem[] }>>([]);
  const [supabaseRows, setSupabaseRows] = useState<Array<{ id: string; wardrobeCount: number; updated_at?: string }>>([]);
  const [cloudPhotos, setCloudPhotos] = useState<ScannedCloudPhoto[]>([]);
  const [allDiscoveredWardrobe, setAllDiscoveredWardrobe] = useState<WardrobeItem[]>([]);
  const [rawSavedNames, setRawSavedNames] = useState<string[]>([]);
  const [rawNameSearch, setRawNameSearch] = useState('');

  // Helper to ensure an item is a valid wardrobe item (NEVER an app item)
  const isWardrobeLike = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;

    // Purge app categories / app items from wardrobe
    const isApp =
      typeof item.platform === 'string' ||
      typeof item.appIcon === 'string' ||
      typeof item.isInstalled === 'boolean' ||
      typeof item.isConfigured === 'boolean' ||
      item.category === 'Proxy & Bypass' ||
      item.category === 'Proxies & Bypass' ||
      item.category === 'Stock AI & Academic' ||
      item.category === 'Transit & Maps';
    if (isApp) return false;

    const hasName = typeof item.name === 'string' && item.name.trim().length > 0;
    const hasWardrobeProp =
      typeof item.category === 'string' ||
      typeof item.targetBag === 'string' ||
      typeof item.isPacked === 'boolean' ||
      typeof item.isBought === 'boolean' ||
      typeof item.photoUrl === 'string';

    return hasName && hasWardrobeProp;
  };

  const runGlobalScan = async () => {
    setIsScanning(true);
    setRestoreSuccessMsg(null);

    const discoveredMap = new Map<string, WardrobeItem>();
    const photoToOriginalItem = new Map<string, WardrobeItem>();
    const rawNamesSet = new Set<string>();

    // 1. SCAN ALL LOCALSTORAGE KEYS
    const scannedKeys: ScannedStorageKey[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const rawVal = localStorage.getItem(key) || '';
        const sizeKB = Math.round((rawVal.length * 2) / 1024);
        let items: WardrobeItem[] = [];

        try {
          const parsed = JSON.parse(rawVal);
          if (Array.isArray(parsed)) {
            items = parsed.filter(isWardrobeLike);
          } else if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.wardrobe)) {
              items = parsed.wardrobe.filter(isWardrobeLike);
            } else if (Array.isArray(parsed.items)) {
              items = parsed.items.filter(isWardrobeLike);
            }
          }
        } catch {}

        if (items.length > 0 || key.includes('wardrobe') || key.includes('navini') || key.includes('plan')) {
          scannedKeys.push({
            key,
            sizeKB,
            itemCount: items.length,
            sampleNames: items.slice(0, 3).map((w) => w.name),
            items,
          });

          items.forEach((item) => {
            const trimmedName = (item.name || '').trim();
            if (trimmedName && !trimmedName.toLowerCase().startsWith('recovered item')) {
              rawNamesSet.add(trimmedName);
            }

            // Normalization
            const normCat = normalizeCategoryName(item.category);
            const normBag = normalizeBagLocation(item.targetBag);
            const isPacked =
              item.isPacked === true ||
              (item as any).packed === true ||
              (item as any).checked === true ||
              (item as any).status === 'packed';

            const normalizedItem: WardrobeItem = {
              ...item,
              category: normCat,
              targetBag: normBag,
              isPacked,
            };

            // Map photo to item for real title re-linking
            if (item.photoUrl && trimmedName && !trimmedName.toLowerCase().startsWith('recovered item')) {
              photoToOriginalItem.set(item.photoUrl, normalizedItem);
              const filename = item.photoUrl.split('/').pop()?.split('?')[0];
              if (filename) photoToOriginalItem.set(filename, normalizedItem);
            }

            const normKey = (item.name || '').trim().toLowerCase();
            if (normKey) {
              const existing = discoveredMap.get(normKey);
              if (!existing) {
                discoveredMap.set(normKey, normalizedItem);
              } else {
                // If either is packed, preserve packed=true
                discoveredMap.set(normKey, {
                  ...existing,
                  photoUrl: existing.photoUrl || normalizedItem.photoUrl,
                  notes: existing.notes || normalizedItem.notes,
                  isPacked: existing.isPacked || isPacked,
                });
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('localStorage scan warning:', e);
    }
    setLocalStorageKeys(scannedKeys);

    // 2. SCAN ALL INDEXEDDB DATABASES
    try {
      const idbData = await scanAllIDBDatabases();
      const validIdb: Array<{ dbName: string; storeName: string; count: number; items: WardrobeItem[] }> = [];

      idbData.forEach((dbEntry) => {
        const wardrobeItems = dbEntry.items.filter(isWardrobeLike);
        if (wardrobeItems.length > 0 || dbEntry.storeName.includes('wardrobe')) {
          validIdb.push({
            dbName: dbEntry.dbName,
            storeName: dbEntry.storeName,
            count: dbEntry.count,
            items: wardrobeItems,
          });

          wardrobeItems.forEach((item) => {
            const trimmedName = (item.name || '').trim();
            if (trimmedName && !trimmedName.toLowerCase().startsWith('recovered item')) {
              rawNamesSet.add(trimmedName);
            }

            const normCat = normalizeCategoryName(item.category);
            const normBag = normalizeBagLocation(item.targetBag);
            const isPacked =
              item.isPacked === true ||
              (item as any).packed === true ||
              (item as any).checked === true ||
              (item as any).status === 'packed';

            const normalizedItem: WardrobeItem = {
              ...item,
              category: normCat,
              targetBag: normBag,
              isPacked,
            };

            if (item.photoUrl && trimmedName && !trimmedName.toLowerCase().startsWith('recovered item')) {
              photoToOriginalItem.set(item.photoUrl, normalizedItem);
              const filename = item.photoUrl.split('/').pop()?.split('?')[0];
              if (filename) photoToOriginalItem.set(filename, normalizedItem);
            }

            const normKey = (item.name || '').trim().toLowerCase();
            if (normKey) {
              const existing = discoveredMap.get(normKey);
              if (!existing) {
                discoveredMap.set(normKey, normalizedItem);
              } else {
                discoveredMap.set(normKey, {
                  ...existing,
                  photoUrl: existing.photoUrl || normalizedItem.photoUrl,
                  isPacked: existing.isPacked || isPacked,
                });
              }
            }
          });
        }
      });
      setIdbResults(validIdb);
    } catch (e) {
      console.warn('IndexedDB scan warning:', e);
    }

    // 3. SCAN SUPABASE DATABASE (ALL ROWS IN app_state)
    try {
      const { data: rows } = await supabase.from(STATE_TABLE).select('*');
      if (rows && Array.isArray(rows)) {
        const scannedRows = rows.map((r) => {
          const wItems = (r.payload?.wardrobe || []).filter(isWardrobeLike);
          wItems.forEach((item: WardrobeItem) => {
            const trimmedName = (item.name || '').trim();
            if (trimmedName && !trimmedName.toLowerCase().startsWith('recovered item')) {
              rawNamesSet.add(trimmedName);
            }

            const normCat = normalizeCategoryName(item.category);
            const normBag = normalizeBagLocation(item.targetBag);
            const isPacked =
              item.isPacked === true ||
              (item as any).packed === true ||
              (item as any).checked === true ||
              (item as any).status === 'packed';

            const normalizedItem: WardrobeItem = {
              ...item,
              category: normCat,
              targetBag: normBag,
              isPacked,
            };

            if (item.photoUrl && trimmedName && !trimmedName.toLowerCase().startsWith('recovered item')) {
              photoToOriginalItem.set(item.photoUrl, normalizedItem);
              const filename = item.photoUrl.split('/').pop()?.split('?')[0];
              if (filename) photoToOriginalItem.set(filename, normalizedItem);
            }

            const normKey = (item.name || '').trim().toLowerCase();
            if (normKey) {
              const existing = discoveredMap.get(normKey);
              if (!existing) {
                discoveredMap.set(normKey, normalizedItem);
              } else {
                discoveredMap.set(normKey, {
                  ...existing,
                  photoUrl: existing.photoUrl || normalizedItem.photoUrl,
                  isPacked: existing.isPacked || isPacked,
                });
              }
            }
          });
          return {
            id: r.id,
            wardrobeCount: wItems.length,
            updated_at: r.updated_at,
          };
        });
        setSupabaseRows(scannedRows);
      }
    } catch (e) {
      console.warn('Supabase database scan warning:', e);
    }

    // 4. SCAN SUPABASE STORAGE BUCKET (travel-media/wardrobe)
    try {
      const { data: files } = await supabase.storage.from(STORAGE_BUCKET).list('wardrobe', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (files && Array.isArray(files)) {
        const photos: ScannedCloudPhoto[] = files
          .filter((f) => f.name && !f.name.startsWith('.'))
          .map((f) => {
            const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(`wardrobe/${f.name}`);
            return {
              name: f.name,
              url: data.publicUrl,
              created_at: f.created_at,
              sizeKB: f.metadata?.size ? Math.round(f.metadata.size / 1024) : undefined,
            };
          });
        setCloudPhotos(photos);
      }
    } catch (e) {
      console.warn('Supabase storage scan warning:', e);
    }

    // 5. AUTO-MATCH REAL TITLES FOR "Recovered Item X" (Requirement #6.1)
    const finalizedItems = Array.from(discoveredMap.values()).map((item) => {
      const isPlaceholder =
        item.name.toLowerCase().startsWith('recovered item') ||
        item.name.toLowerCase().startsWith('untitled');

      if (isPlaceholder && item.photoUrl) {
        const filename = item.photoUrl.split('/').pop()?.split('?')[0];
        const match = photoToOriginalItem.get(item.photoUrl) || (filename ? photoToOriginalItem.get(filename) : undefined);
        if (match && match.name && !match.name.toLowerCase().startsWith('recovered item')) {
          return {
            ...item,
            name: match.name,
            category: match.category || item.category,
            targetBag: match.targetBag || item.targetBag,
            isPacked: match.isPacked || item.isPacked,
          };
        }
      }
      return item;
    });

    setAllDiscoveredWardrobe(finalizedItems);
    setRawSavedNames(Array.from(rawNamesSet).sort());
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen) {
      runGlobalScan();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Compare discovered items with current active wardrobe
  const currentNames = new Set(currentWardrobe.map((w) => (w.name || '').trim().toLowerCase()));
  const missingItemsToRestore = allDiscoveredWardrobe.filter(
    (w) => !currentNames.has((w.name || '').trim().toLowerCase())
  );

  // Cloud photos not currently referenced
  const activePhotoUrls = new Set(currentWardrobe.map((w) => w.photoUrl).filter(Boolean));
  const unattachedCloudPhotos = cloudPhotos.filter((p) => !activePhotoUrls.has(p.url));

  const filteredRawNames = rawSavedNames.filter((name) =>
    name.toLowerCase().includes(rawNameSearch.toLowerCase())
  );

  // Auto-Match & Restore All Found Items
  const handleRestoreClick = async () => {
    setIsRestoring(true);
    try {
      const mergedList = [...currentWardrobe];
      let restoredCount = 0;

      allDiscoveredWardrobe.forEach((candidate) => {
        const existingIdx = mergedList.findIndex(
          (m) =>
            m.id === candidate.id ||
            m.name.trim().toLowerCase() === candidate.name.trim().toLowerCase()
        );

        if (existingIdx === -1) {
          mergedList.push(candidate);
          restoredCount++;
        } else {
          // If candidate was marked packed in any storage key, restore packed state
          if (candidate.isPacked && !mergedList[existingIdx].isPacked) {
            mergedList[existingIdx] = {
              ...mergedList[existingIdx],
              isPacked: true,
            };
          }
        }
      });

      await onRestoreItems(mergedList);
      setRestoreSuccessMsg(
        `✓ Restored & synchronized ${allDiscoveredWardrobe.length} items. All packed states & titles locked into iPad and Cloud.`
      );
    } catch (err) {
      console.error('Failed to restore items:', err);
    } finally {
      setIsRestoring(false);
    }
  };

  // Convert unattached cloud photos into items with available names
  const handleAdoptCloudPhotos = async () => {
    if (unattachedCloudPhotos.length === 0) return;
    setIsRestoring(true);
    try {
      const mergedList = [...currentWardrobe];
      let count = 0;

      unattachedCloudPhotos.forEach((photo, idx) => {
        const id = `w-recovered-cloud-${Date.now()}-${idx}`;
        const newWardrobeItem: WardrobeItem = {
          id,
          name: `Recovered Item ${mergedList.length + 1}`,
          category: 'Tops',
          targetBag: 'Main Large Rolling Suitcase',
          quantity: 1,
          photoUrl: photo.url,
          notes: 'iPad camera photo recovered from Supabase Cloud Storage',
          isBought: true,
          isPacked: false,
        };
        mergedList.push(newWardrobeItem);
        count++;
      });

      await onRestoreItems(mergedList);
      setRestoreSuccessMsg(
        `✓ Created ${count} items from cloud photos. Tap titles directly on cards to rename them.`
      );
    } catch (err) {
      console.error('Failed to adopt cloud photos:', err);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP HEADER */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Emergency Data Recovery & Raw Names Vault
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  iPad & Cloud
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Deep-scans 29 storage keys, IndexedDB vaults, and Supabase cloud photos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runGlobalScan}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Rescan'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. BODY CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* SUCCESS BANNER */}
          {restoreSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{restoreSuccessMsg}</span>
            </div>
          )}

          {/* METRIC TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Active in Wardrobe</span>
              </div>
              <div className="text-xl font-black text-slate-900 mt-0.5">
                {currentWardrobe.length} <span className="text-xs font-normal text-slate-500">items</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>localStorage Keys</span>
              </div>
              <div className="text-xl font-black text-amber-900 mt-0.5">
                {localStorageKeys.length} <span className="text-xs font-normal text-slate-500">keys</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Discovered Items</span>
              </div>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {allDiscoveredWardrobe.length} <span className="text-xs font-normal text-slate-500">records</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-sky-600" />
                <span>Cloud Photos</span>
              </div>
              <div className="text-xl font-black text-sky-800 mt-0.5">
                {cloudPhotos.length} <span className="text-xs font-normal text-slate-500">photos</span>
              </div>
            </div>
          </div>

          {/* RESTORE ACTION BAR */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-extrabold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                <span>Available to Restore:</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
                  {missingItemsToRestore.length > 0 ? `${missingItemsToRestore.length} items ready` : 'All items active'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Matches saved photos back to real titles and restores locked-in packed states.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRestoreClick}
                disabled={isRestoring || allDiscoveredWardrobe.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{isRestoring ? 'Restoring...' : `RESTORE ALL FOUND ITEMS (${allDiscoveredWardrobe.length})`}</span>
              </button>

              {unattachedCloudPhotos.length > 0 && (
                <button
                  type="button"
                  onClick={handleAdoptCloudPhotos}
                  disabled={isRestoring}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Recover {unattachedCloudPhotos.length} Photos</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. RAW SAVED NAMES PICKER (Requirement #6.2) */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                  🔍 View All Raw Saved Names ({rawSavedNames.length} Found Across 29 Keys)
                </h3>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={rawNameSearch}
                  onChange={(e) => setRawNameSearch(e.target.value)}
                  placeholder="Filter saved names..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-[#007AFF]"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every unique title ever typed across your iPad’s storage keys and cloud backups. Use these to rename any generic item inline:
            </p>

            <div className="max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
              {filteredRawNames.map((name, i) => (
                <div
                  key={i}
                  className="p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between gap-1 shadow-2xs hover:border-[#007AFF]"
                >
                  <span className="truncate">{name}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">#{i + 1}</span>
                </div>
              ))}
              {filteredRawNames.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-400">
                  No matching names found.
                </div>
              )}
            </div>
          </div>

          {/* 4. EXPANDABLE TECHNICAL STORAGE INSPECTION */}
          <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-3">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between font-bold text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <span>Inspect All 29 Storage Keys & Cloud Photos Breakdown</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div className="space-y-3 pt-2 text-xs">
                {/* Storage keys table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-3">Storage Key</th>
                        <th className="py-1.5 px-3">Size (KB)</th>
                        <th className="py-1.5 px-3">Wardrobe Count</th>
                        <th className="py-1.5 px-3">Sample Items</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {localStorageKeys.map((k) => (
                        <tr key={k.key} className={k.itemCount > 0 ? 'bg-amber-50/40' : ''}>
                          <td className="py-1.5 px-3 font-bold text-slate-800">{k.key}</td>
                          <td className="py-1.5 px-3 text-slate-600">{k.sizeKB} KB</td>
                          <td className="py-1.5 px-3">
                            {k.itemCount > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                {k.itemCount} items
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </td>
                          <td className="py-1.5 px-3 text-slate-500 font-sans truncate max-w-xs">
                            {k.sampleNames.join(', ') || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cloud Photos Preview */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowCloudPhotos(!showCloudPhotos)}
                    className="font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer mb-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showCloudPhotos ? 'Hide Cloud Photo Grid' : `View All ${cloudPhotos.length} Cloud Storage Photos`}</span>
                  </button>

                  {showCloudPhotos && (
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 rounded-xl bg-white border border-slate-200 max-h-56 overflow-y-auto">
                      {cloudPhotos.map((photo, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 bg-white aspect-square shadow-2xs">
                          <img
                            src={photo.url}
                            alt={`Cloud photo ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 font-mono truncate px-0.5">
                            #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
