import React from 'react';
import { TimelineMilestone } from '../data';
import { Check, ChevronRight, Calendar } from 'lucide-react';

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
  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  // Helper to render facts as scannable structured key-value rows (Requirement #7)
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
    <div className="ios-card p-4 sm:p-6 space-y-4">
      {/* Header with Title and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Schedule & Travel Timeline
          </h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Key milestones from Colombo preparation to arrival at Hainan University
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2F2F7] text-slate-700 border border-black/5">
            {completedCount} of {milestones.length} Finished ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Vertical Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-3.5 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E5EA]">
        {milestones.map((m) => {
          const isDone = m.isCompleted;

          return (
            <div key={m.id} className="relative group">
              {/* Circular iOS Checkmark Node */}
              <button
                type="button"
                onClick={() => onToggleMilestone(m.id)}
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                }`}
                title="Mark milestone complete"
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#007AFF]" />
                )}
              </button>

              {/* Inset Milestone Card */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-black/5 bg-white hover:border-black/10 shadow-2xs'
                }`}
              >
                {/* Milestone Top Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#007AFF] text-white'
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
                  <span className={`font-semibold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isDone ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
