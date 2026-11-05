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
  FolderLock,
  Compass,
  MapPin,
  Clock,
  PhoneCall,
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
    <div className="space-y-6">
      {/* iOS Styled Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-500 block">
            Official Documents & Airport Procedures
          </span>
          <span className="text-[11px] font-semibold text-[#003580]">
            {packedDocsCount}/{documents.length} Docs Packed • {doneStepsCount}/{procedureSteps.length} Steps Finished
          </span>
        </div>
      </div>

      {/* Segmented Controls (iOS Style Tabs) */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-md mx-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'vault'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Credential Vault ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('procedures')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'procedures'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Procedures & Task Editor ({doneStepsCount}/{procedureSteps.length})
        </button>
      </div>

      {/* TAB 1: CREDENTIAL VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Mandatory Credentials & Document Placements
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Original legal certificates and photocopies mapped to exact protective bags
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddDoc(!showAddDoc)}
                  className="px-3 py-1.5 rounded-lg bg-[#003580] text-white text-xs font-semibold hover:bg-[#00224f] transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Document</span>
                </button>
              </div>
            </div>

            {/* Add Document Form */}
            {showAddDoc && (
              <form onSubmit={handleAddDocSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl my-4 space-y-3 text-xs">
                <div className="font-bold text-slate-900">Add New Document / Certificate</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Police Clearance Certificate"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Carry Placement</label>
                    <select
                      value={newDocLocation}
                      onChange={(e) => setNewDocLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Fanny Pack (Worn on Chest)">Fanny Pack (Worn on Chest)</option>
                      <option value="A4 Waterproof Folder (Cabin Backpack)">A4 Waterproof Folder (Cabin Backpack)</option>
                      <option value="Main Large Suitcase (30×40×70cm)">Main Large Suitcase (30×40×70cm)</option>
                      <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Priority</label>
                    <select
                      value={newDocPriority}
                      onChange={(e) => setNewDocPriority(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Critical">Critical (Immigration / Border)</option>
                      <option value="High">High (University Registration)</option>
                      <option value="Medium">Medium (General)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notes / Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 physical photocopies included"
                    value={newDocNotes}
                    onChange={(e) => setNewDocNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddDoc(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#003580] text-white rounded-lg font-bold"
                  >
                    Save Document
                  </button>
                </div>
              </form>
            )}

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
              {documents.map((doc) => {
                const isEditing = editingDocId === doc.id;

                if (isEditing) {
                  return (
                    <div key={doc.id} className="p-4 bg-blue-50/50 border border-blue-400 rounded-xl space-y-2 text-xs">
                      <div className="font-bold text-slate-900">Edit Document</div>
                      <input
                        type="text"
                        value={editDocTitle}
                        onChange={(e) => setEditDocTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Issuer"
                        value={editDocIssuer}
                        onChange={(e) => setEditDocIssuer(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Carry location"
                        value={editDocLocation}
                        onChange={(e) => setEditDocLocation(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Notes"
                        value={editDocNotes}
                        onChange={(e) => setEditDocNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                      />
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingDocId(null)}
                          className="px-2.5 py-1 border rounded bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveDocEdit(doc.id)}
                          className="px-3.5 py-1 rounded bg-[#003580] text-white font-bold"
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
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      doc.isPacked
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              doc.priority === 'Critical'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : doc.priority === 'High'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {doc.priority}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEditDoc(doc)}
                            className="p-1 text-slate-400 hover:text-[#003580]"
                            title="Edit document"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className={`text-sm font-bold mt-1.5 ${doc.isPacked ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {doc.title}
                      </h4>

                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Issuer: {doc.issuer}
                      </div>

                      <div className="text-xs text-[#003580] font-semibold mt-2 bg-blue-50/60 p-2 rounded border border-blue-100">
                        📍 Placed In: {doc.carryLocation}
                      </div>

                      {doc.notes && (
                        <div className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                          Note: {doc.notes}
                        </div>
                      )}
                    </div>

                    {/* Dual Checks */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={doc.isReady}
                          onChange={() => onToggleDocReady(doc.id)}
                          className="w-3.5 h-3.5 rounded accent-emerald-600 cursor-pointer"
                        />
                        <span className={`text-[11px] ${doc.isReady ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                          {doc.isReady ? 'Document Verified' : 'Pending Verification'}
                        </span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={doc.isPacked}
                          onChange={() => onToggleDocPacked(doc.id)}
                          className="w-3.5 h-3.5 rounded accent-[#003580] cursor-pointer"
                        />
                        <span className={`text-[11px] font-bold ${doc.isPacked ? 'text-[#003580]' : 'text-slate-400'}`}>
                          {doc.isPacked ? 'Packed in Bag' : 'Not Packed'}
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

      {/* TAB 2: PROCEDURES & TASK EDITOR */}
      {activeTab === 'procedures' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Customs, Transit & University Early Arrival Task Manager
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full ability to edit, alter, delete, or add steps for Sri Lanka departure, Shanghai PVG transit, and Hainan University early registration
              </p>
            </div>

            <button
              onClick={() => setShowAddStep(!showAddStep)}
              className="px-3 py-1.5 rounded-lg bg-[#003580] text-white text-xs font-semibold hover:bg-[#00224f] transition-colors flex items-center gap-1 shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Step</span>
            </button>
          </div>

          {/* Important Early Arrival Notice Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Early Arrival Note:</strong> Leaving Sri Lanka on Sunday, Nov 8 means arriving in Haikou early (ahead of the general Nov 17 registration date). You can use this task editor to customize dorm move-in, temporary room allocation, and orientation steps as dates are confirmed with campus coordinators.
            </div>
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {stages.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStage(st.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedStage === st.id
                    ? 'bg-[#003580] text-white border-[#003580]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {/* Add Step Form */}
          {showAddStep && (
            <form onSubmit={handleAddStepSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-slate-900">Create New Procedure Step</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Stage</label>
                  <select
                    value={newStepStage}
                    onChange={(e) => setNewStepStage(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
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
                    placeholder="e.g. Dorm Setup, Medical, SIM Card"
                    value={newStepCategory}
                    onChange={(e) => setNewStepCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Step Title</label>
                <input
                  type="text"
                  placeholder="e.g. Pick up electricity meter card from Dorm Management"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Detailed Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Details, timings, office numbers, or contact people..."
                  value={newStepDetail}
                  onChange={(e) => setNewStepDetail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assigned Bag / Location (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fanny Pack / South Gate Office"
                  value={newStepCarryBag}
                  onChange={(e) => setNewStepCarryBag(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddStep(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#003580] text-white rounded-lg font-bold"
                >
                  Save Step
                </button>
              </div>
            </form>
          )}

          {/* Procedure Steps List */}
          <div className="space-y-3 pt-2">
            {filteredSteps.map((step) => {
              const isEditing = editingStepId === step.id;

              if (isEditing) {
                return (
                  <div key={step.id} className="p-4 bg-blue-50/50 border border-blue-400 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-slate-900">Edit / Alter Procedure Step</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={editStepStage}
                        onChange={(e) => setEditStepStage(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                      >
                        <option value="prep-srilanka">1. Sri Lanka Prep</option>
                        <option value="airport-cmb">2. Colombo CMB Airport</option>
                        <option value="transit-pvg">3. Shanghai PVG Layover</option>
                        <option value="flight-hak">4. Haikou HAK Arrival</option>
                        <option value="arrival-campus">5. University & Dorm Setup</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Category"
                        value={editStepCategory}
                        onChange={(e) => setEditStepCategory(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Title"
                      value={editStepTitle}
                      onChange={(e) => setEditStepTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white font-bold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Details"
                      value={editStepDetail}
                      onChange={(e) => setEditStepDetail(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Bag or location"
                      value={editStepCarryBag}
                      onChange={(e) => setEditStepCarryBag(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white"
                    />
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingStepId(null)}
                        className="px-2.5 py-1 border rounded bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveStepEdit(step.id)}
                        className="px-3.5 py-1 rounded bg-[#003580] text-white font-bold"
                      >
                        Save Alterations
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-all ${
                    step.isDone
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleStepDone(step.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        step.isDone
                          ? 'border-emerald-600 bg-emerald-500 text-white'
                          : 'border-slate-300 bg-white hover:border-[#003580]'
                      }`}
                    >
                      {step.isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {step.category}
                        </span>
                        {step.carryBag && (
                          <span className="text-[10px] font-semibold text-[#003580] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
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
                      className="p-1.5 text-slate-400 hover:text-[#003580] rounded hover:bg-slate-100"
                      title="Edit or alter this step"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteStep(step.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
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
    </div>
  );
};
