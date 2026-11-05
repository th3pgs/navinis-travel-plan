import React, { useState } from 'react';
import { FileText, Shield, Check, Copy, AlertCircle, X, Download, Printer } from 'lucide-react';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({ isOpen, onClose }) => {
  const [docs, setDocs] = useState([
    {
      id: 'doc-1',
      title: 'Original Passport with Valid Chinese X1 Visa',
      issuer: 'Department of Immigration (Sri Lanka) & Chinese Embassy',
      carryLocation: 'Fanny Pack (Chest)',
      isReady: true,
      isPacked: false,
      notes: 'Must not have damaged photo page. Valid for Master\'s entry in China.',
    },
    {
      id: 'doc-2',
      title: 'Printed & Digital Admission Notice (#263660001)',
      issuer: 'School of Food Science and Engineering, Hainan University',
      carryLocation: 'A4 Waterproof Folder (Laptop Backpack)',
      isReady: true,
      isPacked: false,
      notes: 'Contains Page 1 (stamped full scholarship) and Page 2 (English).',
    },
    {
      id: 'doc-3',
      title: 'Confirmation Form for Study in China (JW202)',
      issuer: 'Ministry of Education of the People\'s Republic of China',
      carryLocation: 'A4 Waterproof Folder (Laptop Backpack)',
      isReady: true,
      isPacked: false,
      notes: 'Official government stamped visa authorization form.',
    },
    {
      id: 'doc-4',
      title: 'ORIGINAL Foreigner Physical Examination Form',
      issuer: 'Designated Government Hospital / Doctor Stamps',
      carryLocation: 'A4 Waterproof Folder (Laptop Backpack)',
      isReady: true,
      isPacked: false,
      notes: 'Must bear real physical clinic/physician ink stamp (not just a scan).',
    },
    {
      id: 'doc-5',
      title: 'ORIGINAL Blood Test Laboratory Reports',
      issuer: 'Clinical Laboratory Slips',
      carryLocation: 'A4 Waterproof Folder (Laptop Backpack)',
      isReady: true,
      isPacked: false,
      notes: 'HIV, Hepatitis B, Syphilis, and chest X-ray laboratory slips.',
    },
    {
      id: 'doc-6',
      title: 'Bachelor\'s Degree Certificate & Official Transcripts',
      issuer: 'Graduating University',
      carryLocation: 'A4 Waterproof Folder (Laptop Backpack)',
      isReady: true,
      isPacked: false,
      notes: 'Original diploma + certified English notarized copies for Master\'s verification.',
    },
    {
      id: 'doc-7',
      title: 'Four (4) Printed Passport Photos',
      issuer: 'Standard 33x48mm Chinese Visa Specs',
      carryLocation: 'Fanny Pack (Chest)',
      isReady: true,
      isPacked: false,
      notes: 'Matches visa photograph exactly. Required for campus student ID badge.',
    },
    {
      id: 'doc-8',
      title: 'Foreign Study Declaration Notice (BOC, People\'s, NSB)',
      issuer: 'Sri Lankan Commercial Banks',
      carryLocation: 'Fanny Pack (Zippered)',
      isReady: false,
      isPacked: false,
      notes: 'Bank submission copy to prove card travel clearance.',
    },
  ]);

  if (!isOpen) return null;

  const toggleDocReady = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, isReady: !d.isReady } : d)));
  };

  const toggleDocPacked = (id: string) => {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, isPacked: !d.isPacked } : d)));
  };

  const readyCount = docs.filter((d) => d.isReady).length;
  const packedCount = docs.filter((d) => d.isPacked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#003580] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <FileText className="w-5 h-5 text-[#febb02]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Mandatory Documentation & Registration Credentials
              </h2>
              <p className="text-xs text-blue-200">
                A4 Waterproof Folder & Fanny Pack • Dual Checkboxes (Obtained at Home + Packed in Bag)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 hidden sm:inline">
              {packedCount}/{docs.length} In Travel Bag
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Aviation Baggage Rule:</strong>
            Never pack these original documents in Checked Suitcases 1 or 2! Always carry items in your <strong>Fanny Pack</strong> (Passport & Photos) or <strong>Cabin Laptop Backpack</strong> (A4 Waterproof Folder).
          </div>
        </div>

        {/* Document List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50/50 space-y-2.5">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                doc.isPacked
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h4 className={`text-xs sm:text-sm font-bold ${doc.isPacked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {doc.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#003580] border border-blue-200 font-semibold">
                    📍 {doc.carryLocation}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  <strong>Authority:</strong> {doc.issuer}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {doc.notes}
                </p>
              </div>

              {/* Dual Checkboxes */}
              <div className="flex flex-col items-end gap-1.5 shrink-0 text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={doc.isReady}
                    onChange={() => toggleDocReady(doc.id)}
                    className="w-3.5 h-3.5 rounded accent-emerald-600"
                  />
                  <span>1. Ready at Home</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-[#003580]">
                  <input
                    type="checkbox"
                    checked={doc.isPacked}
                    onChange={() => toggleDocPacked(doc.id)}
                    className="w-3.5 h-3.5 rounded accent-[#003580]"
                  />
                  <span>2. In Travel Bag</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003580] hover:bg-[#00224f] text-white text-xs font-semibold rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
