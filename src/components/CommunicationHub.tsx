import React, { useState } from 'react';
import { AppConfigItem } from '../data';
import { AppIcon } from './AppIcon';
import {
  ChevronLeft,
  Copy,
  Edit3,
  ExternalLink,
  Plus,
  Minus,
  Check,
  Globe2,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Printer,
  X,
  Phone,
  Mail,
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
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);
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
      isConfigured: true,
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

  // Simplified 0-100% Math for Apps (Single-check Ready status)
  const totalApps = apps.length;
  const readyApps = apps.filter((a) => a.isConfigured).length;
  const appProgress = Math.round((readyApps / (totalApps || 1)) * 100);

  // Toggle single ready check (configures and marks installed)
  const handleToggleReady = (app: AppConfigItem) => {
    if (!app.isConfigured) {
      if (!app.isInstalled) onToggleAppInstalled(app.id);
      onToggleAppConfigured(app.id);
    } else {
      onToggleAppConfigured(app.id);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* 1. iOS STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-[#007AFF] text-base font-medium flex items-center gap-0.5 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>Overview</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          Internet, Apps & Chat
        </h1>

        <button
          type="button"
          onClick={() => setIsSectionEditMode(!isSectionEditMode)}
          className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity"
        >
          {isSectionEditMode ? 'Done' : 'Edit'}
        </button>
      </header>

      {/* 2. iOS SEGMENTED CONTROL */}
      <div className="ios-segmented">
        <button
          type="button"
          onClick={() => setActiveTab('apps')}
          className={`ios-segmented-item ${activeTab === 'apps' ? 'active' : ''}`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Device Apps</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`ios-segmented-item ${activeTab === 'messages' ? 'active' : ''}`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Campus Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('taxi')}
          className={`ios-segmented-item ${activeTab === 'taxi' ? 'active' : ''}`}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Taxi Card</span>
        </button>
      </div>

      {/* TAB 1: DEVICE APPS */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          {/* iOS Summary Progress Card (0-100% Math) */}
          <div className="ios-card p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Digital Readiness
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {readyApps} of {totalApps} Apps Setup & Ready
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{appProgress}%</span>
              </div>
            </div>

            {/* Clean Progress Bar */}
            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${appProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>Single tap to mark app configured and verified</span>
              {isSectionEditMode && (
                <button
                  type="button"
                  onClick={() => setShowAddAppModal(true)}
                  className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New App</span>
                </button>
              )}
            </div>
          </div>

          {/* Device Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDevice === d.id
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-black/5 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Section 1: Stock AI & Academic */}
          {aiAcademicApps.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <h2 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
                  Stock AI & Academic Tools ({aiAcademicApps.filter((a) => a.isConfigured).length}/{aiAcademicApps.length})
                </h2>
              </div>
              <div className="ios-card divide-y divide-black/5 overflow-hidden">
                {aiAcademicApps.map((app) => (
                  <AppRowItem
                    key={app.id}
                    app={app}
                    isEditMode={isSectionEditMode}
                    onToggleReady={() => handleToggleReady(app)}
                    onDelete={() => onDeleteApp(app.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Proxy & Bypass */}
          {proxyBypassApps.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <h2 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
                  Proxy & Network Bypass Tools ({proxyBypassApps.filter((a) => a.isConfigured).length}/{proxyBypassApps.length})
                </h2>
              </div>
              <div className="ios-card divide-y divide-black/5 overflow-hidden">
                {proxyBypassApps.map((app) => (
                  <AppRowItem
                    key={app.id}
                    app={app}
                    isEditMode={isSectionEditMode}
                    onToggleReady={() => handleToggleReady(app)}
                    onDelete={() => onDeleteApp(app.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Mainland China Ecosystem */}
          {chinaEcosystemApps.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-1 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                <h2 className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
                  Mainland China Daily Life Services ({chinaEcosystemApps.filter((a) => a.isConfigured).length}/{chinaEcosystemApps.length})
                </h2>
              </div>
              <div className="ios-card divide-y divide-black/5 overflow-hidden">
                {chinaEcosystemApps.map((app) => (
                  <AppRowItem
                    key={app.id}
                    app={app}
                    isEditMode={isSectionEditMode}
                    onToggleReady={() => handleToggleReady(app)}
                    onDelete={() => onDeleteApp(app.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CAMPUS CHAT SUGGESTIONS & CONTACTS */}
      {activeTab === 'messages' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Key Campus Contacts */}
          <div className="space-y-1.5">
            <span className="px-1 text-xs font-semibold text-[#8E8E93] uppercase tracking-wider block">
              Official Campus Contacts
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Contact 1: Ms. Sun */}
              <div className="ios-card p-3.5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#007AFF] flex items-center justify-center font-bold text-xs">
                    HU
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">Intl. Students Office</h4>
                    <p className="text-[11px] text-[#8E8E93]">Ms. Sun (Admission)</p>
                  </div>
                </div>

                <div className="space-y-1 pt-1 border-t border-black/5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[#8E8E93]">Hotline:</span>
                    <strong className="font-mono text-slate-900">0898-66291354</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[#8E8E93]">WeChat ID:</span>
                    <strong className="font-mono text-[#007AFF]">sun_admission</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-[#8E8E93]">Email:</span>
                    <span className="font-mono text-slate-700">admission@hainanu.edu.cn</span>
                  </div>
                </div>
              </div>

              {/* Contact 2: Student Guide */}
              <div className="ios-card p-3.5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    SG
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900">Campus Volunteer Guide</h4>
                    <p className="text-[11px] text-[#8E8E93]">Haidian Campus South Gate</p>
                  </div>
                </div>

                <div className="pt-1 border-t border-black/5 text-[11px] text-slate-600 leading-relaxed">
                  Assists at South Gate for dormitory key collection, luggage help, and campus card activation.
                </div>
              </div>
            </div>
          </div>

          {/* Chat Suggestions */}
          <div className="space-y-1.5">
            <div className="px-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">
                Pre-Written WeChat Updates
              </span>
              <span className="text-[11px] font-mono text-[#8E8E93]">{messages.length} Scenarios</span>
            </div>

            <div className="space-y-3">
              {messages.map((msg) => {
                const isEditing = editingMsgId === msg.id;
                const isCopied = copiedId === msg.id;

                return (
                  <div key={msg.id} className="ios-card p-3.5 sm:p-4 space-y-2.5">
                    {/* Header: Timing & Reason */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">
                          {msg.timingTitle}
                        </span>
                        <span className="text-[11px] font-mono text-[#8E8E93]">{msg.timeStr}</span>
                      </div>
                      <p className="text-xs text-[#007AFF] leading-relaxed">
                        💡 {msg.reasonExplanation}
                      </p>
                    </div>

                    {/* Chat Bubble Presentation */}
                    {isEditing ? (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                        <textarea
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full text-xs text-slate-900 p-2 rounded-lg bg-white border border-blue-200 focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingMsgId(null)}
                            className="px-3 py-1 text-xs rounded-lg bg-white text-slate-600 border border-slate-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-4 py-1 text-xs rounded-lg bg-[#007AFF] text-white font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end pt-0.5">
                        <div className="max-w-[92%] sm:max-w-[85%] bg-[#007AFF] text-white p-3 sm:p-3.5 rounded-2xl rounded-br-sm text-xs sm:text-[13px] leading-relaxed shadow-2xs">
                          {msg.body}
                        </div>

                        {/* Action buttons below bubble */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(msg.id, msg.body)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F2F7] text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-[#8E8E93]" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.body)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#007AFF] hover:bg-blue-600 text-white shadow-2xs'
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
        <div className="max-w-xl mx-auto ios-card p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
            <Printer className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Haikou Meilan Airport Taxi Pocket Card
            </h3>
            <p className="text-xs text-[#8E8E93] mt-1">
              Optimized for showing directly to the Haikou airport taxi driver. Isolated 1-page print ready.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F2F2F7] text-left space-y-1.5 border border-black/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
              Destination Address (Driver Destination)
            </span>
            <div className="text-base font-bold text-slate-900 leading-snug">
              海南省海口市美兰区人民大道58号<br />
              海南大学（海甸校区）南门 / 留学生公寓
            </div>
            <div className="text-xs text-slate-500 pt-1.5 border-t border-black/5">
              Hainan University Haidian Campus South Gate / International Student Dormitory, No. 58 Renmin Avenue, Haikou
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenTaxiModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open & Print Pocket Card</span>
          </button>
        </div>
      )}

      {/* iOS Modal Sheet for Add App */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end sm:justify-center sm:p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleAddAppSubmit}
            className="bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl max-w-md w-full mx-auto overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Sheet Navigation Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-black/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAddAppModal(false)}
                className="text-[#007AFF] text-sm font-medium"
              >
                Cancel
              </button>
              <h3 className="font-semibold text-sm text-slate-900">Add Application</h3>
              <button
                type="submit"
                className="text-[#007AFF] text-sm font-bold"
              >
                Done
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="ios-card p-3 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                    App Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pleco, Notion, WeChat"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/10 rounded-xl bg-[#F2F2F7] focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                      Device
                    </label>
                    <select
                      value={newAppPlatform}
                      onChange={(e) => setNewAppPlatform(e.target.value as any)}
                      className="w-full px-2 py-2 text-xs border border-black/10 rounded-xl bg-[#F2F2F7]"
                    >
                      <option value="iOS">iPhone / iPad</option>
                      <option value="Android">Samsung S20</option>
                      <option value="Windows">Dell Laptop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newAppCategory}
                      onChange={(e) => setNewAppCategory(e.target.value as any)}
                      className="w-full px-2 py-2 text-xs border border-black/10 rounded-xl bg-[#F2F2F7]"
                    >
                      <option value="Stock AI & Academic">Stock AI</option>
                      <option value="Proxy & Bypass">Proxy / VPN</option>
                      <option value="Essential Daily">Essential Daily</option>
                      <option value="Transit & Maps">Transit & Maps</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                    Role & Setup Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Offline dictionary, campus chat, navigation"
                    value={newAppRole}
                    onChange={(e) => setNewAppRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-black/10 rounded-xl bg-[#F2F2F7] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Reusable Sub-Component for App Row (iOS Settings style, Requirement #5 & #4)
interface AppRowItemProps {
  app: AppConfigItem;
  isEditMode: boolean;
  onToggleReady: () => void;
  onDelete: () => void;
}

const AppRowItem: React.FC<AppRowItemProps> = ({
  app,
  isEditMode,
  onToggleReady,
  onDelete,
}) => {
  return (
    <div className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Delete minus badge in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={onDelete}
            className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
            title="Remove app"
          >
            <Minus className="w-3 h-3 stroke-[3]" />
          </button>
        )}

        {/* 36x36px Crisp Rounded App Icon container (Requirement #5) */}
        <div className="w-9 h-9 rounded-xl bg-[#F2F2F7] border border-black/5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
          <AppIcon name={app.appIcon} className="w-5 h-5" />
        </div>

        {/* Scannable App Title & Subtext */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
              {app.name}
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-[#F2F2F7] text-slate-600 border border-black/5">
              {app.platform}
            </span>
          </div>
          <p className="text-[11px] text-[#8E8E93] line-clamp-1 mt-0.5">
            {app.role}
          </p>
        </div>
      </div>

      {/* Single Circular iOS Checkmark Circle (Requirement #4 & #5) */}
      <div className="shrink-0 pl-1">
        <button
          type="button"
          onClick={onToggleReady}
          title={app.isConfigured ? 'Ready (Tap to toggle)' : 'Not ready (Tap to mark ready)'}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            app.isConfigured
              ? 'bg-[#007AFF] text-white shadow-xs'
              : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
          }`}
        >
          {app.isConfigured && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>
      </div>
    </div>
  );
};
