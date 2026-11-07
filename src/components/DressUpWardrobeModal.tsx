import React, { useState } from 'react';
import { WardrobeItem, BagAsset } from '../data';
import { Plus, Trash2, Edit3, Check, X, Sparkles, Filter } from 'lucide-react';
import { IOSConfirmModal } from './IOSConfirmModal';

interface DressUpWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: WardrobeItem[];
  bags: BagAsset[];
  onToggleBought: (id: string) => void;
  onTogglePacked: (id: string) => void;
  onAddItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onUpdateItem: (id: string, updated: Partial<WardrobeItem>) => void;
  onDeleteItem: (id: string) => void;
}

export const DressUpWardrobeModal: React.FC<DressUpWardrobeModalProps> = ({
  isOpen,
  onClose,
  items,
  bags,
  onToggleBought,
  onTogglePacked,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
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

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeItem['category']>('Dresses');
  const [targetBag, setTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [colorHex, setColorHex] = useState('#38bdf8');

  // Edit item state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<WardrobeItem['category']>('Dresses');
  const [editTargetBag, setEditTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [editQuantity, setEditQuantity] = useState(1);
  const [editNotes, setEditNotes] = useState('');

  if (!isOpen) return null;

  const categories: ('All' | WardrobeItem['category'])[] = [
    'All',
    'Dresses',
    'Tops',
    'Bottoms',
    'Outerwear',
    'Footwear',
    'Essentials',
    'Luggage',
  ];

  const handleStartEdit = (item: WardrobeItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditTargetBag(item.targetBag);
    setEditQuantity(item.quantity);
    setEditNotes(item.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateItem(id, {
      name: editName.trim(),
      category: editCategory,
      targetBag: editTargetBag,
      quantity: Math.max(1, editQuantity),
      notes: editNotes.trim() || undefined,
    });
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      quantity: Math.max(1, quantity),
      targetBag,
      isBought: true,
      isPacked: false,
      colorHex,
      notes: notes.trim() || undefined,
    });

    setName('');
    setNotes('');
    setQuantity(1);
  };

  const filteredItems = items.filter((item) =>
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  const totalItems = items.length;
  const packedCount = items.filter((i) => i.isPacked).length;
  const boughtCount = items.filter((i) => i.isBought).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header (iOS / Dress-Up Game Style) */}
        <div className="bg-[#003580] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <Sparkles className="w-5 h-5 text-[#febb02]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Navini's Relocation Wardrobe & Closet Studio
              </h2>
              <p className="text-xs text-blue-200">
                Interactive dress-up catalog • Dual Checkboxes • Luggage Allocation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
              {packedCount}/{totalItems} Packed
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills Bar (Dress-Up Game Category Selector) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#003580] text-white border-[#003580] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Dress / Clothing Form (Fast Input Bar) */}
        <form
          onSubmit={handleAddSubmit}
          className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs shrink-0"
        >
          <input
            type="text"
            placeholder="Add new dress or outfit (e.g. Lab Coat, Formal Midi Dress)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="Dresses">👗 Dresses</option>
            <option value="Tops">👚 Tops</option>
            <option value="Bottoms">👖 Bottoms</option>
            <option value="Outerwear">🧥 Outerwear</option>
            <option value="Footwear">👟 Footwear</option>
            <option value="Essentials">🧣 Essentials</option>
            <option value="Luggage">👜 Luggage</option>
          </select>

          <select
            value={targetBag}
            onChange={(e) => setTargetBag(e.target.value as any)}
            className="px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 max-w-[220px]"
          >
            <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase (30×40×70cm)</option>
            <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
            <option value="Cabin Laptop Backpack">Cabin Laptop Backpack</option>
            <option value="Fanny Pack">Fanny Pack (Chest)</option>
            <option value="Wear on Flight">Wear on Flight</option>
          </select>

          <input
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-14 px-2 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 text-center font-mono"
            title="Quantity"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-[#003580] hover:bg-[#00224f] text-white font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Outfit</span>
          </button>
        </form>

        {/* Dress-Up Interactive Catalog Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => {
              const isEditing = editingId === item.id;
              const isUnbought = !item.isBought;

              if (isEditing) {
                return (
                  <div key={item.id} className="p-3.5 bg-blue-50/50 border border-blue-400 rounded-xl space-y-2 text-xs">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1.5 border border-blue-300 rounded bg-white font-bold text-slate-900"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                    >
                      <option value="Dresses">Dresses</option>
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Essentials">Essentials</option>
                      <option value="Luggage">Luggage</option>
                    </select>
                    <select
                      value={editTargetBag}
                      onChange={(e) => setEditTargetBag(e.target.value as any)}
                      className="w-full px-2 py-1 border border-blue-300 rounded bg-white text-[11px]"
                    >
                      <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase (30×40×70cm)</option>
                      <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                      <option value="Cabin Laptop Backpack">Cabin Laptop Backpack</option>
                      <option value="Fanny Pack">Fanny Pack</option>
                      <option value="Wear on Flight">Wear on Flight</option>
                    </select>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 border rounded bg-white text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3 py-1 rounded bg-[#003580] text-white font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isUnbought
                      ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
                      : item.isPacked
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Top card bar with category badge and edit actions */}
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1 rounded text-slate-400 hover:text-[#003580]"
                          title="Edit dress"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Delete Item?',
                              message: `Are you sure you want to remove "${item.name}" from your wardrobe?`,
                              onConfirm: () => {
                                onDeleteItem(item.id);
                                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                              },
                            });
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600"
                          title="Remove dress"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold leading-tight ${item.isPacked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {item.name}
                    </h4>

                    {item.quantity > 1 && (
                      <span className="text-[11px] font-mono font-bold text-slate-500 mt-0.5 block">
                        Quantity: x{item.quantity}
                      </span>
                    )}

                    <div className="text-[11px] text-[#003580] font-medium mt-1">
                      🎯 {item.targetBag}
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Dual Upfront Checkboxes Bar */}
                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Line 1: Bought Checkbox */}
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.isBought}
                        onChange={() => onToggleBought(item.id)}
                        className={`w-3.5 h-3.5 rounded cursor-pointer ${
                          isUnbought ? 'accent-red-600' : 'accent-emerald-600'
                        }`}
                      />
                      <span className={`text-[10px] font-semibold ${isUnbought ? 'text-red-700' : 'text-slate-600'}`}>
                        {isUnbought ? 'Need to Buy' : 'Ready'}
                      </span>
                    </label>

                    {/* Line 2: Packed Checkbox */}
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        onChange={() => onTogglePacked(item.id)}
                        className="w-3.5 h-3.5 rounded cursor-pointer accent-[#003580]"
                      />
                      <span className={`text-[10px] font-bold ${item.isPacked ? 'text-[#003580]' : 'text-slate-400'}`}>
                        {item.isPacked ? 'Packed' : 'Unpacked'}
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Closet inventory automatically saves locally and synchronizes.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#003580] hover:bg-[#00224f] text-white text-xs font-semibold rounded-lg"
          >
            Done / Close Closet
          </button>
        </div>
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
