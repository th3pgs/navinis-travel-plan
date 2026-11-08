import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Luggage,
  FileText,
  Globe2,
  ChevronRight,
} from 'lucide-react';

import {
  BagAsset,
  DeviceAsset,
  DocumentItem,
  AppConfigItem,
  WardrobeItem,
  TimelineMilestone,
  ProcedureStep,
  BankingTaskItem,
  GiftItem,
  DEFAULT_WARDROBE_CATEGORIES,
  DEFAULT_BAG_LOCATIONS,
  INITIAL_BAGS,
  INITIAL_DEVICES,
  INITIAL_DOCUMENTS,
  INITIAL_APPS,
  INITIAL_WARDROBE,
  INITIAL_MILESTONES,
  INITIAL_PROCEDURE_STEPS,
  INITIAL_BANKING_TASKS,
  INITIAL_GIFTS,
  migrateLegacyApps,
  migrateWardrobeItems,
  normalizeBagLocation,
  isSoftwareAppOrNonWardrobe,
} from './data';

import {
  AppMasterState,
  fetchCloudState,
  fetchRemoteUpdatedAt,
  pushCloudState,
  subscribeToCloudState,
  checkSupabaseConnection,
  uploadWardrobeItemPhotoAtomic,
  isOfflineLocked as getIsOfflineLocked,
  setOfflineLocked as saveIsOfflineLocked,
  isMasterMigrationDone,
  setMasterMigrationDone,
  purgeLegacyLocalStorageAndIDB,
  mergeItemsByTimestamp,
  mergeWardrobeLists,
  deduplicateExactWardrobeItems,
  recordLocalMutation,
  getLastLocalMutationTime,
  broadcastItemDelta,
  broadcastLiveSync,
} from './cloudSync';

import { supabase, STATE_TABLE, STATE_ROW_ID } from './supabase';

import { AuthGate } from './components/AuthGate';
import { RecoveryScanner } from './components/RecoveryScanner';
import { saveWardrobeItemsIDB, getWardrobeItemsIDB, saveMasterStateIDB } from './db';
import { TopDockedProfileAirline } from './components/TopDockedProfileAirline';
import { HardwareShowcaseWidgets } from './components/HardwareShowcaseWidgets';
import { PhysicalHub } from './components/PhysicalHub';
import { DocumentationHub } from './components/DocumentationHub';
import { CommunicationHub } from './components/CommunicationHub';
import { TimelineOverview } from './components/TimelineOverview';
import { AppleSidebar } from './components/AppleSidebar';
import { TaxiCardModal } from './components/TaxiCardModal';
import { OfflineBackupModal } from './components/OfflineBackupModal';
import { LuggageContentsModal } from './components/LuggageContentsModal';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('navini_auth_unlocked') === 'true';
  });

  // Current View Routing: 'overview' | 'physical' | 'documents' | 'connectivity'
  const [currentView, setCurrentView] = useState<'overview' | 'physical' | 'documents' | 'connectivity'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryView = urlParams.get('view');
      if (queryView === 'wardrobe' || queryView === 'physical') return 'physical';
      if (queryView && ['documents', 'connectivity', 'overview'].includes(queryView)) return queryView as any;

      const hash = window.location.hash.replace('#', '');
      if (hash === 'wardrobe' || hash === 'physical') return 'physical';
      if (['documents', 'connectivity'].includes(hash)) return hash as any;

      const saved = localStorage.getItem('navini_active_view');
      if (saved === 'wardrobe' || saved === 'physical') return 'physical';
      if (saved && ['documents', 'connectivity', 'overview'].includes(saved)) return saved as any;
    } catch {}
    return 'overview';
  });

  // Active Category Filter Persistence across Refreshes & URL query (Requirement #4)
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCat = urlParams.get('cat');
      if (queryCat && queryCat.trim()) return queryCat.trim();

      const saved = localStorage.getItem('navini_active_category');
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return 'all';
  });

  // Sidebar & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [selectedInspectBag, setSelectedInspectBag] = useState<BagAsset | null>(null);

  // Live Supabase Status
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const lastSeenRemoteUpdatedAtRef = useRef<number>(0);

  // Master Cloud Migration State (Requirement #1: 100% Pure Cloud Overhaul)
  const [isMasterLocked, setIsMasterLocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('MASTER_CLOUD_MIGRATION_DONE_V1') === 'true';
    } catch {
      return false;
    }
  });
  const [isMasterPushing, setIsMasterPushing] = useState<boolean>(false);
  const [masterModalMessage, setMasterModalMessage] = useState<string | null>(null);

  // Synchronize URL search params and hash without causing page reload
  const updateUrlAndHistory = (view: string, cat?: string) => {
    try {
      const url = new URL(window.location.href);
      if (view && view !== 'overview') {
        url.searchParams.set('view', view);
        url.hash = view;
      } else {
        url.searchParams.delete('view');
        url.hash = '';
      }

      const activeCat = cat !== undefined ? cat : selectedCategory;
      if (activeCat && activeCat !== 'all') {
        url.searchParams.set('cat', activeCat);
      } else {
        url.searchParams.delete('cat');
      }

      window.history.replaceState(null, '', url.toString());
    } catch {}
  };

  // Synchronize hash / popstate with currentView & selectedCategory
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qView = urlParams.get('view');
        const hash = window.location.hash.replace('#', '');
        const targetView =
          qView === 'wardrobe' || qView === 'physical' || hash === 'wardrobe' || hash === 'physical'
            ? 'physical'
            : ['documents', 'connectivity'].includes(qView || '')
            ? (qView as any)
            : ['documents', 'connectivity'].includes(hash)
            ? (hash as any)
            : 'overview';

        setCurrentView(targetView);

        const qCat = urlParams.get('cat');
        if (qCat) {
          setSelectedCategory(qCat);
        }
      } catch {}
    };

    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, []);

  // Update URL on initial mount to match restored state
  useEffect(() => {
    updateUrlAndHistory(currentView, selectedCategory);
  }, []);

  const navigateToView = (view: 'overview' | 'physical' | 'documents' | 'connectivity') => {
    setCurrentView(view);
    try {
      localStorage.setItem('navini_active_view', view);
    } catch {}
    updateUrlAndHistory(view, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    try {
      localStorage.setItem('navini_active_category', cat);
    } catch {}
    updateUrlAndHistory(currentView, cat);
  };

  // State Management (v7 Migration with Purged Legacy VPNs)
  const [passportInfo, setPassportInfo] = useState<{
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  }>(() => {
    const saved = localStorage.getItem('navini_passport_profile_v7') || localStorage.getItem('navini_passport_profile_v6');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      passportNumber: 'N10385921',
      expiryDate: '2034-08-15',
      photoUrl: `${import.meta.env.BASE_URL}navini-passport.jpeg`,
    };
  });

  const [bags, setBags] = useState<BagAsset[]>(INITIAL_BAGS);

  const [devices, setDevices] = useState<DeviceAsset[]>(INITIAL_DEVICES);

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

  const [apps, setApps] = useState<AppConfigItem[]>(() => {
    const saved = localStorage.getItem('navini_apps_v7') || localStorage.getItem('navini_apps_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return migrateLegacyApps(parsed);
        }
      } catch (e) {}
    }
    return INITIAL_APPS;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem('navini_milestones_v7') || localStorage.getItem('navini_milestones_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_MILESTONES;
  });

  const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>(INITIAL_PROCEDURE_STEPS);
  const [bankingTasks, setBankingTasks] = useState<BankingTaskItem[]>(INITIAL_BANKING_TASKS);
  const [gifts, setGifts] = useState<GiftItem[]>(INITIAL_GIFTS);
  const [confirmedCampusChat, setConfirmedCampusChat] = useState<boolean>(() => {
    return localStorage.getItem('navini_campus_chat_confirmed') === 'true';
  });

  // Dynamic Custom Dropdown Options State
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_custom_categories_v7') || localStorage.getItem('navini_custom_categories_v6');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [customLocations, setCustomLocations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_custom_locations_v7') || localStorage.getItem('navini_custom_locations_v6');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Canonical Single Source of Truth for Categories & Locations (v8)
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_categories_v8');
      const deleted = JSON.parse(localStorage.getItem('navini_deleted_categories_v8') || '[]');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: string) => !deleted.includes(c));
        }
      }
      const legacyCustom = JSON.parse(localStorage.getItem('navini_custom_categories_v7') || '[]');
      const combined = Array.from(new Set([...DEFAULT_WARDROBE_CATEGORIES, ...legacyCustom]));
      return combined.filter((c) => !deleted.includes(c));
    } catch {
      return DEFAULT_WARDROBE_CATEGORIES;
    }
  });

  const [deletedCategories, setDeletedCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_deleted_categories_v8');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [locations, setLocations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_locations_v8');
      const deleted = JSON.parse(localStorage.getItem('navini_deleted_locations_v8') || '[]');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(
            new Set(parsed.map((l: string) => normalizeBagLocation(l)).filter((l: string) => !deleted.includes(l)))
          );
        }
      }
      const legacyCustom = JSON.parse(localStorage.getItem('navini_custom_locations_v7') || '[]');
      const combined = Array.from(
        new Set([...DEFAULT_BAG_LOCATIONS, ...legacyCustom.map((l: string) => normalizeBagLocation(l))])
      );
      return combined.filter((l) => !deleted.includes(l));
    } catch {
      return DEFAULT_BAG_LOCATIONS;
    }
  });

  const [deletedLocations, setDeletedLocations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_deleted_locations_v8');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Offline Mode / Downloaded Mode Lock State (Requirement #1)
  const [isOfflineLocked, setIsOfflineLocked] = useState<boolean>(() => {
    return localStorage.getItem('navini_offline_locked') === 'true';
  });

  // Tombstone Deleted Item IDs (Requirement #3 - prevents deleted items from resurrecting)
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_deleted_item_ids_v8');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Trash Bin for Recently Deleted Wardrobe Items & Drafts
  const [trashedWardrobe, setTrashedWardrobe] = useState<WardrobeItem[]>(() => {
    try {
      const saved = localStorage.getItem('navini_trashed_wardrobe_v8');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Synchronous Refs to prevent stale React closures during rapid background tasks
  const wardrobeRef = useRef<WardrobeItem[]>(wardrobe);
  wardrobeRef.current = wardrobe;

  const deletedItemIdsRef = useRef<Set<string>>(new Set(deletedItemIds));
  const trashedWardrobeRef = useRef<WardrobeItem[]>(trashedWardrobe);
  trashedWardrobeRef.current = trashedWardrobe;

  const lastSeenRowUpdatedAtRef = useRef<string>('');
  const [isCloudFetching, setIsCloudFetching] = useState<boolean>(true);

  // Subtle Bottom iOS / CoD-Style Single-Line Activity Strip (Zero extra DB calls)
  const [activityStripText, setActivityStripText] = useState<string | null>(null);
  const activityStripTimerRef = useRef<any>(null);

  const showActivityStrip = (text: string) => {
    if (!text) return;
    setActivityStripText(text);
    if (activityStripTimerRef.current) {
      clearTimeout(activityStripTimerRef.current);
    }
    activityStripTimerRef.current = setTimeout(() => {
      setActivityStripText(null);
    }, 2600);
  };

  const realtimeUnsubRef = useRef<(() => void) | null>(null);

  // Background Non-Blocking Upload Queue State
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [showSyncedPill, setShowSyncedPill] = useState<boolean>(false);
  const activeUploadsRef = useRef<Set<string>>(new Set());
  const prevUploadingCountRef = useRef<number>(0);

  const [customBanks, setCustomBanks] = useState<string[]>([]);
  const [customAppCategories, setCustomAppCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_custom_app_categories_v7') || localStorage.getItem('navini_custom_app_categories_v6');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [customAppDevices, setCustomAppDevices] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('navini_custom_app_devices_v7') || localStorage.getItem('navini_custom_app_devices_v6');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Helper to package the current master state snapshot using live synchronous refs
  const buildCurrentMasterState = (overrides?: Partial<AppMasterState>): AppMasterState => {
    const cats = Array.from(new Set((overrides?.categories || categories).map((c) => c.trim()).filter(Boolean)));
    const delCats = overrides?.deletedCategories || deletedCategories;
    const locs = Array.from(new Set((overrides?.locations || locations).map((l) => l.trim()).filter(Boolean)));
    const delLocs = overrides?.deletedLocations || deletedLocations;
    const delItemIds = overrides?.deletedItemIds || Array.from(deletedItemIdsRef.current);
    const cCats = overrides?.customCategories || customCategories;
    const cLocs = overrides?.customLocations || customLocations;
    const cAppCats = overrides?.customAppCategories || customAppCategories;
    const cAppDevs = overrides?.customAppDevices || customAppDevices;
    const rawWItems = overrides?.wardrobe || wardrobeRef.current;
    const wItems = deduplicateExactWardrobeItems(rawWItems, delItemIds);
    const tItems = overrides?.trashedWardrobe || trashedWardrobeRef.current;
    const bAssets = overrides?.bags || bags;
    const dAssets = overrides?.devices || devices;
    const docItems = overrides?.documents || documents;
    const appItems = overrides?.apps || apps;
    const mStones = overrides?.milestones || milestones;
    const pInfo = overrides?.passportInfo || passportInfo;

    return {
      version: '8.0',
      lastUpdated: new Date().toISOString(),
      lastUpdatedAt: Date.now(),
      is_master_locked: overrides?.is_master_locked ?? isMasterLocked,
      passportInfo: pInfo,
      bags: bAssets,
      devices: dAssets,
      wardrobe: wItems,
      trashedWardrobe: tItems.slice(0, 60),
      documents: docItems,
      procedureSteps,
      bankingTasks,
      gifts,
      apps: appItems,
      milestones: mStones,
      confirmedCampusChat: overrides?.confirmedCampusChat ?? confirmedCampusChat,
      categories: cats,
      deletedCategories: delCats,
      locations: locs,
      deletedLocations: delLocs,
      deletedItemIds: delItemIds,
      customCategories: cCats,
      customLocations: cLocs,
      customBanks,
      customAppCategories: cAppCats,
      customAppDevices: cAppDevs,
    };
  };

  // Non-blocking debounced cloud state sync (conserves Supabase credits & never freezes UI)
  const syncAllState = async (overrides?: Partial<AppMasterState>, immediate = false): Promise<boolean> => {
    recordLocalMutation();
    const masterState = buildCurrentMasterState(overrides);
    if (isMasterLocked) {
      masterState.is_master_locked = true;
    }

    // Always keep local IndexedDB updated immediately
    try {
      saveWardrobeItemsIDB(masterState.wardrobe);
      saveMasterStateIDB(masterState);
    } catch (e) {
      console.warn('IDB write warning in syncAllState:', e);
    }

    if (isOfflineLocked) {
      return true;
    }

    const pushResult = await pushCloudState(masterState, immediate);
    return pushResult;
  };

  // Emergency Master Push Action: 100% pure force overwrite of Supabase with current device state (triggered after 2-step "delete" confirmation)
  const handlePushMasterDataToCloud = async () => {
    setIsMasterPushing(true);
    try {
      recordLocalMutation();
      const snapshot = buildCurrentMasterState({
        is_master_locked: true,
      });
      snapshot.is_master_locked = true;
      snapshot.lastUpdatedAt = Date.now();

      const { error } = await supabase.from(STATE_TABLE).upsert({
        id: STATE_ROW_ID,
        payload: snapshot,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        setIsMasterLocked(true);
        setMasterMigrationDone(true);
        wardrobeRef.current = snapshot.wardrobe;
        setWardrobe(snapshot.wardrobe);
        await saveWardrobeItemsIDB(snapshot.wardrobe);
        await saveMasterStateIDB(snapshot);

        // Broadcast master_locked to all connected peer tabs & devices
        broadcastLiveSync({
          action: 'master_locked',
          masterState: snapshot,
        });

        showActivityStrip(`🔴 Master state pushed (${snapshot.wardrobe.length} wardrobe items)`);
        setMasterModalMessage(
          `✓ Master Version Replaced Online! All ${snapshot.wardrobe.length} wardrobe items, ${snapshot.bags.length} bags, and ${snapshot.devices.length} devices (${snapshot.wardrobe.length + snapshot.bags.length + snapshot.devices.length} total physical items) are now the standard across all devices.`
        );
      } else {
        setMasterModalMessage('Failed to publish master data: ' + error.message);
      }
    } catch (err: any) {
      setMasterModalMessage('Error publishing master data: ' + (err?.message || 'Network error'));
    } finally {
      setIsMasterPushing(false);
    }
  };

  // Direct 1-Tap JSON Backup Download for Offline Viewing
  const handleDownloadMasterJsonBackup = () => {
    try {
      const snapshot = buildCurrentMasterState({ is_master_locked: true });
      const dataStr = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateTag = new Date().toISOString().slice(0, 10);
      a.download = `navini-china-plan-master-${dateTag}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('JSON download error:', e);
    }
  };

  // Applies incoming remote master state from Supabase cleanly without resurrecting deleted items
  const applyRemoteMasterState = (remote: AppMasterState, isForceMasterOverride = false) => {
    if (isOfflineLocked) return;

    if ((remote as any)._rowUpdatedAt) {
      lastSeenRowUpdatedAtRef.current = String((remote as any)._rowUpdatedAt);
    }
    if (remote.lastUpdatedAt) {
      lastSeenRemoteUpdatedAtRef.current = Number(remote.lastUpdatedAt);
    }

    if (remote.is_master_locked) {
      setIsMasterLocked(true);
      setMasterMigrationDone(true);
    }

    const remoteDelItemIds = remote.deletedItemIds || [];
    // If this is an explicit Red Button Master Override from another device, adopt its exact deleted list; otherwise union with local synchronous deletedItemIdsRef
    const mergedDeletedIds = isForceMasterOverride
      ? Array.from(new Set(remoteDelItemIds))
      : Array.from(new Set([...Array.from(deletedItemIdsRef.current), ...remoteDelItemIds]));

    deletedItemIdsRef.current = new Set(mergedDeletedIds);
    setDeletedItemIds(mergedDeletedIds);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(mergedDeletedIds));
    } catch {}

    if (Array.isArray(remote.trashedWardrobe)) {
      const nextTrash = deduplicateExactWardrobeItems(remote.trashedWardrobe, []);
      trashedWardrobeRef.current = nextTrash;
      setTrashedWardrobe(nextTrash);
      try {
        localStorage.setItem('navini_trashed_wardrobe_v8', JSON.stringify(nextTrash.slice(0, 40)));
      } catch {}
    }

    if (remote.passportInfo) {
      setPassportInfo(remote.passportInfo);
    }

    if (Array.isArray(remote.wardrobe)) {
      const cleanRemote = deduplicateExactWardrobeItems(
        migrateWardrobeItems(remote.wardrobe),
        mergedDeletedIds
      );
      setWardrobe((prev) => {
        // Preserve items actively uploading a photo right this second on this device
        const inFlightLocal = prev.filter(
          (w) =>
            w.syncStatus === 'uploading' &&
            activeUploadsRef.current.has(w.id) &&
            !deletedItemIdsRef.current.has(w.id) &&
            !cleanRemote.some((r) => r.id === w.id)
        );
        const nextWardrobe = deduplicateExactWardrobeItems(
          [...inFlightLocal, ...cleanRemote],
          mergedDeletedIds
        );
        wardrobeRef.current = nextWardrobe;
        saveWardrobeItemsIDB(nextWardrobe);
        return nextWardrobe;
      });
    }

    if (Array.isArray(remote.bags) && remote.bags.length > 0) {
      const cleanBags = remote.bags
        .filter((b) => b && b.id && !mergedDeletedIds.includes(b.id))
        .map((b) => ({ ...b, name: normalizeBagLocation(b.name) }));
      setBags(cleanBags);
    }

    if (Array.isArray(remote.devices) && remote.devices.length > 0) {
      const cleanDevices = remote.devices
        .filter((d) => d && d.id && !mergedDeletedIds.includes(d.id))
        .map((d) => ({ ...d, carryLocation: normalizeBagLocation(d.carryLocation) }));
      setDevices(cleanDevices);
    }

    if (Array.isArray(remote.documents) && remote.documents.length > 0) {
      const cleanDocs = remote.documents
        .filter((d) => d && d.id && !mergedDeletedIds.includes(d.id))
        .map((d) => ({ ...d, carryLocation: normalizeBagLocation(d.carryLocation) }));
      setDocuments(cleanDocs);
    }

    if (Array.isArray(remote.apps) && remote.apps.length > 0) {
      setApps(migrateLegacyApps(remote.apps));
    }

    if (Array.isArray(remote.milestones) && remote.milestones.length > 0) {
      setMilestones(remote.milestones);
    }

    if (Array.isArray(remote.categories) && remote.categories.length > 0) {
      const del = remote.deletedCategories || [];
      const dedupedCats = Array.from(
        new Set(remote.categories.map((c: string) => c.trim()).filter((c: string) => c && !del.includes(c)))
      );
      setCategories(dedupedCats);
    }
    if (Array.isArray(remote.deletedCategories)) {
      setDeletedCategories(remote.deletedCategories);
    }

    if (Array.isArray(remote.locations) && remote.locations.length > 0) {
      const del = remote.deletedLocations || [];
      const dedupedLocs = Array.from(
        new Set(
          remote.locations
            .map((l: string) => normalizeBagLocation(l.trim()))
            .filter((l: string) => l && !del.includes(l))
        )
      );
      setLocations(dedupedLocs);
    }
    if (Array.isArray(remote.deletedLocations)) {
      setDeletedLocations(remote.deletedLocations);
    }

    if (typeof remote.confirmedCampusChat === 'boolean') {
      setConfirmedCampusChat(remote.confirmedCampusChat);
    }
  };

  // Real-time Item Delta Handler (Sub-100ms in-place item updates across devices without jumping icons or DB polling)
  const handleIncomingDelta = (delta: any) => {
    if (isOfflineLocked || !delta) return;

    if (delta.type === 'ITEM_DELETE' && delta.deletedId) {
      const id = delta.deletedId;
      deletedItemIdsRef.current.add(id);
      const nextDeleted = Array.from(deletedItemIdsRef.current);
      setDeletedItemIds(nextDeleted);
      try {
        localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
      } catch {}

      const removedItem = delta.trashedItem || wardrobeRef.current.find((w) => w.id === id);
      if (removedItem) {
        const nextTrash = [
          { ...removedItem, deletedAt: Date.now() },
          ...trashedWardrobeRef.current.filter((t) => t.id !== id),
        ].slice(0, 60);
        trashedWardrobeRef.current = nextTrash;
        setTrashedWardrobe(nextTrash);
        try {
          localStorage.setItem('navini_trashed_wardrobe_v8', JSON.stringify(nextTrash.slice(0, 40)));
        } catch {}
        showActivityStrip(`🗑️ Moved to Trash: ${removedItem.name || 'Item'}`);
      }

      setWardrobe((prev) => {
        const updated = prev.filter((w) => w.id !== id);
        wardrobeRef.current = updated;
        saveWardrobeItemsIDB(updated);
        return updated;
      });
    } else if (delta.type === 'ITEM_RESTORE' && delta.item && delta.item.id) {
      const restored = delta.item as WardrobeItem;
      deletedItemIdsRef.current.delete(restored.id);
      const nextDeleted = Array.from(deletedItemIdsRef.current);
      setDeletedItemIds(nextDeleted);
      try {
        localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
      } catch {}

      const nextTrash = trashedWardrobeRef.current.filter((t) => t.id !== restored.id);
      trashedWardrobeRef.current = nextTrash;
      setTrashedWardrobe(nextTrash);
      try {
        localStorage.setItem('navini_trashed_wardrobe_v8', JSON.stringify(nextTrash.slice(0, 40)));
      } catch {}

      setWardrobe((prev) => {
        const exists = prev.some((w) => w.id === restored.id);
        const updated = exists
          ? prev.map((w) => (w.id === restored.id ? restored : w))
          : [restored, ...prev];
        wardrobeRef.current = updated;
        saveWardrobeItemsIDB(updated);
        return updated;
      });
      showActivityStrip(`↩️ Restored from Trash: ${restored.name || 'Item'}`);
    } else if (delta.type === 'TRASH_EMPTY') {
      trashedWardrobeRef.current = [];
      setTrashedWardrobe([]);
      try {
        localStorage.removeItem('navini_trashed_wardrobe_v8');
      } catch {}
      showActivityStrip('🗑️ Trash emptied');
    } else if (delta.type === 'ITEM_UPSERT' && delta.item && delta.item.id) {
      const incomingItem = delta.item as WardrobeItem;
      if (deletedItemIdsRef.current.has(incomingItem.id)) return;

      setWardrobe((prev) => {
        const index = prev.findIndex((w) => w.id === incomingItem.id);
        let updated: WardrobeItem[];
        if (index >= 0) {
          const current = prev[index];
          const incomingTime = Number(incomingItem.updatedAt || incomingItem.createdAt || 0);
          const currentTime = Number(current.updatedAt || current.createdAt || 0);
          if (incomingTime >= currentTime) {
            updated = [...prev];
            // Update in-place at exact index so card NEVER moves up or down!
            updated[index] = {
              ...current,
              ...incomingItem,
              createdAt: current.createdAt || incomingItem.createdAt,
            };
          } else {
            return prev;
          }
        } else {
          updated = deduplicateExactWardrobeItems(
            [incomingItem, ...prev],
            Array.from(deletedItemIdsRef.current)
          );
        }
        wardrobeRef.current = updated;
        saveWardrobeItemsIDB(updated);
        return updated;
      });

      if (delta.activityText) {
        showActivityStrip(delta.activityText);
      } else if (incomingItem.name) {
        showActivityStrip(`☁️ Updated: ${incomingItem.name}`);
      }
    }
  };

  // Lightweight Cloud Check: Only downloads payload if 30-byte `updated_at` header changed & no recent local mutation
  const pullAndMergeFromCloud = async (forceFullFetch = false) => {
    if (isOfflineLocked) return;
    // Never overwrite local screen while user is actively making changes
    if (!forceFullFetch && Date.now() - getLastLocalMutationTime() < 4000) {
      return;
    }
    try {
      if (!forceFullFetch && lastSeenRowUpdatedAtRef.current) {
        const remoteUpdatedAt = await fetchRemoteUpdatedAt();
        if (!remoteUpdatedAt) return;
        setIsSupabaseConnected(true);
        if (remoteUpdatedAt === lastSeenRowUpdatedAtRef.current) {
          // 0 changes in cloud — saved 500KB download!
          return;
        }
      }

      const remote = await fetchCloudState();
      if (remote) {
        setIsSupabaseConnected(true);
        applyRemoteMasterState(remote, false);
      }
    } catch (err) {
      console.warn('pullAndMergeFromCloud error:', err);
    }
  };

  // Toggle Download / Offline Lock (Requirement #1)
  const handleToggleOfflineLock = async () => {
    if (!isOfflineLocked) {
      // Switching from Live -> Offline Locked (ON)
      try {
        const snapshot = buildCurrentMasterState();
        saveMasterStateIDB(snapshot);
        saveWardrobeItemsIDB(wardrobeRef.current);
        saveIsOfflineLocked(true);
      } catch (err) {
        console.warn('Offline snapshot warning:', err);
      }
      setIsOfflineLocked(true);
      saveIsOfflineLocked(true);

      if (realtimeUnsubRef.current) {
        realtimeUnsubRef.current();
        realtimeUnsubRef.current = null;
      }
      setIsSupabaseConnected(false);
      showActivityStrip('📥 Locked Offline — reading from local storage');
    } else {
      // Switching from Offline Locked -> Live (OFF)
      setIsOfflineLocked(false);
      saveIsOfflineLocked(false);

      syncAllState();

      if (realtimeUnsubRef.current) {
        realtimeUnsubRef.current();
      }
      realtimeUnsubRef.current = subscribeToCloudState((incoming) => {
        applyRemoteMasterState(incoming, true);
      }, handleIncomingDelta);

      await pullAndMergeFromCloud(true);
      showActivityStrip('☁️ Live Cloud Sync active');
    }
  };

  // Auto-Sync on Tab Focus / Visibility Change using 30-byte header check (Zero credit waste)
  useEffect(() => {
    const handleVisibilityOrFocus = async () => {
      if (document.visibilityState === 'visible' && !isOfflineLocked) {
        await pullAndMergeFromCloud(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [isOfflineLocked]);

  // Live Supabase Lifecycle: Instant IndexedDB Cache Render + Background Cloud Fetch + Realtime WebSocket
  useEffect(() => {
    let isMounted = true;

    const initSupabase = async () => {
      // Remove legacy localStorage keys so old pre-migration items never mix in
      try {
        localStorage.removeItem('navini_wardrobe_v7');
        localStorage.removeItem('navini_wardrobe_v6');
        localStorage.removeItem('navini_bags_v7');
        localStorage.removeItem('navini_bags_v6');
        localStorage.removeItem('navini_devices_v7');
        localStorage.removeItem('navini_devices_v6');
        localStorage.removeItem('navini_docs_v7');
        localStorage.removeItem('navini_docs_v6');
        localStorage.removeItem('navini_master_state_v5');
      } catch {}

      // 1. Instant 0ms Cache Render from IndexedDB so refreshing NEVER shows "No items available"!
      try {
        const idbWardrobe = await getWardrobeItemsIDB();
        if (idbWardrobe && Array.isArray(idbWardrobe) && idbWardrobe.length > 0 && isMounted) {
          const cleanCached = deduplicateExactWardrobeItems(
            migrateWardrobeItems(idbWardrobe),
            Array.from(deletedItemIdsRef.current)
          );
          if (cleanCached.length > 0) {
            wardrobeRef.current = cleanCached;
            setWardrobe(cleanCached);
          }
        }
      } catch (e) {
        console.warn('IDB instant cache load check:', e);
      }

      // If offline locked, stop here and stay 100% local
      if (isOfflineLocked) {
        if (isMounted) {
          setIsSupabaseConnected(false);
          setIsCloudFetching(false);
        }
        return;
      }

      // 2. Fetch exact master state from Supabase with iOS Fetching status indicator
      if (isMounted) setIsCloudFetching(true);
      try {
        const remote = await fetchCloudState();
        if (remote && isMounted) {
          setIsSupabaseConnected(true);
          applyRemoteMasterState(remote, false);
        } else if (isMounted) {
          const isAlive = await checkSupabaseConnection();
          if (isMounted) setIsSupabaseConnected(isAlive);
        }
      } catch (err) {
        console.warn('Initial cloud state fetch warning:', err);
      } finally {
        if (isMounted) setIsCloudFetching(false);
      }
    };

    initSupabase();

    if (!isOfflineLocked) {
      realtimeUnsubRef.current = subscribeToCloudState((incoming) => {
        if (!isMounted || isOfflineLocked) return;
        setIsSupabaseConnected(true);
        applyRemoteMasterState(incoming, true);
      }, handleIncomingDelta);
    }

    return () => {
      isMounted = false;
      if (realtimeUnsubRef.current) {
        realtimeUnsubRef.current();
        realtimeUnsubRef.current = null;
      }
    };
  }, [isOfflineLocked]);

  // Background Non-Blocking Upload Queue Worker
  const processItemUpload = async (item: WardrobeItem) => {
    if (activeUploadsRef.current.has(item.id)) return;
    activeUploadsRef.current.add(item.id);

    try {
      const result = await uploadWardrobeItemPhotoAtomic(item, (progress) => {
        setWardrobe((prev) => {
          const updated = prev.map((w) => (w.id === item.id ? { ...w, uploadProgress: progress } : w));
          wardrobeRef.current = updated;
          return updated;
        });
      });

      if (result.success) {
        const finalUrl = result.photoUrl || item.photoUrl;
        let syncedItem: WardrobeItem | null = null;
        setWardrobe((prev) => {
          const updated = prev.map((w) => {
            if (w.id === item.id) {
              syncedItem = {
                ...w,
                photoUrl: finalUrl,
                syncStatus: 'synced' as const,
                uploadProgress: 100,
              };
              return syncedItem;
            }
            return w;
          });
          wardrobeRef.current = updated;
          saveWardrobeItemsIDB(updated);
          return updated;
        });

        if (syncedItem) {
          broadcastItemDelta({
            type: 'ITEM_UPSERT',
            item: syncedItem,
            activityText: `☁️ Photo uploaded: ${(syncedItem as WardrobeItem).name}`,
          });
          syncAllState({ wardrobe: wardrobeRef.current });
        }
      } else {
        setWardrobe((prev) => {
          const updated = prev.map((w) =>
            w.id === item.id ? { ...w, syncStatus: 'error' as const } : w
          );
          wardrobeRef.current = updated;
          return updated;
        });
      }
    } catch (err) {
      console.error('Background upload queue error for item:', item.id, err);
      setWardrobe((prev) => {
        const updated = prev.map((w) => (w.id === item.id ? { ...w, syncStatus: 'error' as const } : w));
        wardrobeRef.current = updated;
        return updated;
      });
    } finally {
      activeUploadsRef.current.delete(item.id);
    }
  };

  useEffect(() => {
    const uploadingItems = wardrobe.filter((w) => w.syncStatus === 'uploading');
    const count = uploadingItems.length;
    setUploadingCount(count);

    if (count > 0) {
      uploadingItems.forEach((item) => {
        if (!activeUploadsRef.current.has(item.id)) {
          processItemUpload(item);
        }
      });
    }
  }, [wardrobe]);

  useEffect(() => {
    if (prevUploadingCountRef.current > 0 && uploadingCount === 0) {
      setShowSyncedPill(true);
      const timer = setTimeout(() => setShowSyncedPill(false), 3000);
      return () => clearTimeout(timer);
    }
    prevUploadingCountRef.current = uploadingCount;
  }, [uploadingCount]);

  const handleRetryWardrobeItemSync = (id: string) => {
    setWardrobe((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, syncStatus: 'uploading' as const, uploadProgress: 15 } : w
      )
    );
  };

  // Dynamic classification handlers (Cascade updates to all items)
  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    const updatedCategories = [...categories, trimmed];
    const updatedDeleted = deletedCategories.filter((c) => c !== trimmed);
    setCategories(updatedCategories);
    setDeletedCategories(updatedDeleted);
    syncAllState({
      categories: updatedCategories,
      deletedCategories: updatedDeleted,
      customCategories: updatedCategories.filter((c) => !DEFAULT_WARDROBE_CATEGORIES.includes(c)),
    });
  };

  const handleRenameCategory = (oldCategory: string, newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed || oldCategory === trimmed) return;

    const updatedCategories = categories.map((c) => (c === oldCategory ? trimmed : c));
    if (!updatedCategories.includes(trimmed)) {
      updatedCategories.push(trimmed);
    }
    const updatedDeleted = Array.from(new Set([...deletedCategories, oldCategory])).filter(
      (c) => c !== trimmed
    );
    setCategories(updatedCategories);
    setDeletedCategories(updatedDeleted);

    // Cascade rename to all wardrobe items
    const now = Date.now();
    const updatedWardrobe = wardrobe.map((w) =>
      w.category === oldCategory ? { ...w, category: trimmed, updatedAt: now } : w
    );
    setWardrobe(updatedWardrobe);
    saveWardrobeItemsIDB(updatedWardrobe);

    syncAllState({
      categories: updatedCategories,
      deletedCategories: updatedDeleted,
      customCategories: updatedCategories.filter((c) => !DEFAULT_WARDROBE_CATEGORIES.includes(c)),
      wardrobe: updatedWardrobe,
    });
  };

  const handleDeleteCategory = (catToDelete: string) => {
    const updatedCategories = categories.filter((c) => c !== catToDelete);
    const updatedDeleted = Array.from(new Set([...deletedCategories, catToDelete]));
    setCategories(updatedCategories);
    setDeletedCategories(updatedDeleted);

    // Reassign items in deleted category to first available category
    const now = Date.now();
    const fallbackCategory = updatedCategories[0] || 'Uncategorized';
    const updatedWardrobe = wardrobe.map((w) =>
      w.category === catToDelete ? { ...w, category: fallbackCategory, updatedAt: now } : w
    );
    setWardrobe(updatedWardrobe);
    saveWardrobeItemsIDB(updatedWardrobe);

    syncAllState({
      categories: updatedCategories,
      deletedCategories: updatedDeleted,
      customCategories: updatedCategories.filter((c) => !DEFAULT_WARDROBE_CATEGORIES.includes(c)),
      wardrobe: updatedWardrobe,
    });
  };

  const handleAddLocation = (newLoc: string) => {
    const trimmed = newLoc.trim();
    if (!trimmed || locations.includes(trimmed)) return;
    const updatedLocations = [...locations, trimmed];
    const updatedDeleted = deletedLocations.filter((l) => l !== trimmed);
    setLocations(updatedLocations);
    setDeletedLocations(updatedDeleted);

    const exists = bags.some(
      (b) => b.name.toLowerCase() === trimmed.toLowerCase() || b.id === trimmed
    );
    let updatedBags = bags;
    if (!exists) {
      const newBag: BagAsset = {
        id: `bag-custom-${Date.now()}`,
        name: trimmed,
        type: 'Custom Storage Container',
        dimensions: 'Flexible Container',
        weightLimit: 'Personal Carry',
        targetBag: trimmed,
        recommendedContents: 'User designated packing parcel / container',
        isBought: true,
        isPacked: false,
        kind: 'custom',
      };
      updatedBags = [...bags, newBag];
      setBags(updatedBags);
    }

    syncAllState({
      locations: updatedLocations,
      deletedLocations: updatedDeleted,
      customLocations: updatedLocations.filter((l) => !DEFAULT_BAG_LOCATIONS.includes(l)),
      bags: updatedBags,
    });
  };

  const handleRenameLocation = (oldLoc: string, newLoc: string) => {
    const trimmed = newLoc.trim();
    if (!trimmed || oldLoc === trimmed) return;

    const updatedLocations = locations.map((l) => (l === oldLoc ? trimmed : l));
    if (!updatedLocations.includes(trimmed)) {
      updatedLocations.push(trimmed);
    }
    const updatedDeleted = Array.from(new Set([...deletedLocations, oldLoc])).filter(
      (l) => l !== trimmed
    );
    setLocations(updatedLocations);
    setDeletedLocations(updatedDeleted);

    const now = Date.now();
    const updatedWardrobe = wardrobe.map((w) =>
      w.targetBag === oldLoc ? { ...w, targetBag: trimmed, updatedAt: now } : w
    );
    setWardrobe(updatedWardrobe);
    saveWardrobeItemsIDB(updatedWardrobe);

    const updatedBags = bags.map((b) => (b.name === oldLoc ? { ...b, name: trimmed, targetBag: trimmed, updatedAt: now } : b));
    setBags(updatedBags);

    syncAllState({
      locations: updatedLocations,
      deletedLocations: updatedDeleted,
      customLocations: updatedLocations.filter((l) => !DEFAULT_BAG_LOCATIONS.includes(l)),
      bags: updatedBags,
      wardrobe: updatedWardrobe,
    });
  };

  const handleDeleteLocation = (locToDelete: string) => {
    const updatedLocations = locations.filter((l) => l !== locToDelete);
    const updatedDeleted = Array.from(new Set([...deletedLocations, locToDelete]));
    setLocations(updatedLocations);
    setDeletedLocations(updatedDeleted);

    const fallbackLoc = updatedLocations[0] || 'Main Large Rolling Suitcase';

    const now = Date.now();
    const updatedWardrobe = wardrobe.map((w) =>
      w.targetBag === locToDelete ? { ...w, targetBag: fallbackLoc, updatedAt: now } : w
    );
    setWardrobe(updatedWardrobe);
    saveWardrobeItemsIDB(updatedWardrobe);

    const updatedBags = bags.filter((b) => b.name !== locToDelete);
    setBags(updatedBags);

    syncAllState({
      locations: updatedLocations,
      deletedLocations: updatedDeleted,
      customLocations: updatedLocations.filter((l) => !DEFAULT_BAG_LOCATIONS.includes(l)),
      bags: updatedBags,
      wardrobe: updatedWardrobe,
    });
  };

  const handlePullFromSupabase = async () => {
    const remote = await fetchCloudState();
    if (remote) {
      if (remote.passportInfo) setPassportInfo(remote.passportInfo);
      if (remote.bags?.length) setBags(remote.bags.map((b) => ({ ...b, name: normalizeBagLocation(b.name) })));
      if (remote.devices?.length) setDevices(remote.devices);
      if (remote.wardrobe?.length) {
        const cleanRemote = migrateWardrobeItems(remote.wardrobe);
        setWardrobe(cleanRemote);
        await saveWardrobeItemsIDB(cleanRemote);
      }
      if (remote.documents?.length) setDocuments(remote.documents);
      if (remote.apps?.length) setApps(migrateLegacyApps(remote.apps));
      if (remote.customCategories?.length) setCustomCategories(remote.customCategories);
      if (remote.customLocations?.length) setCustomLocations(remote.customLocations);
    }
  };

  const handleAddCustomLocation = (loc: string) => {
    const trimmed = loc.trim();
    if (!trimmed) return;
    let updatedLocations = customLocations;
    if (!customLocations.includes(trimmed)) {
      updatedLocations = [...customLocations, trimmed];
      setCustomLocations(updatedLocations);
    }

    const exists = bags.some(
      (b) => b.name.toLowerCase() === trimmed.toLowerCase() || b.id === trimmed
    );
    let updatedBags = bags;
    if (!exists) {
      const newBag: BagAsset = {
        id: `bag-custom-${Date.now()}`,
        name: trimmed,
        type: 'Custom Storage Container',
        dimensions: 'Flexible Container',
        weightLimit: 'Personal Carry',
        targetBag: trimmed,
        recommendedContents: 'User designated packing parcel / container',
        isBought: true,
        isPacked: false,
        kind: 'custom',
      };
      updatedBags = [...bags, newBag];
      setBags(updatedBags);
    }
    syncAllState({ bags: updatedBags, customLocations: updatedLocations });
  };

  const handleAddCustomAppCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed || customAppCategories.includes(trimmed)) return;
    const updated = [...customAppCategories, trimmed];
    setCustomAppCategories(updated);
    syncAllState({ customAppCategories: updated });
  };

  const handleAddCustomAppDevice = (dev: string) => {
    const trimmed = dev.trim();
    if (!trimmed || customAppDevices.includes(trimmed)) return;
    const updated = [...customAppDevices, trimmed];
    setCustomAppDevices(updated);
    syncAllState({ customAppDevices: updated });
  };

  // Profile Update Handler (Synced to database)
  const handleUpdatePassportInfo = (updated: { passportNumber: string; expiryDate: string; photoUrl?: string }) => {
    setPassportInfo(updated);
    syncAllState({ passportInfo: updated });
  };

  // Handlers for Physical Gear
  const toggleBagBought = (id: string) => {
    const now = Date.now();
    const updated = bags.map((b) => (b.id === id ? { ...b, isBought: !b.isBought, updatedAt: now } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleCycleBagStatus = (id: string) => {
    const now = Date.now();
    const updated = bags.map((b) => {
      if (b.id !== id) return b;
      // Cycle: !isBought (Missing) -> isBought && !isPacked (Bought) -> isBought && isPacked (Packed) -> !isBought (Missing)
      if (!b.isBought) {
        return { ...b, isBought: true, isPacked: false, updatedAt: now };
      } else if (b.isBought && !b.isPacked) {
        return { ...b, isBought: true, isPacked: true, updatedAt: now };
      } else {
        return { ...b, isBought: false, isPacked: false, updatedAt: now };
      }
    });
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const toggleBagPacked = (id: string) => {
    const now = Date.now();
    const updated = bags.map((b) => (b.id === id ? { ...b, isPacked: !b.isPacked, updatedAt: now } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleAddBag = (bag: Omit<BagAsset, 'id'>) => {
    const now = Date.now();
    const newBag: BagAsset = { ...bag, id: `bag-custom-${now}`, updatedAt: now };
    const updated = [...bags, newBag];
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleUpdateBag = (id: string, partial: Partial<BagAsset>) => {
    const now = Date.now();
    const updated = bags.map((b) => (b.id === id ? { ...b, ...partial, updatedAt: now } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleDeleteBag = (id: string) => {
    const updated = bags.filter((b) => b.id !== id);
    const nextDeleted = Array.from(new Set([...deletedItemIds, id]));
    setBags(updated);
    setDeletedItemIds(nextDeleted);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}
    syncAllState({ bags: updated, deletedItemIds: nextDeleted });
  };

  const toggleDeviceBought = (id: string) => {
    const now = Date.now();
    const updated = devices.map((d) => (d.id === id ? { ...d, isBought: !d.isBought, updatedAt: now } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleCycleDeviceStatus = (id: string) => {
    const now = Date.now();
    const updated = devices.map((d) => {
      if (d.id !== id) return d;
      // Cycle: !isBought (Missing) -> isBought && !isPacked (Bought) -> isBought && isPacked (Packed) -> !isBought (Missing)
      if (!d.isBought) {
        return { ...d, isBought: true, isPacked: false, updatedAt: now };
      } else if (d.isBought && !d.isPacked) {
        return { ...d, isBought: true, isPacked: true, updatedAt: now };
      } else {
        return { ...d, isBought: false, isPacked: false, updatedAt: now };
      }
    });
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const toggleDevicePacked = (id: string) => {
    const now = Date.now();
    const updated = devices.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked, updatedAt: now } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleAddDevice = (device: Omit<DeviceAsset, 'id'>) => {
    const now = Date.now();
    const newDev: DeviceAsset = { ...device, id: `dev-custom-${now}`, updatedAt: now };
    const updated = [...devices, newDev];
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleUpdateDevice = (id: string, partial: Partial<DeviceAsset>) => {
    const now = Date.now();
    const updated = devices.map((d) => (d.id === id ? { ...d, ...partial, updatedAt: now } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleDeleteDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id);
    const nextDeleted = Array.from(new Set([...deletedItemIds, id]));
    setDevices(updated);
    setDeletedItemIds(nextDeleted);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}
    syncAllState({ devices: updated, deletedItemIds: nextDeleted });
  };

  const toggleWardrobeBought = (id: string) => {
    const now = Date.now();
    const updated = wardrobeRef.current.map((w) => (w.id === id ? { ...w, isBought: !w.isBought, updatedAt: now } : w));
    wardrobeRef.current = updated;
    setWardrobe(updated);
    void syncAllState({ wardrobe: updated });
  };

  const toggleWardrobePacked = (id: string) => {
    const now = Date.now();
    let updatedItem: WardrobeItem | null = null;
    const updated = wardrobeRef.current.map((w) => {
      if (w.id === id) {
        updatedItem = { ...w, isPacked: !w.isPacked, updatedAt: now };
        return updatedItem;
      }
      return w;
    });
    wardrobeRef.current = updated;
    setWardrobe(updated);
    saveWardrobeItemsIDB(updated);
    void syncAllState({ wardrobe: updated });
    if (updatedItem) {
      const packedMsg = (updatedItem as WardrobeItem).isPacked
        ? `🟢 Packed: ${(updatedItem as WardrobeItem).name}`
        : `○ Unpacked: ${(updatedItem as WardrobeItem).name}`;
      showActivityStrip(packedMsg);
      broadcastItemDelta({
        type: 'ITEM_UPSERT',
        item: updatedItem,
        activityText: packedMsg,
      });
    }
  };

  // UUID-Only Item Identifier Generator (Requirement #1.2)
  const generateItemId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  };

  const handleAddWardrobeItem = async (item: Omit<WardrobeItem, 'id'>): Promise<{ success: boolean; cloudSynced: boolean }> => {
    const now = Date.now();
    const newItem: WardrobeItem = {
      ...item,
      id: generateItemId(),
      syncStatus: item.syncStatus || 'uploading',
      uploadProgress: item.uploadProgress || 15,
      createdAt: now,
      updatedAt: now,
    };
    const updated = deduplicateExactWardrobeItems(
      [newItem, ...wardrobeRef.current],
      Array.from(deletedItemIdsRef.current)
    );
    wardrobeRef.current = updated;
    setWardrobe(updated);
    saveWardrobeItemsIDB(updated);
    showActivityStrip(`➕ Added: ${newItem.name}`);
    broadcastItemDelta({
      type: 'ITEM_UPSERT',
      item: newItem,
      activityText: `➕ Added: ${newItem.name}`,
    });
    // Non-blocking background sync so modal closes in 0ms!
    void syncAllState({ wardrobe: updated });
    return { success: true, cloudSynced: true };
  };

  const handleUpdateWardrobeItem = async (id: string, partial: Partial<WardrobeItem>): Promise<{ success: boolean; cloudSynced: boolean }> => {
    const now = Date.now();
    let updatedItem: WardrobeItem | null = null;
    const updated = wardrobeRef.current.map((w) => {
      if (w.id === id) {
        updatedItem = { ...w, ...partial, updatedAt: now };
        return updatedItem;
      }
      return w;
    });
    wardrobeRef.current = updated;
    setWardrobe(updated);
    saveWardrobeItemsIDB(updated);
    if (updatedItem) {
      const msg = `✏️ Updated: ${(updatedItem as WardrobeItem).name}`;
      showActivityStrip(msg);
      broadcastItemDelta({
        type: 'ITEM_UPSERT',
        item: updatedItem,
        activityText: msg,
      });
    }
    // Non-blocking background sync so modal closes in 0ms!
    void syncAllState({ wardrobe: updated });
    return { success: true, cloudSynced: true };
  };

  const handleDeleteWardrobeItem = (id: string) => {
    const targetItem = wardrobeRef.current.find((w) => w.id === id);
    const updated = wardrobeRef.current.filter((w) => w.id !== id);
    wardrobeRef.current = updated;

    deletedItemIdsRef.current.add(id);
    const nextDeleted = Array.from(deletedItemIdsRef.current);

    let nextTrash = trashedWardrobeRef.current;
    let trashedEntry: WardrobeItem | undefined = undefined;
    if (targetItem) {
      trashedEntry = { ...targetItem, updatedAt: Date.now() };
      nextTrash = [
        trashedEntry,
        ...trashedWardrobeRef.current.filter((t) => t.id !== id),
      ].slice(0, 60);
      trashedWardrobeRef.current = nextTrash;
      setTrashedWardrobe(nextTrash);
      try {
        localStorage.setItem('navini_trashed_wardrobe_v8', JSON.stringify(nextTrash.slice(0, 40)));
      } catch {}
    }

    setWardrobe(updated);
    setDeletedItemIds(nextDeleted);
    saveWardrobeItemsIDB(updated);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}

    showActivityStrip(`🗑️ Moved to Trash: ${targetItem?.name || 'Item'}`);
    broadcastItemDelta({
      type: 'ITEM_DELETE',
      deletedId: id,
      trashedItem: trashedEntry,
      activityText: `🗑️ Moved to Trash: ${targetItem?.name || 'Item'}`,
    });
    void syncAllState({
      wardrobe: updated,
      deletedItemIds: nextDeleted,
      trashedWardrobe: nextTrash,
    });
  };

  const handleRestoreFromTrash = (id: string) => {
    const itemToRestore = trashedWardrobeRef.current.find((t) => t.id === id);
    if (!itemToRestore) return;

    deletedItemIdsRef.current.delete(id);
    const nextDeleted = Array.from(deletedItemIdsRef.current);
    setDeletedItemIds(nextDeleted);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}

    const nextTrash = trashedWardrobeRef.current.filter((t) => t.id !== id);
    trashedWardrobeRef.current = nextTrash;
    setTrashedWardrobe(nextTrash);
    try {
      localStorage.setItem('navini_trashed_wardrobe_v8', JSON.stringify(nextTrash.slice(0, 40)));
    } catch {}

    const restoredItem: WardrobeItem = {
      ...itemToRestore,
      updatedAt: Date.now(),
    };
    const nextWardrobe = deduplicateExactWardrobeItems(
      [restoredItem, ...wardrobeRef.current],
      nextDeleted
    );
    wardrobeRef.current = nextWardrobe;
    setWardrobe(nextWardrobe);
    saveWardrobeItemsIDB(nextWardrobe);

    showActivityStrip(`↩️ Restored from Trash: ${restoredItem.name}`);
    broadcastItemDelta({
      type: 'ITEM_RESTORE',
      item: restoredItem,
      activityText: `↩️ Restored from Trash: ${restoredItem.name}`,
    });
    void syncAllState({
      wardrobe: nextWardrobe,
      deletedItemIds: nextDeleted,
      trashedWardrobe: nextTrash,
    });
  };

  const handlePermanentDeleteFromTrash = (id: string) => {
    deletedItemIdsRef.current.add(id);
    const nextDeleted = Array.from(deletedItemIdsRef.current);
    setDeletedItemIds(nextDeleted);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}

    const nextTrash = trashedWardrobeRef.current.filter((t) => t.id !== id);
    trashedWardrobeRef.current = nextTrash;
    setTrashedWardrobe(nextTrash);
    try {
      localStorage.setItem('navini_trashed_wardrobe_v8', JSON.stringify(nextTrash.slice(0, 40)));
    } catch {}

    showActivityStrip('🗑️ Permanently deleted from Trash');
    void syncAllState({
      deletedItemIds: nextDeleted,
      trashedWardrobe: nextTrash,
    });
  };

  const handleEmptyTrash = () => {
    trashedWardrobeRef.current = [];
    setTrashedWardrobe([]);
    try {
      localStorage.removeItem('navini_trashed_wardrobe_v8');
    } catch {}
    showActivityStrip('🗑️ Trash emptied');
    broadcastItemDelta({
      type: 'TRASH_EMPTY',
    });
    void syncAllState({
      trashedWardrobe: [],
    });
  };

  const handleRestoreWardrobeItems = async (restoredItems: WardrobeItem[]) => {
    const now = Date.now();
    const withTimestamps = restoredItems.map((item) => ({
      ...item,
      updatedAt: item.updatedAt || now,
    }));
    wardrobeRef.current = withTimestamps;
    setWardrobe(withTimestamps);
    await saveWardrobeItemsIDB(withTimestamps);
    void syncAllState({ wardrobe: withTimestamps });
  };

  // Handlers for Official Documents
  const toggleDocReady = (id: string) => {
    const now = Date.now();
    const updated = documents.map((d) => (d.id === id ? { ...d, isReady: !d.isReady, updatedAt: now } : d));
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const toggleDocPacked = (id: string) => {
    const now = Date.now();
    const updated = documents.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked, updatedAt: now } : d));
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const handleAddDoc = (doc: Omit<DocumentItem, 'id'>) => {
    const now = Date.now();
    const newDoc: DocumentItem = { ...doc, id: 'doc-custom-' + now, updatedAt: now };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const handleUpdateDoc = (id: string, partial: Partial<DocumentItem>) => {
    const now = Date.now();
    const updated = documents.map((d) => (d.id === id ? { ...d, ...partial, updatedAt: now } : d));
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const handleDeleteDoc = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    const nextDeleted = Array.from(new Set([...deletedItemIds, id]));
    setDocuments(updated);
    setDeletedItemIds(nextDeleted);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}
    syncAllState({ documents: updated, deletedItemIds: nextDeleted });
  };

  // Handlers for Apps & 3 Checkpoints
  const toggleAppInstalled = (id: string) => {
    const now = Date.now();
    const updated = apps.map((a) => (a.id === id ? { ...a, isInstalled: !a.isInstalled, updatedAt: now } : a));
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppLoggedIn = (id: string) => {
    const now = Date.now();
    const updated = apps.map((a) => (a.id === id ? { ...a, isLoggedIn: !a.isLoggedIn, updatedAt: now } : a));
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppVerified = (id: string) => {
    const now = Date.now();
    const updated = apps.map((a) => {
      if (a.id === id) {
        const next = !a.isVerified;
        return { ...a, isVerified: next, isConfigured: next, updatedAt: now };
      }
      return a;
    });
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppConfigured = (id: string) => {
    const now = Date.now();
    const updated = apps.map((a) => {
      if (a.id === id) {
        const next = !a.isConfigured;
        return { ...a, isConfigured: next, isVerified: next, updatedAt: now };
      }
      return a;
    });
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const handleAddApp = (app: Omit<AppConfigItem, 'id'>) => {
    const now = Date.now();
    const newApp: AppConfigItem = { ...app, id: 'app-custom-' + now, updatedAt: now };
    const updated = [...apps, newApp];
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const handleDeleteApp = (id: string) => {
    const updated = apps.filter((a) => a.id !== id);
    const nextDeleted = Array.from(new Set([...deletedItemIds, id]));
    setApps(updated);
    setDeletedItemIds(nextDeleted);
    try {
      localStorage.setItem('navini_deleted_item_ids_v8', JSON.stringify(nextDeleted));
    } catch {}
    syncAllState({ apps: updated, deletedItemIds: nextDeleted });
  };

  // Milestone Completion
  const toggleMilestone = (id: string) => {
    const updated = milestones.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m));
    setMilestones(updated);
    syncAllState({ milestones: updated });
  };

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  // Inventory stats
  const totalPhysicalItems = bags.length + devices.length + wardrobe.length;
  const totalPackedItems =
    bags.filter((b) => b.isPacked).length +
    devices.filter((d) => d.isPacked).length +
    wardrobe.filter((w) => w.isPacked).length;
  const physicalPercent = Math.round((totalPackedItems / (totalPhysicalItems || 1)) * 100);

  const unboughtCount =
    bags.filter((b) => !b.isBought).length +
    devices.filter((d) => !d.isBought).length +
    wardrobe.filter((w) => !w.isBought).length;

  const inHandDocs = documents.filter((d) => d.isReady || d.isPacked).length;
  const docPercent = Math.round((inHandDocs / (documents.length || 1)) * 100);

  const verifiedApps = apps.filter((a) => a.isVerified || a.isConfigured).length;
  const appPercent = Math.round((verifiedApps / (apps.length || 1)) * 100);

  const activeUploadingItems = wardrobe.filter((w) => w.syncStatus === 'uploading');
  const avgUploadProgress =
    activeUploadingItems.length > 0
      ? Math.round(
          activeUploadingItems.reduce((sum, w) => sum + (Number(w.uploadProgress) || 30), 0) /
            activeUploadingItems.length
        )
      : 100;

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 pb-20 font-sans overflow-x-hidden print:bg-white print:pb-0 print:overflow-visible">
      {/* NON-OBSTRUCTING CORNER LOADING BAR (TOP-LEFT VIEWPORT — NEVER BLOCKS ADD ITEM PANEL OR CLOSE BUTTON) */}
      {(uploadingCount > 0 || showSyncedPill) && (
        <div
          className={`fixed top-1.5 left-2 z-[100000] px-2.5 py-1 rounded-xl flex flex-col gap-1 backdrop-blur-md shadow-md pointer-events-none transition-all duration-200 max-w-[165px] ${
            uploadingCount > 0
              ? 'bg-slate-900/85 text-white border border-white/15 animate-in fade-in'
              : 'bg-emerald-900/85 text-emerald-100 border border-emerald-500/40 animate-in fade-in'
          }`}
        >
          {uploadingCount > 0 ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-[#38bdf8] rounded-full animate-spin shrink-0" />
                  <span className="text-[10px] font-semibold truncate">
                    ☁️ Syncing {uploadingCount > 1 ? `(${uploadingCount})` : ''}
                  </span>
                </div>
                <span className="text-[9.5px] font-mono font-bold text-[#38bdf8] shrink-0">
                  {avgUploadProgress}%
                </span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#38bdf8] rounded-full transition-all duration-200"
                  style={{ width: `${Math.max(15, Math.min(100, avgUploadProgress))}%` }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">☁️✓</span>
              <span className="text-[10px] font-semibold text-emerald-200">
                Synced
              </span>
            </div>
          )}
        </div>
      )}

      {/* SUBTLE BOTTOM iOS / CALL-OF-DUTY STYLE SINGLE-LINE ACTIVITY STRIP (Zero DB Credit Cost) */}
      {activityStripText && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9995] max-w-[92vw] px-3.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium tracking-tight shadow-lg pointer-events-none flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 print:hidden">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shrink-0" />
          <span className="truncate">{activityStripText}</span>
        </div>
      )}

      {/* 1. TOP HEADER (China Flag PNG Branding & Live Supabase Rippling Indicator) */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/10 sticky top-0 z-40 w-full transition-all">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 h-12 sm:h-14 flex items-center justify-between gap-1.5 sm:gap-3 box-border overflow-hidden">
          {/* Logo & Brand with China Flag PNG */}
          <button
            type="button"
            onClick={() => navigateToView('overview')}
            className="flex items-center gap-1.5 sm:gap-2.5 text-left group cursor-pointer min-w-0 flex-1 overflow-hidden"
          >
            <img
              src="https://flagcdn.com/w80/cn.png"
              alt="China Flag"
              className="h-[16px] sm:h-[20px] w-auto rounded-[3px] border border-black/10 shrink-0 object-cover inline-block shadow-2xs"
              onError={(e) => {
                e.currentTarget.src = './favicon-cn.svg';
              }}
            />
            <div className="min-w-0 flex-1 truncate">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-[13px] sm:text-base tracking-tight text-slate-900 block leading-tight truncate">
                  Navini's Travel Plan
                </span>

                {/* iOS Fetching Spinner or Live Supabase Rippling Green Indicator */}
                {isCloudFetching && !isOfflineLocked ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] text-[10px] font-semibold border border-blue-200/80 shrink-0">
                    <span className="w-2.5 h-2.5 border-2 border-[#007AFF]/30 border-t-[#007AFF] rounded-full animate-spin" />
                    <span className="hidden xs:inline">Syncing...</span>
                  </span>
                ) : (
                  isSupabaseConnected &&
                  !isOfflineLocked && (
                    <span
                      className="ripple-green-dot shrink-0"
                      title="Live Supabase Sync Active"
                    />
                  )
                )}
              </div>
              <span className="text-[10px] text-[#8E8E93] hidden md:block truncate">
                Colombo &rarr; Shanghai &rarr; Haikou
              </span>
            </div>
          </button>

          {/* Quick Action Pills + Hamburger Menu */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Tiny Top-Bar Recovery Shield Icon */}
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Emergency Data Recovery & Raw Names Vault"
            >
              <span className="text-xs sm:text-sm">🛡️</span>
            </button>

            {/* TOP-BAR DOWNLOAD / OFFLINE LOCK TOGGLE BUTTON */}
            <button
              type="button"
              onClick={handleToggleOfflineLock}
              className={`h-7 sm:h-8 px-2 sm:px-3 rounded-full flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer select-none shrink-0 ${
                isOfflineLocked
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-400 font-bold'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 font-bold'
              }`}
              title={
                isOfflineLocked
                  ? 'Offline Mode Active: Reading exclusively from local cache. Tap to activate Live Cloud Sync'
                  : 'Live Cloud Sync Active: Changes sync instantly across devices. Tap to lock offline'
              }
            >
              {isOfflineLocked ? (
                <>
                  <span className="text-xs sm:text-sm leading-none">📥</span>
                  <span className="text-[11px] font-bold hidden sm:inline tracking-tight">Locked Offline</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-800 hidden sm:inline tracking-tight">☁️ Live</span>
                </>
              )}
            </button>

            {/* Taxi Card Button */}
            <button
              type="button"
              onClick={() => setShowTaxiModal(true)}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] sm:text-xs transition-colors shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
            >
              🚕 <span className="hidden xs:inline">Taxi Card</span>
            </button>

            {/* Hamburger Button for Apple Sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Open menu"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 print:p-0 print:m-0 print:max-w-none print:w-full print:pt-0">
        {/* OVERVIEW VIEW */}
        {currentView === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* SECTION 1: TOP DOCKED PROFILE & AIRLINE ACCORDION (Requirement #1) */}
            <TopDockedProfileAirline
              passportInfo={passportInfo}
              onUpdatePassportInfo={handleUpdatePassportInfo}
              isCloudSynced={isSupabaseConnected && !isOfflineLocked}
            />

            {/* SECTION 2: 10 HARDWARE & LUGGAGE SHOWCASE WIDGETS (Strict 3-State Cycle) */}
            <HardwareShowcaseWidgets
              bags={bags}
              devices={devices}
              onToggleBagBought={toggleBagBought}
              onToggleDeviceBought={toggleDeviceBought}
              onCycleBagStatus={handleCycleBagStatus}
              onCycleDeviceStatus={handleCycleDeviceStatus}
              onInspectBag={(bag) => setSelectedInspectBag(bag)}
            />

            {/* SECTION 3: THREE MAIN INTERACTIVE PORTALS */}
            <section className="space-y-2">
              <span className="text-xs font-bold text-slate-900 tracking-tight px-1 block">
                Portals
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Portal 1: Luggage & Wardrobe */}
                <button
                  type="button"
                  onClick={() => navigateToView('physical')}
                  className="ios-card p-4 sm:p-5 text-left flex flex-col justify-between hover:border-[#007AFF]/60 active:scale-[0.98] transition-all group border-l-4 border-l-[#007AFF] shadow-xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                        <Luggage className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-[#007AFF]">{physicalPercent}%</span>
                        <div className="w-6 h-6 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-400 group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Luggage & Wardrobe
                    </h3>
                    <p className="text-xs text-[#8E8E93] mt-0.5 line-clamp-2">
                      Clothing, shoes, toiletries, and suitcase allocations.
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {totalPackedItems}/{totalPhysicalItems} Packed
                    </span>
                    {unboughtCount > 0 ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                        {unboughtCount} To Buy
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        All Owned
                      </span>
                    )}
                  </div>
                </button>

                {/* Portal 2: Documents */}
                <button
                  type="button"
                  onClick={() => navigateToView('documents')}
                  className="ios-card p-4 sm:p-5 text-left flex flex-col justify-between hover:border-[#F59E0B]/60 active:scale-[0.98] transition-all group border-l-4 border-l-[#F59E0B] shadow-xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-[#F59E0B]">{docPercent}%</span>
                        <div className="w-6 h-6 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-400 group-hover:bg-[#F59E0B] group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#F59E0B] transition-colors">
                      Documents
                    </h3>
                    <p className="text-xs text-[#8E8E93] mt-0.5 line-clamp-2">
                      Passport, JW202/Visa, and official physical certificates.
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {inHandDocs}/{documents.length} In Hand
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      Ready
                    </span>
                  </div>
                </button>

                {/* Portal 3: Internet, Apps & Chat */}
                <button
                  type="button"
                  onClick={() => navigateToView('connectivity')}
                  className="ios-card p-4 sm:p-5 text-left flex flex-col justify-between hover:border-[#10B981]/60 active:scale-[0.98] transition-all group border-l-4 border-l-[#10B981] shadow-xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                        <Globe2 className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-[#10B981]">{appPercent}%</span>
                        <div className="w-6 h-6 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-400 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#10B981] transition-colors">
                      Internet, Apps & Chat
                    </h3>
                    <p className="text-xs text-[#8E8E93] mt-0.5 line-clamp-2">
                      CMLink 5G eSIM, Hiddify VPN guide, and campus WeChat.
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {verifiedApps}/{apps.length} Ready
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      CMLink + Hiddify
                    </span>
                  </div>
                </button>
              </div>
            </section>

            {/* SECTION 4: SCHEDULE & TRAVEL STEPS */}
            <section>
              <TimelineOverview
                milestones={milestones}
                onToggleMilestone={toggleMilestone}
                onNavigateToCategory={(cat) => navigateToView(cat)}
              />
            </section>
          </div>
        )}

        {/* SUB-HUB 1: WARDROBE & PACKING STUDIO (FULL VIEW) */}
        {currentView === 'physical' && (
          <PhysicalHub
            onBack={() => navigateToView('overview')}
            wardrobe={wardrobe}
            trashedWardrobe={trashedWardrobe}
            isCloudFetching={isCloudFetching}
            bags={bags}
            devices={devices}
            documents={documents}
            categories={categories}
            deletedCategories={deletedCategories}
            locations={locations}
            deletedLocations={deletedLocations}
            customLocations={customLocations}
            customCategories={customCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onAddLocation={handleAddLocation}
            onRenameLocation={handleRenameLocation}
            onDeleteLocation={handleDeleteLocation}
            onAddCategory={handleAddCategory}
            onRenameCategory={handleRenameCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddCustomLocation={handleAddLocation}
            onAddCustomCategory={handleAddCategory}
            onDeleteCustomCategory={handleDeleteCategory}
            onToggleWardrobeBought={toggleWardrobeBought}
            onToggleWardrobePacked={toggleWardrobePacked}
            onAddWardrobeItem={handleAddWardrobeItem}
            onUpdateWardrobeItem={handleUpdateWardrobeItem}
            onDeleteWardrobeItem={handleDeleteWardrobeItem}
            onRestoreFromTrash={handleRestoreFromTrash}
            onPermanentDeleteFromTrash={handlePermanentDeleteFromTrash}
            onEmptyTrash={handleEmptyTrash}
            onRetryUpload={handleRetryWardrobeItemSync}
            onToggleBagBought={toggleBagBought}
            onToggleBagPacked={toggleBagPacked}
            onAddBag={handleAddBag}
            onUpdateBag={handleUpdateBag}
            onDeleteBag={handleDeleteBag}
            onToggleDeviceBought={toggleDeviceBought}
            onToggleDevicePacked={toggleDevicePacked}
            onAddDevice={handleAddDevice}
            onUpdateDevice={handleUpdateDevice}
            onDeleteDevice={handleDeleteDevice}
            onToggleDocPacked={toggleDocPacked}
            onAddDoc={handleAddDoc}
            onUpdateDoc={handleUpdateDoc}
            onDeleteDoc={handleDeleteDoc}
          />
        )}

        {/* SUB-HUB 2: DOCUMENT CHECKER (FULL VIEW) */}
        {currentView === 'documents' && (
          <DocumentationHub
            onBack={() => navigateToView('overview')}
            documents={documents}
            customLocations={customLocations}
            onAddCustomLocation={handleAddCustomLocation}
            onToggleDocReady={toggleDocReady}
            onToggleDocPacked={toggleDocPacked}
            onAddDoc={handleAddDoc}
            onUpdateDoc={handleUpdateDoc}
            onDeleteDoc={handleDeleteDoc}
          />
        )}

        {/* SUB-HUB 3: CONNECTIVITY & APPLICATIONS MATRIX (FULL VIEW) */}
        {currentView === 'connectivity' && (
          <CommunicationHub
            onBack={() => navigateToView('overview')}
            apps={apps}
            customAppCategories={customAppCategories}
            customAppDevices={customAppDevices}
            onAddCustomAppCategory={handleAddCustomAppCategory}
            onAddCustomAppDevice={handleAddCustomAppDevice}
            onToggleAppInstalled={toggleAppInstalled}
            onToggleAppLoggedIn={toggleAppLoggedIn}
            onToggleAppVerified={toggleAppVerified}
            onToggleAppConfigured={toggleAppConfigured}
            onAddApp={handleAddApp}
            onDeleteApp={handleDeleteApp}
            onOpenTaxiModal={() => setShowTaxiModal(true)}
            confirmedCampusChat={confirmedCampusChat}
          />
        )}
      </main>

      {/* APPLE STYLE SLIDE-OUT SIDEBAR */}
      <AppleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onNavigate={navigateToView}
        onOpenTaxi={() => setShowTaxiModal(true)}
        onOpenBackup={() => setShowBackupModal(true)}
        passportInfo={passportInfo}
      />

      {/* TAXI POCKET CARD MODAL */}
      <TaxiCardModal
        isOpen={showTaxiModal}
        onClose={() => setShowTaxiModal(false)}
      />

      {/* EMERGENCY DATA RECOVERY & STORAGE INSPECTOR MODAL */}
      <RecoveryScanner
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        currentWardrobe={wardrobe}
        onRestoreItems={handleRestoreWardrobeItems}
        onPullFromSupabase={handlePullFromSupabase}
      />

      {/* OFFLINE BACKUP MODAL */}
      <OfflineBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        checklistItems={documents.map((d) => ({
          id: d.id,
          category: 'Documents',
          label: d.title,
          detail: d.notes,
          tag: d.carryLocation,
          isChecked: d.isReady || d.isPacked,
        }))}
        wardrobeItems={wardrobe}
        onImportJson={(data) => {
          if (Array.isArray(data?.wardrobe)) {
            handleRestoreWardrobeItems(data.wardrobe);
          } else if (Array.isArray(data?.wardrobeItems)) {
            handleRestoreWardrobeItems(data.wardrobeItems);
          }
        }}
        onPushMasterToCloud={handlePushMasterDataToCloud}
        isMasterPushing={isMasterPushing}
        onDownloadMasterJson={handleDownloadMasterJsonBackup}
      />

      {/* LUGGAGE CONTENTS MODAL (TRIGGERED FROM SHOWCASE WIDGETS) */}
      <LuggageContentsModal
        isOpen={selectedInspectBag !== null}
        onClose={() => setSelectedInspectBag(null)}
        bag={selectedInspectBag}
        bags={bags}
        wardrobeItems={wardrobe}
        deviceItems={devices}
        documentItems={documents}
        giftItems={gifts}
        locationOptions={locations}
        wardrobeCategories={categories}
        onAddCustomLocation={handleAddLocation}
        onAddCustomCategory={handleAddCategory}
        onToggleWardrobePacked={toggleWardrobePacked}
        onToggleDevicePacked={toggleDevicePacked}
        onToggleDocPacked={toggleDocPacked}
        onUpdateWardrobeItem={handleUpdateWardrobeItem}
        onUpdateDevice={handleUpdateDevice}
        onUpdateDoc={handleUpdateDoc}
        onDeleteWardrobeItem={handleDeleteWardrobeItem}
        onDeleteDevice={handleDeleteDevice}
        onDeleteDoc={handleDeleteDoc}
        onAddWardrobeItem={handleAddWardrobeItem}
        onAddDevice={handleAddDevice}
        onAddDoc={handleAddDoc}
      />

      {/* MASTER CLOUD MIGRATION CONFIRMATION MODAL */}
      {masterModalMessage && (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl shadow-inner font-bold">
              ✓
            </div>
            <h3 className="text-base font-bold text-slate-900">Published Online Globally</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {masterModalMessage}
            </p>
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadMasterJsonBackup}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📥</span>
                <span>Download Offline JSON Backup</span>
              </button>
              <button
                type="button"
                onClick={() => setMasterModalMessage(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-98 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
