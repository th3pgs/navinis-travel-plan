import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
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
} from 'lucide-react';
import { WardrobeItem } from '../data';
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
  currentWardrobe: WardrobeItem[];
  onRestoreItems: (restoredItems: WardrobeItem[]) => Promise<void> | void;
}

export const RecoveryScanner: React.FC<RecoveryScannerProps> = ({
  currentWardrobe,
  onRestoreItems,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCloudPhotos, setShowCloudPhotos] = useState(false);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState<string | null>(null);

  // Scan results
  const [localStorageKeys, setLocalStorageKeys] = useState<ScannedStorageKey[]>([]);
  const [idbResults, setIdbResults] = useState<Array<{ dbName: string; storeName: string; count: number; items: WardrobeItem[] }>>([]);
  const [supabaseRows, setSupabaseRows] = useState<Array<{ id: string; wardrobeCount: number; updated_at?: string }>>([]);
  const [cloudPhotos, setCloudPhotos] = useState<ScannedCloudPhoto[]>([]);
  const [allDiscoveredWardrobe, setAllDiscoveredWardrobe] = useState<WardrobeItem[]>([]);

  // Helper to test if an object looks like a wardrobe item
  const isWardrobeLike = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;
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
        } catch {
          // not JSON
        }

        if (items.length > 0 || key.includes('wardrobe') || key.includes('navini') || key.includes('plan')) {
          scannedKeys.push({
            key,
            sizeKB,
            itemCount: items.length,
            sampleNames: items.slice(0, 3).map((w) => w.name),
            items,
          });

          // Add to overall candidate pool
          items.forEach((item) => {
            const normKey = (item.name || '').trim().toLowerCase();
            if (normKey && !discoveredMap.has(normKey)) {
              discoveredMap.set(normKey, item);
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
            const normKey = (item.name || '').trim().toLowerCase();
            if (normKey && !discoveredMap.has(normKey)) {
              discoveredMap.set(normKey, item);
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
            const normKey = (item.name || '').trim().toLowerCase();
            if (normKey && !discoveredMap.has(normKey)) {
              discoveredMap.set(normKey, item);
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

    setAllDiscoveredWardrobe(Array.from(discoveredMap.values()));
    setIsScanning(false);
    setHasScanned(true);
  };

  useEffect(() => {
    runGlobalScan();
  }, []);

  // Calculate missing items (discovered vs currently active in wardrobe)
  const currentNames = new Set(currentWardrobe.map((w) => (w.name || '').trim().toLowerCase()));
  const missingItemsToRestore = allDiscoveredWardrobe.filter(
    (w) => !currentNames.has((w.name || '').trim().toLowerCase())
  );

  // Cloud photos that don't have an active wardrobe item referencing them
  const activePhotoUrls = new Set(currentWardrobe.map((w) => w.photoUrl).filter(Boolean));
  const unattachedCloudPhotos = cloudPhotos.filter((p) => !activePhotoUrls.has(p.url));

  const handleRestoreClick = async () => {
    setIsRestoring(true);
    try {
      // Merge all discovered items into current wardrobe
      const mergedList = [...currentWardrobe];
      let restoredCount = 0;

      allDiscoveredWardrobe.forEach((candidate) => {
        const exists = mergedList.some(
          (m) =>
            m.id === candidate.id ||
            m.name.trim().toLowerCase() === candidate.name.trim().toLowerCase()
        );
        if (!exists) {
          mergedList.push(candidate);
          restoredCount++;
        }
      });

      await onRestoreItems(mergedList);
      setRestoreSuccessMsg(`✓ Successfully restored ${restoredCount} items into your wardrobe! All data is permanently saved to iPad & Cloud.`);
    } catch (err) {
      console.error('Failed to restore items:', err);
      alert('Error during restore. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  // Convert unattached cloud photos into wardrobe items if desired
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
          targetBag: 'Main Large Suitcase (30×40×70cm)',
          quantity: 1,
          photoUrl: photo.url,
          notes: 'Auto-recovered from iPad camera cloud storage upload',
          isBought: true,
          isPacked: false,
        };
        mergedList.push(newWardrobeItem);
        count++;
      });

      await onRestoreItems(mergedList);
      setRestoreSuccessMsg(`✓ Created ${count} items from discovered cloud photos! All items are now in your wardrobe.`);
    } catch (err) {
      console.error('Failed to adopt cloud photos:', err);
    } finally {
      setIsRestoring(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="bg-amber-500 text-amber-950 px-3.5 py-1.5 flex items-center justify-between text-xs font-bold border-b border-amber-600/30 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-900" />
          <span>
            Recovery Scanner: {allDiscoveredWardrobe.length} items & {cloudPhotos.length} cloud photos available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runGlobalScan}
            disabled={isScanning}
            className="hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Scan</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-100 hover:bg-black transition-colors cursor-pointer"
          >
            Open Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-b-2 border-amber-400 p-3.5 sm:p-5 shadow-md">
      <div className="max-w-6xl mx-auto space-y-3.5">
        {/* 1. HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-amber-950 tracking-tight">
                  iPad & Cloud Emergency Data Recovery Scanner
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  On-Screen Diagnostic
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Deep-scans iPad Chrome localStorage, IndexedDB vaults, and Supabase cloud storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={runGlobalScan}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-amber-600' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Rescan Now'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
              title="Minimize banner"
            >
              Minimize
            </button>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {restoreSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{restoreSuccessMsg}</span>
          </div>
        )}

        {/* 2. SUMMARY METRICS TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
          {/* Tile 1: Active Wardrobe */}
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Active in Wardrobe</span>
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {currentWardrobe.length}{' '}
              <span className="text-xs font-normal text-slate-500">items</span>
            </div>
          </div>

          {/* Tile 2: Scanned Keys in Browser */}
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              <span>localStorage Keys</span>
            </div>
            <div className="text-xl font-black text-amber-900 mt-0.5">
              {localStorageKeys.length}{' '}
              <span className="text-xs font-normal text-slate-500">keys scanned</span>
            </div>
          </div>

          {/* Tile 3: Total Discovered Items */}
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Discovered Records</span>
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {allDiscoveredWardrobe.length}{' '}
              <span className="text-xs font-normal text-slate-500">unique items</span>
            </div>
          </div>

          {/* Tile 4: Discovered Cloud Photos */}
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-sky-600" />
              <span>Cloud Storage Photos</span>
            </div>
            <div className="text-xl font-black text-sky-800 mt-0.5">
              {cloudPhotos.length}{' '}
              <span className="text-xs font-normal text-slate-500">photos saved</span>
            </div>
          </div>
        </div>

        {/* 3. PRIMARY ACTION BAR */}
        <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="font-extrabold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Status:</span>
              {missingItemsToRestore.length > 0 ? (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
                  {missingItemsToRestore.length} items can be restored now!
                </span>
              ) : (
                <span className="text-amber-800">
                  All {allDiscoveredWardrobe.length} discovered items are currently active.
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-800">
              {cloudPhotos.length > 0
                ? `${cloudPhotos.length} iPad camera photos are safely preserved in Supabase Cloud Storage.`
                : 'Scanned browser cache and cloud backups.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            {/* ONE-TAP RESTORE BUTTON */}
            <button
              type="button"
              onClick={handleRestoreClick}
              disabled={isRestoring || allDiscoveredWardrobe.length === 0}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>
                {isRestoring
                  ? 'Restoring Items...'
                  : `RESTORE ALL FOUND ITEMS (${allDiscoveredWardrobe.length})`}
              </span>
            </button>

            {/* ADOPT UNATTACHED CLOUD PHOTOS */}
            {unattachedCloudPhotos.length > 0 && (
              <button
                type="button"
                onClick={handleAdoptCloudPhotos}
                disabled={isRestoring}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                title="Create wardrobe items for uploaded photos that are not currently linked"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Recover {unattachedCloudPhotos.length} Cloud Photos</span>
              </button>
            )}

            {/* TOGGLE STORAGE DETAILS */}
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showDetails ? 'Hide Details' : 'Inspect Storage'}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 4. EXPANDABLE TECHNICAL INSPECTION PANEL */}
        {showDetails && (
          <div className="bg-white rounded-2xl p-4 border border-amber-200 space-y-4 animate-in fade-in duration-200 text-xs">
            {/* A. Browser localStorage Keys Table */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                  <span>Browser localStorage Keys Scanned ({localStorageKeys.length})</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Origin storage: ~{localStorageKeys.reduce((acc, k) => acc + k.sizeKB, 0)} KB total
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-3">Storage Key Name</th>
                      <th className="py-1.5 px-3">Size (KB)</th>
                      <th className="py-1.5 px-3">Wardrobe Items</th>
                      <th className="py-1.5 px-3">Sample Items Found</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {localStorageKeys.map((k) => (
                      <tr key={k.key} className={k.itemCount > 0 ? 'bg-amber-50/50' : ''}>
                        <td className="py-1.5 px-3 font-bold text-slate-800">{k.key}</td>
                        <td className="py-1.5 px-3 text-slate-600">{k.sizeKB} KB</td>
                        <td className="py-1.5 px-3">
                          {k.itemCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              {k.itemCount} items
                            </span>
                          ) : (
                            <span className="text-slate-400">0 items</span>
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
            </div>

            {/* B. IndexedDB Databases */}
            <div>
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>IndexedDB Databases ({idbResults.length})</span>
              </span>
              {idbResults.length === 0 ? (
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 text-[11px] italic">
                  No existing IndexedDB stores detected. The new vault will initialize automatically upon saving.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {idbResults.map((idb, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="font-bold text-emerald-950 font-mono text-[11px]">
                        {idb.dbName} → {idb.storeName}
                      </div>
                      <div className="text-[11px] text-emerald-800 mt-0.5">
                        {idb.count} records stored ({idb.items.length} wardrobe items)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* C. Supabase Rows & Storage Photos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-sky-600" />
                  <span>Supabase Cloud Storage Photos ({cloudPhotos.length} in travel-media/wardrobe)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCloudPhotos(!showCloudPhotos)}
                  className="text-[11px] text-sky-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showCloudPhotos ? 'Hide Photo Previews' : 'Preview Photos'}</span>
                </button>
              </div>

              {/* Photo Preview Grid */}
              {showCloudPhotos && (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 max-h-56 overflow-y-auto">
                  {cloudPhotos.map((photo, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white aspect-square shadow-2xs">
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
  );
};
