import React, { useState } from 'react';
import { AppConfigItem } from '../data';
import { AppIcon } from './AppIcon';
import {
  ArrowLeft,
  Copy,
  Edit3,
  ExternalLink,
  Phone,
  Printer,
  Plus,
  Minus,
  Check,
  Globe2,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';

interface CommunicationHubProps {
  onBack: () => void;
  apps: AppConfigItem[];
  onToggleAppInstalled: (id: string) => void;
  onToggleAppConfigured: (id: string) => void;
  onAddApp: (app: Omit<AppConfigItem, 'id'>) => void;
  onDeleteApp: (id: string) => void;
  onOpenTaxiModal: () => void;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  onBack,
  apps,
  onToggleAppInstalled,
  onToggleAppConfigured,
  onAddApp,
  onDeleteApp,
  onOpenTaxiModal,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'messages' | 'taxi'>('apps');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New App Modal State
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppPlatform, setNewAppPlatform] = useState<AppConfigItem['platform']>('iOS');
  const [newAppCategory, setNewAppCategory] = useState<AppConfigItem['category']>('Stock AI & Academic');
  const [newAppRole, setNewAppRole] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('doc');

  // Editable Messages State
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    {
      id: string;
      timingTitle: string;
      reasonExplanation: string;
      body: string;
      timeStr: string;
    }[]
  >(() => {
    const saved = localStorage.getItem('navini_messages_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'msg-1',
        timingTitle: 'Before Takeoff (Colombo Airport)',
        reasonExplanation: 'Send before boarding MU6018 in Colombo so your buddy knows you have departed on schedule.',
        body: 'Hello! This is Navini Ravishka Priyantha (Admission No. 263660001). I am currently at Colombo Airport boarding China Eastern flight MU6018 to Shanghai. Looking forward to arriving at Hainan University tomorrow!',
        timeStr: '20:15 PM',
      },
      {
        id: 'msg-2',
        timingTitle: 'During Shanghai Transfer (After Baggage Re-Check)',
        reasonExplanation: 'Send when you finish re-checking your 2 bags at Shanghai Domestic Transfer so your buddy knows your domestic flight timing.',
        body: 'Hi! I have safely landed at Shanghai Pudong (PVG), collected my 2 suitcases from the international belt, cleared customs, and re-checked my luggage for domestic flight MU6381. My estimated arrival at Haikou Meilan Airport is 14:35 today. See you soon at Haidian Campus!',
        timeStr: '08:45 AM',
      },
      {
        id: 'msg-3',
        timingTitle: 'After Landing in Haikou (Inside Airport Taxi)',
        reasonExplanation: 'Send once you are in the official metered taxi at Haikou Meilan Airport, sharing your estimated arrival time at South Gate.',
        body: 'Hi! I just landed at Haikou Meilan Airport, collected both of my bags, and am now in an official taxi heading to Hainan University Haidian Campus (South Gate / No. 58 Renmin Avenue). The driver estimates arrival in about 45 minutes. Will send my live location!',
        timeStr: '15:10 PM',
      },
      {
        id: 'msg-4',
        timingTitle: 'At Hainan University South Gate',
        reasonExplanation: 'Send when arriving at the South Gate to find out exactly where to meet for room key collection and check-in.',
        body: 'Hello Ms. Sun / Buddy, I have just arrived at Hainan University Haidian Campus South Gate with my luggage. Could you please let me know which building I should report to for dormitory room key collection and registration?',
        timeStr: '16:00 PM',
      },
      {
        id: 'msg-5',
        timingTitle: 'Dormitory Wi-Fi & Electricity Setup',
        reasonExplanation: 'Send on your first evening to get instructions for campus Wi-Fi access and room electricity card recharge.',
        body: 'Hi! I am settled into my dorm room. Could you guide me on how to connect my laptop and phone to the Hainan University campus Wi-Fi network and how to recharge the electricity card? Thank you so much for your assistance!',
        timeStr: '18:30 PM',
      },
    ];
  });

  const [editText, setEditText] = useState('');

  const handleStartEdit = (id: string, text: string) => {
    setEditingMsgId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    const updated = messages.map((m) => (m.id === id ? { ...m, body: editText.trim() } : m));
    setMessages(updated);
    localStorage.setItem('navini_messages_v5', JSON.stringify(updated));
    setEditingMsgId(null);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    onAddApp({
      name: newAppName.trim(),
      platform: newAppPlatform,
      category: newAppCategory,
      role: newAppRole.trim() || 'Essential tool for study and communication',
      isInstalled: true,
      isConfigured: false,
      appIcon: newAppIcon,
    });
    setNewAppName('');
    setNewAppRole('');
    setShowAddAppModal(false);
  };

  // Filter apps by device
  const filteredApps = apps.filter((app) => {
    if (selectedDevice === 'all') return true;
    if (selectedDevice === 'iphone') return app.platform === 'iOS';
    if (selectedDevice === 'samsung') return app.platform === 'Android';
    if (selectedDevice === 'dell') return app.platform === 'Windows';
    if (selectedDevice === 'ipad') return app.platform === 'iOS';
    return true;
  });

  // Compartments
  const aiAcademicApps = filteredApps.filter((a) => a.category === 'Stock AI & Academic');
  const proxyBypassApps = filteredApps.filter((a) => a.category === 'Proxy & Bypass');
  const chinaEcosystemApps = filteredApps.filter(
    (a) => a.category === 'Essential Daily' || a.category === 'Transit & Maps'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* iOS Styled Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#003580]" />
          <span>Back to Overview</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-500 block">
            Internet, Apps & Buddy Chat
          </span>
          <span className="text-[11px] font-semibold text-[#003580]">
            {apps.filter((a) => a.isConfigured).length} of {apps.length} Apps Ready
          </span>
        </div>
      </div>

      {/* Segmented Navigation Controls (Apple Style) */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl max-w-lg mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('apps')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'apps'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe2 className="w-4 h-4 text-emerald-600" />
          <span>Device Apps</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'messages'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-blue-600" />
          <span>Campus Chat Suggestions</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('taxi')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'taxi'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4 text-amber-600" />
          <span>Taxi Pocket Card</span>
        </button>
      </div>

      {/* TAB 1: DEVICE APPS WITH MAJESTIC TWO-DOT FRONT TOGGLE */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          {/* Top Control Bar: Device Filter Pills + Two-Dot Legend + Edit Mode Toggle */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Device Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {[
                  { id: 'all', label: 'All Devices' },
                  { id: 'iphone', label: 'iPhone 17' },
                  { id: 'samsung', label: 'Samsung S20 FE' },
                  { id: 'dell', label: 'Dell Laptop' },
                  { id: 'ipad', label: 'Apple iPad 11' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDevice(d.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                      selectedDevice === d.id
                        ? 'bg-[#003580] text-white border-[#003580]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons: Edit Apps & Add App */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                    isEditMode
                      ? 'bg-red-50 text-red-700 border-red-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditMode ? 'Done Editing' : 'Manage Apps'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddAppModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#003580] text-white text-xs font-bold hover:bg-[#00224f] transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add App</span>
                </button>
              </div>
            </div>

            {/* The Majestic Two-Dot Switch Legend */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-700">App Status Controls:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-2xs" />
                  <span><strong>Green Dot:</strong> Installed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-2xs" />
                  <span><strong>Blue Dot:</strong> Tested & Configured</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Tap dots in front of each app to turn on/off</span>
            </div>
          </div>

          {/* COMPARTMENT 1: Stock AI & Academic Tools */}
          {aiAcademicApps.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-sm text-slate-900">Stock AI & Academic Tools</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {aiAcademicApps.filter((a) => a.isConfigured).length} of {aiAcademicApps.length} Configured
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiAcademicApps.map((app) => (
                  <AppRowCard
                    key={app.id}
                    app={app}
                    isEditMode={isEditMode}
                    onToggleInstalled={() => onToggleAppInstalled(app.id)}
                    onToggleConfigured={() => onToggleAppConfigured(app.id)}
                    onDelete={() => onDeleteApp(app.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* COMPARTMENT 2: Proxy & GFW Bypass Tools */}
          {proxyBypassApps.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">Proxy & Network Bypass Tools</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {proxyBypassApps.filter((a) => a.isConfigured).length} of {proxyBypassApps.length} Configured
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {proxyBypassApps.map((app) => (
                  <AppRowCard
                    key={app.id}
                    app={app}
                    isEditMode={isEditMode}
                    onToggleInstalled={() => onToggleAppInstalled(app.id)}
                    onToggleConfigured={() => onToggleAppConfigured(app.id)}
                    onDelete={() => onDeleteApp(app.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* COMPARTMENT 3: Mainland China Daily Life Services */}
          {chinaEcosystemApps.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900">Mainland China Daily Life Services</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {chinaEcosystemApps.filter((a) => a.isConfigured).length} of {chinaEcosystemApps.length} Configured
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chinaEcosystemApps.map((app) => (
                  <AppRowCard
                    key={app.id}
                    app={app}
                    isEditMode={isEditMode}
                    onToggleInstalled={() => onToggleAppInstalled(app.id)}
                    onToggleConfigured={() => onToggleAppConfigured(app.id)}
                    onDelete={() => onDeleteApp(app.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SEPARATE TOPICS FOR CAMPUS CONTACTS & TIMING-BASED CHAT SUGGESTIONS */}
      {activeTab === 'messages' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* TWO SEPARATE TOPIC CARDS: Ms. Sun & Campus Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Topic 1: University Admission Office (Ms. Sun) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#003580] flex items-center justify-center font-bold text-sm">
                  HU
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">International Students Office</h4>
                  <span className="text-[11px] text-slate-500">Contact: Ms. Sun (Admission Coordinator)</span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Direct Hotline:</span>
                  <strong className="font-mono text-slate-800">0898-66291354</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Alternate Line:</span>
                  <strong className="font-mono text-slate-800">0898-66213608</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>WeChat ID:</span>
                  <strong className="font-mono text-[#003580]">sun_admission</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email:</span>
                  <strong className="font-mono text-slate-800">admission@hainanu.edu.cn</strong>
                </div>
              </div>
            </div>

            {/* Topic 2: Campus Student Guide / Volunteer */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  SG
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Campus Student Guide / Buddy</h4>
                  <span className="text-[11px] text-slate-500">Orientation, Dorm Key & Arrival Assistance</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 leading-relaxed">
                <p>
                  Assigned university student volunteer who meets you at the Haidian Campus South Gate, assists with luggage, dormitory registration, and campus card activation.
                </p>
              </div>
            </div>
          </div>

          {/* CHAT SUGGESTIONS: Organized by Real Timing with Sub-Explanations */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Chat Message Suggestions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-written updates ready to send on WeChat. Tap "Edit" to customize wording anytime.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                {messages.length} Scenarios
              </span>
            </div>

            <div className="p-5 sm:p-7 space-y-6">
              {messages.map((msg) => {
                const isEditing = editingMsgId === msg.id;
                const isCopied = copiedId === msg.id;

                return (
                  <div key={msg.id} className="space-y-2 pb-5 border-b border-slate-100 last:border-none last:pb-0">
                    {/* Scenario Title + Human Reason Explanation */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-sm text-slate-900">{msg.timingTitle}</span>
                        <span className="text-[11px] font-mono text-slate-400">{msg.timeStr}</span>
                      </div>
                      <p className="text-xs text-[#003580] font-medium leading-relaxed">
                        💡 {msg.reasonExplanation}
                      </p>
                    </div>

                    {/* iOS Blue Chat Bubble Presentation */}
                    {isEditing ? (
                      <div className="p-3.5 bg-blue-50/50 rounded-2xl border-2 border-blue-400 space-y-2">
                        <textarea
                          rows={4}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full text-xs text-slate-800 p-2 rounded-xl bg-white border border-blue-200 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingMsgId(null)}
                            className="px-3 py-1 text-xs border rounded-xl bg-white text-slate-600"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-4 py-1 text-xs rounded-xl bg-[#003580] text-white font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end pt-1">
                        <div className="max-w-[90%] sm:max-w-[85%] bg-[#007AFF] text-white p-4 rounded-3xl rounded-br-md shadow-xs text-xs sm:text-[13px] leading-relaxed">
                          {msg.body}
                        </div>

                        {/* Action buttons below bubble */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(msg.id, msg.body)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.body)}
                            className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#003580] hover:bg-[#00224f] text-white'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy for WeChat</span>
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

      {/* TAB 3: TAXI POCKET CARD */}
      {activeTab === 'taxi' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
            <Printer className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Haikou Meilan Airport Taxi Pocket Card
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Single-page print isolated card with large Chinese typography to show directly to the taxi driver
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination Address</span>
            <div className="text-lg font-bold text-slate-900 leading-snug">
              海南省海口市美兰区人民大道58号<br />
              海南大学（海甸校区）南门 / 留学生公寓
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
              Hainan University Haidian Campus South Gate / International Student Dormitory, No. 58 Renmin Avenue, Haikou
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenTaxiModal}
            className="px-6 py-2.5 rounded-2xl bg-[#003580] hover:bg-[#00224f] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open & Print Pocket Card</span>
          </button>
        </div>
      )}

      {/* Add App Modal */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddAppSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Custom Application</h3>
              <button
                type="button"
                onClick={() => setShowAddAppModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">App Name</label>
                <input
                  type="text"
                  placeholder="e.g. Notion, WeChat, Pleco"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Device</label>
                  <select
                    value={newAppPlatform}
                    onChange={(e) => setNewAppPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="iOS">iPhone / iPad (iOS)</option>
                    <option value="Android">Samsung S20 (Android)</option>
                    <option value="Windows">Dell Laptop (Windows)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={newAppCategory}
                    onChange={(e) => setNewAppCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Stock AI & Academic">Stock AI & Academic</option>
                    <option value="Proxy & Bypass">Proxy & Bypass</option>
                    <option value="Essential Daily">Essential Daily</option>
                    <option value="Transit & Maps">Transit & Maps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Role / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Literature research and paper translation"
                  value={newAppRole}
                  onChange={(e) => setNewAppRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddAppModal(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#003580] text-white text-xs font-bold"
              >
                Save App
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Reusable Sub-Component for App Row with Majestic Front Dots
interface AppRowCardProps {
  app: AppConfigItem;
  isEditMode: boolean;
  onToggleInstalled: () => void;
  onToggleConfigured: () => void;
  onDelete: () => void;
}

const AppRowCard: React.FC<AppRowCardProps> = ({
  app,
  isEditMode,
  onToggleInstalled,
  onToggleConfigured,
  onDelete,
}) => {
  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 relative ${
        app.isConfigured
          ? 'border-blue-200 bg-blue-50/20'
          : app.isInstalled
          ? 'border-emerald-200 bg-emerald-50/10'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Minus Badge in Edit Mode to Remove App */}
      {isEditMode && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors z-10"
          title="Remove application"
        >
          <Minus className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      )}

      {/* Front: Two Majestic Dots Side by Side + App Icon + Name */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* The Two Majestic Dots Side by Side in Front */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Dot 1: Installed (Green) */}
          <button
            type="button"
            onClick={onToggleInstalled}
            title={app.isInstalled ? 'Installed (Click to toggle)' : 'Not Installed (Click to mark installed)'}
            className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
              app.isInstalled
                ? 'bg-emerald-500 shadow-xs ring-2 ring-emerald-200'
                : 'border-2 border-slate-300 hover:border-emerald-500 bg-white'
            }`}
          >
            {app.isInstalled && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>

          {/* Dot 2: Tested & Configured (Blue) */}
          <button
            type="button"
            onClick={onToggleConfigured}
            title={app.isConfigured ? 'Tested & Configured (Click to toggle)' : 'Needs Testing (Click to mark tested)'}
            className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
              app.isConfigured
                ? 'bg-blue-600 shadow-xs ring-2 ring-blue-200'
                : 'border-2 border-slate-300 hover:border-blue-600 bg-white'
            }`}
          >
            {app.isConfigured && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
        </div>

        {/* App Logo */}
        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
          <AppIcon name={app.appIcon} className="w-4 h-4" />
        </div>

        {/* Name & Role */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 truncate">{app.name}</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              {app.platform}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{app.role}</span>
        </div>
      </div>
    </div>
  );
};
