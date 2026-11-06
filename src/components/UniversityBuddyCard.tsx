import React, { useState } from 'react';
import { MessageSquare, Copy, Check, ChevronDown, ChevronUp, UserCheck, Phone } from 'lucide-react';
import { AppIcon } from './AppIcon';

export const UniversityBuddyCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editable suggestion messages
  const [msg1, setMsg1] = useState(
    `Hi! I am Navini Ravishka. Since we discussed my arrival on Sunday (Flight MU6381 landing at 14:35 at Haikou T1), I wanted to check on the taxi situation. With my 2 large suitcases (30x40x70cm and 27x41x57cm), should I just walk out to the official outdoor metered taxi queue, or do you recommend booking a DiDi? Also, which specific gate at Haidian campus is best for drop-off?`
  );

  const [msg2, setMsg2] = useState(
    `Hi! Just updating you with my arrival details: Flight MU6381 from Shanghai lands at Haikou Terminal 1 at 14:35 this Sunday. I should reach Hainan University Haidian campus around 15:45 - 16:00. Will you be near the gate or the International Student Dormitory then so we can meet up?`
  );

  const [msg3Cn, setMsg3Cn] = useState(
    `你好！这是我的最新航班信息：我乘坐的MU6381航班预计本周日下午14:35抵达海口美兰机场T1。我有两件托运大行李箱，请问到海甸校区是直接在机场排队搭乘正规出租车方便，还是用滴滴？出租车送到哪个校门最方便？期待在学校与你见面！`
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section className="space-y-2">
      <div className="ios-card overflow-hidden border border-black/10 bg-white shadow-xs">
        {/* Standalone Bubble Header */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#07C160] flex items-center justify-center p-2 shadow-2xs shrink-0">
              <AppIcon name="wechat" className="w-full h-full" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Contacting University & WeChat Suggestions
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Pre-written Templates
                </span>
              </div>
              <p className="text-xs text-[#8E8E93] mt-0.5 truncate">
                Ms. Sun (Office: 0898-66291354) & Student Support Buddy arrival messages
              </p>
            </div>
          </div>

          <div className="shrink-0 pl-2">
            <div className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center text-slate-600">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Expanded Messages Grid */}
        {isExpanded && (
          <div className="p-4 sm:p-6 border-t border-black/5 bg-[#F9FAFB] space-y-4 animate-in fade-in">
            {/* Quick Contact Info */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-700">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>International Students Office:</strong> Ms. Sun (WeChat: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-900">sun_admission</code>)
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-slate-600">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>0898-66291354</span>
              </div>
            </div>

            {/* 3 Actionable Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {/* Suggestion 1: Taxi vs DiDi with 2 Suitcases */}
              <div className="p-3.5 border border-slate-200/90 rounded-2xl bg-white flex flex-col justify-between space-y-2.5 shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">1. Taxi vs DiDi with 2 Bags</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg1, 'm1')}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#007AFF] hover:bg-blue-600 text-white flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedId === 'm1' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'm1' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={msg1}
                    onChange={(e) => setMsg1(e.target.value)}
                    rows={6}
                    className="w-full text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-[#007AFF] focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  Ask your buddy whether outdoor taxi queue is easier with 2x23kg bags.
                </span>
              </div>

              {/* Suggestion 2: Arrival Time & Gate Meet-Up */}
              <div className="p-3.5 border border-slate-200/90 rounded-2xl bg-white flex flex-col justify-between space-y-2.5 shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">2. Arrival Time & Campus Gate</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg2, 'm2')}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#007AFF] hover:bg-blue-600 text-white flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedId === 'm2' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'm2' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={msg2}
                    onChange={(e) => setMsg2(e.target.value)}
                    rows={6}
                    className="w-full text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-[#007AFF] focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  Confirm exact Haidian campus gate meet-up location with your buddy.
                </span>
              </div>

              {/* Suggestion 3: Chinese Message */}
              <div className="p-3.5 border border-slate-200/90 rounded-2xl bg-white flex flex-col justify-between space-y-2.5 shadow-2xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">3. Chinese Message (中文模版)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg3Cn, 'm3')}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedId === 'm3' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'm3' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <textarea
                    value={msg3Cn}
                    onChange={(e) => setMsg3Cn(e.target.value)}
                    rows={6}
                    className="w-full text-xs text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-emerald-600 focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  High-contrast simplified Chinese characters for immediate copy-pasting.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
