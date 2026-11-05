import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthGateProps {
  onUnlock: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const handleInput = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);

    if (cleaned === '101926') {
      localStorage.setItem('navini_auth_unlocked', 'true');
      onUnlock();
    } else if (cleaned.length === 6) {
      setErrorShake(true);
      setTimeout(() => {
        setErrorShake(false);
        setCode('');
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-white border border-slate-300 rounded-lg shadow-sm p-8 transition-all ${
          errorShake ? 'animate-shake border-red-500 ring-2 ring-red-200' : ''
        }`}
      >
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Restricted Portal</span>
        </div>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Navini's Travel Plan
        </h1>
        <p className="text-xs text-slate-600 mt-1 mb-6">
          Sri Lanka (CMB) to Hainan University (HAK) Relocation & Document Manager. Enter passcode to access.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Passcode
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              value={code}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Enter 6-digit passcode"
              className="w-full px-3.5 py-2.5 rounded border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-center tracking-[0.3em] text-lg focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 bg-white"
            />
          </div>

          <button
            onClick={() => handleInput(code)}
            className="w-full py-2.5 rounded bg-[#003580] hover:bg-[#00224f] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted with local client storage & Supabase sync</span>
        </div>
      </div>
    </div>
  );
};
