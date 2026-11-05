import React, { useState } from 'react';
import { X, Copy, Check, Printer, Edit2, Download } from 'lucide-react';

interface TaxiCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generates a full standalone HTML document for printing in a new window.
// This completely bypasses the broken window.print() approach that was
// hiding/showing elements with CSS visibility — which caused 3 blank pages.
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
  <title>海南大学出租车卡 — Hainan University Taxi Card</title>
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
      font-family: "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", -apple-system, "Segoe UI", sans-serif;
      color: #1e293b;
      padding: 8mm 10mm;
      background: #fff;
    }
    .card {
      border: 3px solid #1e293b;
      border-radius: 10px;
      padding: 20px 22px 16px;
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
    .header-left {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
    }
    .header-right {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      background: #f1f5f9;
      padding: 3px 10px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    .subtitle-cn {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-top: 2px;
    }
    .dest-box {
      background: #fef2f2;
      border: 2px solid #fca5a5;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 14px;
    }
    .dest-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #991b1b;
      margin-bottom: 4px;
    }
    .dest-text {
      font-size: 28px;
      font-weight: 900;
      color: #b91c1c;
      line-height: 1.25;
    }
    .dest-en {
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
    }
    .addr-box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .addr-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 3px;
    }
    .addr-text {
      font-size: 17px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.4;
    }
    .addr-en {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 3px;
    }
    .msg-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .msg-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #92400e;
      margin-bottom: 4px;
    }
    .msg-text {
      font-size: 13px;
      font-weight: 500;
      color: #1e293b;
      line-height: 1.6;
    }
    .phones-row {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }
    .phone-card {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      background: #f8fafc;
    }
    .phone-label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
    }
    .phone-number {
      font-size: 16px;
      font-weight: 800;
      font-family: "SF Mono", "Menlo", "Consolas", monospace;
      color: #1e293b;
      margin-top: 2px;
    }
    .footer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 11px;
      color: #64748b;
    }
    .footer-row strong {
      color: #1e293b;
      font-family: "SF Mono", "Menlo", "Consolas", monospace;
    }
    .student-bar {
      margin-top: 18px;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .student-bar strong {
      color: #1e293b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="header-left">Hainan University Arrival Pocket Card</div>
        <div class="subtitle-cn">出示给出租车司机师傅看 (Show directly to Driver)</div>
      </div>
      <div class="header-right">1-Page Pocket Pass</div>
    </div>

    <div class="dest-box">
      <div class="dest-label">Destination / 目的地:</div>
      <div class="dest-text">${fields.destinationCn}</div>
      <div class="dest-en">(Please take me to: Hainan University — Haidian Campus)</div>
    </div>

    <div class="addr-box">
      <div class="addr-label">Detailed Address / 详细地址:</div>
      <div class="addr-text">${fields.addressCn}</div>
      <div class="addr-en">No. 58 Renmin Avenue, Meilan District, Haikou (School of International Education / Dormitory)</div>
    </div>

    <div class="msg-box">
      <div class="msg-label">Message for Driver / 司机师傅说明:</div>
      <div class="msg-text">${fields.messageCn}</div>
    </div>

    <div class="phones-row">
      <div class="phone-card">
        <div class="phone-label">孙老师 (Ms. Sun 1)</div>
        <div class="phone-number">${fields.phone1}</div>
      </div>
      <div class="phone-card">
        <div class="phone-label">孙老师 (Ms. Sun 2)</div>
        <div class="phone-number">${fields.phone2}</div>
      </div>
    </div>

    <div class="footer-row">
      <div>WeChat: <strong>sun_admission</strong></div>
      <div>Metered Taxi Fare: approx. <strong>50–80 RMB</strong></div>
    </div>
  </div>

  <div class="student-bar">
    Student: <strong>Parana Gamage Navini Ravishka Priyantha</strong> •
    Admission No: <strong>263660001</strong> •
    Hainan University (Haidian Campus) • Food Science & Engineering (2026–2029)
  </div>
</body>
</html>`;
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

  if (!isOpen) return null;

  const copyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  // Uses a clean isolated iframe to print strictly 1 page without any app chrome or blank sheets.
  // Falls back to window.open if iframe printing is restricted.
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

  // Downloads a standalone HTML file that can be opened locally and printed,
  // works everywhere — no Google Docs, no cloud dependency.
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
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="bg-[#003580] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold tracking-tight">Haikou Taxi Destination Pocket Card</h2>
            <p className="text-[11px] text-blue-200">1-Page compact pocket format for print shops or wallet</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done' : 'Edit'}</span>
            </button>
            <button
              onClick={handleDownloadHTML}
              className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
              title="Download as standalone HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save HTML</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs rounded bg-[#febb02] hover:bg-[#e5a800] text-slate-950 font-bold flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print (1 Page)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Preview of the Card */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="border-2 border-slate-900 p-4 rounded-lg bg-white space-y-3">
            {/* Header */}
            <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Hainan University Arrival Pocket Card
                </span>
                <span className="text-xs text-slate-800 font-semibold">
                  出示给出租车司机师傅看 (Show directly to Driver)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                1-Page Pocket Pass
              </span>
            </div>

            {/* Destination in High Contrast Chinese */}
            <div className="bg-red-50 border border-red-200 p-3 rounded">
              <span className="text-[10px] uppercase font-bold text-red-800 block mb-0.5">
                Destination / 目的地:
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={destinationCn}
                  onChange={(e) => setDestinationCn(e.target.value)}
                  className="w-full p-1.5 border border-blue-500 rounded text-xl font-bold text-slate-900"
                />
              ) : (
                <div className="text-2xl sm:text-3xl font-extrabold text-red-700 tracking-tight leading-snug">
                  {destinationCn}
                </div>
              )}
              <div className="text-[11px] text-slate-600 mt-0.5">
                (Please take me to: Hainan University — Haidian Campus)
              </div>
            </div>

            {/* Address */}
            <div className="p-3 border border-slate-200 rounded space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Detailed Address / 详细地址:
              </span>
              {isEditing ? (
                <textarea
                  value={addressCn}
                  onChange={(e) => setAddressCn(e.target.value)}
                  rows={2}
                  className="w-full p-1.5 border border-blue-500 rounded text-sm font-semibold text-slate-900"
                />
              ) : (
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {addressCn}
                </div>
              )}
              <div className="text-[10px] text-slate-500">
                No. 58 Renmin Avenue, Meilan District, Haikou (School of International Education / Dormitory)
              </div>
            </div>

            {/* Note to the Driver */}
            <div className="p-2.5 bg-amber-50/60 border border-amber-300 rounded space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">
                Message for Driver / 司机师傅说明:
              </span>
              {isEditing ? (
                <textarea
                  value={messageCn}
                  onChange={(e) => setMessageCn(e.target.value)}
                  rows={2}
                  className="w-full p-1.5 border border-blue-500 rounded text-xs text-slate-900"
                />
              ) : (
                <p className="text-xs font-medium text-slate-900 leading-relaxed">
                  {messageCn}
                </p>
              )}
            </div>

            {/* Phone numbers */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">孙老师 (Ms. Sun 1)</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      className="w-24 p-0.5 border text-xs font-mono font-bold"
                    />
                  ) : (
                    <div className="font-mono font-bold text-slate-900">{phone1}</div>
                  )}
                </div>
                <button
                  onClick={() => copyText(phone1)}
                  className="px-2 py-0.5 text-[10px] border border-slate-300 rounded bg-white hover:bg-slate-100"
                >
                  {copied === phone1 ? (
                    <span className="flex items-center gap-0.5 text-emerald-700"><Check className="w-3 h-3" />Done</span>
                  ) : (
                    <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" />Copy</span>
                  )}
                </button>
              </div>

              <div className="p-2 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">孙老师 (Ms. Sun 2)</div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      className="w-24 p-0.5 border text-xs font-mono font-bold"
                    />
                  ) : (
                    <div className="font-mono font-bold text-slate-900">{phone2}</div>
                  )}
                </div>
                <button
                  onClick={() => copyText(phone2)}
                  className="px-2 py-0.5 text-[10px] border border-slate-300 rounded bg-white hover:bg-slate-100"
                >
                  {copied === phone2 ? (
                    <span className="flex items-center gap-0.5 text-emerald-700"><Check className="w-3 h-3" />Done</span>
                  ) : (
                    <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" />Copy</span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-600 gap-1">
              <div>
                WeChat: <strong className="font-mono text-slate-900">sun_admission</strong>
              </div>
              <div>
                Metered Taxi Fare: approx. <strong>50–80 RMB</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">
            Print opens a clean page with only the card — no app chrome.
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
