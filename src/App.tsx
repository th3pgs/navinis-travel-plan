import React, { useState, useEffect } from 'react';
import {
  Plane,
  Download,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Luggage,
} from 'lucide-react';

import {
  ChecklistItem,
  WardrobeItem,
  INITIAL_CHECKLIST_ITEMS,
  INITIAL_WARDROBE_ITEMS,
} from './data';
import { supabase, isSupabaseConfigured } from './supabase';
import { AuthGate } from './components/AuthGate';
import { TaxiCardModal } from './components/TaxiCardModal';
import { MultiDeviceMatrix } from './components/MultiDeviceMatrix';
import { WardrobeManager } from './components/WardrobeManager';
import { OfflineBackupModal } from './components/OfflineBackupModal';
import { LuggageWarningBanner } from './components/LuggageWarningBanner';
import { GoldenStrategyTable } from './components/GoldenStrategyTable';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('navini_auth_unlocked') === 'true';
  });

  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Local Mode');

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('navini_checklist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_CHECKLIST_ITEMS.map((initItem) => {
          const found = parsed.find((p: ChecklistItem) => p.id === initItem.id);
          return found ? { ...initItem, isChecked: found.isChecked } : initItem;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('navini_wardrobe');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WARDROBE_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('navini_checklist', JSON.stringify(checklistItems));
  }, [checklistItems]);

  useEffect(() => {
    localStorage.setItem('navini_wardrobe', JSON.stringify(wardrobeItems));
  }, [wardrobeItems]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsCloudSynced(false);
      setSyncStatus('Local Mode');
      return;
    }

    async function syncFromSupabase() {
      if (!supabase) return;
      try {
        setSyncStatus('Connecting...');
        const { data: dbChecklist, error: cErr } = await supabase
          .from('checklist_items')
          .select('*');

        if (!cErr && dbChecklist && dbChecklist.length > 0) {
          setChecklistItems((prev) => {
            const dbMap = new Map(dbChecklist.map((item: any) => [item.id, item.is_checked]));
            return prev.map((item) => ({
              ...item,
              isChecked: dbMap.has(item.id) ? Boolean(dbMap.get(item.id)) : item.isChecked,
            }));
          });
        }

        const { data: dbWardrobe, error: wErr } = await supabase
          .from('wardrobe_items')
          .select('*');

        if (!wErr && dbWardrobe && dbWardrobe.length > 0) {
          const mappedWardrobe: WardrobeItem[] = dbWardrobe.map((row: any) => ({
            id: row.id,
            name: row.name,
            category: row.category,
            quantity: row.quantity || 1,
            targetBag: row.target_bag || '65cm Main Suitcase',
            isBought: Boolean(row.is_bought),
            isPacked: Boolean(row.is_packed),
            notes: row.notes,
          }));
          setWardrobeItems(mappedWardrobe);
        }

        setIsCloudSynced(true);
        setSyncStatus('Cloud Synced');
      } catch (err) {
        setIsCloudSynced(false);
        setSyncStatus('Local Mode');
      }
    }

    syncFromSupabase();
  }, []);

  const toggleChecklist = async (id: string) => {
    const updated = checklistItems.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setChecklistItems(updated);

    const target = updated.find((item) => item.id === id);
    if (supabase && target) {
      try {
        await supabase.from('checklist_items').upsert({
          id: target.id,
          category: target.category,
          label: target.label,
          is_checked: target.isChecked,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        // quiet fallback
      }
    }
  };

  const toggleWardrobeBought = async (id: string) => {
    const updated = wardrobeItems.map((item) =>
      item.id === id ? { ...item, isBought: !item.isBought } : item
    );
    setWardrobeItems(updated);

    const target = updated.find((i) => i.id === id);
    if (supabase && target) {
      supabase.from('wardrobe_items').upsert({
        id: target.id,
        name: target.name,
        category: target.category,
        quantity: target.quantity,
        is_bought: target.isBought,
        is_packed: target.isPacked,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const toggleWardrobePacked = async (id: string) => {
    const updated = wardrobeItems.map((item) =>
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    );
    setWardrobeItems(updated);

    const target = updated.find((i) => i.id === id);
    if (supabase && target) {
      supabase.from('wardrobe_items').upsert({
        id: target.id,
        name: target.name,
        category: target.category,
        quantity: target.quantity,
        is_bought: target.isBought,
        is_packed: target.isPacked,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const handleAddWardrobeItem = async (newItem: Omit<WardrobeItem, 'id'>) => {
    const id = 'custom-' + Date.now();
    const item: WardrobeItem = { ...newItem, id };
    const updated = [item, ...wardrobeItems];
    setWardrobeItems(updated);

    if (supabase) {
      supabase.from('wardrobe_items').upsert({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        is_bought: item.isBought,
        is_packed: item.isPacked,
      });
    }
  };

  const handleDeleteWardrobeItem = async (id: string) => {
    const updated = wardrobeItems.filter((i) => i.id !== id);
    setWardrobeItems(updated);

    if (supabase) {
      supabase.from('wardrobe_items').delete().eq('id', id);
    }
  };

  const handleImportJson = (data: { checklistItems: ChecklistItem[]; wardrobeItems: WardrobeItem[] }) => {
    setChecklistItems(data.checklistItems);
    setWardrobeItems(data.wardrobeItems);
  };

  if (!isUnlocked) {
    return <AuthGate onUnlock={() => setIsUnlocked(true)} />;
  }

  const bankingItems = checklistItems.filter((i) => i.category === 'banking');
  const phase2TransitItems = checklistItems.filter((i) => i.category === 'phase2-transit');
  const phase3ArrivalItems = checklistItems.filter((i) => i.category === 'phase3-arrival');
  const documentItems = checklistItems.filter((i) => i.category === 'registration-docs');

  const totalTasks = checklistItems.length;
  const completedTasks = checklistItems.filter((i) => i.isChecked).length;
  const globalProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* 1. TOP HEADER (Booking.com Style Navy Header) */}
      <header className="bg-[#003580] text-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight">Navini's Travel Plan</span>
            <span className="hidden sm:inline text-xs text-blue-200 border-l border-blue-400/40 pl-3">
              Colombo (CMB) to Haikou (HAK)
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <a href="#banking" className="px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              Banking Prep
            </a>
            <a href="#devices" className="px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              Device Matrix
            </a>
            <a href="#wardrobe" className="px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              Wardrobe Inventory
            </a>
            <a href="#transit" className="px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              PVG Transit
            </a>
            <a href="#arrival" className="px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
              Campus Arrival
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTaxiModal(true)}
              className="px-3 py-1.5 rounded bg-[#febb02] hover:bg-[#e5a800] text-slate-900 font-bold text-xs transition-colors"
            >
              Taxi Destination Card
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="px-3 py-1.5 rounded border border-white/30 hover:bg-white/10 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline Copy</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER / SUMMARY BAR */}
      <div className="bg-[#00224f] text-white py-4 px-4 sm:px-6 border-b border-blue-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <div className="font-semibold text-sm">
              Parana Gamage Navini Ravishka Priyantha
            </div>
            <div className="text-blue-200">
              Admission Notice: <span className="font-mono text-white font-medium">263660001</span> | E-Ticket: <span className="font-mono text-white font-medium">7812903731438</span> | PNR: <span className="font-mono text-white font-medium">JKZ2YN</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-blue-300 block text-[11px]">Tasks Verified</span>
              <span className="font-mono font-bold text-sm">{completedTasks} / {totalTasks} ({globalProgress}%)</span>
            </div>
            <div className="w-24 bg-blue-900/60 rounded-full h-2 overflow-hidden border border-blue-700/50">
              <div
                className="bg-[#febb02] h-full"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FLIGHT ITINERARY SUMMARY CARD */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Leg 1: International</span>
            <div className="text-sm font-bold text-slate-900">China Eastern MU6018</div>
            <div className="text-xs text-slate-600">Colombo (CMB) &rarr; Shanghai Pudong (PVG T1)</div>
            <div className="text-xs text-slate-500 font-mono">Dep: Nov 8, 20:50 | Arr: Nov 9, 06:05</div>
          </div>

          <div className="space-y-1 md:pl-4 pt-3 md:pt-0">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Leg 2: Domestic Transfer</span>
            <div className="text-sm font-bold text-slate-900">China Eastern MU6381</div>
            <div className="text-xs text-slate-600">Shanghai Pudong (PVG T1) &rarr; Haikou (HAK T1)</div>
            <div className="text-xs text-slate-500 font-mono">Dep: Nov 9, 10:55 | Arr: Nov 9, 14:35</div>
          </div>

          <div className="space-y-1 md:pl-4 pt-3 md:pt-0">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Checked Baggage</span>
            <div className="text-sm font-bold text-slate-900">2 Pieces (23kg each)</div>
            <div className="text-xs text-slate-600">Bag 1 (65cm) & Bag 2 (58cm)</div>
            <div className="text-xs text-emerald-700 font-medium">Both checked in at CMB</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* SECTION 1: BANKING PREPARATION */}
        <section id="banking" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. Sri Lanka Banking & Financial Protocol</h2>
              <p className="text-xs text-slate-500">Must be finalized with BOC, People's Bank, and NSB before Friday Nov 6 close</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              Friday Bank Deadline
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
            {bankingItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-4 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  item.isChecked ? 'bg-slate-50/60' : ''
                }`}
              >
                {/* Front Checkbox */}
                <div className="pt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-semibold ${item.isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    {item.tag && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  {item.detail && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: MULTI-DEVICE MATRIX */}
        <section id="devices">
          <MultiDeviceMatrix items={checklistItems} onToggle={toggleChecklist} />
        </section>

        {/* SECTION 3: LUGGAGE WARNING & STRATEGY */}
        <section className="space-y-4">
          <LuggageWarningBanner />
          <GoldenStrategyTable />
        </section>

        {/* SECTION 4: EXCEL-STYLE WARDROBE INVENTORY */}
        <section id="wardrobe">
          <WardrobeManager
            items={wardrobeItems}
            onToggleBought={toggleWardrobeBought}
            onTogglePacked={toggleWardrobePacked}
            onAddItem={handleAddWardrobeItem}
            onDeleteItem={handleDeleteWardrobeItem}
          />
        </section>

        {/* SECTION 5: FLIGHT DAY & SHANGHAI PVG TRANSIT */}
        <section id="transit" className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900">2. Flight Day & Shanghai PVG Transit Protocol</h2>
            <p className="text-xs text-slate-500">Step-by-step procedure during the 4-hour 50-minute layover at Terminal 1</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
            {phase2TransitItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-4 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  item.isChecked ? 'bg-slate-50/60' : ''
                }`}
              >
                {/* Front Checkbox */}
                <div className="pt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-semibold ${item.isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Step {idx + 1}</span>
                  </div>
                  {item.detail && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: HAIKOU ARRIVAL & REGISTRATION */}
        <section id="arrival" className="space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">3. Haikou Meilan Arrival & Campus Registration</h2>
              <p className="text-xs text-slate-500">Terminal 1 arrival at 14:35 — Offices close strictly between 17:00 and 17:30</p>
            </div>
            <button
              onClick={() => setShowTaxiModal(true)}
              className="px-3 py-1 bg-[#003580] hover:bg-[#00224f] text-white text-xs font-semibold rounded"
            >
              Open Taxi Card
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
            {phase3ArrivalItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-4 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                  item.isChecked ? 'bg-slate-50/60' : ''
                }`}
              >
                {/* Front Checkbox */}
                <div className="pt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-semibold ${item.isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Step {idx + 1}</span>
                  </div>
                  {item.detail && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Documents Checklist */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Mandatory Registration Documents (Carry in Backpack & Fanny Pack Only)</h4>
              <p className="text-xs text-slate-500">Never pack these inside checked baggage</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {documentItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded border border-slate-200 flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                    item.isChecked ? 'bg-slate-50/60' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-semibold ${item.isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    {item.detail && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <div>Hainan University (Haidian Campus) • School of Food Science and Engineering (2026–2029)</div>
        <div className="mt-1">Student: Parana Gamage Navini Ravishka Priyantha • E-Ticket: 7812903731438</div>
      </footer>

      {/* MODALS */}
      <TaxiCardModal isOpen={showTaxiModal} onClose={() => setShowTaxiModal(false)} />
      <OfflineBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        checklistItems={checklistItems}
        wardrobeItems={wardrobeItems}
        onImportJson={handleImportJson}
      />
    </div>
  );
}

export default App;
