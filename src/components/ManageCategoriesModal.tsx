import React, { useState } from 'react';
import { X, Trash2, Edit3, Plus, Check, Folder, Sparkles } from 'lucide-react';
import { WardrobeItem, DEFAULT_WARDROBE_CATEGORIES } from '../data';
import { IOSConfirmModal } from './IOSConfirmModal';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  wardrobe: WardrobeItem[];
  onAddCategory: (category: string) => void;
  onRenameCategory: (oldCat: string, newCat: string) => void;
  onDeleteCategory: (cat: string) => void;
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  wardrobe,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
}) => {
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  if (!isOpen) return null;

  const handleStartRename = (cat: string) => {
    setEditingCat(cat);
    setEditValue(cat);
  };

  const handleSaveRename = (oldCat: string) => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== oldCat) {
      onRenameCategory(oldCat, trimmed);
    }
    setEditingCat(null);
    setEditValue('');
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    setNewCatName('');
  };

  const handleDeleteClick = (cat: string) => {
    const itemCount = wardrobe.filter((w) => w.category === cat).length;
    setConfirmModal({
      isOpen: true,
      title: `Delete Category "${cat}"?`,
      message: itemCount > 0
        ? `This category contains ${itemCount} items. If deleted, these items will be moved to "Daily Essentials, Cutlery & Folders".`
        : `Are you sure you want to remove the category "${cat}"?`,
      onConfirm: () => {
        onDeleteCategory(cat);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center font-bold">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Manage Categories</h3>
              <p className="text-[11px] text-[#8E8E93]">
                Rename, delete, or create categories for wardrobe & luggage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {categories.map((cat) => {
            const count = wardrobe.filter((w) => w.category === cat).length;
            const isDefault = DEFAULT_WARDROBE_CATEGORIES.includes(cat);

            return (
              <div
                key={cat}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-all gap-2"
              >
                {editingCat === cat ? (
                  <div className="flex-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(cat);
                        if (e.key === 'Escape') setEditingCat(null);
                      }}
                      className="flex-1 px-2.5 py-1 text-xs border border-[#007AFF] rounded-xl bg-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRename(cat)}
                      className="px-2.5 py-1 bg-[#007AFF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCat(null)}
                      className="px-2 py-1 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <span className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                        {cat}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 shrink-0">
                        {count} {count === 1 ? 'item' : 'items'}
                      </span>
                      {isDefault && (
                        <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-md bg-blue-50 text-[#007AFF] shrink-0">
                          Standard
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartRename(cat)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:border-[#007AFF] text-slate-600 hover:text-[#007AFF] flex items-center justify-center transition-colors cursor-pointer"
                        title="Rename category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(cat)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:border-red-400 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Category Footer Form */}
        <form onSubmit={handleAddNew} className="pt-3 border-t border-black/10 shrink-0 space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            + Add New Custom Category
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Winter Thermal Layers, Lab Coat & Gear..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-[#007AFF] bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!newCatName.trim()}
              className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      <IOSConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
