import React, { useState } from 'react';
import { AppConfigItem } from '../data';
import { AppIcon } from './AppIcon';
import {
  ArrowLeft,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  MessageSquare,
  Phone,
  Printer,
  Shield,
  Smartphone,
  Wifi,
  Sparkles,
} from 'lucide-react';

interface CommunicationHubProps {
  onBack: () => void;
  apps: AppConfigItem[];
  onToggleAppInstalled: (id: string) => void;
  onToggleAppConfigured: (id: string) => void;
  onOpenTaxiModal: () => void;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  onBack,
  apps,
  onToggleAppInstalled,
  onToggleAppConfigured,
  onOpenTaxiModal,
}) => {
  const [activeTab, setActiveTab] = useState<'network' | 'messages' | 'taxi'>('network');
  const [activeAppCategory, setActiveAppCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Editable Message Suggestions (Editable, NOT deletable, as requested)
  const [editingMsgIndex, setEditingMsgIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<
    {
      id: string;
      title: string;
      subtitle: string;
      body: string;
      time: string;
    }[]
  >(() => {
    const saved = localStorage.getItem('navini_buddy_messages_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'msg-1',
        title: 'Shanghai PVG Layover Status',
        subtitle: 'Send after re-checking baggage at T1 domestic transfer counter',
        body: 'Hello! This is Navini Ravishka Priyantha (Admission Notice No. 263660001). I have safely arrived at Shanghai PVG on flight MU6018, cleared customs, and re-checked both of my suitcases for flight MU6381 to Haikou. My estimated arrival at Haikou Meilan Airport is 14:35 today. Looking forward to meeting you at Haidian Campus!',
        time: '08:45 AM',
      },
      {
        id: 'msg-2',
        title: 'Haikou Meilan Airport Arrival & Taxi Departure',
        subtitle: 'Send while sitting in the official outdoor airport taxi',
        body: 'Hi! I have landed at Haikou Meilan Airport, collected both of my bags, and am now in an official metered taxi heading to Hainan University Haidian Campus (South Gate / No. 58 Renmin Avenue). The driver estimates arrival in about 45 minutes. I will share my live location right now!',
        time: '15:10 PM',
      },
      {
        id: 'msg-3',
        title: 'South Gate Campus Arrival & Dorm Key Inquiry',
        subtitle: 'Send upon arriving at Hainan University Haidian Campus South Gate',
        body: 'Hello Ms. Sun / Buddy, I have just arrived at Hainan University Haidian Campus South Gate with my luggage. Could you please let me know where I should report to collect my international student dormitory room key and complete the early arrival registration?',
        time: '16:00 PM',
      },
      {
        id: 'msg-4',
        title: 'Campus Wi-Fi & Electricity Card Top-up Query',
        subtitle: 'Send on day 1 after moving into the dormitory',
        body: 'Hi! I am settled into my dorm room. Could you guide me on how to connect my student account to the Hainan University campus Wi-Fi network and how to top up the electricity meter card? Thank you so much for your assistance!',
        time: '18:30 PM',
      },
    ];
  });

  const [editText, setEditText] = useState('');

  const appCategories = [
    'All',
    'Proxy & Bypass',
    'Essential Daily',
    'Stock AI & Academic',
    'Transit & Maps',
  ];

  const handleStartEdit = (index: number) => {
    setEditingMsgIndex(index);
    setEditText(messages[index].body);
  };

  const handleSaveEdit = (index: number) => {
    if (!editText.trim()) return;
    const updated = [...messages];
    updated[index].body = editText.trim();
    setMessages(updated);
    localStorage.setItem('navini_buddy_messages_v3', JSON.stringify(updated));
    setEditingMsgIndex(null);
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const filteredApps = apps.filter((app) =>
    activeAppCategory === 'All' ? true : app.category === activeAppCategory
  );

  const totalApps = apps.length;
  const configuredApps = apps.filter((a) => a.isConfigured).length;

  return (
    <div className="space-y-6">
      {/* iOS Styled Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-500 block">
            Connectivity & Communication Hub
          </span>
          <span className="text-[11px] font-semibold text-[#003580]">
            {configuredApps}/{totalApps} Apps Configured • iMessage Support Active
          </span>
        </div>
      </div>

      {/* Segmented Controls (iOS Style Tabs) */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-md mx-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('network')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'network'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          GFW Bypass & Apps ({configuredApps}/{totalApps})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'messages'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          iMessage Buddy Templates
        </button>
        <button
          onClick={() => setActiveTab('taxi')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'taxi'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Taxi Card & Contacts
        </button>
      </div>

      {/* TAB 1: GFW BYPASS & STOCK AI APPS */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          {/* 3-Tier Strategy Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              China Great Firewall (GFW) Triple-Redundancy Strategy
            </h3>
            <p className="text-xs text-slate-500">
              Guaranteed continuous access to Google Scholar, ChatGPT, and global communication in mainland China
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#003580] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="text-xs font-bold text-slate-900">Primary: Travel eSIM</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Saily / Airalo on iPhone 17.</strong> Foreign roaming data does NOT pass through the Great Firewall. Instantly accesses Google, WhatsApp & Instagram on arrival.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="text-xs font-bold text-slate-900">Wi-Fi Proxy Clients</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Shadowrocket (iOS) & Clash Verge Rev (Windows).</strong> Subscriptions pre-imported to route laptop and tablet through Hong Kong / Tokyo nodes on university Wi-Fi.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-700 text-white flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="text-xs font-bold text-slate-900">OTP Vault (Dialog)</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Samsung S20 FE.</strong> Dialog SMS roaming is FREE for receiving incoming OTPs. Mobile Data & Data Roaming are permanently LOCKED OFF to prevent bill shock.
                </div>
              </div>
            </div>
          </div>

          {/* App Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Stock AI, Academic & China Ecosystem Apps</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify installation and configuration on iPhone 17 and Dell 5410 prior to departure
                </p>
              </div>

              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {configuredApps} of {totalApps} Configured
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
              {appCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveAppCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    activeAppCategory === cat
                      ? 'bg-[#003580] text-white border-[#003580]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* App Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    app.isConfigured
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <AppIcon name={app.appIcon} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {app.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {app.platform}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 bg-slate-50/60 p-2 rounded border border-slate-100 leading-relaxed">
                      {app.role}
                    </p>
                  </div>

                  {/* Formal Tick Buttons */}
                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={app.isInstalled}
                        onChange={() => onToggleAppInstalled(app.id)}
                        className="w-3.5 h-3.5 rounded accent-emerald-600 cursor-pointer"
                      />
                      <span className={`text-[11px] ${app.isInstalled ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                        Installed
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={app.isConfigured}
                        onChange={() => onToggleAppConfigured(app.id)}
                        className="w-3.5 h-3.5 rounded accent-[#003580] cursor-pointer"
                      />
                      <span className={`text-[11px] font-bold ${app.isConfigured ? 'text-[#003580]' : 'text-slate-400'}`}>
                        {app.isConfigured ? 'Configured & Tested' : 'Needs Config'}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: iOS iMESSAGE BUBBLE BOX WITH EDITABLE SUGGESTIONS */}
      {activeTab === 'messages' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* iOS Messages Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            {/* iOS Navigation Bar */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  HU
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Hainan University Contact & Buddy</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Ms. Sun • 0898-66291354 • WeChat: sun_admission
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                iMessage
              </span>
            </div>

            {/* iMessage Notice Top Label */}
            <div className="py-2.5 px-4 bg-slate-50 border-b border-slate-200 text-center">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                Message Suggestions
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pre-formatted status updates. Tap "Edit" to tweak words before copying.
              </p>
            </div>

            {/* Messages Stream */}
            <div className="p-4 sm:p-6 space-y-6 bg-slate-50/40">
              {messages.map((msg, index) => {
                const isEditing = editingMsgIndex === index;
                const isCopied = copiedIndex === index;

                return (
                  <div key={msg.id} className="space-y-2">
                    {/* Suggestion Context Header */}
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-bold text-slate-800">{msg.title}</span>
                      <span className="text-[10px] text-slate-400">{msg.subtitle}</span>
                    </div>

                    {isEditing ? (
                      /* Editable Textarea in place */
                      <div className="p-3 bg-white border-2 border-blue-400 rounded-2xl space-y-2 shadow-xs">
                        <textarea
                          rows={4}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full text-xs text-slate-800 leading-relaxed p-1 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setEditingMsgIndex(null)}
                            className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            className="px-3 py-1 rounded-lg bg-[#003580] text-xs font-bold text-white hover:bg-[#00224f]"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* iOS Outgoing Blue Chat Bubble */
                      <div className="flex flex-col items-end">
                        <div className="max-w-[85%] sm:max-w-[80%] bg-[#007AFF] text-white p-3.5 rounded-2xl rounded-br-xs shadow-xs text-xs sm:text-[13px] leading-relaxed relative">
                          {msg.body}
                        </div>

                        <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                          <span>{msg.time}</span>
                          <span>• Delivered</span>
                        </div>

                        {/* Action Buttons below bubble */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(index)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 shadow-2xs transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-slate-500" />
                            <span>Edit Text</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.body, index)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold shadow-2xs transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#003580] hover:bg-[#00224f] text-white'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Message</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TAXI POCKET CARD & CONTACTS */}
      {activeTab === 'taxi' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Printer className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Haikou Meilan Airport Taxi Pocket Card
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Strict single-page print format with large Chinese typography to show the taxi driver directly at Haikou Meilan Airport
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Driver Destination Address</div>
              <div className="text-lg font-bold text-slate-900 leading-snug">
                海南省海口市美兰区人民大道58号<br />
                海南大学（海甸校区）南门 / 留学生公寓
              </div>
              <div className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                Hainan University Haidian Campus (South Gate / Overseas Student Building), No. 58 Renmin Avenue, Meilan District, Haikou
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenTaxiModal}
                className="px-5 py-2.5 rounded-xl bg-[#003580] hover:bg-[#00224f] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Full-Screen Pocket Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
