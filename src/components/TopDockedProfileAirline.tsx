import React, { useState } from 'react';
import { AppIcon } from './AppIcon';
import {
  ChevronDown,
  Edit3,
  Check,
  Plane,
  Clock,
  Luggage,
  X,
  Info,
  Camera,
  RefreshCw,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { uploadPhotoToSupabase } from '../cloudSync';

interface TopDockedProfileAirlineProps {
  passportInfo: {
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  };
  onUpdatePassportInfo: (updated: { passportNumber: string; expiryDate: string; photoUrl?: string }) => void;
  isCloudSynced?: boolean;
}

export const TopDockedProfileAirline: React.FC<TopDockedProfileAirlineProps> = ({
  passportInfo,
  onUpdatePassportInfo,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTransferGuide, setShowTransferGuide] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showPassportEditor, setShowPassportEditor] = useState(false);
  const [passportNum, setPassportNum] = useState(passportInfo.passportNumber);
  const [expiry, setExpiry] = useState(passportInfo.expiryDate);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultPassportPhoto = `${import.meta.env.BASE_URL}navini-passport.jpeg`;
  const activePhoto = passportInfo.photoUrl || defaultPassportPhoto;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setShowActionSheet(false);
      const publicUrl = await uploadPhotoToSupabase(file, 'passport');

      onUpdatePassportInfo({
        ...passportInfo,
        photoUrl: publicUrl,
      });

      setToastMessage('Photo updated & synced!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setToastMessage('Upload failed. Try again.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = () => {
    onUpdatePassportInfo({
      ...passportInfo,
      photoUrl: '',
    });
    setShowActionSheet(false);
    setToastMessage('Reset to official passport photo!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePassport = () => {
    onUpdatePassportInfo({
      ...passportInfo,
      passportNumber: passportNum.trim() || passportInfo.passportNumber,
      expiryDate: expiry || passportInfo.expiryDate,
    });
    setShowPassportEditor(false);
    setToastMessage('Passport details saved!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <>
      <div className="ios-card overflow-hidden transition-all shadow-xs border border-black/10">
        {/* COLLAPSED BAR (DEFAULT COMPACT STATE) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
        >
          {/* Left: Small Profile Photo + Two Clean Name Lines */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {!isExpanded && (
              <div className="relative shrink-0">
                <img
                  src={activePhoto}
                  alt="Navini Ravishka"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-slate-200 shadow-2xs"
                  onError={(e) => {
                    e.currentTarget.src = defaultPassportPhoto;
                  }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              {/* Full Name in Two Clean Lines */}
              <div className="leading-tight">
                <div className="font-bold text-sm sm:text-base text-slate-900 tracking-tight truncate">
                  Parana Gamage Navini
                </div>
                <div className="font-semibold text-xs sm:text-sm text-slate-700 tracking-tight truncate">
                  Ravishka Priyantha
                </div>
              </div>

              {/* Tiny Badges: Scholar Pass & China Eastern PNR */}
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-200/60">
                  Scholar Pass • JKZ2YN
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 hidden xs:inline-flex">
                  Hainan Univ #263660001
                </span>
              </div>
            </div>
          </div>

          {/* Right: Expand Chevron */}
          <div className="shrink-0 pl-2 flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* EXPANDED ACCORDION VIEW */}
        {isExpanded && (
          <div className="border-t border-black/5 animate-in fade-in slide-in-from-top-1 duration-250 bg-white">
            {/* 1. SCHOLAR PROFILE SECTION */}
            <div className="p-4 sm:p-6 border-b border-black/5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Profile Portrait */}
                <div className="relative shrink-0">
                  {isUploading ? (
                    <div className="w-24 h-32 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-[#007AFF] p-2 text-center animate-pulse">
                      <RefreshCw className="w-6 h-6 animate-spin mb-1 text-[#007AFF]" />
                      <span className="text-[10px] font-semibold">Uploading...</span>
                    </div>
                  ) : (
                    <img
                      src={activePhoto}
                      alt="Navini Ravishka"
                      className="w-24 h-32 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = defaultPassportPhoto;
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionSheet(true);
                    }}
                    className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-white border border-black/10 shadow-xs text-[10px] font-semibold text-[#007AFF] flex items-center gap-1 hover:bg-slate-50"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Academic & University Details */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#007AFF]">
                      Master's Degree Candidate
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Full Scholarship
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Parana Gamage Navini Ravishka Priyantha
                  </h2>
                  <div className="text-xs text-slate-500 font-serif mt-0.5">
                    帕拉纳·加马吉·纳维尼·拉维什卡·普里扬塔
                  </div>

                  {/* University & Degree */}
                  <div className="mt-3 p-3 rounded-xl bg-[#F2F2F7]/70 border border-black/5 text-xs space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-slate-500 font-medium">University:</span>
                      <strong className="text-slate-900 font-semibold">
                        Hainan University (海南大学) • Haidian Campus
                      </strong>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-slate-500 font-medium">Faculty / Department:</span>
                      <strong className="text-slate-800">School of Food Science and Engineering</strong>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-slate-500 font-medium">Admission Notice:</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        #263660001
                      </span>
                    </div>
                  </div>

                  {/* Passport Details Pill */}
                  <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-700" />
                      <div>
                        <span className="text-slate-600 font-medium">Passport: </span>
                        <strong className="font-mono text-slate-900">{passportInfo.passportNumber}</strong>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-600 font-medium">Expires: </span>
                        <span className="text-slate-800 font-mono">{passportInfo.expiryDate}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPassportEditor(true);
                      }}
                      className="text-xs font-semibold text-[#007AFF] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CHINA EASTERN AIRLINES ITINERARY SECTION */}
            <div className="p-4 sm:p-6 space-y-5 bg-white">
              <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <AppIcon name="china-eastern" className="w-7 h-7" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      China Eastern Airlines 中国东方航空
                    </div>
                    <div className="text-[11px] text-[#8E8E93] font-mono">
                      PNR: <strong className="text-slate-800">JKZ2YN</strong> • E-Ticket:{' '}
                      <strong className="text-slate-800">7812903731438</strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTransferGuide(true);
                  }}
                  className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#007AFF] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>PVG Guide</span>
                </button>
              </div>

              {/* LEG 1: CMB -> PVG */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-[120px]">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">20:50</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">CMB • Colombo</div>
                  <div className="text-[11px] text-[#8E8E93]">Bandaranaike Intl</div>
                  <div className="text-[11px] font-semibold text-[#007AFF] mt-0.5">Sun, Nov 8, 2026</div>
                </div>

                <div className="flex-1 max-w-xs mx-auto text-center px-2">
                  <span className="text-[10px] font-bold font-mono text-[#8E8E93] block mb-1">
                    MU6018 • 6h 45m Direct
                  </span>
                  <div className="flex items-center justify-center gap-2 my-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <Plane className="w-3.5 h-3.5 text-[#007AFF] rotate-90 shrink-0" />
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Airbus A330 • Economy</span>
                </div>

                <div className="min-w-[120px] sm:text-right">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono flex sm:justify-end items-baseline gap-1">
                    <span>06:05</span>
                    <span className="text-xs font-bold text-red-600 font-sans">+1 day</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">PVG • Shanghai</div>
                  <div className="text-[11px] text-[#8E8E93]">Pudong Intl Terminal 1</div>
                  <div className="text-[11px] font-semibold text-[#007AFF] mt-0.5">Mon, Nov 9, 2026</div>
                </div>
              </div>

              {/* LAYOVER PILL */}
              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-dashed border-amber-300 absolute" />
                <div className="relative px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>4h 50m Layover in Shanghai (PVG T1)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-amber-800 font-normal">Baggage Re-check & Customs</span>
                </div>
              </div>

              {/* LEG 2: PVG -> HAK */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-[120px]">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">10:55</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">PVG • Shanghai</div>
                  <div className="text-[11px] text-[#8E8E93]">Pudong Intl Terminal 1</div>
                  <div className="text-[11px] font-semibold text-[#007AFF] mt-0.5">Mon, Nov 9, 2026</div>
                </div>

                <div className="flex-1 max-w-xs mx-auto text-center px-2">
                  <span className="text-[10px] font-bold font-mono text-[#8E8E93] block mb-1">
                    MU6381 • 3h 40m Domestic
                  </span>
                  <div className="flex items-center justify-center gap-2 my-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <Plane className="w-3.5 h-3.5 text-[#007AFF] rotate-90 shrink-0" />
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Airbus A320 • Economy</span>
                </div>

                <div className="min-w-[120px] sm:text-right">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">14:35</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">HAK • Haikou</div>
                  <div className="text-[11px] text-[#8E8E93]">Meilan Intl Terminal 1</div>
                  <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Final Destination 🎓</div>
                </div>
              </div>

              {/* Baggage Summary */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-medium">
                  <Luggage className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Included Baggage: 2 × 23kg Checked Bags + 1 × 8kg Cabin Backpack</span>
                </div>
                <span className="font-semibold text-slate-800">SkyTeam Alliance</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in z-50">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SHANGHAI PVG TRANSFER GUIDE MODAL */}
      {showTransferGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#007AFF] flex items-center justify-center font-bold">
                  PVG
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Shanghai Pudong (PVG) T1 Transfer Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-700" />
                  Layover Duration: 4 Hours 50 Minutes (T1 &rarr; T1)
                </div>
                <div className="text-xs text-blue-800">
                  Both flights (MU6018 and MU6381) depart and arrive at Terminal 1. No terminal train needed.
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-900">Step-by-Step Procedure at PVG:</div>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>
                    <strong>Immigration & Health Inspection:</strong> Follow "International Transfer / Exit" signs to Immigration. Present Passport with X1 Visa.
                  </li>
                  <li>
                    <strong>Collect Checked Luggage:</strong> Proceed to Baggage Claim. <em>CRITICAL:</em> Because you are transferring to a domestic flight (PVG &rarr; HAK), you MUST collect both 23kg suitcases from the carousel!
                  </li>
                  <li>
                    <strong>China Customs Clearance:</strong> Pass through Customs declaration with both bags.
                  </li>
                  <li>
                    <strong>Domestic Transfer Check-in:</strong> Find the China Eastern Domestic Transfer Counter (inside T1) to drop both suitcases again for flight MU6381.
                  </li>
                  <li>
                    <strong>Domestic Security & Gate:</strong> Pass domestic security check and proceed to MU6381 gate for Haikou.
                  </li>
                </ol>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <strong>Sim Card & Connectivity Note:</strong> Turn ON your CMLink travel eSIM as soon as the plane lands in Shanghai. Do NOT turn on Dialog mobile data roaming.
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTransferGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO ACTION SHEET MODAL */}
      {showActionSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-3 animate-in slide-in-from-bottom-5">
            <h3 className="font-bold text-slate-900 text-sm text-center">Update Scholar Portrait</h3>
            <p className="text-xs text-[#8E8E93] text-center">
              Upload a new photo or take one with your device camera.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <label className="py-3 px-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <label className="py-3 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>Photo Gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {passportInfo.photoUrl && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Official Passport Photo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowActionSheet(false)}
              className="w-full py-2.5 rounded-xl text-slate-500 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PASSPORT EDITOR MODAL */}
      {showPassportEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Edit Passport Details</h3>
              <button
                type="button"
                onClick={() => setShowPassportEditor(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Passport Number</label>
                <input
                  type="text"
                  value={passportNum}
                  onChange={(e) => setPassportNum(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm uppercase focus:outline-[#007AFF]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm focus:outline-[#007AFF]"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPassportEditor(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassport}
                className="flex-1 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-xs transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
