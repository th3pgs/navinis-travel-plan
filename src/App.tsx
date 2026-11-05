import React, { useState, useEffect } from 'react';
import {
  Download,
  Menu,
  X,
  Luggage,
  FileText,
  Globe2,
  ChevronRight,
  Printer,
  CloudCheck,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import {
  BagAsset,
  DeviceAsset,
  DocumentItem,
  AppConfigItem,
  WardrobeItem,
  TimelineMilestone,
  ProcedureStep,
  INITIAL_BAGS,
  INITIAL_DEVICES,
  INITIAL_DOCUMENTS,
  INITIAL_APPS,
  INITIAL_WARDROBE,
  INITIAL_MILESTONES,
  INITIAL_PROCEDURE_STEPS,
} from './data';

import { AppMasterState } from './cloudSync';
import { AuthGate } from './components/AuthGate';
import { StudentProfileCard } from './components/StudentProfileCard';
import { FlightItineraryCard } from './components/FlightItineraryCard';
import { PhysicalHub } from './components/PhysicalHub';
import { DocumentationHub } from './components/DocumentationHub';
import { CommunicationHub } from './components/CommunicationHub';
import { TimelineOverview } from './components/TimelineOverview';
import { AppleSidebar } from './components/AppleSidebar';
import { TaxiCardModal } from './components/TaxiCardModal';
import { OfflineBackupModal } from './components/OfflineBackupModal';

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

  // State Management
  const [passportInfo, setPassportInfo] = useState<{
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  }>(() => {
    const saved = localStorage.getItem('navini_passport_profile_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      passportNumber: 'N10385921',
      expiryDate: '2034-08-15',
      photoUrl: `${import.meta.env.BASE_URL}navini-passport.png`,
    };
  });

  const [bags, setBags] = useState<BagAsset[]>(() => {
    const saved = localStorage.getItem('navini_bags_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_BAGS;
  });

  const [devices, setDevices] = useState<DeviceAsset[]>(() => {
    const saved = localStorage.getItem('navini_devices_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DEVICES;
  });

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('navini_wardrobe_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_WARDROBE;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('navini_docs_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DOCUMENTS;
  });

  const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>(() => {
    const saved = localStorage.getItem('navini_procedure_steps_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PROCEDURE_STEPS;
  });

  const [apps, setApps] = useState<AppConfigItem[]>(() => {
    const saved = localStorage.getItem('navini_apps_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_APPS;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem('navini_milestones_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_MILESTONES;
  });

  // Instant local-first persistence (100% stable, zero network race conditions)
  const syncAllState = (overrides?: Partial<AppMasterState>) => {
    const masterState: AppMasterState = {
      version: '5.1',
      lastUpdated: new Date().toISOString(),
      passportInfo: overrides?.passportInfo || passportInfo,
      bags: overrides?.bags || bags,
      devices: overrides?.devices || devices,
      wardrobe: overrides?.wardrobe || wardrobe,
      documents: overrides?.documents || documents,
      procedureSteps: overrides?.procedureSteps || procedureSteps,
      apps: overrides?.apps || apps,
      milestones: overrides?.milestones || milestones,
    };

    // Save locally with zero latency (instant and offline safe)
    try {
      localStorage.setItem('navini_passport_profile_v5', JSON.stringify(masterState.passportInfo));
      localStorage.setItem('navini_bags_v5', JSON.stringify(masterState.bags));
      localStorage.setItem('navini_devices_v5', JSON.stringify(masterState.devices));
      localStorage.setItem('navini_wardrobe_v5', JSON.stringify(masterState.wardrobe));
      localStorage.setItem('navini_docs_v5', JSON.stringify(masterState.documents));
      localStorage.setItem('navini_procedure_steps_v5', JSON.stringify(masterState.procedureSteps));
      localStorage.setItem('navini_apps_v5', JSON.stringify(masterState.apps));
      localStorage.setItem('navini_milestones_v5', JSON.stringify(masterState.milestones));
      localStorage.setItem('navini_master_state_v5', JSON.stringify(masterState));
    } catch (e) {
      console.warn('Local storage write warning', e);
    }
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

  const toggleBagPacked = (id: string) => {
    const updated = bags.map((b) => (b.id === id ? { ...b, isPacked: !b.isPacked } : b));
    setBags(updated);
    syncAllState({ bags: updated });
  };

  const toggleDeviceBought = (id: string) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, isBought: !d.isBought } : d));
    setDevices(updated);
    syncAllState({ devices: updated });
  };

  const toggleDevicePacked = (id: string) => {
    const updated = devices.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked } : d));
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

  // Handlers for Documentation
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
    const updated = [newDoc, ...documents];
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

  const toggleStepDone = (id: string) => {
    const updated = procedureSteps.map((s) => (s.id === id ? { ...s, isDone: !s.isDone } : s));
    setProcedureSteps(updated);
    syncAllState({ procedureSteps: updated });
  };

  const handleAddStep = (step: Omit<ProcedureStep, 'id' | 'isDone'>) => {
    const newStep: ProcedureStep = { ...step, id: 'step-custom-' + Date.now(), isDone: false };
    const updated = [...procedureSteps, newStep];
    setProcedureSteps(updated);
    syncAllState({ procedureSteps: updated });
  };

  const handleUpdateStep = (id: string, partial: Partial<ProcedureStep>) => {
    const updated = procedureSteps.map((s) => (s.id === id ? { ...s, ...partial } : s));
    setProcedureSteps(updated);
    syncAllState({ procedureSteps: updated });
  };

  const handleDeleteStep = (id: string) => {
    const updated = procedureSteps.filter((s) => s.id !== id);
    setProcedureSteps(updated);
    syncAllState({ procedureSteps: updated });
  };

  // Handlers for Apps
  const toggleAppInstalled = (id: string) => {
    const updated = apps.map((a) => (a.id === id ? { ...a, isInstalled: !a.isInstalled } : a));
    setApps(updated);
    syncAllState({ apps: updated });
  };

  const toggleAppConfigured = (id: string) => {
    const updated = apps.map((a) => (a.id === id ? { ...a, isConfigured: !a.isConfigured } : a));
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

  // Milestone Completion (Synced to database)
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
  const totalAcquiredItems =
    bags.filter((b) => b.isBought).length +
    devices.filter((d) => d.isBought).length +
    wardrobe.filter((w) => w.isBought).length;
  const totalPackedItems =
    bags.filter((b) => b.isPacked).length +
    devices.filter((d) => d.isPacked).length +
    wardrobe.filter((w) => w.isPacked).length;

  const acquiredPercent = Math.round((totalAcquiredItems / (totalPhysicalItems || 1)) * 100);
  const packedPercent = Math.round((totalPackedItems / (totalPhysicalItems || 1)) * 100);
  const dualTotalPercent = acquiredPercent + packedPercent; // out of 200%

  const unboughtCount =
    bags.filter((b) => !b.isBought).length +
    devices.filter((d) => !d.isBought).length +
    wardrobe.filter((w) => !w.isBought).length;

  const packedDocs = documents.filter((d) => d.isPacked).length;
  const doneSteps = procedureSteps.filter((s) => s.isDone).length;
  const configuredApps = apps.filter((a) => a.isConfigured).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans overflow-x-hidden">
      {/* 1. APPLE STYLE TRANSLUCENT TOP NAVIGATION BAR */}
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 w-full transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <button
            type="button"
            onClick={() => navigateToView('overview')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#003580] text-white flex items-center justify-center font-black text-xs shadow-xs">
              NP
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                Navini's Travel Plan
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">
                Colombo &rarr; Shanghai &rarr; Haikou
              </span>
            </div>
          </button>

          {/* Quick Action Pills + Hamburger Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold"
              title="All checklists and records are safely preserved"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden sm:inline">Active & Saved</span>
            </div>

            <button
              type="button"
              onClick={() => setShowTaxiModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors shadow-2xs"
            >
              Taxi Pocket Card
            </button>

            {/* Hamburger Button for Apple Sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* OVERVIEW VIEW */}
        {currentView === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* SECTION 1: MODERN STUDENT PROFILE CARD (Separate, No Frame) */}
            <section>
              <StudentProfileCard
                passportInfo={passportInfo}
                onUpdatePassportInfo={handleUpdatePassportInfo}
              />
            </section>

            {/* SECTION 2: TRIP.COM FLIGHT CARD IN THE MIDDLE */}
            <section>
              <FlightItineraryCard />
            </section>

            {/* SECTION 3: THREE CLEAN SQUARE HUB CARDS */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hub 1: Physical Gear & Wardrobe */}
                <button
                  type="button"
                  onClick={() => navigateToView('physical')}
                  className="p-6 rounded-3xl border border-slate-200/90 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003580] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#003580] group-hover:text-white transition-colors">
                        <Luggage className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#003580] transition-colors" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors">
                      Luggage, Clothes & Tech
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      4 bags allocation, clothing wardrobe studio, and connected electronics.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600 font-semibold">
                      Readiness: <strong>{dualTotalPercent}/200%</strong>
                    </span>
                    {unboughtCount > 0 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                        {unboughtCount} To Buy
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        All Owned
                      </span>
                    )}
                  </div>
                </button>

                {/* Hub 2: Documents & Campus Steps */}
                <button
                  type="button"
                  onClick={() => navigateToView('documents')}
                  className="p-6 rounded-3xl border border-slate-200/90 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#003580] group-hover:text-white transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#003580] transition-colors" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors">
                      Documents & Campus Steps
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      Original credentials, physical exam forms, and alterable early registration steps.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600 font-semibold">
                      {packedDocs}/{documents.length} Docs Packed
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {doneSteps}/{procedureSteps.length} Steps Done
                    </span>
                  </div>
                </button>

                {/* Hub 3: Internet, Apps & Buddy Chat */}
                <button
                  type="button"
                  onClick={() => navigateToView('connectivity')}
                  className="p-6 rounded-3xl border border-slate-200/90 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#003580] group-hover:text-white transition-colors">
                        <Globe2 className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#003580] transition-colors" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors">
                      Internet, Apps & Chat
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      Bypass proxies, stock academic AI apps, and pre-written WeChat templates.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600 font-semibold">
                      {configuredApps}/{apps.length} Apps Ready
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      WeChat Ready
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

        {/* SUB-HUB 1: PHYSICAL GEAR & WARDROBE (FULL VIEW) */}
        {currentView === 'physical' && (
          <PhysicalHub
            onBack={() => navigateToView('overview')}
            wardrobe={wardrobe}
            bags={bags}
            devices={devices}
            onToggleWardrobeBought={toggleWardrobeBought}
            onToggleWardrobePacked={toggleWardrobePacked}
            onAddWardrobeItem={handleAddWardrobeItem}
            onUpdateWardrobeItem={handleUpdateWardrobeItem}
            onDeleteWardrobeItem={handleDeleteWardrobeItem}
            onToggleBagBought={toggleBagBought}
            onToggleBagPacked={toggleBagPacked}
            onToggleDeviceBought={toggleDeviceBought}
            onToggleDevicePacked={toggleDevicePacked}
          />
        )}

        {/* SUB-HUB 2: DOCUMENTS & PROCEDURES (FULL VIEW) */}
        {currentView === 'documents' && (
          <DocumentationHub
            onBack={() => navigateToView('overview')}
            documents={documents}
            procedureSteps={procedureSteps}
            onToggleDocReady={toggleDocReady}
            onToggleDocPacked={toggleDocPacked}
            onAddDoc={handleAddDoc}
            onUpdateDoc={handleUpdateDoc}
            onDeleteDoc={handleDeleteDoc}
            onToggleStepDone={toggleStepDone}
            onAddStep={handleAddStep}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
          />
        )}

        {/* SUB-HUB 3: CONNECTIVITY, APPS & CHAT (FULL VIEW) */}
        {currentView === 'connectivity' && (
          <CommunicationHub
            onBack={() => navigateToView('overview')}
            apps={apps}
            onToggleAppInstalled={toggleAppInstalled}
            onToggleAppConfigured={toggleAppConfigured}
            onAddApp={handleAddApp}
            onDeleteApp={handleDeleteApp}
            onOpenTaxiModal={() => setShowTaxiModal(true)}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <div>Hainan University (Haidian Campus) • School of Food Science and Engineering (2026–2029)</div>
        <div className="mt-1">
          Student: Parana Gamage Navini Ravishka Priyantha • E-Ticket: 7812903731438 • Admission: 263660001
        </div>
      </footer>

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
        checklistItems={procedureSteps.map((p) => ({
          id: p.id,
          category: p.stage,
          label: p.title,
          detail: p.detail,
          tag: p.carryBag,
          isChecked: p.isDone,
        }))}
        wardrobeItems={wardrobe}
        onImportJson={() => {}}
      />
    </div>
  );
}

export default App;
