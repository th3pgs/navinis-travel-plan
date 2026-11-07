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
  FileText,
  AlertTriangle,
  RefreshCw,
  Layers,
} from 'lucide-react';
import {
  WardrobeItem,
  normalizeCategoryName,
  normalizeBagLocation,
  isSoftwareAppOrNonWardrobe,
  isUnnamedRetake,
} from '../data';
import { supabase, STORAGE_BUCKET, STATE_TABLE, STATE_ROW_ID } from '../supabase';
import { scanAllIDBDatabases } from '../db';

interface ScannedStorageKey {
  key: string;
  sizeKB: number;
  itemCount: number;
  dataType: string;
  sampleTitles: string[];
  rawPreview: string;
  isWardrobeKey: boolean;
  items: WardrobeItem[];
}

interface ScannedCloudPhoto {
  name: string;
  url: string;
  created_at?: string | null;
  sizeKB?: number;
}

interface SupabaseInspection {
  tableName: string;
  rowId: string;
  updatedAt?: string;
  wardrobeCount: number;
  wardrobeTitles: string[];
  appsCount: number;
  devicesCount: number;
  bagsCount: number;
  documentsCount: number;
}

interface RecoveryScannerProps {
  isOpen: boolean;
  onClose: () => void;
  currentWardrobe: WardrobeItem[];
  onRestoreItems: (restoredItems: WardrobeItem[]) => Promise<void> | void;
  onPullFromSupabase?: () => Promise<void>;
}

export const RecoveryScanner: React.FC<RecoveryScannerProps> = ({
  isOpen,
  onClose,
  currentWardrobe,
  onRestoreItems,
  onPullFromSupabase,
}) => {
  const [activeTab, setActiveTab] = useState<'recovery' | 'inspector'>('recovery');
  const [isScanning, setIsScanning] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCloudPhotos, setShowCloudPhotos] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [restoreSuccessMsg, setRestoreSuccessMsg] = useState<string | null>(null);

  // Scan results
  const [allStorageKeys, setAllStorageKeys] = useState<ScannedStorageKey[]>([]);
  const [idbResults, setIdbResults] = useState<Array<{ dbName: string; storeName: string; count: number; items: WardrobeItem[] }>>([]);
  const [supabaseInspection, setSupabaseInspection] = useState<SupabaseInspection | null>(null);
  const [cloudPhotos, setCloudPhotos] = useState<ScannedCloudPhoto[]>([]);
  const [allDiscoveredWardrobe, setAllDiscoveredWardrobe] = useState<WardrobeItem[]>([]);
  const [rawSavedNames, setRawSavedNames] = useState<string[]>([]);
  const [rawNameSearch, setRawNameSearch] = useState('');

  const isWardrobeLike = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;
    if (isSoftwareAppOrNonWardrobe(item)) return false;

    const hasName = typeof item.name === 'string' && item.name.trim().length > 0;
    const hasWardrobeProp =
      typeof item.category === 'string' ||
      typeof item.targetBag === 'string' ||
      typeof item.isPacked === 'boolean' ||
      typeof item.isBought === 'boolean' ||
      typeof item.photoUrl === 'string';

    return hasName && hasWardrobeProp;
  };

  const isExplicitNonWardrobeKey = (key: string): boolean => {
    const k = key.toLowerCase();
    return (
      k.includes('app') ||
      k.includes('step') ||
      k.includes('doc') ||
      k.includes('bag') ||
      k.includes('device') ||
      k.includes('gift') ||
      k.includes('milestone') ||
      k.includes('bank') ||
      k.includes('auth') ||
      k.includes('chat')
    );
  };

  const runGlobalScan = async () => {
    setIsScanning(true);
    setRestoreSuccessMsg(null);

    const discoveredMap = new Map<string, WardrobeItem>();
    const photoToOriginalItem = new Map<string, WardrobeItem>();
    const rawNamesSet = new Set<string>();
    const scannedKeys: ScannedStorageKey[] = [];

    // 1. SCAN ALL LOCALSTORAGE KEYS
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const rawVal = localStorage.getItem(key) || '';
        const sizeKB = Math.round((rawVal.length * 2) / 1024);
        let items: WardrobeItem[] = [];
        let dataType = 'string';
        let sampleTitles: string[] = [];

        try {
          const parsed = JSON.parse(rawVal);
          if (Array.isArray(parsed)) {
            dataType = `Array (${parsed.length})`;
            sampleTitles = parsed.slice(0, 8).map((p: any) => p.name || p.title || p.label || String(p)).filter(Boolean);

            // ONLY extract wardrobe items if the key is not an explicit non-wardrobe key
            if (!isExplicitNonWardrobeKey(key)) {
              items = parsed.filter(isWardrobeLike);
            }
          } else if (parsed && typeof parsed === 'object') {
            dataType = 'Object';
            if (Array.isArray(parsed.wardrobe)) {
              items = parsed.wardrobe.filter(isWardrobeLike);
              sampleTitles = items.slice(0, 8).map((w) => w.name);
            } else if (Array.isArray(parsed.items) && !isExplicitNonWardrobeKey(key)) {
              items = parsed.items.filter(isWardrobeLike);
              sampleTitles = items.slice(0, 8).map((w) => w.name);
            } else {
              sampleTitles = Object.keys(parsed).slice(0, 5);
            }
          }
        } catch {
          dataType = 'raw';
          sampleTitles = [rawVal.slice(0, 40)];
        }

        const isWardrobeKey = key.includes('wardrobe') || items.length > 0;

        scannedKeys.push({
          key,
          sizeKB,
          itemCount: items.length,
          dataType,
          sampleTitles,
          rawPreview: rawVal.slice(0, 500),
          isWardrobeKey,
          items,
        });

        // Collect legitimate wardrobe items
        items.forEach((item) => {
          const trimmedName = (item.name || '').trim();
          if (trimmedName && !isUnnamedRetake(item)) {
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

          if (item.photoUrl && trimmedName && !isUnnamedRetake(item)) {
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
                notes: existing.notes || normalizedItem.notes,
                isPacked: existing.isPacked || isPacked,
              });
            }
          }
        });
      }
    } catch (e) {
      console.warn('localStorage scan warning:', e);
    }
    setAllStorageKeys(scannedKeys);

    // 2. SCAN INDEXEDDB DATABASES
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
            if (trimmedName && !isUnnamedRetake(item)) {
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

            if (item.photoUrl && trimmedName && !isUnnamedRetake(item)) {
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

    // 3. SCAN SUPABASE DATABASE (app_state table)
    try {
      const { data: row } = await supabase
        .from(STATE_TABLE)
        .select('*')
        .eq('id', STATE_ROW_ID)
        .maybeSingle();

      if (row && row.payload) {
        const p = row.payload;
        const wItems = (p.wardrobe || []).filter(isWardrobeLike);
        const titles = wItems.map((w: any) => w.name).filter((n: string) => !isUnnamedRetake({ name: n } as any));

        wItems.forEach((item: WardrobeItem) => {
          const trimmedName = (item.name || '').trim();
          if (trimmedName && !isUnnamedRetake(item)) {
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

          if (item.photoUrl && trimmedName && !isUnnamedRetake(item)) {
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

        setSupabaseInspection({
          tableName: STATE_TABLE,
          rowId: STATE_ROW_ID,
          updatedAt: row.updated_at,
          wardrobeCount: wItems.length,
          wardrobeTitles: titles,
          appsCount: (p.apps || []).length,
          devicesCount: (p.devices || []).length,
          bagsCount: (p.bags || []).length,
          documentsCount: (p.documents || []).length,
        });
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

    // 5. RESTORE USER-TYPED NAMES ONTO UNNAMED IMAGES
    const finalizedItems = Array.from(discoveredMap.values()).map((item) => {
      if (isUnnamedRetake(item) && item.photoUrl) {
        const filename = item.photoUrl.split('/').pop()?.split('?')[0];
        const match = photoToOriginalItem.get(item.photoUrl) || (filename ? photoToOriginalItem.get(filename) : undefined);
        if (match && match.name && !isUnnamedRetake(match)) {
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

  const currentNames = new Set(currentWardrobe.map((w) => (w.name || '').trim().toLowerCase()));
  const missingItemsToRestore = allDiscoveredWardrobe.filter(
    (w) => !currentNames.has((w.name || '').trim().toLowerCase()) && !isUnnamedRetake(w)
  );

  const activePhotoUrls = new Set(currentWardrobe.map((w) => w.photoUrl).filter(Boolean));
  const unattachedCloudPhotos = cloudPhotos.filter((p) => !activePhotoUrls.has(p.url));

  const filteredRawNames = rawSavedNames.filter((name) =>
    name.toLowerCase().includes(rawNameSearch.toLowerCase())
  );

  const handleRestoreClick = async () => {
    setIsRestoring(true);
    try {
      const mergedList = [...currentWardrobe];
      let restoredCount = 0;

      allDiscoveredWardrobe.forEach((candidate) => {
        // Discard apps, non-wardrobe artifacts, or fake retakes
        if (isSoftwareAppOrNonWardrobe(candidate) || isUnnamedRetake(candidate)) return;

        const existingIdx = mergedList.findIndex(
          (m) =>
            m.id === candidate.id ||
            m.name.trim().toLowerCase() === candidate.name.trim().toLowerCase()
        );

        if (existingIdx === -1) {
          mergedList.push(candidate);
          restoredCount++;
        } else {
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
        `✓ Restored ${restoredCount} items. Clean user titles and packed states preserved.`
      );
    } catch (err) {
      console.error('Failed to restore items:', err);
    } finally {
      setIsRestoring(false);
    }
  };

  const handlePullLatest = async () => {
    setIsRestoring(true);
    try {
      if (onPullFromSupabase) {
        await onPullFromSupabase();
        await runGlobalScan();
        setRestoreSuccessMsg('✓ Pulled latest state from Supabase Cloud successfully!');
      }
    } catch (err) {
      console.error('Failed to pull from Supabase:', err);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="bg-amber-500 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Data Recovery & Storage Inspector
              </h3>
              <p className="text-[11px] text-amber-100">
                Inspect live Supabase tables, local storage keys & restore real items.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runGlobalScan}
              disabled={isScanning}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Re-scan all storage & Supabase"
            >
              <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('recovery')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'recovery'
                ? 'border-[#007AFF] text-[#007AFF] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🛡️ Diagnostic & Auto-Recovery</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inspector')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'inspector'
                ? 'border-[#007AFF] text-[#007AFF] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📂 Raw Storage & Supabase Inspector</span>
          </button>
        </div>

        {/* Success Alert */}
        {restoreSuccessMsg && (
          <div className="m-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{restoreSuccessMsg}</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'recovery' ? (
            /* TAB 1: DIAGNOSTIC & AUTO RECOVERY */
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Active Items</span>
                  <span className="text-xl font-extrabold text-slate-900">{currentWardrobe.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[10px] font-bold text-[#007AFF] uppercase block">Saved Real Titles</span>
                  <span className="text-xl font-extrabold text-[#007AFF]">{rawSavedNames.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                  <span className="text-[10px] font-bold text-purple-600 uppercase block">Cloud Photos</span>
                  <span className="text-xl font-extrabold text-purple-600">{cloudPhotos.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Recoverable</span>
                  <span className="text-xl font-extrabold text-emerald-700">{missingItemsToRestore.length}</span>
                </div>
              </div>

              {/* Action Bar */}
              {missingItemsToRestore.length > 0 ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                      Found {missingItemsToRestore.length} Clean Saved Items
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Discovered across local vaults and Supabase with preserved packed states.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestoreClick}
                    disabled={isRestoring}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isRestoring ? 'Restoring...' : 'Restore All'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All recognized user-named items are currently loaded into your active wardrobe.</span>
                </div>
              )}

              {/* Raw Saved Names Drawer */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#007AFF]" />
                    <span className="font-bold text-xs text-slate-800">
                      User-Typed Real Titles ({rawSavedNames.length})
                    </span>
                  </div>
                  <div className="relative w-44">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={rawNameSearch}
                      onChange={(e) => setRawNameSearch(e.target.value)}
                      placeholder="Filter titles..."
                      className="w-full text-xs pl-7 pr-2 py-1 border border-slate-200 rounded-lg bg-white focus:outline-[#007AFF]"
                    />
                  </div>
                </div>

                <div className="p-3 max-h-48 overflow-y-auto flex flex-wrap gap-1.5">
                  {filteredRawNames.map((name) => (
                    <span
                      key={name}
                      className="px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200 text-slate-800 font-medium text-xs"
                    >
                      {name}
                    </span>
                  ))}
                  {filteredRawNames.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No matching titles found.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: RAW STORAGE & SUPABASE INSPECTOR (Requirement #5) */
            <div className="space-y-4">
              {/* Supabase Inspection Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs sm:text-sm">
                      Supabase Cloud DB: <span className="font-mono text-emerald-400">{STATE_TABLE}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePullLatest}
                    disabled={isRestoring}
                    className="px-3 py-1 rounded-lg bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRestoring ? 'animate-spin' : ''}`} />
                    <span>Pull Latest from Supabase</span>
                  </button>
                </div>

                {supabaseInspection ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Row ID: <strong className="text-white font-mono">{supabaseInspection.rowId}</strong></span>
                      <span>Last Updated: <strong className="text-white font-mono">{supabaseInspection.updatedAt ? new Date(supabaseInspection.updatedAt).toLocaleString() : 'N/A'}</strong></span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-slate-400 block">Wardrobe Items</span>
                        <span className="text-sm font-bold text-emerald-400">{supabaseInspection.wardrobeCount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-slate-400 block">Luggage Bags</span>
                        <span className="text-sm font-bold text-blue-400">{supabaseInspection.bagsCount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-slate-400 block">Devices</span>
                        <span className="text-sm font-bold text-amber-400">{supabaseInspection.devicesCount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-slate-400 block">Documents</span>
                        <span className="text-sm font-bold text-purple-400">{supabaseInspection.documentsCount}</span>
                      </div>
                    </div>

                    {supabaseInspection.wardrobeTitles.length > 0 && (
                      <div className="pt-2 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400 font-bold block mb-1">
                          Titles in Cloud Wardrobe:
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                          {supabaseInspection.wardrobeTitles.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Loading Supabase state...</div>
                )}
              </div>

              {/* LocalStorage Keys List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span>Local Storage Keys ({allStorageKeys.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Total: {allStorageKeys.reduce((acc, k) => acc + k.sizeKB, 0)} KB
                  </span>
                </div>

                <div className="space-y-2">
                  {allStorageKeys.map((item) => (
                    <div
                      key={item.key}
                      className={`p-3 rounded-2xl border transition-all text-xs ${
                        item.isWardrobeKey
                          ? 'bg-blue-50/40 border-blue-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-slate-900 truncate">
                              {item.key}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-600">
                              {item.sizeKB} KB
                            </span>
                            <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700 text-[10px] font-medium">
                              {item.dataType}
                            </span>
                          </div>

                          {/* Sample Titles */}
                          {item.sampleTitles.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {item.sampleTitles.map((st, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 text-[10px] truncate max-w-[200px]"
                                >
                                  {st}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedKey(expandedKey === item.key ? null : item.key)}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] font-bold hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                        >
                          {expandedKey === item.key ? 'Hide Raw' : 'View Raw'}
                        </button>
                      </div>

                      {/* Raw Preview Accordion */}
                      {expandedKey === item.key && (
                        <div className="mt-2 pt-2 border-t border-slate-200/80">
                          <pre className="text-[10px] font-mono bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto max-h-40 text-slate-800 whitespace-pre-wrap break-all">
                            {item.rawPreview}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* IndexedDB Vaults */}
              {idbResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-600" />
                    <span>IndexedDB Local Vaults</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {idbResults.map((idb, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200 text-xs">
                        <span className="font-mono font-bold text-purple-950 block">{idb.dbName}</span>
                        <div className="flex justify-between items-center text-[11px] text-purple-800 mt-1">
                          <span>Store: {idb.storeName}</span>
                          <span className="font-bold font-mono">{idb.count} records</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Durable sync enabled across IndexedDB, LocalStorage & Supabase.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
