import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Edit2 } from 'lucide-react';

export const UniversityBuddyCard: React.FC = () => {
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
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#003580] border border-blue-200">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Direct Contact: Student Support Buddy & Ms. Sun
            </h3>
            <p className="text-[11px] text-slate-500">
              Editable suggestions to clarify luggage taxi queue, campus gate, and dorm meet-up
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Ms. Sun WeChat:</span>
          <code className="px-2 py-0.5 rounded bg-slate-100 text-[#003580] font-mono font-bold border border-slate-200">
            sun_admission
          </code>
        </div>
      </div>

      {/* Suggested Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Suggestion 1: Taxi & Gate Inquiry */}
        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">1. Taxi vs DiDi with 2 Suitcases</span>
              <button
                onClick={() => copyToClipboard(msg1, 'm1')}
                className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              >
                {copiedId === 'm1' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'm1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={msg1}
              onChange={(e) => setMsg1(e.target.value)}
              rows={5}
              className="w-full text-[11px] text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200 focus:outline-none focus:border-[#003580]"
            />
          </div>
          <span className="text-[10px] text-slate-400">Ask your buddy if outdoor taxi queue is easier with 2 bags.</span>
        </div>

        {/* Suggestion 2: Arrival Time & Gate Meetup */}
        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">2. Arrival Time & Campus Gate Meet-Up</span>
              <button
                onClick={() => copyToClipboard(msg2, 'm2')}
                className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              >
                {copiedId === 'm2' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'm2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={msg2}
              onChange={(e) => setMsg2(e.target.value)}
              rows={5}
              className="w-full text-[11px] text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200 focus:outline-none focus:border-[#003580]"
            />
          </div>
          <span className="text-[10px] text-slate-400">Confirm where and when to meet at Haidian campus.</span>
        </div>

        {/* Suggestion 3: Chinese Quick Translation */}
        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/70 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">3. Chinese Message (If preferred)</span>
              <button
                onClick={() => copyToClipboard(msg3Cn, 'm3')}
                className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              >
                {copiedId === 'm3' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'm3' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              value={msg3Cn}
              onChange={(e) => setMsg3Cn(e.target.value)}
              rows={5}
              className="w-full text-[11px] text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-medium focus:outline-none focus:border-[#003580]"
            />
          </div>
          <span className="text-[10px] text-slate-400">High-contrast Chinese characters for clear WeChat replies.</span>
        </div>
      </div>
    </div>
  );
};
