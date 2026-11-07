import React, { useState, useEffect } from 'react';
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
} from './data';

import {
  AppMasterState,
  fetchCloudState,
  pushCloudState,
  subscribeToCloudState,
  checkSupabaseConnection,
} from './cloudSync';

import { AuthGate } from './components/AuthGate';
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
    const hash = window.location.hash.replace('#', '');
    if (['physical', 'documents', 'connectivity'].includes(hash)) {
      return hash as any;
    }
    return 'overview';
  });

  // Sidebar & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [selectedInspectBag, setSelectedInspectBag] = useState<BagAsset | null>(null);

  // Live Supabase Status
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Synchronize hash with currentView
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['physical', 'documents', 'connectivity'].includes(hash)) {
        setCurrentView(hash as any);
      } else {
        setCurrentView('overview');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToView = (view: 'overview' | 'physical' | 'documents' | 'connectivity') => {
    setCurrentView(view);
    window.location.hash = view === 'overview' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const [bags, setBags] = useState<BagAsset[]>(() => {
    const saved = localStorage.getItem('navini_bags_v7') || localStorage.getItem('navini_bags_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_BAGS;
  });

  const [devices, setDevices] = useState<DeviceAsset[]>(() => {
    const saved = localStorage.getItem('navini_devices_v7') || localStorage.getItem('navini_devices_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DEVICES;
  });

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('navini_wardrobe_v7') || localStorage.getItem('navini_wardrobe_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return migrateWardrobeItems(parsed);
      } catch (e) {}
    }
    return INITIAL_WARDROBE;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('navini_docs_v7') || localStorage.getItem('navini_docs_v6');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DOCUMENTS;
  });

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

  // Live Supabase Lifecycle: Fetch initial + Realtime Subscribe + Periodic Ping
  useEffect(() => {
    let isMounted = true;

    const initSupabase = async () => {
      const isAlive = await checkSupabaseConnection();
      if (isMounted) setIsSupabaseConnected(isAlive);

      const remote = await fetchCloudState();
      if (remote && isMounted) {
        if (remote.passportInfo) setPassportInfo(remote.passportInfo);
        if (remote.bags?.length) setBags(remote.bags);
        if (remote.devices?.length) setDevices(remote.devices);
        if (remote.wardrobe?.length) {
          const migrated = migrateWardrobeItems(remote.wardrobe);
          setWardrobe(migrated);
          const hadLegacyCategory = migrated.some((m, idx) => m.category !== remote.wardrobe[idx]?.category);
          if (hadLegacyCategory) {
            syncAllState({ wardrobe: migrated });
          }
        }
        if (remote.documents?.length) setDocuments(remote.documents);
        if (remote.apps?.length) setApps(migrateLegacyApps(remote.apps));
        if (remote.milestones?.length) setMilestones(remote.milestones);
        if (remote.customCategories?.length) setCustomCategories(remote.customCategories);
        if (remote.customLocations?.length) setCustomLocations(remote.customLocations);
        if (remote.customAppCategories?.length) setCustomAppCategories(remote.customAppCategories);
        if (remote.customAppDevices?.length) setCustomAppDevices(remote.customAppDevices);
        if (typeof remote.confirmedCampusChat === 'boolean') {
          setConfirmedCampusChat(remote.confirmedCampusChat);
        }
      }
    };

    initSupabase();

    // Subscribe to realtime changes on `app_state` (row `id = 'main_plan'`)
    const unsubscribe = subscribeToCloudState((incoming) => {
      if (!isMounted) return;
      setIsSupabaseConnected(true);
      if (incoming.passportInfo) setPassportInfo(incoming.passportInfo);
      if (incoming.bags?.length) setBags(incoming.bags);
      if (incoming.devices?.length) setDevices(incoming.devices);
      if (incoming.wardrobe?.length) setWardrobe(migrateWardrobeItems(incoming.wardrobe));
      if (incoming.documents?.length) setDocuments(incoming.documents);
      if (incoming.apps?.length) setApps(migrateLegacyApps(incoming.apps));
      if (incoming.milestones?.length) setMilestones(incoming.milestones);
      if (incoming.customCategories?.length) setCustomCategories(incoming.customCategories);
      if (incoming.customLocations?.length) setCustomLocations(incoming.customLocations);
      if (incoming.customAppCategories?.length) setCustomAppCategories(incoming.customAppCategories);
      if (incoming.customAppDevices?.length) setCustomAppDevices(incoming.customAppDevices);
      if (typeof incoming.confirmedCampusChat === 'boolean') {
        setConfirmedCampusChat(incoming.confirmedCampusChat);
      }
    });

    // Check connection health every 12 seconds
    const pingTimer = setInterval(async () => {
      const isAlive = await checkSupabaseConnection();
      if (isMounted) setIsSupabaseConnected(isAlive);
    }, 12000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(pingTimer);
    };
  }, []);

  // Sync state to local storage & push to Supabase
  const syncAllState = (overrides?: Partial<AppMasterState>) => {
    const cCats = overrides?.customCategories || customCategories;
    const cLocs = overrides?.customLocations || customLocations;
    const cAppCats = overrides?.customAppCategories || customAppCategories;
    const cAppDevs = overrides?.customAppDevices || customAppDevices;
    const wItems = overrides?.wardrobe || wardrobe;
    const bAssets = overrides?.bags || bags;
    const dAssets = overrides?.devices || devices;
    const docItems = overrides?.documents || documents;
    const appItems = overrides?.apps || apps;
    const mStones = overrides?.milestones || milestones;
    const pInfo = overrides?.passportInfo || passportInfo;

    try {
      localStorage.setItem('navini_passport_profile_v7', JSON.stringify(pInfo));
      localStorage.setItem('navini_bags_v7', JSON.stringify(bAssets));
      localStorage.setItem('navini_devices_v7', JSON.stringify(dAssets));
      localStorage.setItem('navini_wardrobe_v7', JSON.stringify(wItems));
      localStorage.setItem('navini_docs_v7', JSON.stringify(docItems));
      localStorage.setItem('navini_apps_v7', JSON.stringify(appItems));
      localStorage.setItem('navini_milestones_v7', JSON.stringify(mStones));
      localStorage.setItem('navini_custom_categories_v7', JSON.stringify(cCats));
      localStorage.setItem('navini_custom_locations_v7', JSON.stringify(cLocs));
      localStorage.setItem('navini_custom_app_categories_v7', JSON.stringify(cAppCats));
      localStorage.setItem('navini_custom_app_devices_v7', JSON.stringify(cAppDevs));
    } catch (e) {
      console.warn('LocalStorage write warning or quota exceeded:', e);
    }

    const masterState: AppMasterState = {
      version: '7.0',
      lastUpdated: new Date().toISOString(),
      passportInfo: pInfo,
      bags: bAssets,
      devices: dAssets,
      wardrobe: wItems,
      documents: docItems,
      procedureSteps,
      bankingTasks,
      gifts,
      apps: appItems,
      milestones: mStones,
      confirmedCampusChat: overrides?.confirmedCampusChat ?? confirmedCampusChat,
      customCategories: cCats,
      customLocations: cLocs,
      customBanks,
      customAppCategories: cAppCats,
      customAppDevices: cAppDevs,
    };

    pushCloudState(masterState);
  };

  // Dynamic classification handlers
  const handleAddCustomCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed || customCategories.includes(trimmed)) return;
    const updated = [...customCategories, trimmed];
    setCustomCategories(updated);
    syncAllState({ customCategories: updated });
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
    const updated = bags.map((b) => (b.id === id ? { ...b, isBought: !b.isBought } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleCycleBagStatus = (id: string) => {
    const updated = bags.map((b) => {
      if (b.id !== id) return b;
      // Cycle: !isBought (Missing) -> isBought && !isPacked (Bought) -> isBought && isPacked (Packed) -> !isBought (Missing)
      if (!b.isBought) {
        return { ...b, isBought: true, isPacked: false };
      } else if (b.isBought && !b.isPacked) {
        return { ...b, isBought: true, isPacked: true };
      } else {
        return { ...b, isBought: false, isPacked: false };
      }
    });
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const toggleBagPacked = (id: string) => {
    const updated = bags.map((b) => (b.id === id ? { ...b, isPacked: !b.isPacked } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleAddBag = (bag: Omit<BagAsset, 'id'>) => {
    const newBag: BagAsset = { ...bag, id: `bag-custom-${Date.now()}` };
    const updated = [...bags, newBag];
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleUpdateBag = (id: string, partial: Partial<BagAsset>) => {
    const updated = bags.map((b) => (b.id === id ? { ...b, ...partial } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const handleDeleteBag = (id: string) => {
    const updated = bags.filter((b) => b.id !== id);
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const toggleDeviceBought = (id: string) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, isBought: !d.isBought } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleCycleDeviceStatus = (id: string) => {
    const updated = devices.map((d) => {
      if (d.id !== id) return d;
      // Cycle: !isBought (Missing) -> isBought && !isPacked (Bought) -> isBought && isPacked (Packed) -> !isBought (Missing)
      if (!d.isBought) {
        return { ...d, isBought: true, isPacked: false };
      } else if (d.isBought && !d.isPacked) {
        return { ...d, isBought: true, isPacked: true };
      } else {
        return { ...d, isBought: false, isPacked: false };
      }
    });
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const toggleDevicePacked = (id: string) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleAddDevice = (device: Omit<DeviceAsset, 'id'>) => {
    const newDev: DeviceAsset = { ...device, id: `dev-custom-${Date.now()}` };
    const updated = [...devices, newDev];
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleUpdateDevice = (id: string, partial: Partial<DeviceAsset>) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, ...partial } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const handleDeleteDevice = (id: string) => {
    const updated = devices.filter((d) => d.id !== id);
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const toggleWardrobeBought = (id: string) => {
    const updated = wardrobe.map((w) => (w.id === id ? { ...w, isBought: !w.isBought } : w));
    setWardrobe(updated);
    syncAllState({ wardrobe: updated });
  };

  const toggleWardrobePacked = (id: string) => {
    const updated = wardrobe.map((w) => (w.id === id ? { ...w, isPacked: !w.isPacked } : w));
    setWardrobe(updated);
    syncAllState({ wardrobe: updated });
  };

  const handleAddWardrobeItem = (item: Omit<WardrobeItem, 'id'>) => {
    const newItem: WardrobeItem = { ...item, id: 'w-custom-' + Date.now() };
    const updated = [newItem, ...wardrobe];
    setWardrobe(updated);
    syncAllState({ wardrobe: updated });
  };

  const handleUpdateWardrobeItem = (id: string, partial: Partial<WardrobeItem>) => {
    const updated = wardrobe.map((w) => (w.id === id ? { ...w, ...partial } : w));
    setWardrobe(updated);
    syncAllState({ wardrobe: updated });
  };

  const handleDeleteWardrobeItem = (id: string) => {
    const updated = wardrobe.filter((w) => w.id !== id);
    setWardrobe(updated);
    syncAllState({ wardrobe: updated });
  };

  // Handlers for Official Documents
  const toggleDocReady = (id: string) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, isReady: !d.isReady } : d));
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const toggleDocPacked = (id: string) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked } : d));
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const handleAddDoc = (doc: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = { ...doc, id: 'doc-custom-' + Date.now() };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const handleUpdateDoc = (id: string, partial: Partial<DocumentItem>) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, ...partial } : d));
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  const handleDeleteDoc = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    syncAllState({ documents: updated });
  };

  // Handlers for Apps & 3 Checkpoints
  const toggleAppInstalled = (id: string) => {
    const updated = apps.map((a) => (a.id === id ? { ...a, isInstalled: !a.isInstalled } : a));
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppLoggedIn = (id: string) => {
    const updated = apps.map((a) => (a.id === id ? { ...a, isLoggedIn: !a.isLoggedIn } : a));
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppVerified = (id: string) => {
    const updated = apps.map((a) => {
      if (a.id === id) {
        const next = !a.isVerified;
        return { ...a, isVerified: next, isConfigured: next };
      }
      return a;
    });
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppConfigured = (id: string) => {
    const updated = apps.map((a) => {
      if (a.id === id) {
        const next = !a.isConfigured;
        return { ...a, isConfigured: next, isVerified: next };
      }
      return a;
    });
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const handleAddApp = (app: Omit<AppConfigItem, 'id'>) => {
    const newApp: AppConfigItem = { ...app, id: 'app-custom-' + Date.now() };
    const updated = [...apps, newApp];
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const handleDeleteApp = (id: string) => {
    const updated = apps.filter((a) => a.id !== id);
    setApps(updated);
    syncAllState({ apps: updated });
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

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 pb-20 font-sans overflow-x-hidden print:bg-white print:pb-0 print:overflow-visible">
      {/* 1. TOP HEADER (China Flag PNG Branding & Live Supabase Rippling Indicator) */}
      <header className="bg-white/90 backdrop-blur-md border-b border-black/10 sticky top-0 z-40 w-full transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-3">
          {/* Logo & Brand with China Flag PNG */}
          <button
            type="button"
            onClick={() => navigateToView('overview')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <img
              src="https://flagcdn.com/w80/cn.png"
              alt="China Flag"
              className="h-[18px] sm:h-[20px] w-auto rounded-[3px] border border-black/10 shrink-0 object-cover inline-block shadow-2xs"
              onError={(e) => {
                e.currentTarget.src = './favicon-cn.svg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                  Navini's Travel Plan
                </span>

                {/* Live Supabase Rippling Green Indicator */}
                {isSupabaseConnected && (
                  <span
                    className="ripple-green-dot shrink-0"
                    title="Live Supabase Sync Active"
                  />
                )}
              </div>
              <span className="text-[10px] text-[#8E8E93] hidden sm:block">
                Colombo &rarr; Shanghai &rarr; Haikou
              </span>
            </div>
          </button>

          {/* Quick Action Pills + Hamburger Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowTaxiModal(true)}
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              🚕 Taxi Card
            </button>

            {/* Hamburger Button for Apple Sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="w-8 h-8 rounded-full border border-black/10 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Open menu"
            >
              <Menu className="w-4 h-4" />
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
              isCloudSynced={isSupabaseConnected}
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
            bags={bags}
            devices={devices}
            documents={documents}
            customLocations={customLocations}
            customCategories={customCategories}
            onAddCustomLocation={handleAddCustomLocation}
            onAddCustomCategory={handleAddCustomCategory}
            onToggleWardrobeBought={toggleWardrobeBought}
            onToggleWardrobePacked={toggleWardrobePacked}
            onAddWardrobeItem={handleAddWardrobeItem}
            onUpdateWardrobeItem={handleUpdateWardrobeItem}
            onDeleteWardrobeItem={handleDeleteWardrobeItem}
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
        onImportJson={() => {}}
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
        locationOptions={Array.from(new Set([...bags.map((b) => b.name), ...customLocations]))}
        wardrobeCategories={Array.from(new Set(['Dresses & Frocks', 'Tops & T-Shirts', 'Bottoms & Jeans', 'Undergarments & Innerwear', 'Footwear & Slippers', 'Bottles, Liquids & Toiletries', 'Medicine & First Aid', 'Gifts & Souvenirs', 'Daily Essentials, Cutlery & Folders', ...customCategories]))}
        onAddCustomLocation={handleAddCustomLocation}
        onAddCustomCategory={handleAddCustomCategory}
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
    </div>
  );
}

export default App;
