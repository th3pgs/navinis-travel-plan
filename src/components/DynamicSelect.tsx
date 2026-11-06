import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Plus } from 'lucide-react';

export interface DynamicSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onAddCustom?: (newOption: string) => void;
  label?: string;
  addCustomLabel?: string;
  customPlaceholder?: string;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  value,
  options,
  onChange,
  onAddCustom,
  label,
  addCustomLabel,
  customPlaceholder,
  placeholder = 'Type custom name...',
  className = '',
  selectClassName = '',
  disabled = false,
}) => {
  const customLabelText = addCustomLabel || customPlaceholder || '+ Add Custom...';
  const [isAdding, setIsAdding] = useState(false);
  const [customText, setCustomText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when entering add mode
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // Ensure current value is included in dropdown options without duplicates
  const allOptions = React.useMemo(() => {
    const list = [...options];
    if (value && !list.includes(value)) {
      list.push(value);
    }
    // Remove duplicates while preserving insertion order
    return Array.from(new Set(list));
  }, [options, value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__ADD_CUSTOM__') {
      setIsAdding(true);
      setCustomText('');
    } else {
      onChange(selected);
    }
  };

  const handleConfirmCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) {
      setIsAdding(false);
      return;
    }
    if (onAddCustom) {
      onAddCustom(trimmed);
    }
    onChange(trimmed);
    setIsAdding(false);
    setCustomText('');
  };

  const handleCancelCustom = () => {
    setIsAdding(false);
    setCustomText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmCustom();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelCustom();
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-[11px] font-semibold text-slate-700">
          {label}
        </label>
      )}

      {isAdding ? (
        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
          <input
            ref={inputRef}
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-0 px-3 py-1.5 text-xs sm:text-sm bg-white border-2 border-[#007AFF] rounded-xl text-slate-900 focus:outline-none shadow-xs"
          />
          <button
            type="button"
            onClick={handleConfirmCustom}
            className="px-2.5 py-1.5 rounded-xl bg-[#007AFF] text-white hover:bg-[#007AFF]/90 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
            title="Save custom option"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            type="button"
            onClick={handleCancelCustom}
            className="p-1.5 rounded-xl bg-[#F2F2F7] text-slate-600 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={handleSelectChange}
          disabled={disabled}
          className={`w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs sm:text-sm text-slate-800 focus:outline-[#007AFF] shadow-2xs transition-colors cursor-pointer disabled:opacity-50 ${selectClassName}`}
        >
          {allOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__ADD_CUSTOM__" className="font-semibold text-[#007AFF]">
            {customLabelText}
          </option>
        </select>
      )}
    </div>
  );
};
