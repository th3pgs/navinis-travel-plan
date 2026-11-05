import React from 'react';
import { TimelineMilestone } from '../data';
import { Check, Clock, ChevronRight } from 'lucide-react';

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
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Sequential Mission Milestones
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Progress tracker from Friday preparation through Haikou arrival
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {milestones.filter((m) => m.isCompleted).length} of {milestones.length} Completed
        </div>
      </div>

      {/* Vertical Timeline with Line and Indicator Nodes */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {milestones.map((m) => {
          const isDone = m.isCompleted;

          return (
            <div key={m.id} className="relative group">
              {/* Timeline Indicator Node */}
              <button
                type="button"
                onClick={() => onToggleMilestone(m.id)}
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? 'border-emerald-600 bg-emerald-500 text-white shadow-xs'
                    : 'border-slate-300 bg-white hover:border-[#003580]'
                }`}
                title="Mark milestone complete"
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#003580]" />
                )}
              </button>

              {/* Milestone Card with Dynamic Color Transformation */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-[#003580] text-white'
                      }`}
                    >
                      {m.dateBadge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {m.dateFull}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigateToCategory(m.targetCategory)}
                    className="text-[11px] font-semibold text-[#003580] hover:text-[#00224f] flex items-center gap-0.5"
                  >
                    <span>View Section</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <h3 className={`text-sm sm:text-base font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {m.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {m.summary}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">
                    🎯 {m.keyAction}
                  </span>
                  <span className={`font-semibold ${isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isDone ? 'Cleared' : 'Pending'}
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
