import React, { useState } from 'react';
import { AppIcon } from './AppIcon';
import { Plane, Clock, Info, X, Luggage, ArrowRight, CheckCircle2 } from 'lucide-react';

export const FlightItineraryCard: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        {/* Top Airline Bar (Trip.com Style) */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 px-5 sm:px-7 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppIcon name="china-eastern" className="w-8 h-8 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 tracking-tight">
                  China Eastern Airlines (中国东方航空)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#003580]">
                  SkyTeam
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Booking Reference (PNR): <strong className="text-slate-800">JKZ2YN</strong> • E-Ticket: <strong className="text-slate-800">7812903731438</strong>
              </span>
            </div>
          </div>

          {/* Corner Info Icon for Uncluttered Details */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-blue-50 text-slate-500 hover:text-[#003580] flex items-center justify-center transition-colors shadow-2xs"
            title="View airport transfer and baggage rules"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Flight Legs Container */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* LEG 1: CMB -> PVG */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Origin CMB */}
            <div className="min-w-[120px]">
              <div className="text-2xl font-black text-slate-900 font-mono">20:50</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">CMB • Colombo</div>
              <div className="text-xs text-slate-400">Bandaranaike Intl</div>
              <div className="text-[11px] font-semibold text-blue-700 mt-0.5">Sun, Nov 8, 2026</div>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 max-w-xs mx-auto text-center px-4">
              <span className="text-[11px] font-bold font-mono text-slate-500 block mb-1">
                MU6018 • 6h 45m Direct
              </span>
              <div className="flex items-center justify-center gap-2 my-1.5">
                <div className="h-px flex-1 bg-slate-200" />
                <Plane className="w-3.5 h-3.5 text-[#003580] rotate-90 shrink-0" />
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Airbus A330 • Economy</span>
            </div>

            {/* Destination PVG */}
            <div className="min-w-[120px] sm:text-right">
              <div className="text-2xl font-black text-slate-900 font-mono flex sm:justify-end items-baseline gap-1">
                <span>06:05</span>
                <span className="text-xs font-bold text-red-600 font-sans">+1 day</span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">PVG • Shanghai</div>
              <div className="text-xs text-slate-400">Pudong Intl Terminal 1</div>
              <div className="text-[11px] font-semibold text-blue-700 mt-0.5">Mon, Nov 9, 2026</div>
            </div>
          </div>

          {/* TRANSFER LAYOVER PILL */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t border-dashed border-amber-300 absolute" />
            <div className="relative px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>4h 50m Layover in Shanghai (PVG T1)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-amber-800 font-medium">Baggage Re-check & Customs</span>
            </div>
          </div>

          {/* LEG 2: PVG -> HAK */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Origin PVG */}
            <div className="min-w-[120px]">
              <div className="text-2xl font-black text-slate-900 font-mono">10:55</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">PVG • Shanghai</div>
              <div className="text-xs text-slate-400">Pudong Intl Terminal 1</div>
              <div className="text-[11px] font-semibold text-blue-700 mt-0.5">Mon, Nov 9, 2026</div>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 max-w-xs mx-auto text-center px-4">
              <span className="text-[11px] font-bold font-mono text-slate-500 block mb-1">
                MU6381 • 3h 40m Direct
              </span>
              <div className="flex items-center justify-center gap-2 my-1.5">
                <div className="h-px flex-1 bg-slate-200" />
                <Plane className="w-3.5 h-3.5 text-[#003580] rotate-90 shrink-0" />
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Domestic Flight • China Eastern</span>
            </div>

            {/* Destination HAK */}
            <div className="min-w-[120px] sm:text-right">
              <div className="text-2xl font-black text-slate-900 font-mono">14:35</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5">HAK • Haikou</div>
              <div className="text-xs text-slate-400">Meilan Intl Terminal 1</div>
              <div className="text-[11px] font-semibold text-blue-700 mt-0.5">Mon, Nov 9, 2026</div>
            </div>
          </div>
        </div>

        {/* Bottom Baggage Allowance Summary Bar */}
        <div className="bg-slate-50 px-5 sm:px-7 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-[#003580]" />
            <span>Checked Baggage Allowance: <strong>2 Pieces (23 kg each)</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span>Cabin: <strong>1 Backpack (~45cm) + 1 Fanny Pack</strong></span>
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="text-[#003580] font-bold hover:underline"
            >
              Transfer Guide &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Clean Info Modal for Airport Rules & Transfer Notice */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#003580]" />
                <h3 className="font-bold text-base text-slate-900">
                  Shanghai Pudong (PVG) Transit Notice
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <strong>Crucial Baggage Rule:</strong> Even though both flights are China Eastern, on arrival from Sri Lanka to Shanghai, your checked luggage will NOT be transferred automatically to the domestic flight.
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#003580] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Clear China Border Immigration with your passport, X1 visa, and Admission Notice.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#003580] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Collect <strong>both</strong> checked suitcases (30 × 40 × 70 cm and 27 × 41 × 57 cm) from the international carousels.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#003580] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Walk through China Customs with your bags and follow signs to <strong>Terminal 1 Domestic Transfers</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#003580] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">4</span>
                  <span>Re-check both bags at the China Eastern Domestic counter for flight <strong>MU6381</strong> to Haikou.</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2 rounded-xl bg-[#003580] hover:bg-[#00224f] text-white text-xs font-bold transition-colors"
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
