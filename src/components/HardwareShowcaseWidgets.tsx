import React from 'react';
import { BagAsset, DeviceAsset, normalizeBagLocation } from '../data';
import { Check, AlertCircle, PackageCheck } from 'lucide-react';

interface HardwareShowcaseWidgetsProps {
  bags: BagAsset[];
  devices: DeviceAsset[];
  onToggleBagBought: (id: string) => void;
  onToggleDeviceBought: (id: string) => void;
  onCycleBagStatus?: (id: string) => void;
  onCycleDeviceStatus?: (id: string) => void;
  onInspectBag?: (bag: BagAsset) => void;
}

// Vector Graphic for Bags
export function renderWidgetBagIcon(kind: BagAsset['kind'] | string, isLightBg: boolean, sizeClass?: string) {
  const iconStroke = isLightBg ? '#065F46' : '#FFFFFF';
  const iconFill = isLightBg ? '#A7F3D0' : 'rgba(255, 255, 255, 0.25)';

  if (kind === 'rolling-large') {
    return (
      <svg viewBox="0 0 36 48" className={`${sizeClass || 'w-8 h-10'} shrink-0`} fill="none">
        <path d="M13 10V4C13 2.9 13.9 2 15 2H21C22.1 2 23 2.9 23 4V10" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
        <rect x="5" y="10" width="26" height="32" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <line x1="10" y1="18" x2="26" y2="18" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="10" y1="26" x2="26" y2="26" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="10" y1="34" x2="26" y2="34" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="9" cy="44" r="2" fill={iconStroke} />
        <circle cx="27" cy="44" r="2" fill={iconStroke} />
      </svg>
    );
  }

  if (kind === 'rolling-medium') {
    return (
      <svg viewBox="0 0 36 48" className={`${sizeClass || 'w-8 h-10'} shrink-0`} fill="none">
        <path d="M14 12V5C14 3.9 14.9 3 16 3H20C21.1 3 22 3.9 22 5V12" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
        <rect x="6" y="12" width="24" height="29" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <line x1="11" y1="20" x2="25" y2="20" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <line x1="11" y1="28" x2="25" y2="28" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="10" cy="43" r="2" fill={iconStroke} />
        <circle cx="26" cy="43" r="2" fill={iconStroke} />
      </svg>
    );
  }

  if (kind === 'backpack') {
    return (
      <svg viewBox="0 0 36 48" className={`${sizeClass || 'w-8 h-10'} shrink-0`} fill="none">
        <path d="M14 9C14 6 22 6 22 9" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
        <path d="M8 15C8 11.7 10.7 9 14 9H22C25.3 9 28 11.7 28 15V40C28 42.2 26.2 44 24 44H12C9.8 44 8 42.2 8 40V15Z" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <rect x="11" y="24" width="14" height="15" rx="2" fill="none" stroke={iconStroke} strokeWidth="1.5" />
      </svg>
    );
  }

  // Sling / Fanny Pack
  return (
    <svg viewBox="0 0 44 32" className={`${sizeClass || 'w-9 h-7'} shrink-0`} fill="none">
      <path d="M4 14C4 9 12 7 22 7C32 7 40 9 40 14" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 13C7 11.3 8.3 10 10 10H34C35.7 10 37 11.3 37 13L35 24C34.7 26.2 32.8 28 30.6 28H13.4C11.2 28 9.3 26.2 9 24L7 13Z" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
      <line x1="12" y1="15" x2="32" y2="15" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Vector Graphic for Devices
function renderWidgetDeviceIcon(type: DeviceAsset['type'], isLightBg: boolean) {
  const iconStroke = isLightBg ? '#065F46' : '#FFFFFF';
  const iconFill = isLightBg ? '#A7F3D0' : 'rgba(255, 255, 255, 0.25)';

  if (type === 'phone-ios') {
    return (
      <svg viewBox="0 0 28 48" className="w-6 h-9 shrink-0" fill="none">
        <rect x="3" y="3" width="22" height="42" rx="5" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <rect x="10" y="6" width="8" height="2.5" rx="1.25" fill={iconStroke} />
        <line x1="10" y1="41" x2="18" y2="41" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'phone-android') {
    return (
      <svg viewBox="0 0 28 48" className="w-6 h-9 shrink-0" fill="none">
        <rect x="3" y="3" width="22" height="42" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <circle cx="14" cy="7" r="1.5" fill={iconStroke} />
        <line x1="11" y1="41" x2="17" y2="41" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'tablet') {
    return (
      <svg viewBox="0 0 36 48" className="w-7 h-9 shrink-0" fill="none">
        <rect x="3" y="3" width="30" height="42" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <circle cx="18" cy="6" r="1" fill={iconStroke} />
        <line x1="14" y1="42" x2="22" y2="42" stroke={iconStroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'laptop') {
    return (
      <svg viewBox="0 0 44 32" className="w-8 h-7 shrink-0" fill="none">
        <rect x="6" y="4" width="32" height="21" rx="2" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
        <path d="M2 27L5 25H39L42 27C42 28.1 41.1 29 40 29H4C2.9 29 2 28.1 2 27Z" fill={iconStroke} />
      </svg>
    );
  }

  if (type === 'earbuds') {
    return (
      <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0" fill="none">
        <circle cx="12" cy="11" r="5" fill={iconFill} stroke={iconStroke} strokeWidth="1.8" />
        <rect x="10.5" y="14" width="3" height="12" rx="1.5" fill={iconStroke} />
        <circle cx="24" cy="11" r="5" fill={iconFill} stroke={iconStroke} strokeWidth="1.8" />
        <rect x="22.5" y="14" width="3" height="12" rx="1.5" fill={iconStroke} />
      </svg>
    );
  }

  // CCC Power Bank (10,000mAh)
  return (
    <svg viewBox="0 0 28 44" className="w-6 h-9 shrink-0" fill="none">
      <rect x="3" y="3" width="22" height="38" rx="4" fill={iconFill} stroke={iconStroke} strokeWidth="2" />
      <circle cx="8" cy="8" r="1" fill={iconStroke} />
      <circle cx="12" cy="8" r="1" fill={iconStroke} />
      <circle cx="16" cy="8" r="1" fill={iconStroke} />
      <circle cx="20" cy="8" r="1" fill={iconStroke} />
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
}) => {
  const missingCount =
    bags.filter((b) => !b.isBought).length + devices.filter((d) => !d.isBought).length;
  const unpackedCount =
    bags.filter((b) => b.isBought && !b.isPacked).length +
    devices.filter((d) => d.isBought && !d.isPacked).length;

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
    <section className="space-y-2.5">
      {/* Minimal iOS Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-900 tracking-tight">
          Luggage & Hardware
        </span>
        {missingCount > 0 ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DC2626] text-white">
            {missingCount} to buy
          </span>
        ) : unpackedCount > 0 ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#10B981]">
            {unpackedCount} to pack
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16A34A] text-white">
            All packed ✓
          </span>
        )}
      </div>

      {/* 1. THE 4 BAGS: Compact 2-Column x 2-Row iOS Grid */}
      <div className="grid grid-cols-2 gap-3">
        {bags.map((bag) => {
          const isMissing = !bag.isBought;
          const isBoughtUnpacked = bag.isBought && !bag.isPacked;

          const cardBgClass = isMissing
            ? 'bg-[#DC2626] border-[#DC2626] text-white'
            : isBoughtUnpacked
            ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
            : 'bg-[#16A34A] border-[#16A34A] text-white';

          const badgeClass = isMissing
            ? 'bg-white/20 text-white'
            : isBoughtUnpacked
            ? 'bg-[#10B981]/25 text-[#065F46]'
            : 'bg-white/20 text-white';

          return (
            <div
              key={bag.id}
              onClick={() => handleBagClick(bag.id)}
              className={`rounded-2xl p-3 border transition-all flex flex-col justify-between items-center text-center cursor-pointer select-none active:scale-[0.98] shadow-2xs min-h-[105px] ${cardBgClass}`}
              title="Tap to toggle status"
            >
              {/* Top Row: Dimension/Weight Tag & Status Pill */}
              <div className="w-full flex items-center justify-between gap-1 text-[9px] font-mono leading-none">
                <span className="opacity-80 truncate">{bag.dimensions || bag.weightLimit}</span>
                <span className={`px-1.5 py-0.5 rounded-full font-bold shrink-0 ${badgeClass}`}>
                  {isMissing ? 'Missing' : isBoughtUnpacked ? 'Bought' : 'Packed ✓'}
                </span>
              </div>

              {/* Centered Vector Illustration */}
              <div className="my-1 flex items-center justify-center">
                {renderWidgetBagIcon(bag.kind, isBoughtUnpacked)}
              </div>

              {/* Bold Title */}
              <div className="font-bold text-xs tracking-tight truncate w-full">
                {normalizeBagLocation(bag.name)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. THE 6 DEVICES: Compact 3-Column x 2-Row iOS Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {devices.map((device) => {
          const isMissing = !device.isBought;
          const isBoughtUnpacked = device.isBought && !device.isPacked;

          const cardBgClass = isMissing
            ? 'bg-[#DC2626] border-[#DC2626] text-white'
            : isBoughtUnpacked
            ? 'bg-[#D1FAE5] border-[#10B981] text-[#065F46]'
            : 'bg-[#16A34A] border-[#16A34A] text-white';

          const badgeClass = isMissing
            ? 'bg-white/20 text-white'
            : isBoughtUnpacked
            ? 'bg-[#10B981]/25 text-[#065F46]'
            : 'bg-white/20 text-white';

          // Short label for top-left
          const tagLabel =
            device.name.includes('iPhone')
              ? 'Primary'
              : device.name.includes('Samsung')
              ? 'OTP / SMS'
              : device.name.includes('iPad')
              ? 'iPad'
              : device.name.includes('Dell')
              ? 'Laptop'
              : device.name.includes('Earbuds')
              ? 'Audio'
              : '10,000mAh';

          return (
            <div
              key={device.id}
              onClick={() => handleDeviceClick(device.id)}
              className={`rounded-2xl p-2.5 border transition-all flex flex-col justify-between items-center text-center cursor-pointer select-none active:scale-[0.98] shadow-2xs min-h-[98px] ${cardBgClass}`}
              title="Tap to toggle status"
            >
              {/* Top Row: Short Tag & Status Indicator */}
              <div className="w-full flex items-center justify-between gap-1 text-[9px] font-mono leading-none">
                <span className="opacity-80 truncate">{tagLabel}</span>
                <span className={`px-1.5 py-0.5 rounded-full font-bold shrink-0 ${badgeClass}`}>
                  {isMissing ? 'Missing' : isBoughtUnpacked ? 'Bought' : 'Packed ✓'}
                </span>
              </div>

              {/* Centered Vector Illustration */}
              <div className="my-1 flex items-center justify-center">
                {renderWidgetDeviceIcon(device.type, isBoughtUnpacked)}
              </div>

              {/* Bold Title */}
              <div className="font-bold text-[11px] sm:text-xs tracking-tight truncate w-full">
                {device.name}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
