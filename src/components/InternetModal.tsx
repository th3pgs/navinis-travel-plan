import React, { useState } from 'react';
import { InternetAppItem } from '../data';
import { AppIcon } from './AppIcon';
import { ShieldCheck, Check, Smartphone, Monitor, Tablet, X } from 'lucide-react';

interface InternetModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: InternetAppItem[];
  onToggleInstalled: (id: string) => void;
  onToggleConfigured: (id: string) => void;
}

export const InternetModal: React.FC<InternetModalProps> = ({
  isOpen,
  onClose,
  apps,
  onToggleInstalled,
  onToggleConfigured,
}) => {
  const [activePlatform, setActivePlatform] = useState<'All' | 'iOS' | 'Android' | 'Windows'>('All');

  if (!isOpen) return null;

  const filteredApps = apps.filter((app) =>
    activePlatform === 'All' ? true : app.platform === activePlatform
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#003580] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <ShieldCheck className="w-5 h-5 text-[#febb02]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Internet, Communication & Great Firewall Bypass
              </h2>
              <p className="text-xs text-blue-200">
                Shadowrocket • Saily/Airalo Travel eSIM • v2rayNG • Clash Verge Rev • Stock AI Services
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 shrink-0">
          {(['All', 'iOS', 'Android', 'Windows'] as const).map((plat) => (
            <button
              key={plat}
              onClick={() => setActivePlatform(plat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                activePlatform === plat
                  ? 'bg-[#003580] text-white border-[#003580]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {plat === 'All' ? 'All Platforms' : plat}
            </button>
          ))}
        </div>

        {/* Informative Firewall Callout Banner */}
        <div className="p-4 bg-blue-50/60 border-b border-blue-200 text-xs text-slate-700 shrink-0 space-y-1">
          <strong className="text-blue-950 font-bold block">
            How Navini Bypasses the Great Firewall (GFW):
          </strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 mt-1">
            <div className="p-2 rounded bg-white border border-blue-200">
              <strong className="text-slate-900 block">Phase 1: Saily / Airalo Travel eSIM</strong>
              Roaming eSIM traffic routes outside mainland China via Hong Kong/Singapore telecom gateways, giving uncensored Google/WhatsApp access upon touchdown at Shanghai PVG.
            </div>
            <div className="p-2 rounded bg-white border border-blue-200">
              <strong className="text-slate-900 block">Phase 2: Shadowrocket + Ji Chang Nodes</strong>
              Once on Chinese campus Wi-Fi / physical China Mobile SIM, Shadowrocket encrypts outbound traffic over V2Ray/Trojan protocols.
            </div>
          </div>
        </div>

        {/* App List Grid with Real Brand Logos */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  {/* Brand Vector Icon */}
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                    <AppIcon name={app.appIcon} className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {app.platform}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#003580] uppercase tracking-wide block mt-0.5">
                      {app.category}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {app.role}
                    </p>
                  </div>
                </div>

                {/* Dual Checkboxes: Installed & Configured */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={app.isInstalled}
                      onChange={() => onToggleInstalled(app.id)}
                      className="w-3.5 h-3.5 rounded accent-emerald-600"
                    />
                    <span>Installed</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={app.isConfigured}
                      onChange={() => onToggleConfigured(app.id)}
                      className="w-3.5 h-3.5 rounded accent-[#003580]"
                    />
                    <span>Configured</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003580] hover:bg-[#00224f] text-white text-xs font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
