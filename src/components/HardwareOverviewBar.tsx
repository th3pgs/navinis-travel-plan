import React from 'react';
import { DeviceAsset, BagAsset } from '../data';

interface HardwareOverviewBarProps {
  devices: DeviceAsset[];
  bags: BagAsset[];
  packedBagsCount: number;
}

export const HardwareOverviewBar: React.FC<HardwareOverviewBarProps> = ({
  devices,
  bags,
  packedBagsCount,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Section 1: Bags & Luggage Dimensions Banner */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Luggage Allocation & Dimensions (China Eastern 2-Piece Checked Allowance)
            </span>
            <span className="text-xs font-semibold text-[#003580] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {packedBagsCount} of 4 Bags Packed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {bags.map((bag) => (
              <div
                key={bag.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#003580] transition-colors flex items-start gap-3"
              >
                {/* Visual luggage vector icon with size badge */}
                <div className="w-10 h-12 rounded border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                  {/* Handle */}
                  <div className="w-4 h-1 bg-slate-700 rounded-t-sm" />
                  {/* Bag body lines */}
                  <div className="w-6 h-0.5 bg-slate-300" />
                  <div className="w-6 h-0.5 bg-slate-300" />
                  {/* Wheels */}
                  <div className="flex justify-between w-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{bag.name}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#003580] mt-0.5">
                    {bag.dimensions}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {bag.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Connected Hardware & Electronics (Bluetooth Device Style Grid) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Connected Electronics & Device Compartmentalization
            </span>
            <span className="text-xs text-slate-500">All 6 Hardware Units Accounted</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {devices.map((device) => {
              return (
                <div
                  key={device.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-shadow shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {/* Visual Vector Sketch of Device */}
                    {device.type === 'phone-ios' && (
                      <div className="w-6 h-10 rounded-[6px] border-2 border-slate-800 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0 relative">
                        {/* Dynamic Island Pill */}
                        <div className="w-2.5 h-0.5 bg-slate-800 rounded-full" />
                        {/* Home indicator bar */}
                        <div className="w-3 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                    )}

                    {device.type === 'phone-android' && (
                      <div className="w-6 h-10 rounded-[4px] border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0 relative">
                        {/* Punch hole camera */}
                        <div className="w-1 h-1 bg-slate-700 rounded-full mt-0.5" />
                        <div className="w-3 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                    )}

                    {device.type === 'laptop' && (
                      <div className="w-9 h-7 flex flex-col items-center justify-center shrink-0">
                        {/* Laptop screen */}
                        <div className="w-8 h-5 rounded-t-sm border border-slate-700 bg-slate-800 flex items-center justify-center">
                          <div className="w-6 h-3 bg-slate-200 rounded-2xs" />
                        </div>
                        {/* Laptop keyboard base */}
                        <div className="w-9 h-1 rounded-b-sm bg-slate-600" />
                      </div>
                    )}

                    {device.type === 'tablet' && (
                      <div className="w-7 h-9 rounded-sm border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0">
                        <div className="w-1 h-1 bg-slate-400 rounded-full" />
                        <div className="w-4 h-0.5 bg-slate-400 rounded-full" />
                      </div>
                    )}

                    {device.type === 'earbuds' && (
                      <div className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center shrink-0">
                        {/* Earbuds case vector */}
                        <div className="w-5 h-4 rounded-full border border-slate-700 bg-white flex items-center justify-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                        </div>
                      </div>
                    )}

                    {device.type === 'powerbank' && (
                      <div className="w-6 h-10 rounded border border-slate-700 bg-slate-800 flex flex-col items-center justify-between py-1 shrink-0">
                        <div className="flex gap-0.5">
                          <span className="w-1 h-0.5 bg-emerald-400 rounded-full" />
                          <span className="w-1 h-0.5 bg-emerald-400 rounded-full" />
                        </div>
                        <span className="text-[7px] font-bold text-white font-mono">CCC</span>
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

                  <div className="pt-1.5 border-t border-slate-100 text-[10px] space-y-0.5">
                    <div className="text-slate-700 font-medium truncate">
                      📍 {device.carryLocation}
                    </div>
                    <div className="text-[#003580] truncate font-mono text-[9px]">
                      {device.carrierOrOs}
                    </div>
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
