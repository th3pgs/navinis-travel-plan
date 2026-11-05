import React, { useState } from 'react';
import { Smartphone, Laptop, Tablet, CheckCircle2 } from 'lucide-react';
import { ChecklistItem } from '../data';

interface MultiDeviceMatrixProps {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
}

export const MultiDeviceMatrix: React.FC<MultiDeviceMatrixProps> = ({ items, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'iphone' | 'samsung' | 'dell' | 'ipad'>('iphone');

  const tabs = [
    {
      id: 'iphone' as const,
      category: 'devices-iphone' as const,
      name: 'iPhone 17',
      role: 'Primary Daily Phone',
      icon: Smartphone,
      location: 'Fanny Pack on chest',
    },
    {
      id: 'samsung' as const,
      category: 'devices-samsung' as const,
      name: 'Samsung S20 FE',
      role: 'Sri Lankan OTP Vault',
      icon: Smartphone,
      location: 'Fanny Pack (Data Roaming OFF)',
    },
    {
      id: 'dell' as const,
      category: 'devices-dell' as const,
      name: 'Dell Latitude 5410',
      role: 'Academic Workstation',
      icon: Laptop,
      location: 'Backpack Laptop Sleeve',
    },
    {
      id: 'ipad' as const,
      category: 'devices-ipad' as const,
      name: 'Apple iPad 11',
      role: 'Tablet & Notes',
      icon: Tablet,
      location: 'Backpack Tablet Sleeve',
    },
  ];

  const deviceItems = items.filter((item) =>
    ['devices-iphone', 'devices-samsung', 'devices-dell', 'devices-ipad'].includes(item.category)
  );
  const totalVerified = deviceItems.filter((i) => i.isChecked).length;
  const totalCount = deviceItems.length;

  const currentTabInfo = tabs.find((t) => t.id === activeTab)!;
  const currentItems = items.filter((item) => item.category === currentTabInfo.category);
  const currentVerified = currentItems.filter((i) => i.isChecked).length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Hardware & Application Installation Audit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit configurations across all 4 devices before departure from Colombo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase font-semibold text-slate-400 block">Overall Status</span>
            <span className="text-sm font-bold font-mono text-slate-800">
              {totalVerified} / {totalCount} verified
            </span>
          </div>
          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-[#003580] h-full"
              style={{ width: `${(totalVerified / (totalCount || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        {tabs.map((tab) => {
          const tabItems = items.filter((i) => i.category === tab.category);
          const tabChecked = tabItems.filter((i) => i.isChecked).length;
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isSelected
                  ? 'border-[#003580] text-[#003580] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              <span className="ml-1 text-[11px] font-normal px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                {tabChecked}/{tabItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Device Info Strip */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="font-semibold text-slate-800">{currentTabInfo.name}:</span> {currentTabInfo.role}
        </div>
        <div>
          <span className="text-slate-500">Placement:</span> <span className="font-medium text-slate-700">{currentTabInfo.location}</span>
        </div>
      </div>

      {/* Clean Checklist Table */}
      <div className="divide-y divide-slate-100">
        {currentItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`px-5 py-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
              item.isChecked ? 'bg-slate-50/60' : 'bg-white'
            }`}
          >
            {/* Front Checkbox */}
            <div className="pt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => onToggle(item.id)}
                className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-sm font-semibold ${item.isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {item.label}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{idx + 1}</span>
              </div>
              {item.detail && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
