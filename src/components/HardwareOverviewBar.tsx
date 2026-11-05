import React from 'react';
import { DeviceAsset, BagAsset } from '../data';
import { Check, AlertCircle } from 'lucide-react';

interface HardwareOverviewBarProps {
  devices: DeviceAsset[];
  bags: BagAsset[];
  onToggleDeviceBought: (id: string) => void;
  onToggleBagBought: (id: string) => void;
}

export const HardwareOverviewBar: React.FC<HardwareOverviewBarProps> = ({
  devices,
  bags,
  onToggleDeviceBought,
  onToggleBagBought,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Section 1: 4 Bags with Individual Distinct Vector Silhouettes & Bought Status */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Luggage Allocation (China Eastern 2-Piece Checked Allowance)
            </span>
            <span className="text-[11px] text-slate-500">
              Click checkbox if item needs to be purchased in Colombo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {bags.map((bag) => {
              const isUnbought = !bag.isBought;

              return (
                <div
                  key={bag.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                    isUnbought
                      ? 'border-red-400 bg-red-50/50 ring-1 ring-red-300'
                      : 'border-slate-200 bg-white hover:border-[#003580]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Distinct vector silhouettes for each bag type */}
                    {bag.kind === 'rolling-large' && (
                      <div className="w-10 h-14 rounded-md border-2 border-slate-800 bg-slate-100 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                        <div className="w-4 h-1.5 bg-slate-800 rounded-t-sm" />
                        <div className="w-6 h-0.5 bg-slate-400" />
                        <div className="w-6 h-0.5 bg-slate-400" />
                        <div className="w-6 h-0.5 bg-slate-400" />
                        <div className="flex justify-between w-6">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                        </div>
                      </div>
                    )}

                    {bag.kind === 'rolling-medium' && (
                      <div className="w-9 h-12 rounded-md border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                        <div className="w-3.5 h-1.5 bg-slate-700 rounded-t-sm" />
                        <div className="w-5 h-0.5 bg-slate-400" />
                        <div className="w-5 h-0.5 bg-slate-400" />
                        <div className="flex justify-between w-5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        </div>
                      </div>
                    )}

                    {bag.kind === 'backpack' && (
                      <div className="w-10 h-12 rounded-t-2xl rounded-b-md border-2 border-slate-800 bg-amber-50/60 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                        <div className="w-3 h-1 bg-slate-800 rounded-t-full" />
                        {/* Front pocket zipper arc */}
                        <div className="w-6 h-4 rounded-b-md border-b-2 border-slate-500 bg-white/70" />
                        {/* Base */}
                        <div className="w-8 h-1 bg-slate-700 rounded-xs" />
                      </div>
                    )}

                    {bag.kind === 'fannypack' && (
                      <div className="w-12 h-6 rounded-full border-2 border-rose-900 bg-rose-50 flex items-center justify-center relative shrink-0 shadow-2xs mt-2">
                        {/* Buckle strap lines */}
                        <span className="w-8 h-1 bg-rose-900 rounded-full" />
                        <span className="w-2 h-2 rounded-full bg-slate-800 absolute right-1" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {bag.name}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-[#003580] mt-0.5">
                        {bag.dimensions}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {bag.type}
                      </div>
                    </div>
                  </div>

                  {/* Bought Checkbox and Status Line */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bag.isBought}
                        onChange={() => onToggleBagBought(bag.id)}
                        className={`w-3.5 h-3.5 rounded border cursor-pointer ${
                          isUnbought ? 'border-red-400 accent-red-600' : 'border-slate-300 accent-emerald-600'
                        }`}
                      />
                      <span className={`text-[11px] font-semibold ${isUnbought ? 'text-red-700' : 'text-emerald-700'}`}>
                        {isUnbought ? 'Need to Buy' : 'Acquired / Owned'}
                      </span>
                    </label>

                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      isUnbought ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {isUnbought ? 'PENDING BUY' : 'READY'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Connected Hardware & Electronics (Bluetooth style grid with Earbuds stem & Bought state) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Connected Hardware & Electronics Vault
            </span>
            <span className="text-[11px] text-slate-500">
              Unbought equipment highlighted in red
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {devices.map((device) => {
              const isUnbought = !device.isBought;

              return (
                <div
                  key={device.id}
                  className={`p-2.5 rounded-lg border transition-all flex flex-col justify-between ${
                    isUnbought
                      ? 'border-red-400 bg-red-50/50 ring-1 ring-red-300'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1.5">
                    {/* Visual Vector Sketches */}
                    {device.type === 'phone-ios' && (
                      <div className="w-5 h-9 rounded-[5px] border-2 border-slate-800 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0 relative">
                        <div className="w-2 h-0.5 bg-slate-800 rounded-full" />
                        <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                    )}

                    {device.type === 'phone-android' && (
                      <div className="w-5 h-9 rounded-[3px] border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0 relative">
                        <div className="w-1 h-1 bg-slate-700 rounded-full mt-0.5" />
                        <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                    )}

                    {device.type === 'laptop' && (
                      <div className="w-8 h-6 flex flex-col items-center justify-center shrink-0">
                        <div className="w-7 h-4 rounded-t-sm border border-slate-700 bg-slate-800 flex items-center justify-center">
                          <div className="w-5 h-2.5 bg-slate-200 rounded-2xs" />
                        </div>
                        <div className="w-8 h-1 rounded-b-sm bg-slate-600" />
                      </div>
                    )}

                    {device.type === 'tablet' && (
                      <div className="w-6 h-8 rounded-sm border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0">
                        <div className="w-1 h-1 bg-slate-400 rounded-full" />
                        <div className="w-3 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                    )}

                    {/* Accurate In-Ear Soundcore Stem Earbuds Vector */}
                    {device.type === 'earbuds' && (
                      <div className="w-7 h-7 flex items-center justify-center gap-1 shrink-0">
                        {/* Left earbud with downward stem */}
                        <div className="flex flex-col items-center">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-800 bg-slate-900" />
                          <span className="w-1 h-3 bg-slate-700 rounded-b-full" />
                        </div>
                        {/* Right earbud with downward stem */}
                        <div className="flex flex-col items-center">
                          <span className="w-2.5 h-2.5 rounded-full border border-slate-800 bg-slate-900" />
                          <span className="w-1 h-3 bg-slate-700 rounded-b-full" />
                        </div>
                      </div>
                    )}

                    {device.type === 'powerbank' && (
                      <div className="w-5 h-9 rounded border border-slate-700 bg-slate-800 flex flex-col items-center justify-between py-0.5 shrink-0">
                        <div className="flex gap-0.5">
                          <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full" />
                          <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full" />
                        </div>
                        <span className="text-[6px] font-bold text-white font-mono leading-none">CCC</span>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                        {device.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {device.model}
                      </div>
                    </div>
                  </div>

                  {/* Device Bought Toggle */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={device.isBought}
                        onChange={() => onToggleDeviceBought(device.id)}
                        className="w-3 h-3 rounded cursor-pointer accent-emerald-600"
                      />
                      <span className={isUnbought ? 'text-red-700 font-bold' : 'text-slate-600'}>
                        {isUnbought ? 'Need to Buy' : 'Owned'}
                      </span>
                    </label>

                    <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                      isUnbought ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {device.carryLocation.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
