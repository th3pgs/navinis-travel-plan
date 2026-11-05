import React, { useState } from 'react';
import { X, Copy, Check, Printer, Edit2, FileText, Download } from 'lucide-react';

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

  if (!isOpen) return null;

  const copyText = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportAsHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Hainan University Taxi Card</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, sans-serif; color: #000; padding: 20px; }
    .card { border: 3px solid #000; padding: 24px; border-radius: 8px; max-width: 580px; margin: 0 auto; }
    .dest { font-size: 28px; font-weight: 900; color: #b91c1c; margin: 12px 0; }
    .addr { font-size: 18px; font-weight: bold; margin: 8px 0; }
    .msg { font-size: 14px; margin: 12px 0; line-height: 1.5; }
    .phones { background: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 12px; font-weight: bold; text-transform: uppercase;">Show directly to Taxi Driver / 出示给出租车司机看:</div>
    <div class="dest">${destinationCn}</div>
    <div class="addr">详细地址：${addressCn}</div>
    <div class="msg">${messageCn}</div>
    <div class="phones">
      孙老师 (Ms. Sun 1): ${phone1}<br>
      孙老师 (Ms. Sun 2): ${phone2}<br>
      WeChat: sun_admission
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hainan_University_Taxi_Pocket_Card.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportForGoogleDocs = () => {
    const docContent = `<html>
<head><meta charset="utf-8"><title>Hainan University Taxi Card</title></head>
<body>
  <h2>HAINAN UNIVERSITY - TAXI POCKET CARD</h2>
  <hr/>
  <h1 style="color:#b91c1c;">${destinationCn}</h1>
  <p><strong>详细地址 / Detailed Address:</strong> ${addressCn}</p>
  <p><strong>司机师傅您好：</strong> ${messageCn}</p>
  <p><strong>孙老师 (Ms. Sun 1):</strong> ${phone1}</p>
  <p><strong>孙老师 (Ms. Sun 2):</strong> ${phone2}</p>
  <p><strong>WeChat ID:</strong> sun_admission</p>
  <p><strong>Estimated Metered Fare:</strong> 50 - 80 RMB</p>
</body>
</html>`;
    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Hainan_University_Taxi_Card_for_Google_Docs.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden my-auto print:border-none print:shadow-none">
        {/* Modal Top Bar */}
        <div className="bg-[#003580] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
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
              onClick={exportAsHTML}
              className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
              title="Save as single HTML/PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>
            <button
              onClick={exportForGoogleDocs}
              className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-colors"
              title="Download editable doc for Google Docs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Google Docs</span>
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

        {/* Printable Card Area Strictly Locked to Exactly 1 Page */}
        <div className="p-4 sm:p-5 space-y-3 print:p-0 print:m-0" id="single-page-card">
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
            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
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
                  className="px-2 py-0.5 text-[10px] border border-slate-300 rounded bg-white hover:bg-slate-100 print:hidden"
                >
                  {copied === phone1 ? 'Copied' : 'Copy'}
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
                  className="px-2 py-0.5 text-[10px] border border-slate-300 rounded bg-white hover:bg-slate-100 print:hidden"
                >
                  {copied === phone2 ? 'Copied' : 'Copy'}
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
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex justify-between items-center print:hidden">
          <span className="text-[11px] text-slate-500">
            Locked to a single 1-page pocket printout.
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
