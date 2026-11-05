import React, { useState } from 'react';
import { DocumentItem, ProcedureStep, BankingTaskItem, INITIAL_BANKING_TASKS } from '../data';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Edit3,
  Check,
  FolderCheck,
  ListTodo,
  Info,
  Shield,
  FileCheck,
  CreditCard,
  Landmark,
  Coins,
  MapPin,
  Building,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface DocumentationHubProps {
  onBack: () => void;
  documents: DocumentItem[];
  procedureSteps: ProcedureStep[];
  bankingTasks?: BankingTaskItem[];
  onToggleDocReady: (id: string) => void;
  onToggleDocPacked: (id: string) => void;
  onAddDoc: (doc: Omit<DocumentItem, 'id'>) => void;
  onUpdateDoc: (id: string, updated: Partial<DocumentItem>) => void;
  onDeleteDoc: (id: string) => void;
  onToggleStepDone?: (id: string) => void;
  onAddStep?: (step: Omit<ProcedureStep, 'id' | 'isDone'>) => void;
  onUpdateStep?: (id: string, updated: Partial<ProcedureStep>) => void;
  onDeleteStep?: (id: string) => void;
  onToggleBankingTask?: (id: string) => void;
  onAddBankingTask?: (task: Omit<BankingTaskItem, 'id'>) => void;
  onUpdateBankingTask?: (id: string, updated: Partial<BankingTaskItem>) => void;
  onDeleteBankingTask?: (id: string) => void;
}

// Official Sri Lankan Bank Brand Logos & Badges
export function renderBankLogo(bankName: string) {
  if (bankName.includes('BOC') || bankName.includes('Ceylon')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-black border-2 border-amber-500 flex flex-col items-center justify-center p-1 shadow-2xs shrink-0">
        <span className="text-[10px] font-black text-amber-400 font-serif leading-none tracking-tight">BOC</span>
        <span className="text-[6px] font-bold text-amber-500/80 uppercase mt-0.5">Ceylon</span>
      </div>
    );
  }
  if (bankName.includes("People's")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#881337] border-2 border-amber-400 flex flex-col items-center justify-center p-1 shadow-2xs shrink-0">
        <span className="text-[10px] font-black text-amber-300 font-serif leading-none tracking-tight">PB</span>
        <span className="text-[6px] font-bold text-amber-200/80 uppercase mt-0.5">People's</span>
      </div>
    );
  }
  if (bankName.includes('NSB') || bankName.includes('Savings')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] border-2 border-orange-500 flex flex-col items-center justify-center p-1 shadow-2xs shrink-0">
        <span className="text-[10px] font-black text-orange-400 font-sans leading-none tracking-tight">NSB</span>
        <span className="text-[6px] font-bold text-orange-300/80 uppercase mt-0.5">Savings</span>
      </div>
    );
  }
  // General Cash Reserve Stash
  return (
    <div className="w-10 h-10 rounded-xl bg-emerald-800 border-2 border-emerald-400 flex flex-col items-center justify-center p-1 shadow-2xs shrink-0">
      <span className="text-xs font-black text-emerald-200 font-mono leading-none">¥ / $</span>
      <span className="text-[6px] font-bold text-emerald-300/80 uppercase mt-0.5">Cash</span>
    </div>
  );
}

export const DocumentationHub: React.FC<DocumentationHubProps> = ({
  onBack,
  documents,
  procedureSteps,
  bankingTasks: propsBankingTasks,
  onToggleDocReady,
  onToggleDocPacked,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
  onToggleStepDone,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onToggleBankingTask: propsToggleBanking,
  onAddBankingTask: propsAddBanking,
  onUpdateBankingTask: propsUpdateBanking,
  onDeleteBankingTask: propsDeleteBanking,
}) => {
  // Navigation: 'overview' | 'banking' | 'vault' | 'steps'
  const [currentSubView, setCurrentSubView] = useState<'overview' | 'banking' | 'vault' | 'steps'>('overview');
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);

  // Local Banking Tasks state fallback
  const [localBankingTasks, setLocalBankingTasks] = useState<BankingTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('navini_banking_tasks_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BANKING_TASKS;
  });

  const activeBankingTasks = propsBankingTasks || localBankingTasks;

  const handleToggleBankTask = (id: string) => {
    if (propsToggleBanking) {
      propsToggleBanking(id);
    } else {
      const updated = localBankingTasks.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t));
      setLocalBankingTasks(updated);
      localStorage.setItem('navini_banking_tasks_v5', JSON.stringify(updated));
    }
  };

  const handleAddBankTaskSubmit = (task: Omit<BankingTaskItem, 'id'>) => {
    if (propsAddBanking) {
      propsAddBanking(task);
    } else {
      const newT: BankingTaskItem = { ...task, id: `bank-${Date.now()}` };
      const updated = [...localBankingTasks, newT];
      setLocalBankingTasks(updated);
      localStorage.setItem('navini_banking_tasks_v5', JSON.stringify(updated));
    }
  };

  const handleUpdateBankTaskSubmit = (id: string, updatedFields: Partial<BankingTaskItem>) => {
    if (propsUpdateBanking) {
      propsUpdateBanking(id, updatedFields);
    } else {
      const updated = localBankingTasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
      setLocalBankingTasks(updated);
      localStorage.setItem('navini_banking_tasks_v5', JSON.stringify(updated));
    }
  };

  const handleDeleteBankTaskSubmit = (id: string) => {
    if (propsDeleteBanking) {
      propsDeleteBanking(id);
    } else {
      const updated = localBankingTasks.filter((t) => t.id !== id);
      setLocalBankingTasks(updated);
      localStorage.setItem('navini_banking_tasks_v5', JSON.stringify(updated));
    }
  };

  // Bank Form State
  const [showAddBankTask, setShowAddBankTask] = useState(false);
  const [newBank, setNewBank] = useState<BankingTaskItem['bank']>('Bank of Ceylon (BOC)');
  const [newBankTitle, setNewBankTitle] = useState('');
  const [newBankDetail, setNewBankDetail] = useState('');
  const [newBankPriority, setNewBankPriority] = useState<BankingTaskItem['priority']>('Critical');

  const [editingBankTaskId, setEditingBankTaskId] = useState<string | null>(null);
  const [editBank, setEditBank] = useState<BankingTaskItem['bank']>('Bank of Ceylon (BOC)');
  const [editBankTitle, setEditBankTitle] = useState('');
  const [editBankDetail, setEditBankDetail] = useState('');
  const [editBankPriority, setEditBankPriority] = useState<BankingTaskItem['priority']>('Critical');

  // Document Forms
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocIssuer, setNewDocIssuer] = useState('');
  const [newDocLocation, setNewDocLocation] = useState('A4 Waterproof Folder (Cabin Backpack)');
  const [newDocPriority, setNewDocPriority] = useState<DocumentItem['priority']>('High');
  const [newDocNotes, setNewDocNotes] = useState('');

  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editDocTitle, setEditDocTitle] = useState('');
  const [editDocIssuer, setEditDocIssuer] = useState('');
  const [editDocLocation, setEditDocLocation] = useState('');
  const [editDocPriority, setEditDocPriority] = useState<DocumentItem['priority']>('High');
  const [editDocNotes, setEditDocNotes] = useState('');

  // Step Form State (for Action Guide edit mode)
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editStepTitle, setEditStepTitle] = useState('');
  const [editStepDetail, setEditStepDetail] = useState('');
  const [editStepCarryBag, setEditStepCarryBag] = useState('');

  // Metrics
  const packedDocsCount = documents.filter((d) => d.isPacked).length;
  const criticalDocsCount = documents.filter((d) => d.priority === 'Critical').length;
  const docProgress = Math.round((packedDocsCount / (documents.length || 1)) * 100);

  const doneBankingCount = activeBankingTasks.filter((t) => t.isDone).length;
  const bankingProgress = Math.round((doneBankingCount / (activeBankingTasks.length || 1)) * 100);

  const handleStartEditDoc = (doc: DocumentItem) => {
    setEditingDocId(doc.id);
    setEditDocTitle(doc.title);
    setEditDocIssuer(doc.issuer);
    setEditDocLocation(doc.carryLocation);
    setEditDocPriority(doc.priority);
    setEditDocNotes(doc.notes);
  };

  const handleSaveDocEdit = (id: string) => {
    if (!editDocTitle.trim()) return;
    onUpdateDoc(id, {
      title: editDocTitle.trim(),
      issuer: editDocIssuer.trim(),
      carryLocation: editDocLocation.trim(),
      priority: editDocPriority,
      notes: editDocNotes.trim(),
    });
    setEditingDocId(null);
  };

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    onAddDoc({
      title: newDocTitle.trim(),
      issuer: newDocIssuer.trim() || 'Official Authority',
      carryLocation: newDocLocation,
      priority: newDocPriority,
      notes: newDocNotes.trim(),
      isReady: true,
      isPacked: false,
    });
    setNewDocTitle('');
    setNewDocIssuer('');
    setNewDocNotes('');
    setShowAddDoc(false);
  };

  const handleStartEditBankTask = (t: BankingTaskItem) => {
    setEditingBankTaskId(t.id);
    setEditBank(t.bank);
    setEditBankTitle(t.title);
    setEditBankDetail(t.detail);
    setEditBankPriority(t.priority || 'High');
  };

  const handleSaveBankTaskEdit = (id: string) => {
    if (!editBankTitle.trim()) return;
    handleUpdateBankTaskSubmit(id, {
      bank: editBank,
      title: editBankTitle.trim(),
      detail: editBankDetail.trim(),
      priority: editBankPriority,
    });
    setEditingBankTaskId(null);
  };

  const handleAddBankTaskFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankTitle.trim()) return;
    handleAddBankTaskSubmit({
      bank: newBank,
      title: newBankTitle.trim(),
      detail: newBankDetail.trim(),
      priority: newBankPriority,
      isDone: false,
    });
    setNewBankTitle('');
    setNewBankDetail('');
    setShowAddBankTask(false);
  };

  const handleStartEditStep = (step: ProcedureStep) => {
    setEditingStepId(step.id);
    setEditStepTitle(step.title);
    setEditStepDetail(step.detail);
    setEditStepCarryBag(step.carryBag || '');
  };

  const handleSaveStepEdit = (id: string) => {
    if (!editStepTitle.trim()) return;
    if (onUpdateStep) {
      onUpdateStep(id, {
        title: editStepTitle.trim(),
        detail: editStepDetail.trim(),
        carryBag: editStepCarryBag.trim() || undefined,
      });
    }
    setEditingStepId(null);
  };

  // Group banking tasks by bank
  const bankGroups: { name: BankingTaskItem['bank']; tasks: BankingTaskItem[] }[] = [
    {
      name: 'General / Cash Stash',
      tasks: activeBankingTasks.filter((t) => t.bank === 'General / Cash Stash'),
    },
    {
      name: 'Bank of Ceylon (BOC)',
      tasks: activeBankingTasks.filter((t) => t.bank === 'Bank of Ceylon (BOC)'),
    },
    {
      name: "People's Bank",
      tasks: activeBankingTasks.filter((t) => t.bank === "People's Bank"),
    },
    {
      name: 'National Savings Bank (NSB)',
      tasks: activeBankingTasks.filter((t) => t.bank === 'National Savings Bank (NSB)'),
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* 1. iOS STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentSubView === 'overview') {
              onBack();
            } else {
              setCurrentSubView('overview');
            }
          }}
          className="text-[#007AFF] text-base font-medium flex items-center gap-0.5 active:opacity-60 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>{currentSubView === 'overview' ? 'Overview' : 'Documents & Banking'}</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          {currentSubView === 'overview' && 'Documents & Banking'}
          {currentSubView === 'banking' && 'Friday Morning Bank Run'}
          {currentSubView === 'vault' && 'Document Vault'}
          {currentSubView === 'steps' && 'Campus Arrival Guide'}
        </h1>

        {currentSubView !== 'overview' ? (
          <button
            type="button"
            onClick={() => setIsSectionEditMode(!isSectionEditMode)}
            className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity cursor-pointer"
          >
            {isSectionEditMode ? 'Done' : 'Edit'}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      {/* ========================================================= */}
      {/* VIEW A: OVERVIEW (TOP BANKING WIDGET + VAULT + STEPS)     */}
      {/* ========================================================= */}
      {currentSubView === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 block">
            Friday Financial Procedures & Document Clearance
          </span>

          {/* WIDGET 1: BANKING INFORMATION & FRIDAY MORNING BANK RUN (Requirement #2A) */}
          <button
            type="button"
            onClick={() => setCurrentSubView('banking')}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group space-y-3.5 border-l-4 border-l-amber-500 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  🏦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Banking Information & Friday Morning Bank Run
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-100 text-amber-900">
                      Friday Nov 6
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    BOC, People's Bank & NSB overseas authorizations, 3DS cards & physical USD/CNY stash.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{bankingProgress}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{doneBankingCount}/{activeBankingTasks.length} Tasks Done</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </div>

            {/* Dynamic Progress Bar (starts at 0%) */}
            <div className="w-full bg-[#E5E5EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${bankingProgress}%` }}
              />
            </div>

            {/* Bank Logos Preview Strip */}
            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {renderBankLogo('BOC')}
                {renderBankLogo("People's")}
                {renderBankLogo('NSB')}
                {renderBankLogo('Cash')}
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                ⏰ Deadline: Before 3:00 PM Branch Closing
              </span>
            </div>
          </button>

          {/* WIDGET 2: DOCUMENT VAULT WIDGET */}
          <button
            type="button"
            onClick={() => setCurrentSubView('vault')}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  📂
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                    Document Vault
                  </h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    Original credentials, passport with X1 visa, medical report & JW202 form.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{docProgress}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{packedDocsCount}/{documents.length} Packed</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${docProgress}%` }}
              />
            </div>

            <div className="pt-1 border-t border-black/5 flex items-center justify-between text-xs text-[#8E8E93] flex-wrap gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                {criticalDocsCount} Critical Pass Documents
              </span>
              <span className="text-[11px] font-medium text-slate-600">
                📁 A4 Waterproof Folder (Cabin Carry-On)
              </span>
            </div>
          </button>

          {/* WIDGET 3: CAMPUS REGISTRATION & ARRIVAL GUIDE (READ-ONLY VISUAL ACTION GUIDE) */}
          <button
            type="button"
            onClick={() => setCurrentSubView('steps')}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  📋
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Hainan University Arrival Action Guide
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      Visual Guide
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    Numbered 4-step arrival protocol from Haikou Meilan Airport to campus dorm.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </div>

            <div className="pt-1 border-t border-black/5 flex items-center justify-between text-xs text-[#8E8E93]">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                4 Calm Action Cards (No Checkbox Penalties)
              </span>
              <span className="text-[11px] font-medium text-slate-600">
                📍 Haidian Campus South Gate (No. 58 Renmin Ave)
              </span>
            </div>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: BANKING INFORMATION & FRIDAY BANK RUN FULL VIEW   */}
      {/* ========================================================= */}
      {currentSubView === 'banking' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card p-4 space-y-2 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Friday Morning Bank Run (Nov 6)
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {doneBankingCount} of {activeBankingTasks.length} Financial Tasks Done
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-amber-600">{bankingProgress}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${bankingProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>BOC, People's Bank, NSB & Cash Conversion</span>
              <button
                type="button"
                onClick={() => setShowAddBankTask(true)}
                className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Add Bank Task Form */}
          {showAddBankTask && (
            <form onSubmit={handleAddBankTaskFormSubmit} className="ios-card p-4 space-y-3 bg-amber-50/40 border-amber-200">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800">Add Bank Task</h4>
                <button
                  type="button"
                  onClick={() => setShowAddBankTask(false)}
                  className="text-xs text-[#8E8E93] hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Institution</label>
                  <select
                    value={newBank}
                    onChange={(e) => setNewBank(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  >
                    <option value="General / Cash Stash">General / Cash Stash</option>
                    <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                    <option value="People's Bank">People's Bank</option>
                    <option value="National Savings Bank (NSB)">National Savings Bank (NSB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newBankTitle}
                    onChange={(e) => setNewBankTitle(e.target.value)}
                    placeholder="e.g. Card Whitelisting for China"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Procedure Details</label>
                <textarea
                  value={newBankDetail}
                  onChange={(e) => setNewBankDetail(e.target.value)}
                  placeholder="Exact steps and requirements at the branch counter"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF] text-xs"
                  rows={2}
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-amber-600 text-white text-xs font-semibold shadow-xs hover:bg-amber-700"
                >
                  Save Bank Task
                </button>
              </div>
            </form>
          )}

          {/* Grouped Bank Procedures */}
          <div className="space-y-4">
            {bankGroups.map((group) => {
              if (group.tasks.length === 0) return null;

              return (
                <div key={group.name} className="space-y-2">
                  <div className="flex items-center gap-2.5 px-1">
                    {renderBankLogo(group.name)}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{group.name}</h3>
                      <span className="text-[11px] text-[#8E8E93]">
                        {group.tasks.filter((t) => t.isDone).length} of {group.tasks.length} Cleared
                      </span>
                    </div>
                  </div>

                  <div className="ios-card divide-y divide-black/5 overflow-hidden">
                    {group.tasks.map((task) => {
                      const isEditing = editingBankTaskId === task.id;

                      return (
                        <div key={task.id} className="p-3.5 space-y-2 bg-white">
                          {isEditing ? (
                            <div className="space-y-2 text-xs">
                              <input
                                type="text"
                                value={editBankTitle}
                                onChange={(e) => setEditBankTitle(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-black/10 font-bold"
                              />
                              <textarea
                                value={editBankDetail}
                                onChange={(e) => setEditBankDetail(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-black/10 text-xs"
                                rows={2}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingBankTaskId(null)}
                                  className="px-3 py-1 rounded-full text-xs text-[#8E8E93]"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveBankTaskEdit(task.id)}
                                  className="px-3 py-1 rounded-full bg-[#007AFF] text-white text-xs font-semibold"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  {isSectionEditMode && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteBankTaskSubmit(task.id)}
                                      className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                                      title="Delete task"
                                    >
                                      <Minus className="w-3 h-3 stroke-[3]" />
                                    </button>
                                  )}
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                    {task.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {task.detail}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                                {isSectionEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditBankTask(task)}
                                    className="text-[#007AFF] text-xs font-semibold"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleToggleBankTask(task.id)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    task.isDone
                                      ? 'bg-amber-500 text-white shadow-xs'
                                      : 'border-2 border-slate-300 hover:border-amber-500 bg-white'
                                  }`}
                                >
                                  {task.isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW C: DOCUMENT VAULT FULL VIEW                          */}
      {/* ========================================================= */}
      {currentSubView === 'vault' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Vault Readiness
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {packedDocsCount} of {documents.length} Documents Packed & Ready
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{docProgress}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${docProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>Never place original certificates in checked baggage</span>
              <button
                type="button"
                onClick={() => setShowAddDoc(true)}
                className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Document</span>
              </button>
            </div>
          </div>

          {/* Add Doc Form */}
          {showAddDoc && (
            <form onSubmit={handleAddDocSubmit} className="ios-card p-4 space-y-3 bg-blue-50/40 border-[#007AFF]/30">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#007AFF]">New Official Document</h4>
                <button
                  type="button"
                  onClick={() => setShowAddDoc(false)}
                  className="text-xs text-[#8E8E93] hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Document Title</label>
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Admission Notice Page 1 & 2"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={newDocIssuer}
                    onChange={(e) => setNewDocIssuer(e.target.value)}
                    placeholder="e.g. Hainan University"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Carry Location</label>
                  <input
                    type="text"
                    value={newDocLocation}
                    onChange={(e) => setNewDocLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newDocPriority}
                    onChange={(e) => setNewDocPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notes & Requirements</label>
                <textarea
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF] text-xs"
                  rows={2}
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#007AFF] text-white text-xs font-semibold shadow-xs hover:bg-[#007AFF]/90"
                >
                  Save Document
                </button>
              </div>
            </form>
          )}

          {/* Document Inset List */}
          <div className="ios-card divide-y divide-black/5 overflow-hidden">
            {documents.map((doc) => {
              const isEditing = editingDocId === doc.id;

              return (
                <div key={doc.id} className="p-3.5 sm:p-4 space-y-2 bg-white">
                  {isEditing ? (
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        value={editDocTitle}
                        onChange={(e) => setEditDocTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-black/10 font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editDocIssuer}
                          onChange={(e) => setEditDocIssuer(e.target.value)}
                          placeholder="Issuer"
                          className="px-3 py-1.5 rounded-lg border border-black/10"
                        />
                        <input
                          type="text"
                          value={editDocLocation}
                          onChange={(e) => setEditDocLocation(e.target.value)}
                          placeholder="Location"
                          className="px-3 py-1.5 rounded-lg border border-black/10"
                        />
                      </div>
                      <textarea
                        value={editDocNotes}
                        onChange={(e) => setEditDocNotes(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-black/10 text-xs"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingDocId(null)}
                          className="px-3 py-1 rounded-full text-xs text-[#8E8E93]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveDocEdit(doc.id)}
                          className="px-3 py-1 rounded-full bg-[#007AFF] text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isSectionEditMode && (
                            <button
                              type="button"
                              onClick={() => onDeleteDoc(doc.id)}
                              className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                              title="Delete doc"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                          )}
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {doc.title}
                          </h4>
                          {doc.priority === 'Critical' && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-red-50 text-red-700 border border-red-200">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {doc.notes}
                        </p>
                        <span className="text-[11px] text-[#8E8E93] block">
                          📍 {doc.carryLocation}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        {isSectionEditMode && (
                          <button
                            type="button"
                            onClick={() => handleStartEditDoc(doc)}
                            className="text-[#007AFF] text-xs font-semibold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onToggleDocPacked(doc.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            doc.isPacked
                              ? 'bg-[#007AFF] text-white shadow-xs'
                              : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                          }`}
                        >
                          {doc.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW D: CAMPUS ARRIVAL ACTION GUIDE (READ-ONLY, NO CHECKS)*/}
      {/* ========================================================= */}
      {currentSubView === 'steps' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Calm Guidance Banner */}
          <div className="ios-card p-4 sm:p-5 border-l-4 border-l-[#34C759] space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Post-Flight Arrival & Campus Registration Protocol
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                Action Guide
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Read-only sequential guide for when you land in Haikou. Calm, clear action cards—no checkboxes to tick or progress bar penalties.
            </p>
          </div>

          {/* 4 Numbered Action Cards (Requirement #3) */}
          <div className="space-y-3.5">
            {procedureSteps.map((step, idx) => {
              const isEditing = editingStepId === step.id;

              return (
                <div
                  key={step.id}
                  className="ios-card p-4 sm:p-5 space-y-2.5 bg-white border border-black/5 hover:border-black/10 transition-all shadow-xs"
                >
                  {isEditing ? (
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        value={editStepTitle}
                        onChange={(e) => setEditStepTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-black/10 font-bold"
                      />
                      <textarea
                        value={editStepDetail}
                        onChange={(e) => setEditStepDetail(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-black/10 text-xs"
                        rows={3}
                      />
                      <input
                        type="text"
                        value={editStepCarryBag}
                        onChange={(e) => setEditStepCarryBag(e.target.value)}
                        placeholder="Carry location / touchpoint"
                        className="w-full px-3 py-1.5 rounded-lg border border-black/10 text-xs"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingStepId(null)}
                          className="px-3 py-1 rounded-full text-xs text-[#8E8E93]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveStepEdit(step.id)}
                          className="px-3 py-1 rounded-full bg-[#007AFF] text-white text-xs font-semibold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Step Number Circle */}
                          <div className="w-8 h-8 rounded-full bg-[#007AFF] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                              {step.title}
                            </h3>
                            <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                              {step.category}
                            </span>
                          </div>
                        </div>

                        {step.carryBag && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#007AFF] border border-blue-100 shrink-0">
                            📍 {step.carryBag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed bg-[#F2F2F7] p-3 rounded-xl border border-black/5">
                        {step.detail}
                      </p>

                      {isSectionEditMode && (
                        <div className="pt-2 border-t border-black/5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleStartEditStep(step)}
                            className="text-[#007AFF] text-xs font-semibold flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Step</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
