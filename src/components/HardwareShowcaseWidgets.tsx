import React from 'react';
import { BagAsset, DeviceAsset } from '../data';
import { renderBagIcon, renderDeviceIcon } from './PhysicalHub';
import { Check, ShoppingBag, Eye, ExternalLink } from 'lucide-react';

interface HardwareShowcaseWidgetsProps {
  bags: BagAsset[];
  devices: DeviceAsset[];
  onToggleBagBought: (id: string) => void;
  onToggleDeviceBought: (id: string) => void;
  onInspectBag?: (bag: BagAsset) => void;
}

export const HardwareShowcaseWidgets: React.FC<HardwareShowcaseWidgetsProps> = ({
  bags,
  devices,
  onToggleBagBought,
  onToggleDeviceBought,
  onInspectBag,
}) => {
  const pendingCount =
    bags.filter((b) => !b.isBought).length + devices.filter((d) => !d.isBought).length;

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            Hardware & Luggage Showcase (10 Items)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tap badge to toggle Owned vs To Buy status in real time
          </span>
        </div>
        {pendingCount > 0 ? (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            {pendingCount} Pending / To Buy
          </span>
        ) : (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            All 10 Available & Ready ✓
          </span>
        )}
      </div>

      {/* Grid of 10 Showcase Widgets: 4 Bags + 6 Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. THE 4 BAGS */}
        {bags.map((bag) => {
          const isOwned = bag.isBought;
          return (
            <div
              key={bag.id}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between shadow-2xs relative ${
                isOwned
                  ? 'bg-[#ecfdf5] border-[#10b981]/50 hover:border-[#10b981]'
                  : 'bg-[#fef2f2] border-[#ef4444]/60 hover:border-[#ef4444]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {renderBagIcon(bag.kind, 'w-9 h-12', bag.name)}

                  {/* One-Tap Availability Toggle Badge */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBagBought(bag.id);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                      isOwned
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                        : 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300'
                    }`}
                    title="Tap to toggle Owned vs To Buy"
                  >
                    {isOwned ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Owned</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        <span>To Buy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight leading-snug">
                  {bag.name}
                </div>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  {bag.dimensions} • {bag.weightLimit}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                  {bag.recommendedContents}
                </p>
              </div>

              {/* Action link to inspect bag contents */}
              {onInspectBag && (
                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    {bag.isPacked ? 'Packed ✓' : 'Unpacked'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onInspectBag(bag)}
                    className="text-[11px] font-semibold text-[#007AFF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Contents</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* 2. THE 6 DEVICES */}
        {devices.map((device) => {
          const isOwned = device.isBought;
          return (
            <div
              key={device.id}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between shadow-2xs relative ${
                isOwned
                  ? 'bg-[#ecfdf5] border-[#10b981]/50 hover:border-[#10b981]'
                  : 'bg-[#fef2f2] border-[#ef4444]/60 hover:border-[#ef4444]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {renderDeviceIcon(device.type, 'w-7 h-11')}

                  {/* One-Tap Availability Toggle Badge */}
                  <button
                    type="button"
                    onClick={() => onToggleDeviceBought(device.id)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                      isOwned
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                        : 'bg-red-100 hover:bg-red-200 text-red-800 border-red-300'
                    }`}
                    title="Tap to toggle Owned vs To Buy"
                  >
                    {isOwned ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Owned</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        <span>To Buy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight leading-snug">
                  {device.name}
                </div>
                <div className="text-[11px] font-medium text-slate-700 mt-0.5">
                  {device.model}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                  {device.role}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-500 truncate max-w-[120px]">
                  {device.carryLocation}
                </span>
                <span className="font-semibold text-slate-700">
                  {device.carrierOrOs}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
