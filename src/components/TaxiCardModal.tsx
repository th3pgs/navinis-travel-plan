import React, { useState } from 'react';
import { X, Copy, Check, MapPin, Phone } from 'lucide-react';

interface TaxiCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxiCardModal: React.FC<TaxiCardModalProps> = ({ isOpen, onClose }) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(text);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#003580] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Haikou Airport Taxi Destination Card</h2>
            <p className="text-xs text-blue-200 mt-0.5">Show directly to the driver or queue attendant</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Destination */}
          <div className="border border-slate-200 bg-slate-50 p-5 rounded">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Destination
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              请送我去：海南大学（海甸校区）
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Please take me to: Hainan University (Haidian Campus)
            </p>
          </div>

          {/* Detailed Address */}
          <div className="border border-slate-200 p-5 rounded space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Official Street Address
            </span>
            <div className="text-lg sm:text-xl font-semibold text-slate-900">
              中国海南省海口市美兰区人民大道58号
            </div>
            <div className="text-sm font-semibold text-blue-900">
              （海南大学国际教育学院 / 留学生公寓）
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              No. 58 Renmin Avenue, Meilan District, Haikou (School of International Education / Dormitory)
            </p>
          </div>

          {/* Driver Note */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
              Note for Driver
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              司机师傅您好：我是刚到的外国留学生，不会说中文，行李有两件大箱子。如果大门保安询问或找不到具体报到楼，请帮我打这个电话联系学校老师或同学：
            </p>
            <p className="text-xs text-slate-600 mt-1">
              (Hello driver: I am an international student and don't speak Chinese. I have 2 large suitcases. If campus gate security asks or you need the exact building, please call the teacher below:)
            </p>
          </div>

          {/* Emergency Phone Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 p-3.5 rounded flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Ms. Sun (Office 1)</div>
                <div className="text-base font-bold font-mono text-slate-900">0898-66291354</div>
              </div>
              <button
                onClick={() => copyToClipboard('089866291354')}
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                {copiedPhone === '089866291354' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone === '089866291354' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="border border-slate-200 p-3.5 rounded flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Ms. Sun (Office 2)</div>
                <div className="text-base font-bold font-mono text-slate-900">0898-66213608</div>
              </div>
              <button
                onClick={() => copyToClipboard('089866213608')}
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                {copiedPhone === '089866213608' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone === '089866213608' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div>WeChat ID: <span className="font-mono font-bold text-slate-900">sun_admission</span></div>
            <div>Metered Taxi Fare: approx. 50–80 RMB (35–45 minutes)</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded"
          >
            Close Card
          </button>
        </div>
      </div>
    </div>
  );
};
