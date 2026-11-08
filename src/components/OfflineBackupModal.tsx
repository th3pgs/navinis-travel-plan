import React, { useState } from 'react';
import { Download, Printer, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';
import { ChecklistItem, WardrobeItem } from '../data';

interface OfflineBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklistItems: ChecklistItem[];
  wardrobeItems: WardrobeItem[];
  onImportJson: (data: any) => void;
  onPushMasterToCloud?: () => Promise<void> | void;
  isMasterPushing?: boolean;
  onDownloadMasterJson?: () => void;
}

export const OfflineBackupModal: React.FC<OfflineBackupModalProps> = ({
  isOpen,
  onClose,
  checklistItems,
  wardrobeItems,
  onImportJson,
  onPushMasterToCloud,
  isMasterPushing = false,
  onDownloadMasterJson,
}) => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmStep, setConfirmStep] = useState<0 | 1 | 2>(0);
  const [deleteTypedText, setDeleteTypedText] = useState<string>('');

  if (!isOpen) return null;

  const exportJSON = () => {
    if (onDownloadMasterJson) {
      onDownloadMasterJson();
      setStatusMsg({ type: 'success', text: 'Full Master JSON backup downloaded!' });
      return;
    }
    const data = {
      exportDate: new Date().toISOString(),
      student: 'Parana Gamage Navini Ravishka Priyantha',
      admissionNo: '263660001',
      eTicket: '7812903731438',
      pnr: 'JKZ2YN',
      checklistItems,
      wardrobeItems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Navini_Travel_Plan_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.wardrobe || parsed.wardrobeItems || parsed.checklistItems) {
          onImportJson(parsed);
          setStatusMsg({ type: 'success', text: 'State backup imported & synced successfully!' });
          setTimeout(() => {
            onClose();
          }, 1200);
        } else {
          setStatusMsg({ type: 'error', text: 'Invalid backup file format.' });
        }
      } catch (err) {
        setStatusMsg({ type: 'error', text: 'Could not parse JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  const downloadPrintableHTML = () => {
    const checkedCount = checklistItems.filter((i) => i.isChecked).length;
    const packedCount = wardrobeItems.filter((i) => i.isPacked).length;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Navini's Travel Plan - Offline Snapshot & Chinese Taxi Pass</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; color: #1e293b; line-height: 1.5; }
    .header { border-bottom: 2px solid #003580; padding-bottom: 12px; margin-bottom: 20px; }
    .chinese-card { border: 2px solid #003580; background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .huge-cn { font-size: 26px; font-weight: bold; color: #003580; margin: 10px 0; }
    .addr-cn { font-size: 18px; font-weight: bold; color: #0f172a; }
    .phone-box { background: #ffffff; border: 1px solid #cbd5e1; padding: 10px 15px; border-radius: 6px; margin: 10px 0; font-family: monospace; font-size: 15px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; color: #334155; }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size: 20px; font-weight: bold; color: #003580;">NAVINI'S TRAVEL PLAN — OFFLINE REFERENCE SNAPSHOT</div>
    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
      Student: <strong>Parana Gamage Navini Ravishka Priyantha</strong> | Admission No: <strong>263660001</strong><br>
      E-Ticket: <strong>7812903731438</strong> | PNR: <strong>JKZ2YN</strong> | Flight: <strong>MU6018 (CMB &rarr; PVG) + MU6381 (PVG &rarr; HAK)</strong><br>
      Generated on: <strong>${new Date().toLocaleString()}</strong>
    </div>
  </div>

  <div class="chinese-card">
    <div style="font-size: 11px; font-weight: bold; color: #475569; text-transform: uppercase;">Show directly to Haikou Airport Taxi Driver:</div>
    <div class="huge-cn">请送我去：海南大学（海甸校区）</div>
    <div class="addr-cn">详细地址：中国海南省海口市美兰区人民大道58号<br>（海南大学国际教育学院 / 留学生公寓）</div>
    <div style="margin-top: 10px; font-size: 13px; color: #334155;">
      <strong>司机师傅您好：</strong> 我是刚到的外国留学生，不会说中文，行李有两件大箱子。如果大门保安询问或找不到具体报到楼，请帮我打这个电话联系学校老师：
    </div>
    <div class="phone-box">
      <strong>孙老师 (Ms. Sun Office 1):</strong> 0898-66291354<br>
      <strong>孙老师 (Ms. Sun Office 2):</strong> 0898-66213608<br>
      <strong>WeChat ID:</strong> sun_admission
    </div>
  </div>

  <div style="font-size: 16px; font-weight: bold; margin-top: 25px;">Flight & Transit Details</div>
  <table>
    <tr><th>Flight</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Key Transit Tasks</th></tr>
    <tr>
      <td><strong>MU6018</strong></td>
      <td>Colombo (CMB) &rarr; Shanghai (PVG T1)</td>
      <td>Nov 8 at 20:50</td>
      <td>Nov 9 at 06:05</td>
      <td>Clear Immigration &rarr; Collect 2 checked bags &rarr; Clear Customs &rarr; Re-check bags at Domestic Transfer Desk</td>
    </tr>
    <tr>
      <td><strong>MU6381</strong></td>
      <td>Shanghai (PVG T1) &rarr; Haikou (HAK T1)</td>
      <td>Nov 9 at 10:55</td>
      <td>Nov 9 at 14:35</td>
      <td>Collect 2 bags &rarr; Official Taxi queue &rarr; Register before 17:00</td>
    </tr>
  </table>

  <div style="font-size: 16px; font-weight: bold; margin-top: 25px;">Checklist Progress (${checkedCount}/${checklistItems.length} Verified)</div>
  <table>
    <tr><th>Category</th><th>Task Item</th><th>Detail</th><th>Status</th></tr>
    ${checklistItems
      .map(
        (item) => `<tr>
          <td>${item.category}</td>
          <td><strong>${item.label}</strong></td>
          <td>${item.detail || ''}</td>
          <td>${item.isChecked ? 'Verified' : 'Pending'}</td>
        </tr>`
      )
      .join('')}
  </table>

  <div style="font-size: 16px; font-weight: bold; margin-top: 25px;">Wardrobe & Packing Inventory (${packedCount}/${wardrobeItems.length} Packed)</div>
  <table>
    <tr><th>Category</th><th>Item Description</th><th>Target Bag</th><th>Quantity</th><th>Packed?</th></tr>
    ${wardrobeItems
      .map(
        (item) => `<tr>
          <td>${item.category}</td>
          <td><strong>${item.name}</strong></td>
          <td>${item.targetBag}</td>
          <td>${item.quantity}</td>
          <td>${item.isPacked ? 'Packed' : 'Unpacked'}</td>
        </tr>`
      )
      .join('')}
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Navini_Travel_Plan_Offline_Emergency_Pass_${new Date().toISOString().slice(0, 10)}.html`;
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
          className="text-[#007AFF] text-base font-semibold active:opacity-60 transition-opacity"
        >
          Done
        </button>

        <h2 className="font-semibold text-sm sm:text-base text-slate-900 text-center">
          Offline Backup & Export
        </h2>

        <div className="w-12" />
      </header>

      {/* Touch-Scrollable Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full space-y-4">
        {statusMsg && (
          <div
            className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <p className="text-xs text-[#8E8E93] leading-relaxed">
          Mainland China network environments can be restrictive. Save an offline snapshot so you have guaranteed access without internet, or publish your current progress globally across all devices.
        </p>

        {/* Offline HTML Card */}
        <div className="ios-card p-4 sm:p-5 space-y-2.5">
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#007AFF]" />
            <span>Standalone Offline HTML Document</span>
          </div>
          <p className="text-xs text-[#8E8E93] leading-relaxed">
            Downloads a standalone HTML file containing all flight details, Chinese taxi cards, and your inventory. Can be opened in any phone browser or saved as PDF.
          </p>
          <button
            type="button"
            onClick={downloadPrintableHTML}
            className="w-full sm:w-auto mt-2 py-2.5 px-4 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Offline File</span>
          </button>
        </div>

        {/* JSON State Card */}
        <div className="ios-card p-4 sm:p-5 space-y-2.5">
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-[#007AFF]" />
            <span>JSON State File</span>
          </div>
          <p className="text-xs text-[#8E8E93] leading-relaxed">
            Export your complete master state to a JSON backup file for offline viewing, or restore on another device.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={exportJSON}
              className="py-2.5 px-3 rounded-xl border border-black/10 bg-[#F2F2F7] hover:bg-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <label className="py-2.5 px-3 rounded-xl border border-black/10 bg-[#F2F2F7] hover:bg-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-slate-700 text-center">
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Emergency Global Cloud Master Override Card */}
        <div className="ios-card p-4 sm:p-5 space-y-3 border-l-4 border-l-red-600 bg-red-50/30">
          <div className="text-sm font-bold text-red-900 flex items-center gap-2">
            <span>🔴</span>
            <span>Emergency Master Cloud Override</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Replaces all available versions online in the cloud database with this device&apos;s exact current version ({wardrobeItems.length} wardrobe items) and forces every connected device to adopt this copy as the standard.
          </p>
          {onPushMasterToCloud && (
            <button
              type="button"
              onClick={() => {
                setDeleteTypedText('');
                setConfirmStep(1);
              }}
              disabled={isMasterPushing}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <span>🔴</span>
              <span>
                {isMasterPushing
                  ? 'Overwriting Online Database...'
                  : `Push Master Data to Cloud (${wardrobeItems.length} Items)`}
              </span>
            </button>
          )}
        </div>
      </main>

      {/* 2-STEP CONFIRMATION MODAL FOR MASTER PUSH OVERWRITE */}
      {confirmStep > 0 && (
        <div className="fixed inset-0 z-[100005] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl text-center">
            {confirmStep === 1 ? (
              <>
                <div className="p-5 space-y-2">
                  <div className="text-2xl">⚠️</div>
                  <h3 className="text-base font-bold text-slate-900">
                    Overwrite Online Version?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    This will remove all the available versions online and replace it with the current version. Do you want to continue?
                  </p>
                </div>
                <div className="grid grid-cols-2 border-t border-black/10 divide-x divide-black/10">
                  <button
                    type="button"
                    onClick={() => setConfirmStep(0)}
                    className="py-3 text-sm font-normal text-[#007AFF] hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteTypedText('');
                      setConfirmStep(2);
                    }}
                    className="py-3 text-sm font-bold text-[#FF3B30] hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-5 space-y-3">
                  <div className="text-2xl">🔴</div>
                  <h3 className="text-base font-bold text-slate-900">
                    Final Security Confirmation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Type <strong className="text-red-600 font-mono">delete</strong> below and press OK to permanently replace all online versions with this device&apos;s current copy:
                  </p>
                  <input
                    type="text"
                    value={deleteTypedText}
                    onChange={(e) => setDeleteTypedText(e.target.value)}
                    placeholder="Type delete here..."
                    autoFocus
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-center text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 border-t border-black/10 divide-x divide-black/10">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteTypedText('');
                      setConfirmStep(0);
                    }}
                    className="py-3 text-sm font-normal text-[#007AFF] hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deleteTypedText.trim().toLowerCase() !== 'delete' || isMasterPushing}
                    onClick={async () => {
                      if (deleteTypedText.trim().toLowerCase() !== 'delete') return;
                      setConfirmStep(0);
                      setDeleteTypedText('');
                      if (onPushMasterToCloud) {
                        await onPushMasterToCloud();
                      }
                    }}
                    className={`py-3 text-sm font-bold transition-colors ${
                      deleteTypedText.trim().toLowerCase() === 'delete'
                        ? 'text-[#FF3B30] hover:bg-black/5 cursor-pointer'
                        : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
