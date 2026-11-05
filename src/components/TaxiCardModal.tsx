import React, { useState } from 'react';
import { Copy, Check, Printer, Edit2, Download, ChevronLeft, Info, X } from 'lucide-react';

interface TaxiCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generates a crisp, single-page bilingual HTML document for isolated printing.
// Zero-jargon, clean border, large bold Chinese first, clear English translation directly underneath.
function generateBilingualPrintableHTML(fields: {
  destinationCn: string;
  destinationEn: string;
  addressCn: string;
  addressEn: string;
  messageCn: string;
  messageEn: string;
  coordinatorLabelCn: string;
  coordinatorLabelEn: string;
  phone1: string;
  phone2: string;
  wechatId: string;
}) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>Hainan University Taxi Pass — 海南大学出租车到达卡</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #fff;
      padding: 10mm;
      line-height: 1.4;
    }
    .card {
      border: 3px solid #0f172a;
      border-radius: 14px;
      padding: 24px;
      max-width: 640px;
      margin: 0 auto;
      page-break-inside: avoid;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title-cn {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
    }
    .header-sub-en {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      margin-top: 2px;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      color: #003580;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .dest-box {
      background: #fef2f2;
      border: 2px solid #dc2626;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 16px;
    }
    .dest-cn {
      font-size: 30px;
      font-weight: 900;
      color: #b91c1c;
      line-height: 1.3;
      margin-bottom: 6px;
    }
    .dest-en {
      font-size: 13px;
      font-weight: 700;
      color: #991b1b;
    }
    .addr-box {
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 16px;
      background: #f8fafc;
    }
    .addr-cn {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 4px;
    }
    .addr-en {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }
    .msg-box {
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 16px;
      background: #fff;
    }
    .msg-cn {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.5;
      margin-bottom: 6px;
    }
    .msg-en {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
    }
    .contact-box {
      background: #f1f5f9;
      border: 1.5px solid #94a3b8;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .contact-title {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .contact-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .contact-row strong {
      font-family: monospace;
      font-size: 15px;
      color: #003580;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="header-title-cn">海南大学留学生到达卡</div>
        <div class="header-sub-en">Hainan University International Student Arrival Pass</div>
      </div>
      <div class="badge">海甸校区 Haidian Campus</div>
    </div>

    <!-- Destination -->
    <div class="dest-box">
      <div class="dest-cn">${fields.destinationCn}</div>
      <div class="dest-en">${fields.destinationEn}</div>
    </div>

    <!-- Address -->
    <div class="addr-box">
      <div class="addr-cn">${fields.addressCn}</div>
      <div class="addr-en">${fields.addressEn}</div>
    </div>

    <!-- Driver Note -->
    <div class="msg-box">
      <div class="msg-cn">${fields.messageCn}</div>
      <div class="msg-en">${fields.messageEn}</div>
    </div>

    <!-- Contact Info -->
    <div class="contact-box">
      <div class="contact-title">${fields.coordinatorLabelCn} (${fields.coordinatorLabelEn})</div>
      <div class="contact-row">
        <span>电话 1 (Hotline 1):</span>
        <strong>${fields.phone1}</strong>
      </div>
      <div class="contact-row">
        <span>电话 2 (Hotline 2):</span>
        <strong>${fields.phone2}</strong>
      </div>
      <div class="contact-row">
        <span>微信 (WeChat ID):</span>
        <strong>${fields.wechatId}</strong>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const TaxiCardModal: React.FC<TaxiCardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Editable Bilingual Fields (Requirement #9)
  const [fields, setFields] = useState({
    destinationCn: '请送我去：海南大学（海甸校区）南门',
    destinationEn: 'Please take me to: Hainan University (Haidian Campus) South Gate',
    addressCn: '海南省海口市美兰区人民大道58号（留学生公寓）',
    addressEn: 'No. 58 Renmin Avenue, Meilan District, Haikou (International Student Dormitory)',
    messageCn: '司机师傅您好：我是刚到的海南大学外国留学生，不会说中文。请带我到海甸校区南门。如果校门保安询问或找不到具体报到地点，请协助拨打学校老师电话：',
    messageEn: 'Dear Driver: I am a new international student at Hainan University and do not speak Chinese. Please take me to the South Gate. If gate security asks or if meeting location is needed, please call my teacher:',
    coordinatorLabelCn: '海南大学国际教育学院（孙老师）',
    coordinatorLabelEn: 'International Education College (Ms. Sun)',
    phone1: '0898-66291354',
    phone2: '0898-66213608',
    wechatId: 'sun_admission',
  });

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    const html = generateBilingualPrintableHTML(fields);
    const existing = document.getElementById('taxi-print-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'taxi-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 400);
  };

  const handleDownloadHtml = () => {
    const html = generateBilingualPrintableHTML(fields);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hainan_University_Taxi_Pass_Bilingual.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#F2F2F7]">
      {/* Sticky iOS Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 h-12 sm:h-14 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-[#007AFF] text-base font-semibold active:opacity-60 transition-opacity cursor-pointer"
        >
          Done
        </button>

        <h2 className="font-semibold text-sm sm:text-base text-slate-900 text-center truncate px-2">
          Haikou Airport Taxi Pocket Card
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#007AFF] text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isEditing ? 'View Card' : 'Edit Text'}
          </button>
        </div>
      </header>

      {/* Touch-Scrollable Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full space-y-4">
        {/* Secondary Option Framing Banner (Requirement #9) */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs shadow-2xs">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Secondary / Backup Option:</span>
            <p className="leading-relaxed">
              Use this card if your Chat Buddy recommends taking an official metered airport taxi instead of booking DiDi, or if mobile internet is unavailable upon landing.
            </p>
          </div>
        </div>

        {/* Action Buttons Strip */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#007AFF] hover:bg-blue-600 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print 1-Page Pass</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadHtml}
            className="py-2.5 px-3 rounded-xl bg-white border border-black/10 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            title="Download Standalone HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save HTML</span>
          </button>
        </div>

        {/* BILINGUAL CARD CONTAINER (Chinese first, English directly underneath) */}
        <div className="ios-card p-5 sm:p-6 space-y-4 border-2 border-slate-900 shadow-md">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                海南大学留学生到达卡
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Hainan University International Student Arrival Pass
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#007AFF] border border-blue-200">
              海甸校区
            </span>
          </div>

          {/* Section 1: Destination (Chinese 32px first, English underneath) */}
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 space-y-1.5 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-800">
                目标地点 / Destination
              </span>
              <button
                type="button"
                onClick={() => handleCopy('dest', fields.destinationCn)}
                className="text-[10px] font-semibold text-red-700 hover:underline flex items-center gap-1"
              >
                {copiedKey === 'dest' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'dest' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={fields.destinationCn}
                  onChange={(e) => setFields({ ...fields, destinationCn: e.target.value })}
                  className="w-full text-base font-bold text-red-700 bg-white p-2 rounded-lg border border-red-300"
                />
                <input
                  type="text"
                  value={fields.destinationEn}
                  onChange={(e) => setFields({ ...fields, destinationEn: e.target.value })}
                  className="w-full text-xs text-red-900 bg-white p-1.5 rounded-lg border border-red-200"
                />
              </div>
            ) : (
              <div>
                <div className="text-2xl sm:text-3xl font-black text-red-700 leading-tight">
                  {fields.destinationCn}
                </div>
                <div className="text-xs sm:text-sm font-bold text-red-900 mt-1">
                  {fields.destinationEn}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Address (Chinese first, English underneath) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
              <span>详细地址 / Full Address</span>
              <button
                type="button"
                onClick={() => handleCopy('addr', fields.addressCn)}
                className="text-slate-600 hover:underline flex items-center gap-0.5"
              >
                {copiedKey === 'addr' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'addr' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={fields.addressCn}
                  onChange={(e) => setFields({ ...fields, addressCn: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  value={fields.addressEn}
                  onChange={(e) => setFields({ ...fields, addressEn: e.target.value })}
                  className="w-full text-xs text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200"
                />
              </div>
            ) : (
              <div>
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {fields.addressCn}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {fields.addressEn}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Driver Note (Chinese first, English underneath) */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              致司机师傅提示 / Note to Driver
            </span>

            {isEditing ? (
              <div className="space-y-1">
                <textarea
                  rows={3}
                  value={fields.messageCn}
                  onChange={(e) => setFields({ ...fields, messageCn: e.target.value })}
                  className="w-full text-xs font-semibold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-300"
                />
                <textarea
                  rows={2}
                  value={fields.messageEn}
                  onChange={(e) => setFields({ ...fields, messageEn: e.target.value })}
                  className="w-full text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200"
                />
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  {fields.messageCn}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed border-t border-slate-100 pt-1">
                  {fields.messageEn}
                </p>
              </div>
            )}
          </div>

          {/* Section 4: University Hotline Contacts */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-300 space-y-2 text-xs">
            <div className="font-bold text-slate-900">
              {fields.coordinatorLabelCn} <span className="font-normal text-slate-600">({fields.coordinatorLabelEn})</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">办公热线 1 (Hotline 1):</span>
                <strong className="font-mono text-sm text-[#007AFF]">{fields.phone1}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">办公热线 2 (Hotline 2):</span>
                <strong className="font-mono text-sm text-[#007AFF]">{fields.phone2}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">微信客服 (WeChat ID):</span>
                <strong className="font-mono text-sm text-[#34C759]">{fields.wechatId}</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
