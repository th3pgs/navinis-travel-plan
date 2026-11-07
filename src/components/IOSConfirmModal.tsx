import React from 'react';

interface IOSConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const IOSConfirmModal: React.FC<IOSConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="w-[280px] sm:w-[310px] rounded-[18px] bg-white/95 backdrop-blur-2xl text-center overflow-hidden border border-black/10 shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Message */}
        <div className="px-5 pt-5 pb-4 space-y-1.5">
          <h3 className="text-[17px] font-semibold text-slate-900 leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-[13px] text-slate-600 leading-snug px-1">
            {message}
          </p>
        </div>

        {/* Hairline Divider & Bottom Split Buttons */}
        <div className="border-t border-black/10 flex divide-x divide-black/10 text-[17px]">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 py-3 text-[#007AFF] font-normal hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer select-none"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-1/2 py-3 transition-colors cursor-pointer select-none ${
              isDestructive
                ? 'text-[#FF3B30] font-semibold hover:bg-red-50/50 active:bg-red-100/50'
                : 'text-[#007AFF] font-semibold hover:bg-blue-50/50 active:bg-blue-100/50'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
