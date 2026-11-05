import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertCircle,
  Menu,
  X,
  Luggage,
  FileText,
  Wifi,
  Sparkles,
  Plane,
  ChevronRight,
} from 'lucide-react';

import {
  TimelineEvent,
  WardrobeItem,
  DeviceAsset,
  BagAsset,
  InternetAppItem,
  INITIAL_TIMELINE,
  INITIAL_WARDROBE_ITEMS,
  INITIAL_DEVICES,
  INITIAL_BAGS,
  INITIAL_INTERNET_APPS,
} from './data';
import { AuthGate } from './components/AuthGate';
import { TaxiCardModal } from './components/TaxiCardModal';
import { OfflineBackupModal } from './components/OfflineBackupModal';
import { HardwareOverviewBar } from './components/HardwareOverviewBar';
import { ChronoTimelineView } from './components/ChronoTimelineView';
import { DressUpWardrobeModal } from './components/DressUpWardrobeModal';
import { InternetModal } from './components/InternetModal';
import { DocumentsModal } from './components/DocumentsModal';
import { UniversityBuddyCard } from './components/UniversityBuddyCard';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('navini_auth_unlocked') === 'true';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 3 Main Pathway Modals + Utilities
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showInternetModal, setShowInternetModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showBuddyModal, setShowBuddyModal] = useState(false);

  // States
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('navini_timeline_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_TIMELINE;
  });

  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('navini_wardrobe_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_WARDROBE_ITEMS;
  });

  const [devices, setDevices] = useState<DeviceAsset[]>(() => {
    const saved = localStorage.getItem('navini_devices_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_DEVICES;
  });

  const [bags, setBags] = useState<BagAsset[]>(() => {
    const saved = localStorage.getItem('navini_bags_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BAGS;
  });

  const [internetApps, setInternetApps] = useState<InternetAppItem[]>(() => {
    const saved = localStorage.getItem('navini_apps_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_INTERNET_APPS;
  });

  // Local storage auto-sync
  useEffect(() => {
    localStorage.setItem('navini_timeline_v3', JSON.stringify(timelineEvents));
  }, [timelineEvents]);

  useEffect(() => {
    localStorage.setItem('navini_wardrobe_v3', JSON.stringify(wardrobeItems));
  }, [wardrobeItems]);

  useEffect(() => {
    localStorage.setItem('navini_devices_v3', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('navini_bags_v3', JSON.stringify(bags));
  }, [bags]);

  useEffect(() => {
    localStorage.setItem('navini_apps_v3', JSON.stringify(internetApps));
  }, [internetApps]);

  // Handlers
  const handleToggleTimelineItem = (eventId: string, itemId: string) => {
    setTimelineEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const updatedItems = ev.items.map((it) =>
          it.id === itemId ? { ...it, isDone: !it.isDone } : it
        );
        const allDone = updatedItems.every((i) => i.isDone);
        return {
          ...ev,
          items: updatedItems,
          isPacked: allDone,
        };
      })
    );
  };

  const toggleDeviceBought = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isBought: !d.isBought } : d))
    );
  };

  const toggleBagBought = (id: string) => {
    setBags((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isBought: !b.isBought } : b))
    );
  };

  const toggleWardrobeBought = (id: string) => {
    setWardrobeItems((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isBought: !w.isBought } : w))
    );
  };

  const toggleWardrobePacked = (id: string) => {
    setWardrobeItems((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isPacked: !w.isPacked } : w))
    );
  };

  const handleAddWardrobeItem = (newItem: Omit<WardrobeItem, 'id'>) => {
    const item: WardrobeItem = { ...newItem, id: 'w-custom-' + Date.now() };
    setWardrobeItems((prev) => [item, ...prev]);
  };

  const handleUpdateWardrobeItem = (id: string, updated: Partial<WardrobeItem>) => {
    setWardrobeItems((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
  };

  const handleDeleteWardrobeItem = (id: string) => {
    setWardrobeItems((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleAppInstalled = (id: string) => {
    setInternetApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isInstalled: !a.isInstalled } : a))
    );
  };

  const toggleAppConfigured = (id: string) => {
    setInternetApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isConfigured: !a.isConfigured } : a))
    );
  };

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  // Stats
  const packedClothes = wardrobeItems.filter((w) => w.isPacked).length;
  const totalClothes = wardrobeItems.length;

  const totalTimelineTasks = timelineEvents.reduce((acc, ev) => acc + ev.items.length, 0);
  const doneTimelineTasks = timelineEvents.reduce(
    (acc, ev) => acc + ev.items.filter((i) => i.isDone).length,
    0
  );
  const globalProgress = Math.round((doneTimelineTasks / (totalTimelineTasks || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans overflow-x-hidden">
      {/* 1. TOP STICKY HEADER (Booking.com style) */}
      <header className="bg-[#003580] text-white shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-bold text-base sm:text-lg tracking-tight truncate">
              Navini's Travel Plan
            </span>
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

      {/* 2. BOOKING.COM FLIGHT ITINERARY HEADER SUMMARY */}
      <div className="bg-[#00224f] text-white py-4 px-4 sm:px-6 border-b border-blue-950 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span>Parana Gamage Navini Ravishka Priyantha</span>
              <span className="px-2 py-0.2 rounded bg-blue-900/80 text-blue-200 text-[10px] uppercase font-semibold">
                Master's Program
              </span>
            </div>
            <div className="text-blue-200 text-[11px]">
              E-Ticket: <span className="font-mono text-white">7812903731438</span> • PNR: <span className="font-mono text-white">JKZ2YN</span> • Admission Notice: <span className="font-mono text-white">263660001</span>
            </div>
            <div className="text-slate-300 text-[11px] flex items-center gap-2 pt-0.5">
              <span>China Eastern <strong>MU6018</strong> (CMB 20:50 &rarr; PVG 06:05)</span>
              <span>&rarr;</span>
              <span><strong>MU6381</strong> (PVG 10:55 &rarr; HAK 14:35)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-blue-300 block text-[10px] uppercase font-bold">Overall Journey Readiness</span>
              <span className="font-mono font-bold text-sm">
                {doneTimelineTasks} / {totalTimelineTasks} Tasks ({globalProgress}%)
              </span>
            </div>
            <div className="w-24 bg-blue-950 rounded-full h-2 overflow-hidden border border-blue-800">
              <div
                className="bg-[#febb02] h-full transition-all duration-300"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. THREE MAIN SQUARE BUTTON PATHWAYS (Packed, Documentation, Internet) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Button 1: Packed & Wardrobe Studio */}
          <button
            onClick={() => setShowWardrobeModal(true)}
            className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex items-start gap-4 group"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003580] group-hover:bg-[#003580] group-hover:text-white transition-colors shrink-0">
              <Luggage className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-[#003580]">
                  Pathway 1
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {packedClothes}/{totalClothes} Packed
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Wardrobe & Luggage
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Dress-up style interactive clothing studio, 4 bags allocation, and unbought items check.
              </p>
            </div>
          </button>

          {/* Button 2: Mandatory Documentation */}
          <button
            onClick={() => setShowDocumentsModal(true)}
            className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex items-start gap-4 group"
          >
            <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-[#003580] group-hover:text-white transition-colors shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
                  Pathway 2
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  A4 Folder + Fanny
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Official Documents
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Passport, X1 Visa, JW202, hospital medical stamps, blood test slips, and degree notarizations.
              </p>
            </div>
          </button>

          {/* Button 3: Internet & Communication */}
          <button
            onClick={() => setShowInternetModal(true)}
            className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#003580] hover:shadow-md transition-all text-left flex items-start gap-4 group"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-[#003580] group-hover:text-white transition-colors shrink-0">
              <Wifi className="w-7 h-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                  Pathway 3
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  GFW Bypass
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Internet & Devices
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Shadowrocket, Saily eSIM, v2rayNG, Clash Verge Rev, Google Suite & stock AI research apps.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. HARDWARE & 4-BAG OVERVIEW WIDGET (Top overview as requested) */}
      <div className="pt-4">
        <HardwareOverviewBar
          devices={devices}
          bags={bags}
          onToggleDeviceBought={toggleDeviceBought}
          onToggleBagBought={toggleBagBought}
        />
      </div>

      {/* 5. MAIN CONTENT AREA: VERTICAL LINE & DOTS TIMELINE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Direct Contact Buddy Helper Card */}
        <div id="buddy-advice">
          <UniversityBuddyCard />
        </div>

        {/* Chronological Timeline */}
        <section id="timeline">
          <ChronoTimelineView
            events={timelineEvents}
            onToggleItemDone={handleToggleTimelineItem}
            onOpenBuddyModal={() => {
              const el = document.getElementById('buddy-advice');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <div>Hainan University (Haidian Campus) • School of Food Science and Engineering (2026–2029)</div>
        <div className="mt-1">Student: Parana Gamage Navini Ravishka Priyantha • E-Ticket: 7812903731438</div>
      </footer>

      {/* INTERACTIVE MODALS */}
      <DressUpWardrobeModal
        isOpen={showWardrobeModal}
        onClose={() => setShowWardrobeModal(false)}
        items={wardrobeItems}
        bags={bags}
        onToggleBought={toggleWardrobeBought}
        onTogglePacked={toggleWardrobePacked}
        onAddItem={handleAddWardrobeItem}
        onUpdateItem={handleUpdateWardrobeItem}
        onDeleteItem={handleDeleteWardrobeItem}
      />

      <DocumentsModal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
      />

      <InternetModal
        isOpen={showInternetModal}
        onClose={() => setShowInternetModal(false)}
        apps={internetApps}
        onToggleInstalled={toggleAppInstalled}
        onToggleConfigured={toggleAppConfigured}
      />

      <TaxiCardModal
        isOpen={showTaxiModal}
        onClose={() => setShowTaxiModal(false)}
      />

      <OfflineBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        checklistItems={timelineEvents.flatMap((ev) =>
          ev.items.map((i) => ({
            id: i.id,
            category: ev.title,
            label: i.label,
            detail: i.detail,
            tag: i.targetBag,
            isChecked: i.isDone,
          }))
        )}
        wardrobeItems={wardrobeItems}
        onImportJson={() => {}}
      />
    </div>
  );
}

export default App;
