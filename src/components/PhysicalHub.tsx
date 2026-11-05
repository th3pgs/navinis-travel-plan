import React, { useState } from 'react';
import { WardrobeItem, BagAsset, DeviceAsset } from '../data';
import { ArrowLeft, Plus, Trash2, Edit3, Check, X, AlertCircle } from 'lucide-react';

interface PhysicalHubProps {
  onBack: () => void;
  wardrobe: WardrobeItem[];
  bags: BagAsset[];
  devices: DeviceAsset[];
  onToggleWardrobeBought: (id: string) => void;
  onToggleWardrobePacked: (id: string) => void;
  onAddWardrobeItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onUpdateWardrobeItem: (id: string, updated: Partial<WardrobeItem>) => void;
  onDeleteWardrobeItem: (id: string) => void;
  onToggleBagBought: (id: string) => void;
  onToggleBagPacked?: (id: string) => void;
  onToggleDeviceBought: (id: string) => void;
  onToggleDevicePacked?: (id: string) => void;
}

export const PhysicalHub: React.FC<PhysicalHubProps> = ({
  onBack,
  wardrobe,
  bags,
  devices,
  onToggleWardrobeBought,
  onToggleWardrobePacked,
  onAddWardrobeItem,
  onUpdateWardrobeItem,
  onDeleteWardrobeItem,
  onToggleBagBought,
  onToggleBagPacked,
  onToggleDeviceBought,
  onToggleDevicePacked,
}) => {
  const [activeTab, setActiveTab] = useState<'bags' | 'wardrobe' | 'devices'>('bags');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeItem['category']>('Dresses');
  const [targetBag, setTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Edit item form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<WardrobeItem['category']>('Dresses');
  const [editTargetBag, setEditTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [editQuantity, setEditQuantity] = useState(1);
  const [editNotes, setEditNotes] = useState('');

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Essentials', 'Luggage'];

  // Global calculations for dual progress bars (200% system)
  // Total physical inventory: bags (4) + devices (6) + wardrobe items
  const totalPhysicalItems = bags.length + devices.length + wardrobe.length;

  const totalAcquiredItems =
    bags.filter((b) => b.isBought).length +
    devices.filter((d) => d.isBought).length +
    wardrobe.filter((w) => w.isBought).length;

  const totalPackedItems =
    bags.filter((b) => b.isPacked).length +
    devices.filter((d) => d.isPacked).length +
    wardrobe.filter((w) => w.isPacked).length;

  const acquiredPercent = Math.round((totalAcquiredItems / (totalPhysicalItems || 1)) * 100);
  const packedPercent = Math.round((totalPackedItems / (totalPhysicalItems || 1)) * 100);
  const dualTotalPercent = acquiredPercent + packedPercent; // out of 200%

  const unboughtBags = bags.filter((b) => !b.isBought);
  const unboughtDevices = devices.filter((d) => !d.isBought);
  const unboughtWardrobe = wardrobe.filter((w) => !w.isBought);
  const totalUnboughtCount = unboughtBags.length + unboughtDevices.length + unboughtWardrobe.length;

  const handleStartEdit = (w: WardrobeItem) => {
    setEditingId(w.id);
    setEditName(w.name);
    setEditCategory(w.category);
    setEditTargetBag(w.targetBag);
    setEditQuantity(w.quantity);
    setEditNotes(w.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateWardrobeItem(id, {
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
    onAddWardrobeItem({
      name: name.trim(),
      category,
      quantity: Math.max(1, quantity),
      targetBag,
      isBought: true,
      isPacked: false,
      notes: notes.trim() || undefined,
    });
    setName('');
    setNotes('');
    setQuantity(1);
  };

  const filteredWardrobe = wardrobe.filter((item) =>
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* iOS Styled Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-500 block">
            Physical Gear & Wardrobe
          </span>
          <span className="text-[11px] font-semibold text-[#003580]">
            Total Readiness: {dualTotalPercent}/200%
          </span>
        </div>
      </div>

      {/* 200% DUAL TASKBAR SYSTEM WIDGET */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Dual Taskbar Inventory Readiness
            </h2>
            <p className="text-xs text-slate-500">
              Line 1 tracks acquisition (red items turn green once bought) • Line 2 fills when items are physically packed
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {totalUnboughtCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                {totalUnboughtCount} Need to Buy
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                All Items Acquired
              </span>
            )}
            <span className="text-xs font-mono font-bold text-[#003580] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {dualTotalPercent} / 200% Ready
            </span>
          </div>
        </div>

        {/* The Two Distinct Taskbars */}
        <div className="space-y-2 pt-1">
          {/* Line 1: Items Acquired / Bought (Red -> Green) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${totalUnboughtCount > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                Line 1: Items Acquired & Purchased ({totalAcquiredItems}/{totalPhysicalItems})
              </span>
              <span className={`font-mono ${totalUnboughtCount > 0 ? 'text-red-700 font-bold' : 'text-emerald-700 font-bold'}`}>
                {acquiredPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 ${
                  totalUnboughtCount > 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${acquiredPercent}%` }}
              />
            </div>
          </div>

          {/* Line 2: Items Packed & Staged */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#003580]" />
                Line 2: Items Packed & Staged into Luggage ({totalPackedItems}/{totalPhysicalItems})
              </span>
              <span className="font-mono font-bold text-[#003580]">
                {packedPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-[#003580] h-full transition-all duration-300"
                style={{ width: `${packedPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Controls (iOS Style Tabs) */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl max-w-md mx-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('bags')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'bags'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4-Bag Allocation
        </button>
        <button
          onClick={() => setActiveTab('wardrobe')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'wardrobe'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Wardrobe Studio ({wardrobe.filter((w) => w.isPacked).length}/{wardrobe.length})
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'devices'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hardware & Electronics
        </button>
      </div>

      {/* TAB 1: 4-BAG ALLOCATION */}
      {activeTab === 'bags' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">4-Bag Luggage Specification</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict dimensions and weight boundaries to avoid baggage gate-check or airport surcharge fees
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {bags.map((bag) => {
                const isUnbought = !bag.isBought;

                return (
                  <div
                    key={bag.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isUnbought
                        ? 'border-red-300 bg-red-50/50 ring-1 ring-red-200'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        {/* Distinct vector silhouettes for each bag type */}
                        {bag.kind === 'rolling-large' && (
                          <div className="w-11 h-16 rounded-md border-2 border-slate-800 bg-slate-200 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                            <div className="w-5 h-2 bg-slate-800 rounded-t-sm" />
                            <div className="w-7 h-0.5 bg-slate-500" />
                            <div className="w-7 h-0.5 bg-slate-500" />
                            <div className="w-7 h-0.5 bg-slate-500" />
                            <div className="flex justify-between w-7 px-0.5">
                              <span className="w-2 h-2 rounded-full bg-slate-900" />
                              <span className="w-2 h-2 rounded-full bg-slate-900" />
                            </div>
                          </div>
                        )}

                        {bag.kind === 'rolling-medium' && (
                          <div className="w-10 h-14 rounded-md border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                            <div className="w-4 h-1.5 bg-slate-700 rounded-t-sm" />
                            <div className="w-6 h-0.5 bg-slate-400" />
                            <div className="w-6 h-0.5 bg-slate-400" />
                            <div className="flex justify-between w-6 px-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            </div>
                          </div>
                        )}

                        {bag.kind === 'backpack' && (
                          <div className="w-10 h-13 rounded-t-2xl rounded-b-md border-2 border-slate-800 bg-amber-50/70 flex flex-col items-center justify-between py-1 shrink-0 relative shadow-2xs">
                            <div className="w-3.5 h-1 bg-slate-800 rounded-t-full" />
                            <div className="w-6 h-5 rounded-b-md border-b-2 border-slate-600 bg-white/80" />
                            <div className="w-8 h-1 bg-slate-700 rounded-xs" />
                          </div>
                        )}

                        {bag.kind === 'fannypack' && (
                          <div className="w-12 h-6 rounded-full border-2 border-rose-900 bg-rose-50 flex items-center justify-center relative shrink-0 shadow-2xs mt-2">
                            <span className="w-8 h-1 bg-rose-900 rounded-full" />
                            <span className="w-2 h-2 rounded-full bg-slate-800 absolute right-1" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-sm font-bold text-slate-900">{bag.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                              isUnbought ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {isUnbought ? 'TO BUY' : 'ACQUIRED'}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#003580] block mt-0.5">
                            {bag.dimensions} • {bag.weightLimit}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 mt-2.5 bg-white p-2.5 rounded border border-slate-200/80 leading-relaxed">
                        <strong className="text-slate-800">Assigned Role:</strong> {bag.type}<br />
                        <strong className="text-slate-800">Contents:</strong> {bag.recommendedContents}
                      </div>
                    </div>

                    {/* Dual Checkboxes: Bought and Packed */}
                    <div className="pt-3 mt-3 border-t border-slate-200/60 space-y-2 text-xs">
                      {/* Sub-taskbar lines for this bag */}
                      <div className="grid grid-cols-2 gap-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div className={`h-full ${bag.isBought ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        <div className={`h-full ${bag.isPacked ? 'bg-[#003580]' : 'bg-transparent'}`} />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={bag.isBought}
                            onChange={() => onToggleBagBought(bag.id)}
                            className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                          />
                          <span className={isUnbought ? 'text-red-700 font-bold' : 'text-slate-700 font-medium'}>
                            {isUnbought ? 'Need to Buy' : 'Owned'}
                          </span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={bag.isPacked}
                            onChange={() => onToggleBagPacked?.(bag.id)}
                            className="w-4 h-4 rounded accent-[#003580] cursor-pointer"
                          />
                          <span className={bag.isPacked ? 'text-[#003580] font-bold' : 'text-slate-500 font-medium'}>
                            {bag.isPacked ? 'Packed' : 'Not Packed'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WARDROBE STUDIO */}
      {activeTab === 'wardrobe' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Wardrobe Studio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Itemized apparel catalog with target suitcase allocation, edit capabilities, and dual acquisition checkboxes
              </p>
            </div>
            <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {wardrobe.filter((w) => w.isPacked).length} of {wardrobe.length} Packed
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  activeCategory === cat
                    ? 'bg-[#003580] text-white border-[#003580]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Dress / Outfit Row */}
          <form onSubmit={handleAddSubmit} className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Item name (e.g. Lab coat, casual day dress)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-2.5 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
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
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#003580] hover:bg-[#00224f] text-white font-semibold rounded-lg flex items-center gap-1 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Wardrobe Items Grid */}
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredWardrobe.map((item) => {
              const isEditing = editingId === item.id;
              const isUnbought = !item.isBought;

              if (isEditing) {
                return (
                  <div key={item.id} className="p-3 bg-blue-50/50 border border-blue-400 rounded-xl space-y-2 text-xs">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-300 rounded bg-white font-bold"
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
                      className="w-full px-2 py-1 border border-blue-300 rounded bg-white"
                    >
                      <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase (30×40×70cm)</option>
                      <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                      <option value="Cabin Laptop Backpack">Cabin Laptop Backpack</option>
                      <option value="Fanny Pack">Fanny Pack (Chest)</option>
                      <option value="Wear on Flight">Wear on Flight</option>
                    </select>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button onClick={() => setEditingId(null)} className="px-2 py-1 border rounded bg-white">
                        Cancel
                      </button>
                      <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1 rounded bg-[#003580] text-white font-medium">
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isUnbought
                      ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
                      : item.isPacked
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400 hover:text-[#003580]" title="Edit item">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDeleteWardrobeItem(item.id)} className="p-1 text-slate-400 hover:text-red-600" title="Delete item">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold ${item.isPacked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {item.name}
                    </h4>

                    {item.quantity > 1 && (
                      <span className="text-[11px] font-mono text-slate-500 mt-0.5 block">
                        x{item.quantity} items
                      </span>
                    )}

                    <div className="text-[11px] text-[#003580] font-medium mt-1">
                      🎯 {item.targetBag}
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-1.5">
                    {/* 2-line mini visual taskbar */}
                    <div className="grid grid-cols-2 gap-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.isBought ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <div className={`h-full ${item.isPacked ? 'bg-[#003580]' : 'bg-transparent'}`} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.isBought}
                          onChange={() => onToggleWardrobeBought(item.id)}
                          className={`w-3.5 h-3.5 rounded cursor-pointer ${isUnbought ? 'accent-red-600' : 'accent-emerald-600'}`}
                        />
                        <span className={`text-[10px] font-semibold ${isUnbought ? 'text-red-700' : 'text-slate-600'}`}>
                          {isUnbought ? 'Need to Buy' : 'Owned'}
                        </span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.isPacked}
                          onChange={() => onToggleWardrobePacked(item.id)}
                          className="w-3.5 h-3.5 rounded cursor-pointer accent-[#003580]"
                        />
                        <span className={`text-[10px] font-bold ${item.isPacked ? 'text-[#003580]' : 'text-slate-400'}`}>
                          {item.isPacked ? 'Packed' : 'Unpacked'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: HARDWARE & ELECTRONICS */}
      {activeTab === 'devices' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Connected Hardware & Aviation Safety Vault</h3>
              <p className="text-xs text-slate-500">All 6 electronic units with compartment locations and power safety regulations</p>
            </div>
            <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {devices.filter((d) => d.isPacked).length} of {devices.length} Staged
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {devices.map((device) => {
              const isUnbought = !device.isBought;

              return (
                <div
                  key={device.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isUnbought
                      ? 'border-red-300 bg-red-50/50 ring-1 ring-red-200'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-start gap-2.5 mb-2">
                      {/* Distinct Vector Sketches */}
                      {device.type === 'phone-ios' && (
                        <div className="w-5 h-9 rounded-[5px] border-2 border-slate-800 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0 relative">
                          <div className="w-2 h-0.5 bg-slate-800 rounded-full" />
                          <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                        </div>
                      )}

                      {device.type === 'phone-android' && (
                        <div className="w-5 h-9 rounded-[3px] border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0 relative">
                          <div className="w-1 h-1 bg-slate-700 rounded-full mt-0.5" />
                          <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                        </div>
                      )}

                      {device.type === 'laptop' && (
                        <div className="w-8 h-7 flex flex-col items-center justify-center shrink-0">
                          <div className="w-7 h-4 rounded-t-sm border border-slate-700 bg-slate-800 flex items-center justify-center">
                            <div className="w-5 h-2.5 bg-slate-200 rounded-2xs" />
                          </div>
                          <div className="w-8 h-1 rounded-b-sm bg-slate-600" />
                        </div>
                      )}

                      {device.type === 'tablet' && (
                        <div className="w-6 h-8 rounded-sm border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0">
                          <div className="w-1 h-1 bg-slate-400 rounded-full" />
                          <div className="w-3 h-0.5 bg-slate-400 rounded-full" />
                        </div>
                      )}

                      {/* True Wireless Stem Earbuds Vector */}
                      {device.type === 'earbuds' && (
                        <div className="w-8 h-8 flex items-center justify-center gap-1 shrink-0 bg-slate-100 rounded-lg border border-slate-200 p-1">
                          <div className="flex flex-col items-center">
                            <span className="w-2 h-2 rounded-full bg-slate-900" />
                            <span className="w-0.5 h-3 bg-slate-700 rounded-b-full" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="w-2 h-2 rounded-full bg-slate-900" />
                            <span className="w-0.5 h-3 bg-slate-700 rounded-b-full" />
                          </div>
                        </div>
                      )}

                      {device.type === 'powerbank' && (
                        <div className="w-6 h-9 rounded border-2 border-slate-700 bg-slate-800 flex flex-col items-center justify-between py-0.5 shrink-0 shadow-2xs">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                          </div>
                          <span className="text-[7px] font-bold text-white font-mono leading-none">CCC</span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-sm font-bold text-slate-900">{device.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                            isUnbought ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isUnbought ? 'TO BUY' : 'READY'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{device.model}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-white p-2.5 rounded border border-slate-200/80 leading-relaxed space-y-1">
                      <div><strong className="text-slate-800">Operational Role:</strong> {device.role}</div>
                      <div><strong className="text-slate-800">Placement:</strong> {device.carryLocation}</div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 space-y-2 text-xs">
                    {/* Dual Mini Progress Lines */}
                    <div className="grid grid-cols-2 gap-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className={`h-full ${device.isBought ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <div className={`h-full ${device.isPacked ? 'bg-[#003580]' : 'bg-transparent'}`} />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={device.isBought}
                          onChange={() => onToggleDeviceBought(device.id)}
                          className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                        />
                        <span className={isUnbought ? 'text-red-700 font-bold' : 'text-slate-700 font-medium'}>
                          {isUnbought ? 'Need to Buy' : 'Owned'}
                        </span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={device.isPacked}
                          onChange={() => onToggleDevicePacked?.(device.id)}
                          className="w-4 h-4 rounded accent-[#003580] cursor-pointer"
                        />
                        <span className={device.isPacked ? 'text-[#003580] font-bold' : 'text-slate-500 font-medium'}>
                          {device.isPacked ? 'Packed' : 'Not Packed'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
