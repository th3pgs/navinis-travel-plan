import React, { useState } from 'react';
import { AppIcon } from './AppIcon';
import { Plane, Clock, Luggage, ChevronDown, X, Info } from 'lucide-react';

export const FlightItineraryCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTransferGuide, setShowTransferGuide] = useState(false);

  return (
    <>
      <div className="ios-card overflow-hidden transition-all">
        {/* Compact Summary Header (Collapsed Default State, Requirement #3) */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <AppIcon name="china-eastern" className="w-8 h-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                  China Eastern Airlines 中国东方航空
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 text-[#007AFF]">
                  SkyTeam
                </span>
              </div>
              <div className="text-[11px] text-[#8E8E93] font-mono mt-0.5 truncate">
                PNR: <strong className="text-slate-800">JKZ2YN</strong> • E-Ticket: <strong className="text-slate-800">7812903731438</strong>
              </div>
            </div>
          </div>

          {/* Clean Downward Chevron Arrow (rotates on expand) */}
          <div className="shrink-0 pl-2">
            <div className={`w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Expanded State (Smooth Accordion Transition) */}
        {isExpanded && (
          <div className="border-t border-black/5 animate-in fade-in slide-in-from-top-1 duration-250">
            {/* Flight Legs Container */}
            <div className="p-4 sm:p-6 space-y-5 bg-white">
              {/* LEG 1: CMB -> PVG */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Origin CMB */}
                <div className="min-w-[120px]">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">20:50</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">CMB • Colombo</div>
                  <div className="text-[11px] text-[#8E8E93]">Bandaranaike Intl</div>
                  <div className="text-[11px] font-semibold text-[#007AFF] mt-0.5">Sun, Nov 8, 2026</div>
                </div>

                {/* Flight Path Graphic */}
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

                {/* Destination PVG */}
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

              {/* TRANSFER LAYOVER PILL */}
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
                {/* Origin PVG */}
                <div className="min-w-[120px]">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">10:55</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">PVG • Shanghai</div>
                  <div className="text-[11px] text-[#8E8E93]">Pudong Intl Terminal 1</div>
                  <div className="text-[11px] font-semibold text-[#007AFF] mt-0.5">Mon, Nov 9, 2026</div>
                </div>

                {/* Flight Path Graphic */}
                <div className="flex-1 max-w-xs mx-auto text-center px-2">
                  <span className="text-[10px] font-bold font-mono text-[#8E8E93] block mb-1">
                    MU6381 • 3h 40m Direct
                  </span>
                  <div className="flex items-center justify-center gap-2 my-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <Plane className="w-3.5 h-3.5 text-[#007AFF] rotate-90 shrink-0" />
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Domestic Leg • China Eastern</span>
                </div>

                {/* Destination HAK */}
                <div className="min-w-[120px] sm:text-right">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">14:35</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">HAK • Haikou</div>
                  <div className="text-[11px] text-[#8E8E93]">Meilan Intl Terminal 1</div>
                  <div className="text-[11px] font-semibold text-[#007AFF] mt-0.5">Mon, Nov 9, 2026</div>
                </div>
              </div>
            </div>

            {/* Bottom Baggage Allowance Summary Bar */}
            <div className="bg-[#F2F2F7] px-4 sm:px-6 py-2.5 border-t border-black/5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4 text-[#007AFF]" />
                <span>Checked Baggage Allowance: <strong>2 Pieces (23 kg each)</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span>Cabin: <strong>1 Backpack + 1 Fanny Pack</strong></span>
                <button
                  type="button"
                  onClick={() => setShowTransferGuide(true)}
                  className="text-[#007AFF] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Transfer Guide &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Info Modal for Airport Rules & Transfer Notice */}
      {showTransferGuide && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 border border-black/10">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#007AFF]" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Shanghai Pudong (PVG) Transit Notice
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                <strong>Crucial Baggage Rule:</strong> Even though both flights are China Eastern, on arrival from Sri Lanka to Shanghai, your checked luggage will NOT be transferred automatically to the domestic flight.
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#007AFF] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Clear China Border Immigration with your passport, X1 visa, and Admission Notice.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#007AFF] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Collect <strong>both</strong> checked suitcases (30 × 40 × 70 cm and 27 × 41 × 57 cm) from the international carousels.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#007AFF] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Walk through China Customs with your bags and follow signs to <strong>Terminal 1 Domestic Transfers</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#007AFF] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">4</span>
                  <span>Re-check both bags at the China Eastern Domestic counter for flight <strong>MU6381</strong> to Haikou.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTransferGuide(false)}
                className="px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
