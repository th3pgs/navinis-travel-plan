import React, { useState } from 'react';
import {
  AppConfigItem,
  DEFAULT_APP_CATEGORIES,
  DEFAULT_APP_DEVICES,
} from '../data';
import { AppIcon } from './AppIcon';
import { DynamicSelect } from './DynamicSelect';
import {
  ChevronLeft,
  ChevronRight,
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
  CheckCircle2,
} from 'lucide-react';

interface CommunicationHubProps {
  onBack: () => void;
  apps: AppConfigItem[];
  customAppCategories?: string[];
  customAppDevices?: string[];
  onAddCustomAppCategory?: (cat: string) => void;
  onAddCustomAppDevice?: (dev: string) => void;
  onToggleAppInstalled: (id: string) => void;
  onToggleAppConfigured: (id: string) => void;
  onAddApp: (app: Omit<AppConfigItem, 'id'>) => void;
  onDeleteApp: (id: string) => void;
  onOpenTaxiModal: () => void;
  confirmedCampusChat?: boolean;
  onToggleCampusChatMaster?: () => void;
  confirmedChatTopics?: Record<string, boolean>;
  onToggleChatTopic?: (topicId: string) => void;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  onBack,
  apps,
  customAppCategories = [],
  customAppDevices = [],
  onAddCustomAppCategory,
  onAddCustomAppDevice,
  onToggleAppInstalled,
  onToggleAppConfigured,
  onAddApp,
  onDeleteApp,
  onOpenTaxiModal,
  confirmedCampusChat = false,
  onToggleCampusChatMaster,
  confirmedChatTopics = {},
  onToggleChatTopic,
}) => {
  // Navigation: 'overview' (3-widget entry) | 'apps' | 'chat' | 'taxi' (Requirement #7)
  const [currentSubView, setCurrentSubView] = useState<'overview' | 'apps' | 'chat' | 'taxi'>('overview');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic Options
  const allAppCategories = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_APP_CATEGORIES, ...customAppCategories]));
  }, [customAppCategories]);

  const allAppDevices = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_APP_DEVICES, ...customAppDevices]));
  }, [customAppDevices]);

  // New App Modal State
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppPlatform, setNewAppPlatform] = useState<AppConfigItem['platform']>('iOS');
  const [newAppCategory, setNewAppCategory] = useState<AppConfigItem['category']>('Stock AI & Academic');
  const [newAppRole, setNewAppRole] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('doc');

  // Local state for chat master confirmation if not passed
  const [localConfirmedChat, setLocalConfirmedChat] = useState<boolean>(() => {
    return localStorage.getItem('navini_campus_chat_confirmed') === 'true';
  });

  const [localTopicChecked, setLocalTopicChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('navini_chat_topics_confirmed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const isMasterConfirmed = confirmedCampusChat || localConfirmedChat;

  const handleToggleMasterChat = () => {
    const next = !isMasterConfirmed;
    setLocalConfirmedChat(next);
    localStorage.setItem('navini_campus_chat_confirmed', String(next));
    if (onToggleCampusChatMaster) onToggleCampusChatMaster();
  };

  const isTopicConfirmed = (id: string) => {
    return Boolean(confirmedChatTopics[id] || localTopicChecked[id]);
  };

  const handleToggleTopic = (id: string) => {
    const next = !isTopicConfirmed(id);
    const updated = { ...localTopicChecked, [id]: next };
    setLocalTopicChecked(updated);
    localStorage.setItem('navini_chat_topics_confirmed', JSON.stringify(updated));
    if (onToggleChatTopic) onToggleChatTopic(id);
  };

  // Editable Messages State (4 Key Inquiry Topics, Requirement #8)
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [chatTopics, setChatTopics] = useState<
    {
      id: string;
      topicNum: number;
      title: string;
      whoToAsk: string;
      detailsToGet: string[];
      body: string;
      timeStr: string;
    }[]
  >(() => {
    const saved = localStorage.getItem('navini_support_topics_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'topic-1',
        topicNum: 1,
        title: '📍 Fresh Location & Exact Dormitory Gate Check',
        whoToAsk: 'Chat Buddy / Student Volunteer',
        detailsToGet: [
          'Verify if the previously shared live location / Haidian Campus South Gate is still the exact drop-off point.',
          'Confirm which specific building name/number to walk into for dormitory room key pickup.',
          'Ask if buddy will meet outside the South Gate or directly at the dormitory lobby.',
        ],
        body: 'Hello! I am getting ready for my flight to Haikou. Just to confirm the exact arrival location: is the previously shared Haidian Campus South Gate (No. 58 Renmin Avenue) still the best drop-off point for the taxi? Also, which building should I report to for dorm room key collection?',
        timeStr: 'Before Departure',
      },
      {
        id: 'topic-2',
        topicNum: 2,
        title: '🚕 Airport Taxi vs. DiDi Recommendation',
        whoToAsk: 'Chat Buddy / Ms. Sun',
        detailsToGet: [
          'Explain that we have a printed bilingual Chinese Taxi Pocket Card ready.',
          'Clarify whether taking the official airport metered taxi line is recommended, or if booking DiDi from Meilan Airport is smoother.',
          'Get advice on whether Haikou airport taxi drivers reliably accept WeChat Pay or Cash.',
        ],
        body: 'Hi! Regarding transportation from Haikou Meilan Airport to campus: I have a printed Chinese Taxi Pocket Card with the exact South Gate address ready. Do you recommend taking an official airport taxi from the outdoor taxi rank, or is it better to book a DiDi ride? Which one works best for international students with 2 large bags?',
        timeStr: 'Before Departure',
      },
      {
        id: 'topic-3',
        topicNum: 3,
        title: '📋 On-Arrival Registration & Dorm Process in China',
        whoToAsk: 'Ms. Sun (Admission) / Student Buddy',
        detailsToGet: [
          'Step-by-step flow: key collection, dorm deposit/card, electricity card recharge, and campus Wi-Fi setup.',
          'Office hours for Ms. Sun at International Students Office on arrival day.',
          'Documents needed immediately on day 1 (Admission Notice, Passport, Photos).',
        ],
        body: 'Hello Ms. Sun, could you please advise on the first-day registration steps once I arrive on campus? When collecting the dormitory room key, do I pay the room deposit in cash or via Alipay? Also, could you let me know your office hours so I can complete my initial document verification?',
        timeStr: 'Arrival Morning',
      },
      {
        id: 'topic-4',
        topicNum: 4,
        title: '✈️ Live Flight & Shanghai Transfer Updates',
        whoToAsk: 'Chat Buddy & Family',
        detailsToGet: [
          'Pre-written Colombo boarding update (Flight MU6018 at 20:50).',
          'Shanghai Pudong T1 transit update (re-checking 2 bags for domestic flight MU6381).',
          'Live location sharing notice from the airport taxi.',
        ],
        body: 'Hi! I have safely landed at Shanghai Pudong (PVG), collected my 2 checked suitcases, cleared customs, and re-checked my luggage at the domestic transfer desk for flight MU6381. My estimated arrival at Haikou Meilan Airport is 14:35 today. Will share my live location once in the taxi!',
        timeStr: 'During PVG Layover',
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
    const updated = chatTopics.map((m) => (m.id === id ? { ...m, body: editText.trim() } : m));
    setChatTopics(updated);
    localStorage.setItem('navini_support_topics_v5', JSON.stringify(updated));
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
      isInstalled: false,
      isConfigured: false,
      appIcon: newAppIcon,
    });
    setNewAppName('');
    setNewAppRole('');
    setShowAddAppModal(false);
  };

  // Filter apps by device (Requirement #5A: Deduplication & strict device matching)
  const filteredApps = apps.filter((app) => {
    if (selectedDevice === 'all') return true;
    if (selectedDevice === 'iphone') return app.devices ? app.devices.includes('iPhone 17') : app.platform === 'iOS';
    if (selectedDevice === 'samsung') return app.devices ? app.devices.includes('Samsung S20 FE') : app.platform === 'Android';
    if (selectedDevice === 'dell') return app.devices ? app.devices.includes('Dell Laptop') : app.platform === 'Windows';
    if (selectedDevice === 'ipad') return app.devices ? app.devices.includes('Apple iPad 11') : false;
    return true;
  });

  // Simplified 0-100% Math for Apps (Starts at 0% default, Requirement #7)
  const totalApps = apps.length;
  const readyApps = apps.filter((a) => a.isConfigured).length;
  const appProgress = Math.round((readyApps / (totalApps || 1)) * 100);

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
          onClick={() => {
            if (currentSubView === 'overview') {
              onBack();
            } else {
              setCurrentSubView('overview');
            }
          }}
          className="text-[#007AFF] text-base font-medium flex items-center gap-0.5 active:opacity-60 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>{currentSubView === 'overview' ? 'Overview' : 'Internet, Apps & Chat'}</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          {currentSubView === 'overview' && 'Internet, Apps & Chat'}
          {currentSubView === 'apps' && 'Device Apps'}
          {currentSubView === 'chat' && 'Campus Chat Suggestions'}
          {currentSubView === 'taxi' && 'Taxi Pocket Card'}
        </h1>

        {currentSubView === 'apps' ? (
          <button
            type="button"
            onClick={() => setIsSectionEditMode(!isSectionEditMode)}
            className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity cursor-pointer"
          >
            {isSectionEditMode ? 'Done' : 'Edit'}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      {/* ========================================================= */}
      {/* VIEW A: 3 SUB-PORTAL WIDGETS ENTRY (Requirement #7)       */}
      {/* ========================================================= */}
      {currentSubView === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 block">
            Digital & Communication Portals
          </span>

          {/* Widget 1: Device Apps (0% to 100% progress) */}
          <button
            type="button"
            onClick={() => setCurrentSubView('apps')}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  📱
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                    Device Apps & VPN
                  </h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    {totalApps} apps across iPhone 17, Samsung S20 FE, and Dell laptop.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{appProgress}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{readyApps}/{totalApps} Ready</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${appProgress}%` }}
              />
            </div>

            <div className="pt-1 border-t border-black/5 flex items-center justify-between text-xs text-[#8E8E93]">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#007AFF]">
                Shadowrocket • WeChat • Alipay • DiDi
              </span>
              <span>Tap to configure apps</span>
            </div>
          </button>

          {/* Widget 2: Campus Chat (Single Master Checkbox, Requirement #7 & #8) */}
          <div className="ios-card p-4 sm:p-5 space-y-3">
            <div
              onClick={() => setCurrentSubView('chat')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  💬
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                    Campus Chat Suggestions
                  </h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    4 Inquiry topics & live templates for Buddy & Ms. Sun.
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
            </div>

            {/* Single Master Checkbox (Requirement #7) */}
            <div className="pt-2 border-t border-black/5 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={handleToggleMasterChat}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isMasterConfirmed
                      ? 'bg-[#34C759] text-white shadow-xs'
                      : 'border-2 border-slate-300 bg-white hover:border-[#34C759]'
                  }`}
                >
                  {isMasterConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className={`text-xs font-semibold ${isMasterConfirmed ? 'text-slate-900' : 'text-slate-600'}`}>
                  Contacted Campus & Confirmed Fresh Details
                </span>
              </label>

              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isMasterConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                {isMasterConfirmed ? 'Confirmed' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Widget 3: Taxi Card */}
          <button
            type="button"
            onClick={onOpenTaxiModal}
            className="w-full ios-card p-4 sm:p-5 text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                🚕
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                  Taxi Pocket Card
                </h3>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  Bilingual Hainan University pass for airport taxi driver (Backup option).
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: DEVICE APPS FULL VIEW (Requirement #7)             */}
      {/* ========================================================= */}
      {currentSubView === 'apps' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Summary Progress Card (Starts at 0% default) */}
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
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

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${appProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>Tap checkmark once verified and setup on your device</span>
              <button
                type="button"
                onClick={() => setShowAddAppModal(true)}
                className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add App</span>
              </button>
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDevice === d.id
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-black/5 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* GFW Bypass Architecture & Pre-Departure Setup Strategy (Requirement #5C) */}
          <div className="ios-card p-4 space-y-2 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border-blue-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#007AFF] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                🛡️
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                China Proxy Architecture: Jichang + Shadowsocks / VLESS / Trojan
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern <strong>"Jichang" (Airport / 机场) subscription services</strong> paired with <strong>Shadowrocket</strong> (iPhone & iPad), <strong>v2rayNG</strong> (Samsung S20 FE), and <strong>Clash Verge Rev</strong> (Dell Laptop) using <strong>Shadowsocks (AEAD-2022), VLESS-Reality, or Trojan protocols</strong> are the gold standard for China—far more reliable and cost-effective than commercial consumer VPNs (ExpressVPN/NordVPN), which frequently get blocked during China's firewall crackdowns.
            </p>
            <div className="pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px] text-[#007AFF] font-semibold flex-wrap gap-2">
              <span>⚠️ Must-Do in Sri Lanka:</span>
              <span className="text-slate-700 font-normal">
                Import & test subscription URLs on Friday/Saturday before boarding CMB flight.
              </span>
            </div>
          </div>

          {/* Deduplicated App Rows (Requirement #5A) */}
          <div className="ios-card divide-y divide-black/5 overflow-hidden">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {isSectionEditMode && (
                    <button
                      type="button"
                      onClick={() => onDeleteApp(app.id)}
                      className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                      title="Remove app"
                    >
                      <Minus className="w-3 h-3 stroke-[3]" />
                    </button>
                  )}

                  {/* 36x36px Crisp Rounded App Icon */}
                  <div className="w-9 h-9 rounded-xl bg-[#F2F2F7] border border-black/5 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <AppIcon name={app.appIcon} className="w-5 h-5" />
                  </div>

                  {/* App Info with Multiple Device Badges in All Devices View */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {app.name}
                      </span>

                      {/* Display multiple device badges (Requirement #7) */}
                      {app.devices && app.devices.length > 0 ? (
                        app.devices.map((dev) => (
                          <span
                            key={dev}
                            className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-[#F2F2F7] text-slate-600 border border-black/5"
                          >
                            {dev}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-[#F2F2F7] text-slate-600 border border-black/5">
                          {app.platform}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8E8E93] line-clamp-1 mt-0.5">
                      {app.role}
                    </p>
                  </div>
                </div>

                {/* Single Circular iOS Checkmark Circle */}
                <div className="shrink-0 pl-1">
                  <button
                    type="button"
                    onClick={() => handleToggleReady(app)}
                    title={app.isConfigured ? 'Ready (Tap to toggle)' : 'Not ready (Tap to mark ready)'}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      app.isConfigured
                        ? 'bg-[#007AFF] text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                    }`}
                  >
                    {app.isConfigured && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW C: CAMPUS CHAT GUIDED INQUIRY (Requirement #8)       */}
      {/* ========================================================= */}
      {currentSubView === 'chat' && (
        <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in duration-200">
          {/* Master Confirmation Banner */}
          <div className="ios-card p-4 flex items-center justify-between border-l-4 border-l-[#34C759]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleMasterChat}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isMasterConfirmed
                    ? 'bg-[#34C759] text-white shadow-xs'
                    : 'border-2 border-slate-300 bg-white hover:border-[#34C759]'
                }`}
              >
                {isMasterConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Master Check: Contacted Campus & Confirmed Fresh Details
                </span>
                <span className="text-[11px] text-[#8E8E93]">
                  Tick off once your Buddy / Ms. Sun confirms arrival instructions.
                </span>
              </div>
            </div>
          </div>

          {/* Section Header: iOS Support Page Layout (Requirement #8) */}
          <div className="px-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Suggestion Sections — Get Fresh Details from Chat Buddy
            </h2>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Review and copy these targeted inquiries to finalize arrival plans on WeChat.
            </p>
          </div>

          {/* 4 Clear Suggestion Topics */}
          <div className="space-y-4">
            {chatTopics.map((topic) => {
              const isConfirmed = isTopicConfirmed(topic.id);
              const isEditing = editingMsgId === topic.id;
              const isCopied = copiedId === topic.id;

              return (
                <div key={topic.id} className="ios-card p-4 sm:p-5 space-y-3">
                  {/* Topic Header & Checkbox */}
                  <div className="flex items-start justify-between gap-2 border-b border-black/5 pb-2.5">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {topic.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-[#007AFF] block mt-0.5">
                        Ask: {topic.whoToAsk} • Timing: {topic.timeStr}
                      </span>
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleTopic(topic.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isConfirmed ? 'bg-[#34C759] text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isConfirmed && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span className={`text-[10px] font-semibold ${isConfirmed ? 'text-emerald-800' : 'text-[#8E8E93]'}`}>
                        {isConfirmed ? 'Confirmed' : 'To Confirm'}
                      </span>
                    </label>
                  </div>

                  {/* Who to ask & Details to get summary */}
                  <div className="bg-[#F2F2F7] p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <span className="font-bold text-[11px] text-slate-900 uppercase tracking-wider block">
                      Key details to get:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {topic.detailsToGet.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Compact Chat Bubble Window */}
                  {isEditing ? (
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 text-xs">
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
                          onClick={() => handleSaveEdit(topic.id)}
                          className="px-4 py-1 text-xs rounded-lg bg-[#007AFF] text-white font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end pt-1">
                      <div className="max-w-[95%] sm:max-w-[90%] bg-[#007AFF] text-white p-3 sm:p-3.5 rounded-2xl rounded-br-sm text-xs leading-relaxed shadow-2xs">
                        {topic.body}
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(topic.id, topic.body)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2F2F7] text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-[#8E8E93]" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyMessage(topic.id, topic.body)}
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

          {/* Key Official Contacts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="ios-card p-3.5 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 block">Ms. Sun (Admission)</span>
              <p className="text-[11px] text-[#8E8E93]">Hotlines: 0898-66291354 / 0898-66213608</p>
              <p className="text-[11px] text-[#007AFF] font-mono">WeChat: sun_admission</p>
            </div>

            <div className="ios-card p-3.5 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 block">Campus Student Volunteer</span>
              <p className="text-[11px] text-[#8E8E93]">Meeting at Haidian South Gate</p>
              <p className="text-[11px] text-[#34C759] font-medium">Assists with dorm key & campus card</p>
            </div>
          </div>
        </div>
      )}

      {/* Add App Modal */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleAddAppSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 border border-black/10 text-xs"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Add Application</h3>
              <button
                type="button"
                onClick={() => setShowAddAppModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                App Name
              </label>
              <input
                type="text"
                placeholder="e.g. Pleco, Notion, WeChat"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/10 rounded-xl bg-[#F2F2F7]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <DynamicSelect
                  value={newAppPlatform}
                  options={allAppDevices}
                  onChange={(val) => setNewAppPlatform(val as any)}
                  onAddCustom={onAddCustomAppDevice}
                  addCustomLabel="+ Add Custom Device..."
                  label="Device"
                  selectClassName="py-1.5 text-xs bg-[#F2F2F7]"
                />
              </div>

              <div>
                <DynamicSelect
                  value={newAppCategory}
                  options={allAppCategories}
                  onChange={(val) => setNewAppCategory(val as any)}
                  onAddCustom={onAddCustomAppCategory}
                  addCustomLabel="+ Add Custom Category..."
                  label="Category"
                  selectClassName="py-1.5 text-xs bg-[#F2F2F7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Role & Setup Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Literature translation, offline map"
                value={newAppRole}
                onChange={(e) => setNewAppRole(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-black/10 rounded-xl bg-[#F2F2F7]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <button
                type="button"
                onClick={() => setShowAddAppModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white font-semibold shadow-xs"
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
