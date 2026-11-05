import React, { useState } from 'react';
import { DocumentItem, ProcedureStep } from '../data';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  AlertCircle,
  FolderCheck,
  ListTodo,
  Info,
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
  const [activeTab, setActiveTab] = useState<'vault' | 'procedures'>('vault');
  const [selectedStage, setSelectedStage] = useState<string>('all');
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

  // Stages configuration
  const stages = [
    { id: 'all', name: 'All Stages' },
    { id: 'prep-srilanka', name: '1. Sri Lanka Prep' },
    { id: 'airport-cmb', name: '2. Colombo CMB Airport' },
    { id: 'transit-pvg', name: '3. Shanghai PVG Layover' },
    { id: 'flight-hak', name: '4. Haikou HAK Arrival' },
    { id: 'arrival-campus', name: '5. University & Dorm Setup' },
  ];

  // Document Handlers
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

  // Step Handlers
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

  const filteredSteps = procedureSteps.filter(
    (step) => selectedStage === 'all' || step.stage === selectedStage
  );

  const readyDocsCount = documents.filter((d) => d.isReady).length;
  const packedDocsCount = documents.filter((d) => d.isPacked).length;
  const doneStepsCount = procedureSteps.filter((s) => s.isDone).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* iOS Styled Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#003580]" />
          <span>Back to Overview</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-500 block">
            Documents & Campus Steps
          </span>
          <span className="text-[11px] font-semibold text-[#003580]">
            {packedDocsCount}/{documents.length} Docs Packed • {doneStepsCount}/{procedureSteps.length} Steps Done
          </span>
        </div>
      </div>

      {/* Segmented Controls (Apple Style) */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('vault')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'vault'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderCheck className="w-4 h-4 text-amber-600" />
          <span>Document Vault ({documents.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('procedures')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'procedures'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTodo className="w-4 h-4 text-[#003580]" />
          <span>Steps Editor ({doneStepsCount}/{procedureSteps.length})</span>
        </button>
      </div>

      {/* TAB 1: CREDENTIAL VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Legal Documents & Certificates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Keep in A4 waterproof folder and fanny pack • Never place original certificates in checked bags
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddDoc(!showAddDoc)}
                className="px-3.5 py-1.5 rounded-xl bg-[#003580] text-white text-xs font-bold hover:bg-[#00224f] transition-colors flex items-center gap-1 shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Document</span>
              </button>
            </div>

            {/* Add Document Form */}
            {showAddDoc && (
              <form onSubmit={handleAddDocSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div className="font-bold text-slate-900">Add New Document</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Police Clearance Certificate"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issuing Authority</label>
                    <input
                      type="text"
                      placeholder="e.g. Sri Lanka Police HQ"
                      value={newDocIssuer}
                      onChange={(e) => setNewDocIssuer(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Placement</label>
                    <select
                      value={newDocLocation}
                      onChange={(e) => setNewDocLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="Fanny Pack (Worn on Chest)">Fanny Pack (Worn on Chest)</option>
                      <option value="A4 Waterproof Folder (Cabin Backpack)">A4 Waterproof Folder (Cabin Backpack)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Priority</label>
                    <select
                      value={newDocPriority}
                      onChange={(e) => setNewDocPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="Critical">Critical (Immigration / Border)</option>
                      <option value="High">High (University Registration)</option>
                      <option value="Medium">Medium (General)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddDoc(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#003580] text-white rounded-xl font-bold"
                  >
                    Save Document
                  </button>
                </div>
              </form>
            )}

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {documents.map((doc) => {
                const isEditing = editingDocId === doc.id;

                if (isEditing) {
                  return (
                    <div key={doc.id} className="p-4 bg-blue-50/60 border border-blue-400 rounded-2xl space-y-2 text-xs">
                      <div className="font-bold text-slate-900">Edit Document</div>
                      <input
                        type="text"
                        value={editDocTitle}
                        onChange={(e) => setEditDocTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded-xl bg-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Issuer"
                        value={editDocIssuer}
                        onChange={(e) => setEditDocIssuer(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded-xl bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Carry location"
                        value={editDocLocation}
                        onChange={(e) => setEditDocLocation(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded-xl bg-white"
                      />
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingDocId(null)}
                          className="px-2.5 py-1 border rounded-xl bg-white text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveDocEdit(doc.id)}
                          className="px-3.5 py-1 rounded-xl bg-[#003580] text-white font-bold"
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
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                      doc.isPacked
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            doc.priority === 'Critical'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : doc.priority === 'High'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {doc.priority}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Corner Info Icon for uncluttered reading */}
                          <button
                            type="button"
                            onClick={() => setInfoPopupDoc(doc)}
                            className="w-7 h-7 rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#003580] flex items-center justify-center transition-colors shadow-2xs"
                            title="View document guidelines"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEditDoc(doc)}
                            className="p-1 text-slate-400 hover:text-[#003580]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className={`text-sm font-bold mt-2 ${doc.isPacked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {doc.title}
                      </h4>

                      <div className="text-xs text-[#003580] font-semibold mt-2 bg-blue-50/60 p-2 rounded-xl truncate">
                        📍 {doc.carryLocation}
                      </div>
                    </div>

                    {/* Front Dots for Verification & Packed */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <button
                          type="button"
                          onClick={() => onToggleDocReady(doc.id)}
                          className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
                            doc.isReady
                              ? 'bg-emerald-500 ring-2 ring-emerald-200'
                              : 'border-2 border-slate-300 hover:border-emerald-500 bg-white'
                          }`}
                        >
                          {doc.isReady && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                        <span className={`text-[11px] ${doc.isReady ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                          {doc.isReady ? 'Verified' : 'Pending Check'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <button
                          type="button"
                          onClick={() => onToggleDocPacked(doc.id)}
                          className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
                            doc.isPacked
                              ? 'bg-[#003580] ring-2 ring-blue-200'
                              : 'border-2 border-slate-300 hover:border-[#003580] bg-white'
                          }`}
                        >
                          {doc.isPacked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </button>
                        <span className={`text-[11px] font-bold ${doc.isPacked ? 'text-[#003580]' : 'text-slate-400'}`}>
                          {doc.isPacked ? 'Packed' : 'Unpacked'}
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROCEDURES & STEPS EDITOR */}
      {activeTab === 'procedures' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Customs, Transit & University Steps
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full ability to alter, edit, add, or remove steps as plans adjust
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddStep(!showAddStep)}
              className="px-3.5 py-1.5 rounded-xl bg-[#003580] text-white text-xs font-bold hover:bg-[#00224f] transition-colors flex items-center gap-1 shadow-2xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Step</span>
            </button>
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {stages.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStage(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedStage === st.id
                    ? 'bg-[#003580] text-white border-[#003580]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {/* Add Step Form */}
          {showAddStep && (
            <form onSubmit={handleAddStepSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="font-bold text-slate-900">Add Procedure Step</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Stage</label>
                  <select
                    value={newStepStage}
                    onChange={(e) => setNewStepStage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="prep-srilanka">1. Sri Lanka Prep</option>
                    <option value="airport-cmb">2. Colombo CMB Airport</option>
                    <option value="transit-pvg">3. Shanghai PVG Layover</option>
                    <option value="flight-hak">4. Haikou HAK Arrival</option>
                    <option value="arrival-campus">5. University & Dorm Setup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Dorm Setup, SIM Card"
                    value={newStepCategory}
                    onChange={(e) => setNewStepCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Step Title</label>
                <input
                  type="text"
                  placeholder="e.g. Pick up electricity card from dorm supervisor"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Instructions / Details</label>
                <textarea
                  rows={2}
                  placeholder="Details, location, or notes..."
                  value={newStepDetail}
                  onChange={(e) => setNewStepDetail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddStep(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#003580] text-white rounded-xl font-bold"
                >
                  Save Step
                </button>
              </div>
            </form>
          )}

          {/* Procedure Steps List */}
          <div className="space-y-3 pt-1">
            {filteredSteps.map((step) => {
              const isEditing = editingStepId === step.id;

              if (isEditing) {
                return (
                  <div key={step.id} className="p-4 bg-blue-50/60 border border-blue-400 rounded-2xl space-y-2 text-xs">
                    <div className="font-bold text-slate-900">Edit / Alter Step</div>
                    <input
                      type="text"
                      value={editStepTitle}
                      onChange={(e) => setEditStepTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-blue-300 rounded-xl bg-white font-bold"
                    />
                    <textarea
                      rows={2}
                      value={editStepDetail}
                      onChange={(e) => setEditStepDetail(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-blue-300 rounded-xl bg-white"
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingStepId(null)}
                        className="px-2.5 py-1 border rounded-xl bg-white text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveStepEdit(step.id)}
                        className="px-3.5 py-1 rounded-xl bg-[#003580] text-white font-bold"
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
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-all ${
                    step.isDone
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleStepDone(step.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full transition-all flex items-center justify-center shrink-0 ${
                        step.isDone
                          ? 'bg-emerald-500 ring-2 ring-emerald-200'
                          : 'border-2 border-slate-300 hover:border-emerald-500 bg-white'
                      }`}
                    >
                      {step.isDone && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {step.category}
                        </span>
                        {step.carryBag && (
                          <span className="text-[10px] font-semibold text-[#003580] bg-blue-50 px-2 py-0.5 rounded-full">
                            📍 {step.carryBag}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold ${step.isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {step.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => handleStartEditStep(step)}
                      className="p-1.5 text-slate-400 hover:text-[#003580] rounded-xl hover:bg-slate-100"
                      title="Edit this step"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteStep(step.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                      title="Delete this step"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Document Info Clean Popup */}
      {infoPopupDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#003580]" />
                <h3 className="font-bold text-base text-slate-900">{infoPopupDoc.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoPopupDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <div><strong>Issuer:</strong> {infoPopupDoc.issuer}</div>
              <div><strong>Carry Location:</strong> <span className="font-semibold text-[#003580]">{infoPopupDoc.carryLocation}</span></div>
              <div><strong>Priority:</strong> {infoPopupDoc.priority}</div>
              {infoPopupDoc.notes && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong>Special Guideline:</strong><br />
                  {infoPopupDoc.notes}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoPopupDoc(null)}
                className="px-5 py-2 rounded-xl bg-[#003580] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
