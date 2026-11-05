import React, { useState } from 'react';
import { DocumentItem, ProcedureStep } from '../data';
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
} from 'lucide-react';

interface DocumentationHubProps {
  onBack: () => void;
  documents: DocumentItem[];
  procedureSteps: ProcedureStep[];
  onToggleDocReady: (id: string) => void;
  onToggleDocPacked: (id: string) => void;
  onAddDoc: (doc: Omit<DocumentItem, 'id'>) => void;
  onUpdateDoc: (id: string, updated: Partial<DocumentItem>) => void;
  onDeleteDoc: (id: string) => void;
  onToggleStepDone: (id: string) => void;
  onAddStep: (step: Omit<ProcedureStep, 'id' | 'isDone'>) => void;
  onUpdateStep: (id: string, updated: Partial<ProcedureStep>) => void;
  onDeleteStep: (id: string) => void;
}

export const DocumentationHub: React.FC<DocumentationHubProps> = ({
  onBack,
  documents,
  procedureSteps,
  onToggleDocReady,
  onToggleDocPacked,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
  onToggleStepDone,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
}) => {
  // Navigation: 'overview' (2-widget entry) | 'vault' (full view) | 'steps' (full view) (Requirement #10)
  const [currentSubView, setCurrentSubView] = useState<'overview' | 'vault' | 'steps'>('overview');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);
  const [infoPopupDoc, setInfoPopupDoc] = useState<DocumentItem | null>(null);

  // New Document State
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocIssuer, setNewDocIssuer] = useState('');
  const [newDocLocation, setNewDocLocation] = useState('A4 Waterproof Folder (Cabin Backpack)');
  const [newDocPriority, setNewDocPriority] = useState<DocumentItem['priority']>('High');
  const [newDocNotes, setNewDocNotes] = useState('');

  // Edit Document State
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editDocTitle, setEditDocTitle] = useState('');
  const [editDocIssuer, setEditDocIssuer] = useState('');
  const [editDocLocation, setEditDocLocation] = useState('');
  const [editDocPriority, setEditDocPriority] = useState<DocumentItem['priority']>('High');
  const [editDocNotes, setEditDocNotes] = useState('');

  // New Step State
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepStage, setNewStepStage] = useState<ProcedureStep['stage']>('arrival-campus');
  const [newStepCategory, setNewStepCategory] = useState('Registration');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDetail, setNewStepDetail] = useState('');
  const [newStepCarryBag, setNewStepCarryBag] = useState('');

  // Edit Step State
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editStepStage, setEditStepStage] = useState<ProcedureStep['stage']>('arrival-campus');
  const [editStepCategory, setEditStepCategory] = useState('');
  const [editStepTitle, setEditStepTitle] = useState('');
  const [editStepDetail, setEditStepDetail] = useState('');
  const [editStepCarryBag, setEditStepCarryBag] = useState('');

  const stages = [
    { id: 'all', name: 'All Stages' },
    { id: 'prep-srilanka', name: '1. Sri Lanka Prep' },
    { id: 'airport-cmb', name: '2. Colombo CMB Airport' },
    { id: 'transit-pvg', name: '3. Shanghai PVG Layover' },
    { id: 'flight-hak', name: '4. Haikou HAK Arrival' },
    { id: 'arrival-campus', name: '5. University & Dorm Setup' },
  ];

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

  const handleStartEditStep = (step: ProcedureStep) => {
    setEditingStepId(step.id);
    setEditStepStage(step.stage);
    setEditStepCategory(step.category);
    setEditStepTitle(step.title);
    setEditStepDetail(step.detail);
    setEditStepCarryBag(step.carryBag || '');
  };

  const handleSaveStepEdit = (id: string) => {
    if (!editStepTitle.trim()) return;
    onUpdateStep(id, {
      stage: editStepStage,
      category: editStepCategory.trim() || 'General',
      title: editStepTitle.trim(),
      detail: editStepDetail.trim(),
      carryBag: editStepCarryBag.trim() || undefined,
    });
    setEditingStepId(null);
  };

  const handleAddStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;
    onAddStep({
      stage: newStepStage,
      category: newStepCategory.trim() || 'General',
      title: newStepTitle.trim(),
      detail: newStepDetail.trim(),
      carryBag: newStepCarryBag.trim() || undefined,
      isEditable: true,
    });
    setNewStepTitle('');
    setNewStepDetail('');
    setNewStepCarryBag('');
    setShowAddStep(false);
  };

  const handleToggleDoc = (doc: DocumentItem) => {
    if (!doc.isPacked) {
      if (!doc.isReady) onToggleDocReady(doc.id);
      onToggleDocPacked(doc.id);
    } else {
      onToggleDocPacked(doc.id);
    }
  };

  const filteredSteps = procedureSteps.filter(
    (step) => selectedStage === 'all' || step.stage === selectedStage
  );

  const packedDocsCount = documents.filter((d) => d.isPacked).length;
  const criticalDocsCount = documents.filter((d) => d.priority === 'Critical').length;
  const doneStepsCount = procedureSteps.filter((s) => s.isDone).length;
  const docProgress = Math.round((packedDocsCount / (documents.length || 1)) * 100);
  const stepProgress = Math.round((doneStepsCount / (procedureSteps.length || 1)) * 100);

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
          <span>{currentSubView === 'overview' ? 'Overview' : 'Documents & Steps'}</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          {currentSubView === 'overview' && 'Documents & Steps'}
          {currentSubView === 'vault' && 'Document Vault'}
          {currentSubView === 'steps' && 'Registration Steps'}
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
      {/* VIEW A: 2-WIDGET OVERVIEW (Requirement #10)               */}
      {/* ========================================================= */}
      {currentSubView === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 block">
            Credentials & Procedures Overview
          </span>

          {/* Widget 1: Document Vault Widget */}
          <button
            type="button"
            onClick={() => setCurrentSubView('vault')}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  📂
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                    Document Vault
                  </h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    Original credentials, passport visa, medical & JW202 certificates.
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

            {/* Clean Progress Bar */}
            <div className="w-full bg-[#E5E5EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${docProgress}%` }}
              />
            </div>

            {/* Folder Location & Critical Badges */}
            <div className="pt-1 border-t border-black/5 flex items-center justify-between text-xs text-[#8E8E93] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                  {criticalDocsCount} Critical Pass Documents
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-600">
                📁 A4 Waterproof Folder & Fanny Pack
              </span>
            </div>
          </button>

          {/* Widget 2: Campus Registration Steps Widget */}
          <button
            type="button"
            onClick={() => setCurrentSubView('steps')}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  📋
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                    Campus Registration Steps
                  </h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    Step-by-step guidance from Sri Lanka prep to dorm check-in.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{stepProgress}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{doneStepsCount}/{procedureSteps.length} Done</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            <div className="pt-1 border-t border-black/5 flex items-center justify-between text-xs text-[#8E8E93]">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                5 Structured Stages
              </span>
              <span className="text-[11px] font-medium text-slate-600">
                Next: Haikou South Gate Registration
              </span>
            </div>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: DOCUMENT VAULT FULL VIEW                          */}
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
              <span>Never place original certificates in checked bags</span>
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

          {/* Document Inset List */}
          <div className="ios-card divide-y divide-black/5 overflow-hidden">
            {documents.map((doc) => {
              const isEditing = editingDocId === doc.id;

              if (isEditing) {
                return (
                  <div key={doc.id} className="p-3.5 bg-blue-50/40 space-y-2 text-xs">
                    <span className="font-semibold text-slate-900 block">Edit Document</span>
                    <input
                      type="text"
                      value={editDocTitle}
                      onChange={(e) => setEditDocTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-black/10 rounded-lg bg-white"
                      placeholder="Document title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Issuer"
                        value={editDocIssuer}
                        onChange={(e) => setEditDocIssuer(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-black/10 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Placement"
                        value={editDocLocation}
                        onChange={(e) => setEditDocLocation(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-black/10 rounded-lg bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingDocId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveDocEdit(doc.id)}
                        className="px-3 py-1 rounded-lg bg-[#007AFF] text-white font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={doc.id}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Delete badge in edit mode */}
                    {isSectionEditMode && (
                      <button
                        type="button"
                        onClick={() => onDeleteDoc(doc.id)}
                        className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                        title="Delete document"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            doc.isPacked ? 'text-[#8E8E93] line-through' : 'text-slate-900'
                          }`}
                        >
                          {doc.title}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0 ${
                            doc.priority === 'Critical'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : doc.priority === 'High'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-[#F2F2F7] text-slate-600'
                          }`}
                        >
                          {doc.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8E8E93] flex-wrap">
                        <span>📍 {doc.carryLocation}</span>
                        <span>•</span>
                        <span>🏛️ {doc.issuer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInfoPopupDoc(doc)}
                      className="w-6 h-6 rounded-full bg-[#F2F2F7] text-slate-500 hover:text-[#007AFF] flex items-center justify-center transition-colors"
                      title="View guidelines"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {isSectionEditMode && (
                      <button
                        type="button"
                        onClick={() => handleStartEditDoc(doc)}
                        className="text-[#007AFF] text-xs font-semibold px-1 active:opacity-60"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Single Circular iOS Checkmark Circle */}
                    <button
                      type="button"
                      onClick={() => handleToggleDoc(doc)}
                      title={doc.isPacked ? 'Packed (Tap to unmark)' : 'Unpacked (Tap to mark packed)'}
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
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW C: REGISTRATION STEPS FULL VIEW                      */}
      {/* ========================================================= */}
      {currentSubView === 'steps' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Procedure Steps
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {doneStepsCount} of {procedureSteps.length} Steps Completed
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{stepProgress}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>Follow in sequence during transit and arrival</span>
              <button
                type="button"
                onClick={() => setShowAddStep(true)}
                className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>
          </div>

          {/* Stage Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {stages.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStage(st.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedStage === st.id
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-black/5 hover:bg-slate-50'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {/* Steps List */}
          <div className="ios-card divide-y divide-black/5 overflow-hidden">
            {filteredSteps.map((step) => {
              const isEditing = editingStepId === step.id;

              if (isEditing) {
                return (
                  <div key={step.id} className="p-3.5 bg-blue-50/40 space-y-2 text-xs">
                    <span className="font-semibold text-slate-900 block">Edit Procedure Step</span>
                    <input
                      type="text"
                      value={editStepTitle}
                      onChange={(e) => setEditStepTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-black/10 rounded-lg bg-white"
                      placeholder="Step title"
                    />
                    <textarea
                      rows={2}
                      value={editStepDetail}
                      onChange={(e) => setEditStepDetail(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-black/10 rounded-lg bg-white"
                      placeholder="Instructions..."
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingStepId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-black/10 text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveStepEdit(step.id)}
                        className="px-3 py-1 rounded-lg bg-[#007AFF] text-white font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.id}
                  className="p-3 sm:p-3.5 flex items-start justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {isSectionEditMode && (
                      <button
                        type="button"
                        onClick={() => onDeleteStep(step.id)}
                        className="mt-0.5 w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                        title="Delete step"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                    )}

                    {/* Step Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleStepDone(step.id)}
                      className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        step.isDone
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                      }`}
                    >
                      {step.isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-semibold ${
                            step.isDone ? 'text-[#8E8E93] line-through' : 'text-slate-900'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-[#F2F2F7] text-slate-600 border border-black/5">
                          {step.category}
                        </span>
                        {step.carryBag && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-blue-50 text-[#007AFF] border border-blue-100">
                            📍 {step.carryBag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  {isSectionEditMode && (
                    <button
                      type="button"
                      onClick={() => handleStartEditStep(step)}
                      className="text-[#007AFF] text-xs font-semibold p-1 shrink-0 active:opacity-60"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleAddDocSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 border border-black/10 text-xs"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Add Document</h3>
              <button
                type="button"
                onClick={() => setShowAddDoc(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Document Title
              </label>
              <input
                type="text"
                placeholder="e.g. Police Clearance Certificate"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                  Issuer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Police HQ"
                  value={newDocIssuer}
                  onChange={(e) => setNewDocIssuer(e.target.value)}
                  className="w-full px-2 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={newDocPriority}
                  onChange={(e) => setNewDocPriority(e.target.value as any)}
                  className="w-full px-2 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Placement
              </label>
              <select
                value={newDocLocation}
                onChange={(e) => setNewDocLocation(e.target.value)}
                className="w-full px-2 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
              >
                <option value="Fanny Pack (Worn on Chest)">Fanny Pack (Worn on Chest)</option>
                <option value="A4 Waterproof Folder (Cabin Backpack)">A4 Waterproof Folder (Cabin Backpack)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <button
                type="button"
                onClick={() => setShowAddDoc(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white font-semibold shadow-xs"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Step Modal */}
      {showAddStep && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleAddStepSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 border border-black/10 text-xs"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Add Procedure Step</h3>
              <button
                type="button"
                onClick={() => setShowAddStep(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Stage
              </label>
              <select
                value={newStepStage}
                onChange={(e) => setNewStepStage(e.target.value as any)}
                className="w-full px-2 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
              >
                <option value="prep-srilanka">1. Sri Lanka Prep</option>
                <option value="airport-cmb">2. Colombo CMB Airport</option>
                <option value="transit-pvg">3. Shanghai PVG Layover</option>
                <option value="flight-hak">4. Haikou HAK Arrival</option>
                <option value="arrival-campus">5. University & Dorm Setup</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Step Title
              </label>
              <input
                type="text"
                placeholder="e.g. Register at International Student Office"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Instructions & Details
              </label>
              <textarea
                rows={2}
                placeholder="Location, requirements, timing..."
                value={newStepDetail}
                onChange={(e) => setNewStepDetail(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <button
                type="button"
                onClick={() => setShowAddStep(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white font-semibold shadow-xs"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Guidelines Modal */}
      {infoPopupDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3 border border-black/10 text-xs">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-bold text-sm text-slate-900 truncate pr-2">
                {infoPopupDoc.title}
              </h3>
              <button
                type="button"
                onClick={() => setInfoPopupDoc(null)}
                className="text-[#007AFF] font-bold"
              >
                Done
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#8E8E93]">Issuer</span>
                <span className="font-semibold text-slate-800">{infoPopupDoc.issuer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#8E8E93]">Placement</span>
                <span className="font-semibold text-[#007AFF]">{infoPopupDoc.carryLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#8E8E93]">Priority</span>
                <span className="font-semibold text-slate-800">{infoPopupDoc.priority}</span>
              </div>
              {infoPopupDoc.notes && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 mt-2">
                  <span className="font-bold block mb-0.5">Special Guideline:</span>
                  {infoPopupDoc.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
