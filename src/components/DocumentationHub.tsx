import React, { useState } from 'react';
import { DocumentItem, DEFAULT_BAG_LOCATIONS } from '../data';
import { DynamicSelect } from './DynamicSelect';
import { IOSConfirmModal } from './IOSConfirmModal';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  Shield,
  FileCheck,
  FolderCheck,
  X,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface DocumentationHubProps {
  onBack: () => void;
  documents: DocumentItem[];
  customLocations?: string[];
  onAddCustomLocation?: (loc: string) => void;
  onToggleDocReady: (id: string) => void;
  onToggleDocPacked: (id: string) => void;
  onAddDoc: (doc: Omit<DocumentItem, 'id'>) => void;
  onUpdateDoc: (id: string, updated: Partial<DocumentItem>) => void;
  onDeleteDoc: (id: string) => void;
  // Keep optional props for compatibility
  procedureSteps?: any[];
  bankingTasks?: any[];
  customBanks?: string[];
  onAddCustomBank?: (bank: string) => void;
  onToggleStepDone?: (id: string) => void;
  onAddStep?: (step: any) => void;
  onUpdateStep?: (id: string, updated: any) => void;
  onDeleteStep?: (id: string) => void;
  onToggleBankingTask?: (id: string) => void;
  onAddBankingTask?: (task: any) => void;
  onUpdateBankingTask?: (id: string, updated: any) => void;
  onDeleteBankingTask?: (id: string) => void;
}

export const DocumentationHub: React.FC<DocumentationHubProps> = ({
  onBack,
  documents,
  customLocations = [],
  onAddCustomLocation,
  onToggleDocReady,
  onToggleDocPacked,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formIssuer, setFormIssuer] = useState('');
  const [formLocation, setFormLocation] = useState('Compact Fanny Pack / Crossbody');
  const [formPriority, setFormPriority] = useState<DocumentItem['priority']>('Critical');
  const [formNotes, setFormNotes] = useState('');

  const allLocations = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_BAG_LOCATIONS, ...customLocations]));
  }, [customLocations]);

  const inHandCount = documents.filter((d) => d.isReady || d.isPacked).length;
  const inHandPercent = Math.round((inHandCount / (documents.length || 1)) * 100);

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormIssuer('');
    setFormLocation('Structured Tech Laptop Backpack');
    setFormPriority('High');
    setFormNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormIssuer(doc.issuer);
    setFormLocation(doc.carryLocation);
    setFormPriority(doc.priority);
    setFormNotes(doc.notes);
    setShowAddModal(true);
  };

  const handleSaveDoc = () => {
    const trimmedTitle = formTitle.trim();
    if (!trimmedTitle) return;

    try {
      if (editingDoc) {
        onUpdateDoc(editingDoc.id, {
          title: trimmedTitle,
          issuer: formIssuer.trim(),
          carryLocation: formLocation,
          priority: formPriority,
          notes: formNotes.trim(),
        });
      } else {
        onAddDoc({
          title: trimmedTitle,
          issuer: formIssuer.trim(),
          carryLocation: formLocation,
          priority: formPriority,
          notes: formNotes.trim(),
          isReady: true,
          isPacked: false,
        });
      }
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setShowAddModal(false);
      setEditingDoc(null);
      setFormTitle('');
      setFormIssuer('');
      setFormNotes('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="ios-back-button group"
        >
          <ChevronLeft className="w-5 h-5 text-[#007AFF] group-hover:-translate-x-0.5 transition-transform" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* 2. SECTION BANNER & VERIFICATION PROGRESS */}
      <div className="ios-card p-5 sm:p-6 bg-gradient-to-r from-amber-50/60 via-white to-blue-50/60 border border-amber-200/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📋</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Documents
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Passport, JW202/Visa, medical forms, and physical certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-amber-600">{inHandPercent}%</div>
              <div className="text-[11px] font-semibold text-slate-500">
                {inHandCount} of {documents.length} In Hand
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${inHandPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Security Rule Reminder */}
        <div className="mt-4 p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Reminder:</strong> Keep original documents, passport, and medical forms in your carry-on bag or fanny pack.
          </span>
        </div>
      </div>

      {/* 3. CHECKLIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-900 tracking-tight block">
            Required Documents ({documents.length})
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tap badge to verify in hand
          </span>
        </div>

        <div className="space-y-2.5">
          {documents.map((doc) => {
            const isInHand = doc.isReady || doc.isPacked;

            return (
              <div
                key={doc.id}
                className={`ios-card p-4 sm:p-5 transition-all border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isInHand
                    ? 'bg-emerald-50/30 border-emerald-300/80'
                    : 'bg-white border-black/10'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Status Check Icon */}
                  <div
                    onClick={() => onToggleDocReady(doc.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      isInHand
                        ? 'bg-emerald-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title="Tap to toggle In Hand"
                  >
                    <Check className={`w-5 h-5 stroke-[3] ${isInHand ? 'text-white' : 'text-slate-400'}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-snug">
                        {doc.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.priority === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {doc.priority}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      Issued by: <span className="font-medium text-slate-700">{doc.issuer}</span>
                    </div>

                    {doc.notes && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {doc.notes}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span>Carry: <strong>{doc.carryLocation}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Binary Toggle Badge + Edit + Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleDocReady(doc.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      isInHand
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isInHand ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{isInHand ? 'In Hand & Ready ✓' : 'Mark In Hand'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(doc)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit credential"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Delete Credential?',
                          message: `Are you sure you want to remove "${doc.title}"?`,
                          onConfirm: () => {
                            onDeleteDoc(doc.id);
                            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete credential"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT CREDENTIAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingDoc ? 'Edit Credential' : 'Add Required Credential'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Original Passport with Visa, JW201 Form..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:outline-[#007AFF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issuing Authority / Details</label>
                <input
                  type="text"
                  value={formIssuer}
                  onChange={(e) => setFormIssuer(e.target.value)}
                  placeholder="e.g. Ministry of Education, University..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#007AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Carry Location</label>
                  <DynamicSelect
                    value={formLocation}
                    options={allLocations}
                    onChange={(loc) => setFormLocation(loc)}
                    onAddCustom={(loc) => {
                      onAddCustomLocation?.(loc);
                      setFormLocation(loc);
                    }}
                    customPlaceholder="+ Add Custom Location..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-[#007AFF]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Important Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Must have physical clinic ink stamp, 8 copies..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#007AFF]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              {editingDoc ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Delete Credential?',
                      message: `Are you sure you want to remove "${editingDoc.title}"?`,
                      onConfirm: () => {
                        onDeleteDoc?.(editingDoc.id);
                        setShowAddModal(false);
                        setEditingDoc(null);
                        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Delete Credential
                </button>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDoc}
                  disabled={!formTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <IOSConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
