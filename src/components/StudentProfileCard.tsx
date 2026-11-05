import React, { useState } from 'react';
import { Camera, Edit3, Check, User, CloudCheck, Shield } from 'lucide-react';

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 for persistent local and cloud storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onUpdatePassportInfo({
        ...passportInfo,
        photoUrl: url,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSavePassport = () => {
    onUpdatePassportInfo({
      ...passportInfo,
      passportNumber: passportNum.trim() || passportInfo.passportNumber,
      expiryDate: expiry || passportInfo.expiryDate,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Large Modern Photo (No tacky frame, rounded-2xl with clean hover upload) */}
        <div className="relative group shrink-0">
          {passportInfo.photoUrl ? (
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
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePassport}
                  className="px-4 py-1.5 rounded-xl bg-[#003580] hover:bg-[#00224f] text-white font-bold transition-colors"
                >
                  Save & Sync
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
