import React from 'react';
import {
  X,
  Luggage,
  FileText,
  Globe2,
  Printer,
  Download,
  Home,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';

interface AppleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: 'overview' | 'physical' | 'documents' | 'connectivity') => void;
  onOpenTaxi: () => void;
  onOpenBackup: () => void;
  passportInfo: {
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  };
}

export const AppleSidebar: React.FC<AppleSidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenTaxi,
  onOpenBackup,
  passportInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white/95 backdrop-blur-md shadow-2xl border-l border-slate-200/80 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 tracking-tight">Navigation Menu</span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Student Profile Quick View */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3.5 bg-slate-50/60">
            {passportInfo.photoUrl ? (
              <img
                src={passportInfo.photoUrl}
                alt="Navini"
                className="w-12 h-14 object-cover rounded-xl shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-12 h-14 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">Navini Ravishka</h4>
              <span className="text-[10px] text-slate-500 block truncate">Hainan University (Food Science)</span>
              <span className="text-[10px] font-mono text-[#003580] font-semibold block mt-0.5">
                Passport: {passportInfo.passportNumber}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onNavigate('overview');
                onClose();
              }}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                currentView === 'overview'
                  ? 'bg-[#003580] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" />
                <span>Overview & Timeline</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('physical');
                onClose();
              }}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                currentView === 'physical'
                  ? 'bg-[#003580] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Luggage className="w-4 h-4 text-[#003580]" />
                <span>Luggage, Clothes & Tech</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('documents');
                onClose();
              }}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                currentView === 'documents'
                  ? 'bg-[#003580] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Documents & Campus Steps</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('connectivity');
                onClose();
              }}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all ${
                currentView === 'connectivity'
                  ? 'bg-[#003580] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                <span>Internet, Apps & Chat</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <div className="pt-3 my-2 border-t border-slate-100" />

            <button
              type="button"
              onClick={() => {
                onOpenTaxi();
                onClose();
              }}
              className="w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>Haikou Taxi Pocket Card</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenBackup();
                onClose();
              }}
              className="w-full p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-slate-500" />
                <span>Offline File Backup</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>

          {/* Footer info */}
          <div className="p-5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Cloud & Local Sync Active</span>
            </div>
            <div>Hainan University • Colombo &rarr; Haikou</div>
          </div>
        </div>
      </div>
    </div>
  );
};
