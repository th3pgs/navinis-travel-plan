import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertCircle,
  FileCheck,
  Check,
  Edit,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

import {
  TaskItem,
  WardrobeItem,
  DeviceAsset,
  BagAsset,
  INITIAL_TASKS,
  INITIAL_WARDROBE_ITEMS,
  INITIAL_DEVICES,
  INITIAL_BAGS,
} from './data';
import { supabase, isSupabaseConfigured } from './supabase';
import { AuthGate } from './components/AuthGate';
import { TaxiCardModal } from './components/TaxiCardModal';
import { WardrobeManager } from './components/WardrobeManager';
import { OfflineBackupModal } from './components/OfflineBackupModal';
import { HardwareOverviewBar } from './components/HardwareOverviewBar';
import { StageTaskManager } from './components/StageTaskManager';
import { UniversityBuddyCard } from './components/UniversityBuddyCard';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('navini_auth_unlocked') === 'true';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Data states
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('navini_tasks_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TASKS;
  });

  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('navini_wardrobe_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WARDROBE_ITEMS;
  });

  const [devices, setDevices] = useState<DeviceAsset[]>(() => {
    const saved = localStorage.getItem('navini_devices_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_DEVICES;
  });

  const [bags, setBags] = useState<BagAsset[]>(() => {
    const saved = localStorage.getItem('navini_bags_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BAGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('navini_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('navini_wardrobe_v2', JSON.stringify(wardrobeItems));
  }, [wardrobeItems]);

  useEffect(() => {
    localStorage.setItem('navini_devices_v2', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('navini_bags_v2', JSON.stringify(bags));
  }, [bags]);

  // Task Handlers
  const toggleTaskReady = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isReady: !t.isReady } : t))
    );
  };

  const toggleTaskPacked = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPacked: !t.isPacked } : t))
    );
  };

  const handleAddTask = (taskData: Omit<TaskItem, 'id' | 'status' | 'isReady' | 'isPacked'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: 'task-custom-' + Date.now(),
      status: 'pending',
      isReady: false,
      isPacked: false,
      isEditable: true,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: string, updated: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Device & Bag Bought Toggles
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
      prev.map((item) => (item.id === id ? { ...item, isBought: !item.isBought } : item))
    );
  };

  const toggleWardrobePacked = (id: string) => {
    setWardrobeItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
    );
  };

  const handleAddWardrobeItem = (newItem: Omit<WardrobeItem, 'id'>) => {
    const item: WardrobeItem = { ...newItem, id: 'w-custom-' + Date.now() };
    setWardrobeItems((prev) => [item, ...prev]);
  };

  const handleUpdateWardrobeItem = (id: string, updated: Partial<WardrobeItem>) => {
    setWardrobeItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteWardrobeItem = (id: string) => {
    setWardrobeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleImportJson = (data: any) => {
    if (data.tasks) setTasks(data.tasks);
    if (data.wardrobeItems) setWardrobeItems(data.wardrobeItems);
  };

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  // Filter tasks by Chronological Stage
  const prepSriLankaTasks = tasks.filter((t) => t.stage === 'prep-srilanka');
  const airportCmbTasks = tasks.filter((t) => t.stage === 'airport-cmb');
  const transitPvgTasks = tasks.filter((t) => t.stage === 'transit-pvg');
  const flightHakTasks = tasks.filter((t) => t.stage === 'flight-hak');
  const arrivalCampusTasks = tasks.filter((t) => t.stage === 'arrival-campus');

  // Overall statistics
  const totalTasks = tasks.length;
  const packedTasks = tasks.filter((t) => t.isPacked).length;
  const readyTasks = tasks.filter((t) => t.isReady).length;
  const globalProgress = Math.round((packedTasks / (totalTasks || 1)) * 100);

  // Packed bags status count
  const mainBagPacked = wardrobeItems.some((w) => w.targetBag.includes('30×40×70') && w.isPacked);
  const medBagPacked = wardrobeItems.some((w) => w.targetBag.includes('27×41×57') && w.isPacked);
  const backpackPacked = tasks.some((t) => t.location?.includes('Backpack') && t.isPacked);
  const fannyPackPacked = tasks.some((t) => t.location?.includes('Fanny Pack') && t.isPacked);
  const packedBagsCount = [mainBagPacked, medBagPacked, backpackPacked, fannyPackPacked].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans overflow-x-hidden">
      {/* 1. TOP STICKY HEADER (Responsive & Overflow-Proof) */}
      <header className="bg-[#003580] text-white shadow-sm sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-bold text-base sm:text-lg tracking-tight truncate">
              Navini's Travel Plan
            </span>
            <span className="hidden md:inline text-xs text-blue-200 border-l border-blue-400/40 pl-3">
              Master Mission Control (CMB &rarr; PVG &rarr; HAK)
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-medium">
            <a href="#prep-srilanka" className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors">
              1. Sri Lanka Prep
            </a>
            <a href="#airport-cmb" className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors">
              2. CMB Airport
            </a>
            <a href="#transit-pvg" className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors">
              3. Shanghai PVG
            </a>
            <a href="#flight-hak" className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors">
              4. Haikou Landing
            </a>
            <a href="#arrival-campus" className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors">
              5. University & Dorm
            </a>
            <a href="#wardrobe" className="px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors">
              Wardrobe
            </a>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowTaxiModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded bg-[#febb02] hover:bg-[#e5a800] text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-xs"
            >
              Taxi Destination Card
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded border border-white/30 hover:bg-white/10 text-white font-medium text-xs transition-colors flex items-center gap-1 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Copy</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded hover:bg-white/10 text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#00224f] border-t border-blue-900 px-4 py-3 space-y-1 text-xs">
            <a
              href="#prep-srilanka"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-100 hover:text-white"
            >
              1. Sri Lanka Preparation & Documents
            </a>
            <a
              href="#airport-cmb"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-100 hover:text-white"
            >
              2. Colombo Airport (CMB) Departure
            </a>
            <a
              href="#transit-pvg"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-100 hover:text-white"
            >
              3. Shanghai PVG Transit & Bag Re-Check
            </a>
            <a
              href="#flight-hak"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-100 hover:text-white"
            >
              4. Haikou Meilan Airport & Taxi
            </a>
            <a
              href="#arrival-campus"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-100 hover:text-white"
            >
              5. Hainan University & Dorm Registration
            </a>
            <a
              href="#wardrobe"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-100 hover:text-white"
            >
              6. Wardrobe & Packing Inventory
            </a>
          </div>
        )}
      </header>

      {/* 2. SUB-HEADER SUMMARY BAR */}
      <div className="bg-[#00224f] text-white py-3 px-4 sm:px-6 border-b border-blue-950 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 min-w-0">
            <div className="font-semibold text-sm truncate">
              Parana Gamage Navini Ravishka Priyantha
            </div>
            <div className="text-blue-200 text-[11px] truncate">
              E-Ticket: <span className="font-mono text-white">7812903731438</span> • PNR: <span className="font-mono text-white">JKZ2YN</span> • Admission Notice: <span className="font-mono text-white">263660001</span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-blue-300 block text-[10px] uppercase font-bold">Overall Packing Status</span>
              <span className="font-mono font-bold text-xs sm:text-sm">
                {readyTasks} Ready • {packedTasks} Packed ({globalProgress}%)
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

      {/* 3. VISUAL HARDWARE & LUGGAGE SPECIFICATION BAR (Top Overview Widget) */}
      <HardwareOverviewBar
        devices={devices}
        bags={bags}
        onToggleDeviceBought={toggleDeviceBought}
        onToggleBagBought={toggleBagBought}
      />

      {/* 4. FLIGHT TRANSIT SUMMARY CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Flight 1 (International)</span>
            <div className="text-sm font-bold text-slate-900">China Eastern MU6018 (Airbus A330)</div>
            <div className="text-slate-600">Colombo (CMB) &rarr; Shanghai Pudong (PVG T1)</div>
            <div className="text-slate-500 font-mono text-[11px]">Departure: Sunday Nov 8 at 20:50 • Arrival: Nov 9 at 06:05</div>
          </div>

          <div className="space-y-1 md:pl-4 pt-3 md:pt-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Flight 2 (Domestic Transfer)</span>
            <div className="text-sm font-bold text-slate-900">China Eastern MU6381 (Boeing 737)</div>
            <div className="text-slate-600">Shanghai Pudong (PVG T1) &rarr; Haikou (HAK T1)</div>
            <div className="text-slate-500 font-mono text-[11px]">Departure: Nov 9 at 10:55 • Arrival: Nov 9 at 14:35</div>
          </div>

          <div className="space-y-1 md:pl-4 pt-3 md:pt-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Checked Baggage Allowance</span>
            <div className="text-sm font-bold text-slate-900">2 Free Checked Bags (23kg each)</div>
            <div className="text-slate-700 font-mono text-[11px]">Bag 1: 30×40×70 cm • Bag 2: 27×41×57 cm</div>
            <div className="text-emerald-700 font-medium">Re-check required during Shanghai PVG layover</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* DIRECT BUDDY COORDINATION & AIRPORT TAXI QUERY WIDGET */}
        <section id="buddy-advice">
          <UniversityBuddyCard />
        </section>
        {/* ========================================================= */}
        {/* STAGE 1: PREPARATION IN SRI LANKA                         */}
        {/* ========================================================= */}
        <section id="prep-srilanka" className="space-y-3">
          <StageTaskManager
            stageId="prep-srilanka"
            stageTitle="1. Preparation in Sri Lanka (Documents, Banking, Apps)"
            stageSubtitle="Complete all branch approvals before Friday close and ensure documents are physically inside bags"
            stageBadge="Pre-Departure"
            badgeColor="bg-red-50 text-red-700 border-red-200"
            tasks={prepSriLankaTasks}
            onToggleReady={toggleTaskReady}
            onTogglePacked={toggleTaskPacked}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* ========================================================= */}
        {/* STAGE 2: COLOMBO AIRPORT (CMB) PROCEDURE                  */}
        {/* ========================================================= */}
        <section id="airport-cmb" className="space-y-3">
          <StageTaskManager
            stageId="airport-cmb"
            stageTitle="2. Colombo Airport (CMB) Departure Procedure"
            stageSubtitle="Check-in desk protocol, bag drop for both suitcases, and cabin security scan"
            stageBadge="Sunday Nov 8 • 20:50"
            badgeColor="bg-blue-50 text-blue-700 border-blue-200"
            tasks={airportCmbTasks}
            onToggleReady={toggleTaskReady}
            onTogglePacked={toggleTaskPacked}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* ========================================================= */}
        {/* STAGE 3: SHANGHAI PVG TRANSIT PROCEDURE                   */}
        {/* ========================================================= */}
        <section id="transit-pvg" className="space-y-3">
          <StageTaskManager
            stageId="transit-pvg"
            stageTitle="3. Shanghai PVG International-to-Domestic Transit"
            stageSubtitle="4-hour 50-minute layover at Terminal 1: Immigration, baggage re-claim, customs, and transfer drop"
            stageBadge="PVG T1 Layover"
            badgeColor="bg-amber-50 text-amber-800 border-amber-200"
            tasks={transitPvgTasks}
            onToggleReady={toggleTaskReady}
            onTogglePacked={toggleTaskPacked}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* ========================================================= */}
        {/* STAGE 4: HAIKOU AIRPORT (HAK) ARRIVAL                     */}
        {/* ========================================================= */}
        <section id="flight-hak" className="space-y-3">
          <StageTaskManager
            stageId="flight-hak"
            stageTitle="4. Haikou Meilan Airport (HAK T1) Arrival & Taxi Queue"
            stageSubtitle="100% domestic arrival at 14:35 — Official airport taxi stand to Hainan University Haidian campus"
            stageBadge="Arrival Nov 9 • 14:35"
            badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
            tasks={flightHakTasks}
            onToggleReady={toggleTaskReady}
            onTogglePacked={toggleTaskPacked}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* ========================================================= */}
        {/* STAGE 5: CAMPUS ARRIVAL, DORM & REGISTRATION (EDITABLE)  */}
        {/* ========================================================= */}
        <section id="arrival-campus" className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">Flexible Registration & Dorm Schedule Note:</strong>
              Because arrival timing and campus schedules may adjust depending on university arrangements, all steps in this section are <strong>fully editable</strong>. Click the edit icon to adjust the campus gate, dorm building, or registration times as communicated by Ms. Sun or your buddy.
            </div>
          </div>

          <StageTaskManager
            stageId="arrival-campus"
            stageTitle="5. Hainan University Campus, Dormitory & Registration"
            stageSubtitle="Haidian Campus (人民大道58号) • International Student Dormitory • School of International Education"
            stageBadge="Editable Schedule"
            badgeColor="bg-purple-50 text-purple-800 border-purple-200"
            tasks={arrivalCampusTasks}
            onToggleReady={toggleTaskReady}
            onTogglePacked={toggleTaskPacked}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>

        {/* ========================================================= */}
        {/* STAGE 6: EXCEL-STYLE WARDROBE & PACKING MANAGER           */}
        {/* ========================================================= */}
        <section id="wardrobe" className="space-y-3">
          <WardrobeManager
            items={wardrobeItems}
            onToggleBought={toggleWardrobeBought}
            onTogglePacked={toggleWardrobePacked}
            onAddItem={handleAddWardrobeItem}
            onUpdateItem={handleUpdateWardrobeItem}
            onDeleteItem={handleDeleteWardrobeItem}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <div>Hainan University (Haidian Campus) • School of Food Science and Engineering (2026–2029)</div>
        <div className="mt-1">Student: Parana Gamage Navini Ravishka Priyantha • E-Ticket: 7812903731438</div>
      </footer>

      {/* MODALS */}
      <TaxiCardModal isOpen={showTaxiModal} onClose={() => setShowTaxiModal(false)} />
      <OfflineBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        checklistItems={tasks.map((t) => ({
          id: t.id,
          category: t.stage as any,
          label: t.title,
          detail: t.detail,
          tag: t.category,
          isChecked: t.isPacked,
        }))}
        wardrobeItems={wardrobeItems}
        onImportJson={handleImportJson}
      />
    </div>
  );
}

export default App;
