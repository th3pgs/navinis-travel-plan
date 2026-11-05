import React from 'react';
import { AlertCircle } from 'lucide-react';

export const LuggageWarningBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-5">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Luggage Allocation Protocol
            </span>
          </div>

          <h4 className="text-sm font-bold text-slate-900">
            Check Both Suitcases (65cm & 58cm) in Colombo — Do Not Carry the 58cm Hardcase into the Cabin
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs text-slate-700">
            <div className="p-3 bg-white border border-amber-200/60 rounded">
              <strong className="text-slate-900 block mb-0.5">1. Clamshell Opening Issue:</strong>
              The 58cm suitcase opens 50/50 sideways. Opening it in an airport queue to access electronics or documents exposes all contents on the floor.
            </div>

            <div className="p-3 bg-white border border-amber-200/60 rounded">
              <strong className="text-slate-900 block mb-0.5">2. Exceeds Cabin Limit (58cm &gt; 55cm):</strong>
              China Eastern's cabin maximum is 55cm. Airline gate staff will forcibly gate-check it—risking confiscation if lithium batteries are inside.
            </div>

            <div className="p-3 bg-white border border-amber-200/60 rounded">
              <strong className="text-slate-900 block mb-0.5">3. 2 Free Checked Bags:</strong>
              Your ticket (E-Ticket #7812903731438) includes 2 checked bags (23kg each). Use both checked allowances.
            </div>
          </div>

          <div className="text-xs text-slate-600 pt-1">
            <strong className="text-slate-800">Recommendation:</strong> Carry a structured 25L–30L laptop backpack (~45cm) for the Dell laptop, iPad 11, power bank, and A4 document folder. Pack the blue 43cm school bag flat inside Checked Bag 1 for daily campus classes.
          </div>
        </div>
      </div>
    </div>
  );
};
