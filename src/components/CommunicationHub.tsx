import React, { useState } from 'react';
import {
  AppConfigItem,
  DEFAULT_APP_CATEGORIES,
  DEFAULT_APP_DEVICES,
} from '../data';
import { AppIcon } from './AppIcon';
import { DynamicSelect } from './DynamicSelect';
import { UniversityBuddyCard } from './UniversityBuddyCard';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Check,
  Globe2,
  Shield,
  Wifi,
  Smartphone,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lock,
  Key,
  Info,
  Radio,
  X,
} from 'lucide-react';

interface CommunicationHubProps {
  onBack: () => void;
  apps: AppConfigItem[];
  customAppCategories?: string[];
  customAppDevices?: string[];
  onAddCustomAppCategory?: (cat: string) => void;
  onAddCustomAppDevice?: (dev: string) => void;
  onToggleAppInstalled: (id: string) => void;
  onToggleAppLoggedIn?: (id: string) => void;
  onToggleAppVerified?: (id: string) => void;
  onToggleAppConfigured: (id: string) => void;
  onAddApp: (app: Omit<AppConfigItem, 'id'>) => void;
  onDeleteApp: (id: string) => void;
  onOpenTaxiModal?: () => void;
  confirmedCampusChat?: boolean;
  onToggleCampusChatMaster?: () => void;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({
  onBack,
  apps,
  customAppCategories = [],
  customAppDevices = [],
  onAddCustomAppCategory,
  onAddCustomAppDevice,
  onToggleAppInstalled,
  onToggleAppLoggedIn,
  onToggleAppVerified,
  onToggleAppConfigured,
  onAddApp,
  onDeleteApp,
}) => {
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isTier3Expanded, setIsTier3Expanded] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Add App Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppPlatform, setNewAppPlatform] = useState<AppConfigItem['platform']>('iOS');
  const [newAppCategory, setNewAppCategory] = useState<AppConfigItem['category']>('Stock AI & Academic');
  const [newAppRole, setNewAppRole] = useState('');
  const [newAppIcon, setNewAppIcon] = useState('doc');
  const [newAppDevices, setNewAppDevices] = useState<('iPhone 17' | 'Samsung S20 FE' | 'Dell Laptop' | 'Apple iPad 11')[]>([
    'iPhone 17',
  ]);

  const allCategories = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_APP_CATEGORIES, ...customAppCategories]));
  }, [customAppCategories]);

  const allDevices = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_APP_DEVICES, ...customAppDevices]));
  }, [customAppDevices]);

  // Filtered Apps for Square Matrix View
  const displayedApps = React.useMemo(() => {
    return apps.filter((app) => {
      if (selectedDeviceFilter !== 'all') {
        if (!app.devices || !app.devices.includes(selectedDeviceFilter as any)) {
          return false;
        }
      }
      if (selectedCategoryFilter !== 'all' && app.category !== selectedCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [apps, selectedDeviceFilter, selectedCategoryFilter]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleSaveApp = () => {
    if (!newAppName.trim()) return;

    onAddApp({
      name: newAppName.trim(),
      platform: newAppPlatform,
      category: newAppCategory,
      role: newAppRole.trim() || 'Custom installed application.',
      appIcon: newAppIcon.trim() || 'doc',
      devices: newAppDevices,
      isInstalled: false,
      isLoggedIn: false,
      isVerified: false,
      isConfigured: false,
    });

    setShowAddModal(false);
    setNewAppName('');
    setNewAppRole('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="ios-back-button group"
        >
          <ChevronLeft className="w-5 h-5 text-[#007AFF] group-hover:-translate-x-0.5 transition-transform" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add App</span>
        </button>
      </div>

      {/* 2. SECTION BANNER */}
      <div className="ios-card p-5 sm:p-6 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/60 border border-emerald-200/60 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🌐</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Internet, Apps & Chat
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              CMLink 5G eSIM, Hiddify proxy guide, and university WeChat chat.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 3-TIER CONNECTIVITY ARCHITECTURE */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-900 tracking-tight px-1 block">
          Connectivity Setup
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* TIER 1: Primary Arrival Internet */}
          <div className="ios-card p-5 border-l-4 border-l-emerald-500 bg-white shadow-xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                  T1
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                    Primary Arrival Internet
                  </h3>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    CMLink China 5G eSIM (30 Days / 30GB)
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                iPhone 17
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Device:</strong> iPhone 17 (Install QR profile in Sri Lanka before takeoff). Provides instantaneous 5G data upon touchdown in Shanghai PVG and Haikou Meilan Airport without relying on airport Wi-Fi.
            </p>

            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-[11px] text-emerald-950">
              💡 <strong>Arrival Instruction:</strong> As soon as the flight touches down in Shanghai, toggle "Data Roaming ON" on the CMLink eSIM cellular line.
            </div>
          </div>

          {/* TIER 2: Emergency & OTP Backup */}
          <div className="ios-card p-5 border-l-4 border-l-amber-500 bg-white shadow-xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                  T2
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                    Emergency & OTP Backup
                  </h3>
                  <div className="text-[11px] text-amber-800 font-semibold">
                    Dialog Sri Lanka Roaming SIM
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Samsung S20 FE
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Device:</strong> Samsung S20 FE. Dedicated solely to receiving Sri Lankan bank SMS OTPs (BOC, People's Bank, NSB) and emergency voice calls.
            </p>

            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-950 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>
                <strong>CRITICAL BILL SHOCK RULE:</strong> "Mobile Data" and "Data Roaming" MUST remain <strong>HARD-LOCKED OFF</strong> on the Samsung S20 FE at all times! SMS receipt is 100% free.
              </span>
            </div>
          </div>
        </div>

        {/* TIER 3: Long-Term Firewall Bypass & Emergency VPN (Collapsible Reference Guide) */}
        <div className="ios-card overflow-hidden border-l-4 border-l-[#5856D6] bg-white shadow-xs">
          <button
            type="button"
            onClick={() => setIsTier3Expanded(!isTier3Expanded)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                T3
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                    Tier 3: Long-Term Proxy Nodes & Emergency VPN Guide
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    Hiddify Across All 4 Devices
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  How to buy monthly node packages via Alipay + Astrill emergency credentials ($30 USD)
                </div>
              </div>
            </div>

            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              {isTier3Expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isTier3Expanded && (
            <div className="p-4 sm:p-6 border-t border-black/5 bg-[#F9FAFB] space-y-5 text-xs sm:text-sm animate-in fade-in">
              {/* Primary Client: Hiddify Reminder */}
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-950 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <AppIcon name="hiddify" className="w-5 h-5 shrink-0" />
                  <span>Primary Client: Hiddify (Installed on all 4 devices)</span>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed">
                  We are <strong>NOT</strong> using Shadowrocket, v2rayNG, or Clash. <strong>Hiddify</strong> is installed on Dell Latitude 5410, iPhone 17, iPad 11, and Samsung S20 FE.
                </p>
                <div className="text-[11px] font-semibold text-purple-800 bg-white/60 p-2 rounded-lg border border-purple-200">
                  ⚠️ <em>Important Reminder:</em> Hiddify is a firewall bypass client, NOT an internet provider! She must first be connected to Campus Wi-Fi or local Chinese SIM data.
                </div>
              </div>

              {/* Monthly Node Packages via Alipay */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                  Top Recommended Monthly Node Providers (Buy via Alipay)
                </h4>
                <p className="text-xs text-slate-600">
                  Always purchase <strong>monthly packages</strong> via Alipay (proxy domains change; search names on <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">cn.bing.com</code> inside China if needed):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>1. Taishan Net (泰山机场)</span>
                      <span className="text-emerald-700 font-mono text-xs">~¥13 / mo</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      40+ high speed ports at once. Accepts Alipay & WeChat Pay.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>2. SkyLinX (SkyLinX 机场)</span>
                      <span className="text-emerald-700 font-mono text-xs">~¥8–12 / mo</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Ultra-budget backup with generous port allocations.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>3. JuziCloud (桔子云机场)</span>
                      <span className="text-emerald-700 font-mono text-xs">~¥15–20 / mo</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      ~50 lightning fast low-latency ports across HK, Singapore, and Japan.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>4. ShunYun (顺云)</span>
                      <span className="text-emerald-700 font-mono text-xs">~¥16 / mo</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      High reliability during peak evening academic research hours.
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 space-y-1">
                  <strong>4-Step Setup:</strong> 1) Open provider site &rarr; 2) Buy monthly plan via Alipay &rarr; 3) Copy Subscription URL / QR &rarr; 4) In Hiddify, tap <strong>"+"</strong> &rarr; Import from Clipboard &rarr; Connect!
                </div>
              </div>

              {/* Emergency Backup: Astrill VPN Credential Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 text-amber-900">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Emergency Backup — Astrill VPN ($30 USD Dormant)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    No Subscription Yet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Account Email</span>
                      <strong className="text-slate-900">naviniravishka@icloud.com</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('naviniravishka@icloud.com', 'email')}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Copy email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Password / Code</span>
                      <strong className="text-slate-900">RKB38R</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('RKB38R', 'pass')}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Copy password"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-amber-900 leading-relaxed italic">
                  "In case of an emergency where Hiddify nodes fail, message PGS on WeChat so I can buy the $30 Astrill subscription from Sri Lanka—then simply log in with the email and password above."
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PRE-WRITTEN WECHAT & UNIVERSITY BUDDY ARRIVAL TEMPLATES */}
      <UniversityBuddyCard />

      {/* 5. APPLICATIONS MATRIX */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <span className="text-xs font-bold text-slate-900 tracking-tight block">
              Applications ({displayedApps.length})
            </span>
          </div>

          {/* Device Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDeviceFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDeviceFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Devices
            </button>
            {allDevices.map((dev) => (
              <button
                key={dev}
                type="button"
                onClick={() => setSelectedDeviceFilter(dev)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDeviceFilter === dev
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        </div>

        {/* Spacious Full Square Grid / Matrix View (2 to 3 per row on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayedApps.map((app) => {
            const isInstalled = !!app.isInstalled;
            const isLoggedIn = !!app.isLoggedIn;
            const isVerified = !!app.isVerified || !!app.isConfigured;
            const allCheckpointsDone = isInstalled && isLoggedIn && isVerified;

            return (
              <div
                key={app.id}
                className={`ios-card p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between transition-all border shadow-xs relative ${
                  allCheckpointsDone
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-black/10 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top: High-Res 56x56px (w-14 h-14) Squircle Logo + Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="w-14 h-14 rounded-[14px] bg-slate-50 border border-black/5 flex items-center justify-center p-2 shadow-2xs shrink-0 overflow-hidden">
                      <AppIcon name={app.appIcon || app.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 truncate max-w-[90px]">
                        {app.category}
                      </span>
                      {allCheckpointsDone && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                          Ready ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* App Title & Role */}
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight leading-snug line-clamp-1">
                    {app.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {app.role}
                  </p>

                  {/* Device Badges */}
                  {app.devices && app.devices.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.devices.map((d) => (
                        <span
                          key={d}
                          className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600"
                        >
                          {d === 'Samsung S20 FE' ? 'S20 FE (OTP)' : d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONABLE 3 SUB-TASK CHECKPOINTS INSIDE EVERY APP CARD */}
                <div className="mt-3 pt-2.5 border-t border-black/5 space-y-1.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Pre-Departure Checkpoints:
                  </div>

                  {/* Checkpoint 1: Installed */}
                  <button
                    type="button"
                    onClick={() => onToggleAppInstalled(app.id)}
                    className={`w-full py-1 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isInstalled
                        ? 'bg-blue-50 text-[#007AFF] font-bold'
                        : 'bg-slate-100/70 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <span>1. Installed</span>
                    <Check className={`w-3 h-3 stroke-[3] ${isInstalled ? 'text-[#007AFF]' : 'text-slate-300'}`} />
                  </button>

                  {/* Checkpoint 2: Account Logged In */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleAppLoggedIn) {
                        onToggleAppLoggedIn(app.id);
                      } else {
                        // Fallback toggling
                        onToggleAppConfigured(app.id);
                      }
                    }}
                    className={`w-full py-1 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isLoggedIn
                        ? 'bg-amber-50 text-amber-800 font-bold'
                        : 'bg-slate-100/70 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <span>2. Logged In</span>
                    <Check className={`w-3 h-3 stroke-[3] ${isLoggedIn ? 'text-amber-700' : 'text-slate-300'}`} />
                  </button>

                  {/* Checkpoint 3: Tested & Verified */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleAppVerified) {
                        onToggleAppVerified(app.id);
                      } else {
                        onToggleAppConfigured(app.id);
                      }
                    }}
                    className={`w-full py-1 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'bg-slate-100/70 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <span>3. Tested & Verified ✓</span>
                    <Check className={`w-3 h-3 stroke-[3] ${isVerified ? 'text-emerald-700' : 'text-slate-300'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD APP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Add New Application</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">App Name</label>
                <input
                  type="text"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g. Notion, WeChat, Baidu..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#007AFF]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <DynamicSelect
                  value={newAppCategory}
                  options={allCategories}
                  onChange={(cat) => setNewAppCategory(cat as any)}
                  onAddCustom={(cat) => {
                    onAddCustomAppCategory?.(cat);
                    setNewAppCategory(cat as any);
                  }}
                  customPlaceholder="+ Add Category..."
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Role / Function</label>
                <textarea
                  rows={2}
                  value={newAppRole}
                  onChange={(e) => setNewAppRole(e.target.value)}
                  placeholder="e.g. Campus messaging, VPN backup..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#007AFF]"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApp}
                disabled={!newAppName.trim()}
                className="flex-1 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Add App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
