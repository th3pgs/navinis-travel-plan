import React, { useState } from 'react';
import { X, Copy, Check, Printer, Edit2 } from 'lucide-react';

interface TaxiCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaxiCardModal: React.FC<TaxiCardModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable destination card fields
  const [destinationCn, setDestinationCn] = useState('请送我去：海南大学（海甸校区）');
  const [addressCn, setAddressCn] = useState('中国海南省海口市美兰区人民大道58号（海南大学国际教育学院 / 留学生公寓）');
  const [messageCn, setMessageCn] = useState(
    '司机师傅您好：我是刚到的外国留学生，不会说中文，行李有两件大箱子。如果进门保安询问或找不到具体宿舍/报到楼，请帮我拨打学校老师电话：'
  );
  const [phone1, setPhone1] = useState('0898-66291354');
  const [phone2, setPhone2] = useState('0898-66213608');
  const [buddyNote, setBuddyNote] = useState('如果需要，也可以联系我的中国同学/志愿者接应我。');

  if (!isOpen) return null;

  const copyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden my-auto print:m-0 print:border-none print:shadow-none">
        {/* Modal Top Bar */}
        <div className="bg-[#003580] text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-sm font-bold tracking-tight">Haikou Taxi Destination Card & Pocket Pass</h2>
            <p className="text-[11px] text-blue-200">Editable • Printable pocket card for taxi queue</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Card'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs rounded bg-[#febb02] hover:bg-[#e5a800] text-slate-950 font-bold flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-5 sm:p-6 space-y-4 print:p-2" id="printable-taxi-card">
          {/* Card Border frame */}
          <div className="border-2 border-slate-900 p-5 rounded-lg bg-white space-y-4">
            {/* Header */}
            <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Hainan University Arrival Pocket Card
                </span>
                <span className="text-xs text-slate-700 font-semibold">
                  出示给出租车司机师傅看 (Show directly to Driver)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                Haikou Meilan &rarr; Haidian Campus
              </span>
            </div>

            {/* Destination in High Contrast Chinese */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Destination / 目的地:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={destinationCn}
                  onChange={(e) => setDestinationCn(e.target.value)}
                  className="w-full p-2 border border-blue-500 rounded text-xl font-bold text-slate-900"
                />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                  {destinationCn}
                </div>
              )}
              <div className="text-xs text-slate-600 mt-1">
                (Please take me to: Hainan University — Haidian Campus)
              </div>
            </div>

            {/* Address */}
            <div className="p-3.5 border border-slate-200 rounded space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Detailed Address / 详细地址:
              </span>
              {isEditing ? (
                <textarea
                  value={addressCn}
                  onChange={(e) => setAddressCn(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-blue-500 rounded text-sm font-semibold text-slate-900"
                />
              ) : (
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {addressCn}
                </div>
              )}
              <div className="text-[11px] text-slate-500">
                No. 58 Renmin Avenue, Meilan District, Haikou (School of International Education / Dormitory)
              </div>
            </div>

            {/* Note to the Driver */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-300 rounded space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">
                Message for Driver / 司机师傅说明:
              </span>
              {isEditing ? (
                <textarea
                  value={messageCn}
                  onChange={(e) => setMessageCn(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-blue-500 rounded text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                  {messageCn}
                </p>
              )}
              <div className="text-[11px] text-slate-600">
                {buddyNote}
              </div>
            </div>

            {/* Phone numbers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">孙老师 (Ms. Sun 1)</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      className="w-24 p-1 border text-xs font-mono font-bold"
                    />
                  ) : (
                    <div className="font-mono font-bold text-slate-900">{phone1}</div>
                  )}
                </div>
                <button
                  onClick={() => copyText(phone1)}
                  className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white hover:bg-slate-100 print:hidden"
                >
                  {copied === phone1 ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">孙老师 (Ms. Sun 2)</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      className="w-24 p-1 border text-xs font-mono font-bold"
                    />
                  ) : (
                    <div className="font-mono font-bold text-slate-900">{phone2}</div>
                  )}
                </div>
                <button
                  onClick={() => copyText(phone2)}
                  className="px-2 py-1 text-[11px] border border-slate-300 rounded bg-white hover:bg-slate-100 print:hidden"
                >
                  {copied === phone2 ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-200 text-[11px] text-slate-600 gap-1">
              <div>
                WeChat: <strong className="font-mono text-slate-900">sun_admission</strong>
              </div>
              <div>
                Metered Taxi Fare: approx. <strong>50–80 RMB</strong> (35–45 mins)
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center print:hidden">
          <span className="text-[11px] text-slate-500">
            Tip: You can print this card or screenshot it offline.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
