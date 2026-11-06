import React from 'react';
import { BagAsset, DeviceAsset } from '../data';
import { Check, AlertCircle, PackageCheck, Eye } from 'lucide-react';

interface HardwareShowcaseWidgetsProps {
  bags: BagAsset[];
  devices: DeviceAsset[];
  onToggleBagBought: (id: string) => void;
  onToggleDeviceBought: (id: string) => void;
  onCycleBagStatus?: (id: string) => void;
  onCycleDeviceStatus?: (id: string) => void;
  onInspectBag?: (bag: BagAsset) => void;
}

// Crisp Vector Graphic for Bags
function renderWidgetBagIcon(kind: BagAsset['kind'] | string, isLightBg: boolean) {
  const iconStroke = isLightBg ? '#065F46' : '#FFFFFF';
  const iconFill = isLightBg ? '#A7F3D0' : 'rgba(255, 255, 255, 0.2)';

  if (kind === 'rolling-large') {
    return (
      <svg viewBox="0 0 36 48" className="w-8 h-11 shrink-0" fill="none">
        {/* Telescopic handle */}
        <path d="M13 10V4C13 2.9 13.9 2 15 2H21C22.1 2 23 2.9 23 4V10" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
        <rect x="15" y="2" width="6" height="2" fill={iconStroke} />
        {/* Suitcase body */}
        <rect x="5" y="10" width="26" height="32" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        {/* Ribs / Grooves */}
        <line x1="10" y1="18" x2="26" y2="18" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="10" y1="24" x2="26" y2="24" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="10" y1="30" x2="26" y2="30" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="10" y1="36" x2="26" y2="36" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Wheels */}
        <circle cx="9" cy="44" r="2" fill={iconStroke} />
        <circle cx="27" cy="44" r="2" fill={iconStroke} />
      </svg>
    );
  }

  if (kind === 'rolling-medium') {
    return (
      <svg viewBox="0 0 36 48" className="w-8 h-11 shrink-0" fill="none">
        {/* Telescopic handle */}
        <path d="M14 12V5C14 3.9 14.9 3 16 3H20C21.1 3 22 3.9 22 5V12" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
        {/* Suitcase body */}
        <rect x="6" y="12" width="24" height="29" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        {/* Grooves */}
        <line x1="11" y1="20" x2="25" y2="20" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="11" y1="26" x2="25" y2="26" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="11" y1="32" x2="25" y2="32" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Wheels */}
        <circle cx="10" cy="43" r="2" fill={iconStroke} />
        <circle cx="26" cy="43" r="2" fill={iconStroke} />
      </svg>
    );
  }

  if (kind === 'backpack') {
    return (
      <svg viewBox="0 0 36 48" className="w-8 h-11 shrink-0" fill="none">
        {/* Top Grab Handle */}
        <path d="M14 9C14 6 22 6 22 9" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
        {/* Main Backpack Body */}
        <path d="M8 15C8 11.7 10.7 9 14 9H22C25.3 9 28 11.7 28 15V40C28 42.2 26.2 44 24 44H12C9.8 44 8 42.2 8 40V15Z" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        {/* Front Tech Pocket */}
        <rect x="11" y="24" width="14" height="15" rx="2" fill="none" stroke={iconStroke} strokeWidth="1.5" />
        <line x1="11" y1="28" x2="25" y2="28" stroke={iconStroke} strokeWidth="1.2" />
      </svg>
    );
  }

  // Sling / Fanny Pack
  return (
    <svg viewBox="0 0 44 32" className="w-10 h-8 shrink-0" fill="none">
      {/* Strap */}
      <path d="M4 14C4 9 12 7 22 7C32 7 40 9 40 14" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
      {/* Pack Body */}
      <path d="M7 13C7 11.3 8.3 10 10 10H34C35.7 10 37 11.3 37 13L35 24C34.7 26.2 32.8 28 30.6 28H13.4C11.2 28 9.3 26.2 9 24L7 13Z" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
      {/* Zipper */}
      <line x1="12" y1="15" x2="32" y2="15" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Crisp Vector Graphic for Devices
function renderWidgetDeviceIcon(type: DeviceAsset['type'], isLightBg: boolean) {
  const iconStroke = isLightBg ? '#065F46' : '#FFFFFF';
  const iconFill = isLightBg ? '#A7F3D0' : 'rgba(255, 255, 255, 0.2)';

  if (type === 'phone-ios') {
    return (
      <svg viewBox="0 0 28 48" className="w-7 h-11 shrink-0" fill="none">
        <rect x="3" y="3" width="22" height="42" rx="5" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        {/* Dynamic Island */}
        <rect x="10" y="6" width="8" height="2.5" rx="1.25" fill={iconStroke} />
        {/* Home Indicator */}
        <line x1="10" y1="41" x2="18" y2="41" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'phone-android') {
    return (
      <svg viewBox="0 0 28 48" className="w-7 h-11 shrink-0" fill="none">
        <rect x="3" y="3" width="22" height="42" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        {/* Centered Punch-Hole Camera */}
        <circle cx="14" cy="7" r="1.5" fill={iconStroke} />
        {/* Android Navigation Pill */}
        <line x1="11" y1="41" x2="17" y2="41" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'tablet') {
    return (
      <svg viewBox="0 0 36 48" className="w-8 h-11 shrink-0" fill="none">
        <rect x="3" y="3" width="30" height="42" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <circle cx="18" cy="6" r="1" fill={iconStroke} />
        <line x1="14" y1="42" x2="22" y2="42" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'laptop') {
    return (
      <svg viewBox="0 0 44 32" className="w-10 h-8 shrink-0" fill="none">
        {/* Laptop Screen */}
        <rect x="6" y="4" width="32" height="21" rx="2" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        {/* Screen Bezel / Logo */}
        <circle cx="22" cy="14" r="2.5" stroke={iconStroke} strokeWidth="1" />
        {/* Laptop Base / Keyboard */}
        <path d="M2 27L5 25H39L42 27C42 28.1 41.1 29 40 29H4C2.9 29 2 28.1 2 27Z" fill={iconStroke} />
        <line x1="18" y1="26" x2="26" y2="26" stroke={isLightBg ? '#FFFFFF' : '#065F46'} strokeWidth="1" />
      </svg>
    );
  }

  if (type === 'earbuds') {
    return (
      <svg viewBox="0 0 36 36" className="w-9 h-9 shrink-0" fill="none">
        {/* Left Earbud */}
        <circle cx="12" cy="11" r="5" fill={iconFill} stroke={iconStroke} strokeWidth="1.8" />
        <rect x="10.5" y="14" width="3" height="12" rx="1.5" fill={iconStroke} />
        {/* Right Earbud */}
        <circle cx="24" cy="11" r="5" fill={iconFill} stroke={iconStroke} strokeWidth="1.8" />
        <rect x="22.5" y="14" width="3" height="12" rx="1.5" fill={iconStroke} />
      </svg>
    );
  }

  // CCC Power Bank (10,000mAh)
  return (
    <svg viewBox="0 0 28 44" className="w-7 h-10 shrink-0" fill="none">
      <rect x="3" y="3" width="22" height="38" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
      {/* 4 LED power dots */}
      <circle cx="8" cy="8" r="1" fill={iconStroke} />
      <circle cx="12" cy="8" r="1" fill={iconStroke} />
      <circle cx="16" cy="8" r="1" fill={iconStroke} />
      <circle cx="20" cy="8" r="1" fill={iconStroke} />
      {/* Ports */}
      <rect x="9" y="34" width="10" height="3" rx="1" stroke={iconStroke} strokeWidth="1.2" />
    </svg>
  );
}

export const HardwareShowcaseWidgets: React.FC<HardwareShowcaseWidgetsProps> = ({
  bags,
  devices,
  onToggleBagBought,
  onToggleDeviceBought,
  onCycleBagStatus,
  onCycleDeviceStatus,
  onInspectBag,
}) => {
  const missingCount =
    bags.filter((b) => !b.isBought).length + devices.filter((d) => !d.isBought).length;
  const unpackedCount =
    bags.filter((b) => b.isBought && !b.isPacked).length +
    devices.filter((d) => d.isBought && !d.isPacked).length;
  const packedCount =
    bags.filter((b) => b.isBought && b.isPacked).length +
    devices.filter((d) => d.isBought && d.isPacked).length;

  const handleBagClick = (id: string) => {
    if (onCycleBagStatus) {
      onCycleBagStatus(id);
    } else {
      onToggleBagBought(id);
    }
  };

  const handleDeviceClick = (id: string) => {
    if (onCycleDeviceStatus) {
      onCycleDeviceStatus(id);
    } else {
      onToggleDeviceBought(id);
    }
  };

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            Hardware & Luggage Status (10 Items)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Tap card or badge to cycle: Missing → Bought → Fully Packed
          </span>
        </div>
        {missingCount > 0 ? (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white shadow-2xs">
            {missingCount} Missing / To Buy
          </span>
        ) : unpackedCount > 0 ? (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#10B981]">
            {unpackedCount} Ready to Pack
          </span>
        ) : (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white shadow-2xs">
            All 10 Packed ✓
          </span>
        )}
      </div>

      {/* Grid of 10 Showcase Widgets: 4 Bags + 6 Devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. THE 4 BAGS */}
        {bags.map((bag) => {
          // Strict 3-State Logic:
          // State 1: !isBought -> Solid Vivid Red (#DC2626) with White text
          // State 2: isBought && !isPacked -> Soft Light Green (#D1FAE5) with Dark Emerald text
          // State 3: isBought && isPacked -> Solid Full Green (#16A34A) with White text
          const isMissing = !bag.isBought;
          const isBoughtUnpacked = bag.isBought && !bag.isPacked;
          const isFullyPacked = bag.isBought && bag.isPacked;

          const cardBgClass = isMissing
            ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-xs'
            : isBoughtUnpacked
            ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46] shadow-xs'
            : 'bg-[#16A34A] border-[#16A34A] text-white shadow-xs';

          const badgeClass = isMissing
            ? 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            : isBoughtUnpacked
            ? 'bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#065F46] border-[#10B981]/40'
            : 'bg-white/20 hover:bg-white/30 text-white border-white/30';

          const subtextClass = isMissing
            ? 'text-white/80'
            : isBoughtUnpacked
            ? 'text-[#065F46]/80'
            : 'text-white/80';

          return (
            <div
              key={bag.id}
              onClick={() => handleBagClick(bag.id)}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between cursor-pointer select-none relative ${cardBgClass}`}
              title="Tap to cycle: Missing → Bought → Fully Packed"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {renderWidgetBagIcon(bag.kind, isBoughtUnpacked)}

                  {/* 3-State Cycle Badge */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBagClick(bag.id);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-transform active:scale-95 flex items-center gap-1 shrink-0 ${badgeClass}`}
                  >
                    {isMissing ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Missing</span>
                      </>
                    ) : isBoughtUnpacked ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Bought</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-3 h-3 stroke-[2.5]" />
                        <span>Packed ✓</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-bold text-xs sm:text-sm tracking-tight leading-snug">
                  {bag.name}
                </div>
                <div className={`text-[11px] font-mono mt-0.5 ${subtextClass}`}>
                  {bag.dimensions} • {bag.weightLimit}
                </div>
                <p className={`text-[10px] line-clamp-2 mt-1 ${subtextClass}`}>
                  {bag.recommendedContents}
                </p>
              </div>

              {/* Action link to inspect bag contents */}
              {onInspectBag && (
                <div className="mt-3 pt-2 border-t border-current/15 flex items-center justify-between">
                  <span className={`text-[10px] font-semibold ${subtextClass}`}>
                    {isFullyPacked ? 'Bag Loaded ✓' : isBoughtUnpacked ? 'Empty Bag' : 'To Acquire'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectBag(bag);
                    }}
                    className="text-[11px] font-bold underline flex items-center gap-1 cursor-pointer hover:opacity-80"
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
          const isMissing = !device.isBought;
          const isBoughtUnpacked = device.isBought && !device.isPacked;
          const isFullyPacked = device.isBought && device.isPacked;

          const cardBgClass = isMissing
            ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-xs'
            : isBoughtUnpacked
            ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46] shadow-xs'
            : 'bg-[#16A34A] border-[#16A34A] text-white shadow-xs';

          const badgeClass = isMissing
            ? 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            : isBoughtUnpacked
            ? 'bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#065F46] border-[#10B981]/40'
            : 'bg-white/20 hover:bg-white/30 text-white border-white/30';

          const subtextClass = isMissing
            ? 'text-white/80'
            : isBoughtUnpacked
            ? 'text-[#065F46]/80'
            : 'text-white/80';

          return (
            <div
              key={device.id}
              onClick={() => handleDeviceClick(device.id)}
              className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between cursor-pointer select-none relative ${cardBgClass}`}
              title="Tap to cycle: Missing → Bought → Fully Packed"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  {renderWidgetDeviceIcon(device.type, isBoughtUnpacked)}

                  {/* 3-State Cycle Badge */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeviceClick(device.id);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-transform active:scale-95 flex items-center gap-1 shrink-0 ${badgeClass}`}
                  >
                    {isMissing ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Missing</span>
                      </>
                    ) : isBoughtUnpacked ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Bought</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-3 h-3 stroke-[2.5]" />
                        <span>Packed ✓</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="font-bold text-xs sm:text-sm tracking-tight leading-snug">
                  {device.name}
                </div>
                <div className={`text-[11px] font-medium mt-0.5 ${subtextClass}`}>
                  {device.model}
                </div>
                <p className={`text-[10px] line-clamp-2 mt-1 ${subtextClass}`}>
                  {device.role}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-current/15 flex items-center justify-between text-[10px]">
                <span className={`font-mono truncate max-w-[120px] ${subtextClass}`}>
                  {device.carryLocation}
                </span>
                <span className={`font-semibold ${subtextClass}`}>
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
