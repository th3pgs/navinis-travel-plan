import React, { useState } from 'react';
import { Copy, Check, Printer, Edit2, Download, ChevronLeft } from 'lucide-react';

interface TaxiCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generates a clean, professional standalone HTML document for printing.
// Stripped of unnecessary English translations, confusing subtitles, and taxi fare text.
function generatePrintableHTML(fields: {
  destinationCn: string;
  addressCn: string;
  messageCn: string;
  phone1: string;
  phone2: string;
}) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>海南大学留学生到达卡 — Hainan University Arrival Card</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      height: auto;
      margin: 0;
      padding: 0;
      background: #fff;
    }
    body {
      font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Segoe UI", sans-serif;
      color: #0f172a;
      padding: 8mm 10mm;
      background: #fff;
    }
    .card {
      border: 3px solid #0f172a;
      border-radius: 12px;
      padding: 22px 24px 18px;
      max-width: 620px;
      margin: 0 auto;
      page-break-inside: avoid;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .header-title-cn {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .header-sub-en {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      margin-top: 2px;
    }
    .header-badge {
      font-size: 11px;
      font-weight: 700;
      color: #1e3a8a;
      background: #eff6ff;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #bfdbfe;
    }
    .dest-box {
      background: #fef2f2;
      border: 2px solid #ef4444;
      border-radius: 10px;
      padding: 16px 18px;
      margin-bottom: 14px;
    }
    .dest-label {
      font-size: 11px;
      font-weight: 800;
      color: #991b1b;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .dest-text {
      font-size: 32px;
      font-weight: 900;
      color: #b91c1c;
      line-height: 1.25;
      letter-spacing: 0.5px;
    }
    .addr-box {
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 14px;
      background: #f8fafc;
    }
    .addr-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 4px;
    }
    .addr-text {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
    }
    .msg-box {
      background: #fffbeb;
      border: 1.5px solid #f59e0b;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 14px;
    }
    .msg-label {
      font-size: 11px;
      font-weight: 800;
      color: #92400e;
      margin-bottom: 4px;
    }
    .msg-text {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.6;
    }
    .contacts-row {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }
    .contact-card {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 14px;
      background: #ffffff;
    }
    .contact-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
    }
    .contact-phone {
      font-size: 18px;
      font-weight: 900;
      font-family: -apple-system, "SF Mono", "Menlo", monospace;
      color: #0f172a;
      margin-top: 2px;
    }
    .wechat-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid #e2e8f0;
      padding-top: 12px;
    }
    .wechat-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 6px;
      color: #065f46;
      font-size: 13px;
      font-weight: 700;
    }
    .wechat-icon {
      width: 16px;
      height: 16px;
      fill: #07c160;
    }
    .wechat-id {
      font-family: -apple-system, "SF Mono", "Menlo", monospace;
      font-weight: 900;
      color: #047857;
      font-size: 14px;
    }
    .student-bar {
      margin-top: 16px;
      border: 1px dashed #94a3b8;
      border-radius: 8px;
      padding: 8px 12px;
      text-align: center;
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      background: #f8fafc;
    }
    .student-bar strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="header-title-cn">海南大学留学生到达卡</div>
        <div class="header-sub-en">Hainan University Student Arrival Card</div>
      </div>
      <div class="header-badge">海甸校区 • 留学生公寓</div>
    </div>

    <div class="dest-box">
      <div class="dest-label">目的地 (Destination):</div>
      <div class="dest-text">${fields.destinationCn}</div>
    </div>

    <div class="addr-box">
      <div class="addr-label">详细地址 (Address):</div>
      <div class="addr-text">${fields.addressCn}</div>
    </div>

    <div class="msg-box">
      <div class="msg-label">留学生说明 (Note for Driver):</div>
      <div class="msg-text">${fields.messageCn}</div>
    </div>

    <div class="contacts-row">
      <div class="contact-card">
        <div class="contact-label">学校接报联系人 1 (孙老师)</div>
        <div class="contact-phone">${fields.phone1}</div>
      </div>
      <div class="contact-card">
        <div class="contact-label">学校接报联系人 2 (孙老师)</div>
        <div class="contact-phone">${fields.phone2}</div>
      </div>
    </div>

    <div class="wechat-bar">
      <div class="wechat-pill">
        <svg class="wechat-icon" viewBox="0 0 24 24">
          <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 2.05 1.05 3.89 2.7 5.09l-.7 2.1 2.45-1.23c.96.34 2 .54 3.05.54.2 0 .4 0 .6-.02-.15-.47-.23-.97-.23-1.48 0-3.31 3.13-6 7-6 .34 0 .68.02 1.01.07C16.14 4.5 12.63 2 8.5 2zm-2 4.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6.5 4.5c-3.31 0-6 2.24-6 5s2.69 5 6 5c.83 0 1.62-.15 2.34-.42l1.91.96-.54-1.63c1.37-.95 2.29-2.39 2.29-3.91 0-2.76-2.69-5-6-5zm-2 3c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm4 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z"/>
        </svg>
        <span>微信号 (WeChat ID):</span>
        <span class="wechat-id">sun_admission</span>
      </div>
      <div style="font-size: 11px; color: #64748b;">
        海口美兰机场出租车乘车点直达
      </div>
    </div>
  </div>

  <div class="student-bar">
    学生姓名 (Student): <strong>Parana Gamage Navini Ravishka Priyantha</strong> •
    录取编号: <strong>263660001</strong> •
    专业: <strong>食品科学与工程（全英文授课全额奖学金）</strong>
  </div>
</body>
</html>`;
}

export const TaxiCardModal: React.FC<TaxiCardModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Clean, high-impact destination fields
  const [destinationCn, setDestinationCn] = useState('海南大学（海甸校区）');
  const [addressCn, setAddressCn] = useState('中国海南省海口市美兰区人民大道58号（海南大学国际教育学院 / 留学生公寓）');
  const [messageCn, setMessageCn] = useState(
    '司机师傅您好：我是刚到校报到的外国留学生，中文不流利，行李有两件大箱子。如果进门保安询问或找不到具体宿舍/报到楼，请帮我拨打学校老师电话。非常感谢！'
  );
  const [phone1, setPhone1] = useState('0898-66291354');
  const [phone2, setPhone2] = useState('0898-66213608');

  if (!isOpen) return null;

  const copyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  // Uses a clean isolated iframe to print strictly 1 page without any app chrome or blank sheets.
  const handlePrint = () => {
    const html = generatePrintableHTML({
      destinationCn,
      addressCn,
      messageCn,
      phone1,
      phone2,
    });

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (frameDoc && iframe.contentWindow) {
        frameDoc.open();
        frameDoc.write(html);
        frameDoc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            try {
              document.body.removeChild(iframe);
            } catch (e) {}
          }, 60000);
        }, 300);
        return;
      }
    } catch (e) {
      console.warn('Iframe print error, falling back to window.open', e);
    }

    // Fallback: window.open
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleDownloadHTML = () => {
    const html = generatePrintableHTML({
      destinationCn,
      addressCn,
      messageCn,
      phone1,
      phone2,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hainan_University_Taxi_Card.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    // iOS Modal Sheet Standard: position fixed, inset 0, full column, sticky top bar
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#F2F2F7] overflow-hidden animate-in slide-in-from-bottom duration-250">
      {/* Sticky iOS Top Navigation Bar (Cannot be pushed off screen) */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-black/10 px-4 h-12 sm:h-14 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-[#007AFF] text-base font-semibold flex items-center gap-0.5 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>Done</span>
        </button>

        <div className="text-center font-semibold text-sm sm:text-base text-slate-900 truncate px-2">
          Taxi Pocket Card
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={handleDownloadHTML}
            className="p-1.5 text-slate-600 hover:text-slate-900 active:opacity-60 transition-opacity"
            title="Download HTML"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-2.5 py-1 bg-[#007AFF] hover:bg-blue-600 active:opacity-80 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </header>

      {/* Scrollable Sheet Body (-webkit-overflow-scrolling: touch) */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full">
        {/* iOS Notice Banner */}
        <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3 text-xs text-blue-900 flex items-center justify-between">
          <span>Show this card to the taxi driver at Haikou Airport.</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#007AFF]">
            1-Page Printout
          </span>
        </div>

        {/* The Card Container */}
        <div className="bg-white rounded-2xl border border-black/10 p-5 sm:p-6 shadow-sm space-y-4">
          {/* Header */}
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                海南大学留学生到达卡
              </h3>
              <p className="text-xs text-[#8E8E93] font-medium">
                Hainan University Student Arrival Card
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#007AFF] border border-blue-200">
              海甸校区
            </span>
          </div>

          {/* Destination */}
          <div className="bg-red-50/80 border-2 border-red-200 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-extrabold text-red-800 block mb-1">
              目的地 (Destination):
            </span>
            {isEditing ? (
              <input
                type="text"
                value={destinationCn}
                onChange={(e) => setDestinationCn(e.target.value)}
                className="w-full p-2 border border-red-400 rounded-lg text-xl font-bold text-slate-900 bg-white"
              />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-red-700 tracking-tight leading-snug">
                {destinationCn}
              </div>
            )}
          </div>

          {/* Detailed Address */}
          <div className="p-3.5 border border-slate-200 rounded-xl space-y-1 bg-slate-50/60">
            <span className="text-[10px] uppercase font-bold text-[#8E8E93] block">
              详细地址 (Address):
            </span>
            {isEditing ? (
              <textarea
                value={addressCn}
                onChange={(e) => setAddressCn(e.target.value)}
                rows={2}
                className="w-full p-2 border border-blue-500 rounded-lg text-sm font-semibold text-slate-900 bg-white"
              />
            ) : (
              <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {addressCn}
              </div>
            )}
          </div>

          {/* Note to the Driver */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-900 block">
              留学生说明 (Note for Driver):
            </span>
            {isEditing ? (
              <textarea
                value={messageCn}
                onChange={(e) => setMessageCn(e.target.value)}
                rows={2}
                className="w-full p-2 border border-amber-500 rounded-lg text-xs text-slate-900 bg-white"
              />
            ) : (
              <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                {messageCn}
              </p>
            )}
          </div>

          {/* Teacher Emergency Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 border border-slate-200 rounded-xl bg-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#8E8E93] font-bold">学校联系人 1 (孙老师)</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    className="w-28 p-1 border rounded text-xs font-mono font-bold mt-1"
                  />
                ) : (
                  <div className="font-mono font-black text-slate-900 text-sm mt-0.5">{phone1}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => copyText(phone1)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F2F2F7] hover:bg-slate-200 text-[#007AFF] transition-colors"
              >
                {copied === phone1 ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="p-3 border border-slate-200 rounded-xl bg-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#8E8E93] font-bold">学校联系人 2 (孙老师)</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    className="w-28 p-1 border rounded text-xs font-mono font-bold mt-1"
                  />
                ) : (
                  <div className="font-mono font-black text-slate-900 text-sm mt-0.5">{phone2}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => copyText(phone2)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F2F2F7] hover:bg-slate-200 text-[#007AFF] transition-colors"
              >
                {copied === phone2 ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* WeChat Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              <svg className="w-4 h-4 fill-[#07C160]" viewBox="0 0 24 24">
                <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 2.05 1.05 3.89 2.7 5.09l-.7 2.1 2.45-1.23c.96.34 2 .54 3.05.54.2 0 .4 0 .6-.02-.15-.47-.23-.97-.23-1.48 0-3.31 3.13-6 7-6 .34 0 .68.02 1.01.07C16.14 4.5 12.63 2 8.5 2zm-2 4.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6.5 4.5c-3.31 0-6 2.24-6 5s2.69 5 6 5c.83 0 1.62-.15 2.34-.42l1.91.96-.54-1.63c1.37-.95 2.29-2.39 2.29-3.91 0-2.76-2.69-5-6-5zm-2 3c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm4 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z"/>
              </svg>
              <span>微信号 (WeChat):</span>
              <span className="font-mono font-bold text-slate-900">sun_admission</span>
            </div>
            <button
              type="button"
              onClick={() => copyText('sun_admission')}
              className="text-[#007AFF] font-medium hover:underline text-xs"
            >
              {copied === 'sun_admission' ? 'Copied!' : 'Copy ID'}
            </button>
          </div>
        </div>

        {/* Student Credential Strip */}
        <div className="bg-white rounded-xl border border-black/10 p-3 text-center text-xs text-[#8E8E93]">
          Student: <strong className="text-slate-900">Parana Gamage Navini Ravishka Priyantha</strong> •
          Admission: <strong className="text-slate-900 font-mono">263660001</strong>
        </div>
      </div>
    </div>
  );
};
