import React, { useState } from 'react';
import { Edit3, Check, Shield, RefreshCw, Camera, RotateCcw, X } from 'lucide-react';
import { uploadPhotoToSupabase } from '../cloudSync';

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
}) => {
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

      setToastMessage('Photo uploaded & synced to Supabase!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setToastMessage('Upload failed. Please try again.');
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
    <div className="ios-card p-5 sm:p-7 relative transition-all">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-3 right-12 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-in fade-in z-20">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tiny subtle Pencil Icon in the top-right corner (Requirement #2) */}
      <button
        type="button"
        onClick={() => setShowActionSheet(true)}
        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-[#007AFF] flex items-center justify-center transition-all z-10"
        title="Edit Scholar Profile"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Scholar Portrait */}
        <div className="relative shrink-0">
          {isUploading ? (
            <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-[#007AFF] p-2 text-center animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin mb-1 text-[#007AFF]" />
              <span className="text-[10px] font-semibold">Uploading...</span>
            </div>
          ) : (
            <img
              src={activePhoto}
              alt="Parana Gamage Navini Ravishka Priyantha"
              className="w-24 h-32 sm:w-28 sm:h-36 object-cover object-top rounded-2xl shadow-2xs border border-black/5 bg-slate-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultPassportPhoto;
              }}
            />
          )}
        </div>

        {/* Student Bio & Credentials */}
        <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0 pr-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#007AFF] text-[11px] font-semibold mb-1">
                <span>Hainan University • Haidian Campus</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                Parana Gamage Navini Ravishka Priyantha
              </h1>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-center sm:self-start">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Scholar Pass</span>
            </div>
          </div>

          <p className="text-xs text-[#8E8E93] leading-relaxed">
            Master of Food Science and Engineering (2026–2029) • English Taught Full Scholarship
          </p>

          {/* Clean Scannable Key-Value Strip (No big bottom buttons) */}
          <div className="pt-2 border-t border-black/5 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-[#8E8E93] block text-[10px] uppercase font-semibold">Admission Notice</span>
              <span className="font-mono font-bold text-slate-800 text-sm">263660001</span>
            </div>

            <div>
              <span className="text-[#8E8E93] block text-[10px] uppercase font-semibold">Passport Number</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{passportInfo.passportNumber}</span>
            </div>

            <div>
              <span className="text-[#8E8E93] block text-[10px] uppercase font-semibold">Expiry Date</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{passportInfo.expiryDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Confirmation Action Modal (Requirement #2) */}
      {showActionSheet && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center space-y-4 border border-black/10">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#007AFF] flex items-center justify-center mx-auto mb-2">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Edit Scholar Profile</h3>
              <p className="text-xs text-[#8E8E93] mt-1">
                Would you like to edit your passport details or change your profile photo?
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <label className="w-full py-2.5 px-3 rounded-xl bg-[#007AFF] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer active:opacity-80 transition-opacity">
                <Camera className="w-4 h-4" />
                <span>Upload / Snap New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setShowActionSheet(false);
                  setShowPassportEditor(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F2F2F7] hover:bg-slate-200 text-slate-900 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                <span>Edit Passport & Admission No.</span>
              </button>

              {passportInfo.photoUrl && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="w-full py-2 px-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Official Photo</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowActionSheet(false)}
                className="w-full py-2 px-3 text-[#8E8E93] hover:text-slate-900 font-semibold transition-colors pt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passport Editor Sheet */}
      {showPassportEditor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 border border-black/10 text-xs">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Edit Credentials</h3>
              <button
                type="button"
                onClick={() => setShowPassportEditor(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Passport Number
              </label>
              <input
                type="text"
                value={passportNum}
                onChange={(e) => setPassportNum(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7] font-mono font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <button
                type="button"
                onClick={() => setShowPassportEditor(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassport}
                className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white font-semibold shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
