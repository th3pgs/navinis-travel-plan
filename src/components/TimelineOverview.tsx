import React, { useState } from 'react';
import { TimelineMilestone } from '../data';
import { Check, ChevronRight, ChevronDown } from 'lucide-react';

interface TimelineOverviewProps {
  milestones: TimelineMilestone[];
  onToggleMilestone: (id: string) => void;
  onNavigateToCategory: (cat: 'physical' | 'documents' | 'connectivity') => void;
}

export const TimelineOverview: React.FC<TimelineOverviewProps> = ({
  milestones,
  onToggleMilestone,
  onNavigateToCategory,
}) => {
  // Collapsed by default (Requirement #4)
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine current active day index: first milestone that is NOT completed
  const activeIndex = milestones.findIndex((m) => !m.isCompleted);
  const currentDayIndex = activeIndex === -1 ? milestones.length - 1 : activeIndex;

  const dayLabels = [
    { id: 'm-1', label: 'Day 1 • Fri Nov 6', short: 'Fri Nov 6' },
    { id: 'm-2', label: 'Day 2 • Sat Nov 7', short: 'Sat Nov 7' },
    { id: 'm-3', label: 'Day 3 • Sun Nov 8', short: 'Sun Nov 8' },
    { id: 'm-4', label: 'Day 4 • Mon Nov 9 (PVG)', short: 'PVG Layover' },
    { id: 'm-5', label: 'Day 5 • Mon Nov 9 (Haikou)', short: 'Haikou Arrival' },
  ];

  const renderStructuredFacts = (m: TimelineMilestone) => {
    switch (m.id) {
      case 'm-1':
        return (
          <div className="space-y-1.5 text-xs text-slate-700 pt-1">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🏦 Branches:</span>
              <span>BOC, People's Bank, NSB (Foreign study declaration & international card unlocks)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">⏰ Deadline:</span>
              <span className="font-semibold text-[#007AFF]">Before 3:00 PM branch closing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🛍️ Purchases:</span>
              <span>45cm laptop backpack & CCC-certified power bank</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">📶 Mobile:</span>
              <span>Verify Dialog SMS Roaming for banking OTPs</span>
            </div>
          </div>
        );

      case 'm-2':
        return (
          <div className="space-y-1.5 text-xs text-slate-700 pt-1">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">📱 Tech Drill:</span>
              <span>Test Dialog SMS OTP on Samsung S20 FE & verify VPN configs on Wi-Fi</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">⚖️ Weigh-In:</span>
              <span className="font-semibold text-slate-900">Weigh both rolling suitcases to max 23kg limit</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🔋 Battery:</span>
              <span>100% full charge across all 6 electronic devices</span>
            </div>
          </div>
        );

      case 'm-3':
        return (
          <div className="space-y-1.5 text-xs text-slate-700 pt-1">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">✈️ Flight:</span>
              <span className="font-bold text-slate-900">China Eastern MU6018 (Takeoff 20:50 CMB)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">⏰ CMB Arrival:</span>
              <span className="font-semibold text-[#007AFF]">17:20 PM (3.5 hours before departure)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🧳 Checked Bags:</span>
              <span>Drop 30×40×70cm & 27×41×57cm suitcases (max 23kg each)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🎒 Cabin Bag:</span>
              <span>Dell 5410, iPad 11 & CCC power bank in backpack (mandatory carry-on)</span>
            </div>
          </div>
        );

      case 'm-4':
        return (
          <div className="space-y-1.5 text-xs text-slate-700 pt-1">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🛫 Domestic:</span>
              <span className="font-bold text-slate-900">China Eastern MU6381 to Haikou (Layover: 4h 50m at PVG T1)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🛃 Border & Bags:</span>
              <span>Clear immigration, collect BOTH checked bags, clear customs, re-check at transfer desk</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🌐 Mobile Data:</span>
              <span>Switch to Saily/Airalo travel eSIM & send WeChat buddy touchpoint</span>
            </div>
          </div>
        );

      case 'm-5':
        return (
          <div className="space-y-1.5 text-xs text-slate-700 pt-1">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">📍 Destination:</span>
              <span className="font-bold text-slate-900">Hainan University Haidian Campus (South Gate / No. 58 Renmin Ave)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🚕 Transit:</span>
              <span>Official outdoor metered taxi queue (estimated 50–80 RMB)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">👤 Meet Buddy:</span>
              <span>Share live location from taxi & meet student guide at South Gate</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-slate-900 shrink-0">🏢 Check-in:</span>
              <span>Dorm room key collection & report to Ms. Sun at International Office</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-1 text-xs text-slate-700 pt-1">
            <p className="leading-relaxed">{m.summary}</p>
            {m.keyAction && (
              <div className="flex items-start gap-2 pt-1 font-medium text-slate-900">
                <span>🎯 Action:</span>
                <span>{m.keyAction}</span>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="ios-card overflow-hidden transition-all">
      {/* Collapsible Header (Requirement #4) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer select-none"
      >
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Schedule & Travel Timeline
            </h2>
          </div>

          {/* Live Day Tracker Strip with color coding (Requirement #4) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {milestones.map((m, idx) => {
              const isPast = m.isCompleted || idx < currentDayIndex;
              const isCurrent = idx === currentDayIndex && !m.isCompleted;
              const isFuture = idx > currentDayIndex;

              const labelObj = dayLabels[idx] || { label: m.dateBadge };

              return (
                <span
                  key={m.id}
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                    isPast
                      ? 'bg-slate-200/80 text-slate-500 opacity-75'
                      : isCurrent
                      ? 'bg-[#34C759] text-white shadow-xs font-bold'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  {labelObj.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Downward Chevron Arrow (rotates on expand) */}
        <div className="shrink-0 pl-3">
          <div className={`w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Expanded Timeline Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-black/5 animate-in fade-in slide-in-from-top-1 duration-250">
          <div className="relative pl-6 sm:pl-8 space-y-3.5 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E5EA]">
            {milestones.map((m, idx) => {
              const isDone = m.isCompleted;
              const isCurrent = idx === currentDayIndex && !m.isCompleted;

              return (
                <div key={m.id} className="relative group">
                  {/* Circular iOS Checkmark Node */}
                  <button
                    type="button"
                    onClick={() => onToggleMilestone(m.id)}
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#007AFF] text-white shadow-xs'
                        : isCurrent
                        ? 'border-2 border-[#34C759] bg-white ring-2 ring-[#34C759]/30'
                        : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                    }`}
                    title="Mark milestone complete"
                  >
                    {isDone ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-[#34C759]' : 'bg-slate-300 group-hover:bg-[#007AFF]'}`} />
                    )}
                  </button>

                  {/* Inset Milestone Card */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isCurrent
                        ? 'border-[#34C759]/40 bg-emerald-50/10 shadow-xs'
                        : 'border-black/5 bg-white hover:border-black/10 shadow-2xs'
                    }`}
                  >
                    {/* Milestone Top Bar */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isDone
                              ? 'bg-slate-200 text-slate-600'
                              : isCurrent
                              ? 'bg-[#34C759] text-white font-bold'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {m.dateBadge}
                        </span>
                        <span className="text-[11px] font-mono text-[#8E8E93]">
                          {m.dateFull}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigateToCategory(m.targetCategory)}
                        className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-0.5 active:opacity-60"
                      >
                        <span>Open Section</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Milestone Title */}
                    <h3
                      className={`text-sm sm:text-base font-bold ${
                        isDone ? 'text-[#8E8E93] line-through' : 'text-slate-900'
                      }`}
                    >
                      {m.title}
                    </h3>

                    {/* Scannable Key-Value Facts */}
                    <div className="mt-2 bg-[#F2F2F7] p-3 rounded-xl border border-black/5">
                      {renderStructuredFacts(m)}
                    </div>

                    {/* Bottom Status Row */}
                    <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-xs text-[#8E8E93]">
                      <span>🎯 {m.keyAction}</span>
                      <span className={`font-semibold ${isDone ? 'text-emerald-700' : isCurrent ? 'text-[#34C759]' : 'text-slate-400'}`}>
                        {isDone ? 'Completed' : isCurrent ? 'Active Now' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
