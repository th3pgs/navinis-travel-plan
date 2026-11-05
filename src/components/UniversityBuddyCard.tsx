import React, { useState } from 'react';
import { MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';

export const UniversityBuddyCard: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const templateAirportQuery = `Hi! I am Navini Ravishka from Sri Lanka. I am arriving at Haikou Meilan Airport (HAK T1) on Sunday, November 9 at 14:35 (Flight MU6381) with 2 large suitcases (30x40x70cm & 27x41x57cm). 

Since this is my first time in Haikou, could you please advise me:
1. Is it better and easier to take the official metered taxi queue right outside Terminal 1 Arrivals, or use DiDi with 2 big bags?
2. Which specific Campus Gate should the taxi driver drop me off at (e.g. East Gate on Renmin Ave or Main Gate)?
3. Can you meet me at that gate or the International Student Dormitory when my taxi arrives (around 15:30 - 16:00)? 
4. Could you please send me the exact dormitory building and registration desk name in Chinese characters so I can show it to the driver? Thank you so much!`;

  const templateChineseQuickMsg = `你好！我是来自斯里兰卡的留学生Navini。我将于11月9日下午14:35乘坐MU6381航班抵达海口美兰机场T1航站楼。因为我有两件大行李箱，请问我应该直接在航站楼门口排队乘出租车，还是用滴滴？出租车应该开到海甸校区的哪个校门？您能在校门接我一下吗？非常感谢！`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-[#003580] border border-blue-200">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Direct Contact: University Support Buddy & Ms. Sun
            </h3>
            <p className="text-[11px] text-slate-500">
              Confirm airport taxi advice, campus gate, and dorm meet-up before leaving Sri Lanka
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Template 1: English Detail */}
        <div className="p-3 border border-slate-200 rounded bg-slate-50/70 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">
                1. English Message for Support Buddy (Send on WeChat)
              </span>
              <button
                onClick={() => copyToClipboard(templateAirportQuery, 'en')}
                className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              >
                {copiedId === 'en' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'en' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed font-sans bg-white p-2.5 rounded border border-slate-200">
              {templateAirportQuery}
            </p>
          </div>
          <div className="text-[10px] text-slate-400">
            Covers arrival time, 2 suitcases, best taxi route, gate name, and meet-up request.
          </div>
        </div>

        {/* Template 2: Chinese Quick Copy */}
        <div className="p-3 border border-slate-200 rounded bg-slate-50/70 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">
                2. Chinese Translation (If Buddy Prefers Chinese)
              </span>
              <button
                onClick={() => copyToClipboard(templateChineseQuickMsg, 'cn')}
                className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              >
                {copiedId === 'cn' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'cn' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded border border-slate-200 font-medium">
              {templateChineseQuickMsg}
            </p>
          </div>
          <div className="text-[10px] text-slate-400">
            Direct high-contrast text that your buddy can read and reply with specific gate characters.
          </div>
        </div>
      </div>
    </div>
  );
};
