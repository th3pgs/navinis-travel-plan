import React, { useState } from 'react';
import { TimelineEvent } from '../data';
import { AppIcon } from './AppIcon';
import { ChevronDown, ChevronUp, MapPin, MessageSquare, Check, Plus, Edit3, Trash2 } from 'lucide-react';

interface ChronoTimelineViewProps {
  events: TimelineEvent[];
  onToggleItemDone: (eventId: string, itemId: string) => void;
  onOpenBuddyModal: () => void;
}

export const ChronoTimelineView: React.FC<ChronoTimelineViewProps> = ({
  events,
  onToggleItemDone,
  onOpenBuddyModal,
}) => {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({
    'time-fri-nov6': true,
    'time-sat-nov7': true,
    'time-sun-nov8': true,
    'time-mon-pvg': true,
    'time-mon-hak': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold text-[#003580] uppercase tracking-wider block">
            Chronological Mission Journey
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Line & Dots Timeline: Tomorrow (Nov 6) &rarr; Haikou (Nov 9)
          </h2>
        </div>
        <div className="text-xs text-slate-500">
          Step-by-step sequential path from Colombo prep to Hainan University
        </div>
      </div>

      {/* Vertical Timeline with Line and Dots */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-blue-400 before:to-emerald-500">
        {events.map((event, idx) => {
          const isExpanded = expandedEvents[event.id] ?? true;
          const completedCount = event.items.filter((i) => i.isDone).length;
          const totalItems = event.items.length;
          const isAllDone = completedCount === totalItems && totalItems > 0;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Dot Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isAllDone
                    ? 'border-emerald-600 bg-emerald-500 text-white shadow-xs'
                    : event.status === 'current'
                    ? 'border-[#003580] bg-white ring-4 ring-blue-100'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isAllDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      event.status === 'current' ? 'bg-[#003580] animate-ping' : 'bg-slate-400'
                    }`}
                  />
                )}
              </div>

              {/* Event Card Container */}
              <div
                className={`rounded-xl border transition-all ${
                  event.status === 'current'
                    ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                {/* Event Header Bar */}
                <div
                  onClick={() => toggleExpand(event.id)}
                  className="p-3.5 sm:p-4.5 cursor-pointer flex flex-wrap items-center justify-between gap-2 select-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#003580] text-white">
                        {event.dayBadge}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {event.dateStr}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {event.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {completedCount}/{totalItems} Done
                      </span>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sub-items Checklist Drawer */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-3.5 sm:p-4 space-y-2.5 bg-slate-50/40">
                    {event.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onToggleItemDone(event.id, item.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                          item.isDone
                            ? 'bg-emerald-50/30 border-emerald-200 text-slate-400'
                            : 'bg-white border-slate-200/70 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        {/* Checkbox Upfront */}
                        <div className="pt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={item.isDone}
                            onChange={() => onToggleItemDone(event.id, item.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                          />
                        </div>

                        {/* App Icon */}
                        <div className="pt-0.5 shrink-0">
                          <AppIcon name={item.appIcon} className="w-4 h-4" />
                        </div>

                        {/* Text info */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-1">
                            <span className={`text-xs sm:text-sm font-semibold break-words ${item.isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {item.label}
                            </span>
                            {item.targetBag && (
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                🎯 {item.targetBag}
                              </span>
                            )}
                          </div>
                          {item.detail && (
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed break-words">
                              {item.detail}
                            </p>
                          )}
                          {item.mustContactBuddy && (
                            <div className="mt-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenBuddyModal();
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#07C160]/10 hover:bg-[#07C160]/20 text-[#07C160] font-bold text-[11px] border border-[#07C160]/30 transition-colors"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Open Buddy WeChat Coordination Helper</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
