import React, { useState, useEffect } from 'react';
import { Camera, Edit3, Check, User, Shield, RefreshCw, Trash2 } from 'lucide-react';
import { compressImage } from '../cloudSync';

interface StudentProfileCardProps {
  passportInfo: {
    passportNumber: string;
    expiryDate: string;
    photoUrl?: string;
  };
  onUpdatePassportInfo: (updated: { passportNumber: string; expiryDate: string; photoUrl?: string }) => void;
  isCloudSynced?: boolean;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  passportInfo,
  onUpdatePassportInfo,
  isCloudSynced = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [passportNum, setPassportNum] = useState(passportInfo.passportNumber);
  const [expiry, setExpiry] = useState(passportInfo.expiryDate);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sync internal state when external props update via cloud sync polling
  useEffect(() => {
    setPassportNum(passportInfo.passportNumber);
    setExpiry(passportInfo.expiryDate);
  }, [passportInfo.passportNumber, passportInfo.expiryDate]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizing(true);
      // Downscale & compress to ~15KB for instantaneous cloud database synchronization
      const compressedBase64 = await compressImage(file, 260, 340, 0.78);

      onUpdatePassportInfo({
        ...passportInfo,
        photoUrl: compressedBase64,
      });

      setSyncToast('Photo synced to cloud database!');
      setTimeout(() => setSyncToast(null), 3000);
    } catch (err) {
      console.error('Error optimizing image', err);
      setSyncToast('Upload error. Please try again.');
      setTimeout(() => setSyncToast(null), 3000);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRemovePhoto = () => {
    onUpdatePassportInfo({
      ...passportInfo,
      photoUrl: '',
    });
    setSyncToast('Photo removed & synced!');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleSavePassport = () => {
    onUpdatePassportInfo({
      ...passportInfo,
      passportNumber: passportNum.trim() || passportInfo.passportNumber,
      expiryDate: expiry || passportInfo.expiryDate,
    });
    setIsEditing(false);
    setSyncToast('Passport details saved & synced!');
    setTimeout(() => setSyncToast(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all hover:shadow-md relative">
      {/* Toast Notification */}
      {syncToast && (
        <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-20">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{syncToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Large Modern Photo (No tacky frame, rounded-2xl with clean hover upload) */}
        <div className="relative group shrink-0">
          {isOptimizing ? (
            <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl bg-blue-50 border-2 border-blue-400 flex flex-col items-center justify-center text-[#003580] p-2 text-center shadow-inner animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin mb-1 text-[#003580]" />
              <span className="text-[10px] font-bold">Syncing Photo...</span>
            </div>
          ) : passportInfo.photoUrl ? (
            <img
              src={passportInfo.photoUrl}
              alt="Navini Ravishka"
              className="w-28 h-36 sm:w-32 sm:h-40 object-cover rounded-2xl shadow-sm"
            />
          ) : (
            <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-2 shadow-inner">
              <User className="w-10 h-10 text-slate-400 stroke-[1.5]" />
              <span className="text-[11px] font-semibold text-slate-500 mt-2">Upload Photo</span>
            </div>
          )}

          {/* Upload Button Overlay */}
          <label className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xs text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-[11px] font-bold">Change Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Student Bio & Credentials */}
        <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#003580] text-xs font-bold mb-1.5">
                <span>Hainan University • Haidian Campus</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Parana Gamage Navini Ravishka Priyantha
              </h1>
            </div>

            {/* Cloud Sync Status Badge */}
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-center sm:self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[11px]">Database Synced</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Master of Food Science and Engineering (2026–2029) • English Taught Full Scholarship
          </p>

          {/* Passport & Admission Notice Strip */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Admission Notice</span>
              <span className="font-mono font-bold text-slate-800 text-sm">263660001</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Passport Number</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{passportInfo.passportNumber}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Expiry Date</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{passportInfo.expiryDate}</span>
            </div>

            <div className="sm:ml-auto">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>{isEditing ? 'Close' : 'Edit Passport'}</span>
              </button>
            </div>
          </div>

          {/* Passport Details Editor Popout */}
          {isEditing && (
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs animate-in fade-in duration-200">
              <div className="font-bold text-slate-800">Edit Passport Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={passportNum}
                    onChange={(e) => setPassportNum(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                {passportInfo.photoUrl ? (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePassport}
                    className="px-4 py-1.5 rounded-xl bg-[#003580] hover:bg-[#00224f] text-white font-bold transition-colors shadow-2xs"
                  >
                    Save & Sync
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
