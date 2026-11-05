import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertCircle,
  Luggage,
  FileText,
  Wifi,
  Plane,
  ChevronRight,
  Camera,
  User,
  ShieldCheck,
  Calendar,
  CreditCard,
  Check,
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

import { AuthGate } from './components/AuthGate';
import { PhysicalHub } from './components/PhysicalHub';
import { DocumentationHub } from './components/DocumentationHub';
import { CommunicationHub } from './components/CommunicationHub';
import { HardwareOverviewBar } from './components/HardwareOverviewBar';
import { TimelineOverview } from './components/TimelineOverview';
import { TaxiCardModal } from './components/TaxiCardModal';
import { OfflineBackupModal } from './components/OfflineBackupModal';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('navini_auth_unlocked') === 'true';
  });

  // Current Sub-View Routing: 'overview' | 'physical' | 'documents' | 'connectivity'
  const [currentView, setCurrentView] = useState<'overview' | 'physical' | 'documents' | 'connectivity'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['physical', 'documents', 'connectivity'].includes(hash)) {
      return hash as any;
    }
    return 'overview';
  });

  // Modals
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPassportEditor, setShowPassportEditor] = useState(false);

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

  // State Management with LocalStorage persistence
  const [bags, setBags] = useState<BagAsset[]>(() => {
    const saved = localStorage.getItem('navini_bags_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_BAGS;
  });

  const [devices, setDevices] = useState<DeviceAsset[]>(() => {
    const saved = localStorage.getItem('navini_devices_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DEVICES;
  });

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('navini_wardrobe_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_WARDROBE;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('navini_docs_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DOCUMENTS;
  });

  const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>(() => {
    const saved = localStorage.getItem('navini_procedure_steps_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_PROCEDURE_STEPS;
  });

  const [apps, setApps] = useState<AppConfigItem[]>(() => {
    const saved = localStorage.getItem('navini_apps_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_APPS;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem('navini_milestones_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_MILESTONES;
  });

  // Student Passport & Photo Profile
  const [passportInfo, setPassportInfo] = useState<{
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  }>(() => {
    const saved = localStorage.getItem('navini_passport_profile_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      passportNumber: 'N10385921',
      expiryDate: '2034-08-15',
    };
  });

  // LocalStorage Auto-Sync
  useEffect(() => {
    localStorage.setItem('navini_bags_v4', JSON.stringify(bags));
  }, [bags]);

  useEffect(() => {
    localStorage.setItem('navini_devices_v4', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('navini_wardrobe_v4', JSON.stringify(wardrobe));
  }, [wardrobe]);

  useEffect(() => {
    localStorage.setItem('navini_docs_v4', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('navini_procedure_steps_v4', JSON.stringify(procedureSteps));
  }, [procedureSteps]);

  useEffect(() => {
    localStorage.setItem('navini_apps_v4', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('navini_milestones_v4', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('navini_passport_profile_v4', JSON.stringify(passportInfo));
  }, [passportInfo]);

  // Handlers for Physical Hub
  const toggleBagBought = (id: string) => {
    setBags((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isBought: !b.isBought } : b))
    );
  };

  const toggleBagPacked = (id: string) => {
    setBags((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPacked: !b.isPacked } : b))
    );
  };

  const toggleDeviceBought = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isBought: !d.isBought } : d))
    );
  };

  const toggleDevicePacked = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked } : d))
    );
  };

  const toggleWardrobeBought = (id: string) => {
    setWardrobe((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isBought: !w.isBought } : w))
    );
  };

  const toggleWardrobePacked = (id: string) => {
    setWardrobe((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isPacked: !w.isPacked } : w))
    );
  };

  const handleAddWardrobeItem = (item: Omit<WardrobeItem, 'id'>) => {
    const newItem: WardrobeItem = { ...item, id: 'w-custom-' + Date.now() };
    setWardrobe((prev) => [newItem, ...prev]);
  };

  const handleUpdateWardrobeItem = (id: string, updated: Partial<WardrobeItem>) => {
    setWardrobe((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
  };

  const handleDeleteWardrobeItem = (id: string) => {
    setWardrobe((prev) => prev.filter((w) => w.id !== id));
  };

  // Handlers for Documentation Hub
  const toggleDocReady = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isReady: !d.isReady } : d))
    );
  };

  const toggleDocPacked = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked } : d))
    );
  };

  const handleAddDoc = (doc: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = { ...doc, id: 'doc-custom-' + Date.now() };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleUpdateDoc = (id: string, updated: Partial<DocumentItem>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleStepDone = (id: string) => {
    setProcedureSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isDone: !s.isDone } : s))
    );
  };

  const handleAddStep = (step: Omit<ProcedureStep, 'id' | 'isDone'>) => {
    const newStep: ProcedureStep = { ...step, id: 'step-custom-' + Date.now(), isDone: false };
    setProcedureSteps((prev) => [...prev, newStep]);
  };

  const handleUpdateStep = (id: string, updated: Partial<ProcedureStep>) => {
    setProcedureSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const handleDeleteStep = (id: string) => {
    setProcedureSteps((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for Communication Hub
  const toggleAppInstalled = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isInstalled: !a.isInstalled } : a))
    );
  };

  const toggleAppConfigured = (id: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isConfigured: !a.isConfigured } : a))
    );
  };

  // Milestone Handler
  const toggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setPassportInfo((prev) => ({ ...prev, photoUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  // High-level statistics
  const unboughtBags = bags.filter((b) => !b.isBought).length;
  const unboughtDevices = devices.filter((d) => !d.isBought).length;
  const unboughtWardrobe = wardrobe.filter((w) => !w.isBought).length;
  const totalUnbought = unboughtBags + unboughtDevices + unboughtWardrobe;

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

  const readyDocs = documents.filter((d) => d.isReady).length;
  const packedDocs = documents.filter((d) => d.isPacked).length;
  const doneSteps = procedureSteps.filter((s) => s.isDone).length;
  const configuredApps = apps.filter((a) => a.isConfigured).length;
  const completedMilestones = milestones.filter((m) => m.isCompleted).length;

  // Global Readiness calculation
  const totalCheckpoints = procedureSteps.length + milestones.length;
  const completedCheckpoints = doneSteps + completedMilestones;
  const globalReadinessPercent = Math.round((completedCheckpoints / (totalCheckpoints || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans overflow-x-hidden">
      {/* 1. TOP STICKY HEADER (Booking.com style) */}
      <header className="bg-[#003580] text-white shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigateToView('overview')}
              className="font-bold text-base sm:text-lg tracking-tight truncate hover:opacity-90 text-left"
            >
              Navini's Travel Plan
            </button>
            <span className="hidden md:inline text-xs text-blue-200 border-l border-blue-400/40 pl-3">
              Master Mission Control • Colombo &rarr; Haikou
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowTaxiModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#febb02] hover:bg-[#e5a800] text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-xs"
            >
              Taxi Pocket Card
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/30 hover:bg-white/10 text-white font-medium text-xs transition-colors flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Copy</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. STUDENT PROFILE & BOOKING.COM FLIGHT ITINERARY HEADER */}
      <div className="bg-[#00224f] text-white py-4 px-4 sm:px-6 border-b border-blue-950 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          {/* Left: Student Identity with Reserved Passport Info & Photo Upload */}
          <div className="flex items-start gap-3.5">
            {/* Passport Photo Upload / Avatar Placeholder */}
            <div className="relative group shrink-0">
              {passportInfo.photoUrl ? (
                <img
                  src={passportInfo.photoUrl}
                  alt="Navini Passport Photo"
                  className="w-14 h-16 object-cover rounded-lg border-2 border-blue-300 shadow-xs"
                />
              ) : (
                <div className="w-14 h-16 rounded-lg border-2 border-dashed border-blue-400/60 bg-blue-900/60 flex flex-col items-center justify-center text-blue-200 text-center p-1">
                  <User className="w-5 h-5 text-blue-300" />
                  <span className="text-[8px] font-bold leading-tight mt-0.5">Photo</span>
                </div>
              )}

              {/* Upload trigger overlay */}
              <label className="absolute inset-0 bg-black/50 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
                <span>Parana Gamage Navini Ravishka Priyantha</span>
                <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px] uppercase font-semibold">
                  Master's Program
                </span>
              </div>

              <div className="text-blue-200 text-[11px] flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>School of Food Science and Engineering, Hainan University</span>
                <span>•</span>
                <span>Admission Notice: <strong className="font-mono text-white">263660001</strong></span>
              </div>

              {/* Reserved Passport Section with Inline Edit */}
              <div className="text-slate-300 text-[11px] flex flex-wrap items-center gap-2 pt-0.5">
                <span>Passport: <strong className="font-mono text-white">{passportInfo.passportNumber}</strong></span>
                <span>•</span>
                <span>Expiry: <strong className="font-mono text-white">{passportInfo.expiryDate}</strong></span>
                <button
                  type="button"
                  onClick={() => setShowPassportEditor(!showPassportEditor)}
                  className="text-[10px] text-blue-300 hover:text-white underline ml-1"
                >
                  {showPassportEditor ? 'Done' : 'Edit Passport Info'}
                </button>
              </div>

              {/* Edit form toggle */}
              {showPassportEditor && (
                <div className="mt-2 p-2 bg-blue-950/90 rounded-lg border border-blue-800 flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={passportInfo.passportNumber}
                    onChange={(e) => setPassportInfo({ ...passportInfo, passportNumber: e.target.value })}
                    className="px-2 py-1 rounded bg-blue-900 text-white font-mono border border-blue-700 text-xs"
                  />
                  <input
                    type="date"
                    value={passportInfo.expiryDate}
                    onChange={(e) => setPassportInfo({ ...passportInfo, expiryDate: e.target.value })}
                    className="px-2 py-1 rounded bg-blue-900 text-white font-mono border border-blue-700 text-xs"
                  />
                  <label className="px-2.5 py-1 rounded bg-blue-800 hover:bg-blue-700 text-white text-xs cursor-pointer">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right: Flight Details & Global Progress */}
          <div className="space-y-1.5 md:text-right shrink-0">
            <div className="text-slate-200 text-[11px]">
              E-Ticket: <strong className="font-mono text-white">7812903731438</strong> • PNR: <strong className="font-mono text-white">JKZ2YN</strong>
            </div>
            <div className="text-blue-200 text-[11px] flex md:justify-end items-center gap-2">
              <span>China Eastern <strong>MU6018</strong> (CMB 20:50 &rarr; PVG 06:05)</span>
              <span>&rarr;</span>
              <span><strong>MU6381</strong> (PVG 10:55 &rarr; HAK 14:35)</span>
            </div>
            <div className="flex items-center md:justify-end gap-3 pt-0.5">
              <span className="text-[11px] font-bold text-amber-300">
                {completedCheckpoints}/{totalCheckpoints} Milestones Cleared ({globalReadinessPercent}%)
              </span>
              <div className="w-24 bg-blue-950 rounded-full h-2 overflow-hidden border border-blue-800">
                <div
                  className="bg-[#febb02] h-full transition-all duration-300"
                  style={{ width: `${globalReadinessPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC VIEW CONTAINER: OVERVIEW vs SUB-HUBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {currentView === 'overview' && (
          <div className="space-y-6">
            {/* THREE MAIN SQUARE INTERACTIVE PATHWAY CARDS */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CARD 1: Physical Inventory & Wardrobe */}
                <button
                  type="button"
                  onClick={() => navigateToView('physical')}
                  className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex items-start gap-4 group relative"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003580] group-hover:bg-[#003580] group-hover:text-white transition-colors shrink-0">
                    <Luggage className="w-7 h-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors">
                        Physical Gear & Wardrobe
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#003580] transition-colors shrink-0" />
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      4-bag allocation (30×40×70cm, 27×41×57cm), wardrobe dress-up studio, and connected electronics.
                    </p>

                    {/* Dual Taskbar Progress Preview */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-600">
                          Readiness: <strong>{dualTotalPercent}/200%</strong>
                        </span>
                        {totalUnbought > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                            {totalUnbought} Unbought
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            All Acquired
                          </span>
                        )}
                      </div>

                      {/* Mini dual bars */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${totalUnbought > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${acquiredPercent}%` }}
                          />
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#003580] h-full"
                            style={{ width: `${packedPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* CARD 2: Official Documents & Procedures */}
                <button
                  type="button"
                  onClick={() => navigateToView('documents')}
                  className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex items-start gap-4 group relative"
                >
                  <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-[#003580] group-hover:text-white transition-colors shrink-0">
                    <FileText className="w-7 h-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors">
                        Documents & Procedures
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#003580] transition-colors shrink-0" />
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      Original passport, X1 Visa, JW202, hospital medical stamps, degree notarizations, and early arrival task editor.
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-600">
                        {packedDocs}/{documents.length} Docs Packed
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {doneSteps}/{procedureSteps.length} Steps Done
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                      <div
                        className="bg-amber-600 h-full"
                        style={{ width: `${Math.round((doneSteps / (procedureSteps.length || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* CARD 3: Connectivity & Communication */}
                <button
                  type="button"
                  onClick={() => navigateToView('connectivity')}
                  className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex items-start gap-4 group relative"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-[#003580] group-hover:text-white transition-colors shrink-0">
                    <Wifi className="w-7 h-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#003580] transition-colors">
                        Connectivity & Communication
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#003580] transition-colors shrink-0" />
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      GFW bypass (eSIM + Shadowrocket), 13 stock apps, editable iMessage buddy chat templates, and taxi pocket card.
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-600">
                        {configuredApps}/{apps.length} Apps Ready
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        iMessage Ready
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${Math.round((configuredApps / (apps.length || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* HARDWARE OVERVIEW BAR */}
            <section>
              <HardwareOverviewBar
                devices={devices}
                bags={bags}
                onToggleDeviceBought={toggleDeviceBought}
                onToggleBagBought={toggleBagBought}
              />
            </section>

            {/* SEQUENTIAL MISSION MILESTONES */}
            <section>
              <TimelineOverview
                milestones={milestones}
                onToggleMilestone={toggleMilestone}
                onNavigateToCategory={(cat) => navigateToView(cat)}
              />
            </section>
          </div>
        )}

        {/* SUB-VIEW 1: PHYSICAL GEAR & WARDROBE */}
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

        {/* SUB-VIEW 2: OFFICIAL DOCUMENTS & PROCEDURES */}
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

        {/* SUB-VIEW 3: CONNECTIVITY & COMMUNICATION */}
        {currentView === 'connectivity' && (
          <CommunicationHub
            onBack={() => navigateToView('overview')}
            apps={apps}
            onToggleAppInstalled={toggleAppInstalled}
            onToggleAppConfigured={toggleAppConfigured}
            onOpenTaxiModal={() => setShowTaxiModal(true)}
          />
        )}
      </div>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <div>Hainan University (Haidian Campus) • School of Food Science and Engineering (2026–2029)</div>
        <div className="mt-1">
          Student: Parana Gamage Navini Ravishka Priyantha • E-Ticket: 7812903731438 • Admission Notice: 263660001
        </div>
      </footer>

      {/* MODALS */}
      <TaxiCardModal
        isOpen={showTaxiModal}
        onClose={() => setShowTaxiModal(false)}
      />

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
