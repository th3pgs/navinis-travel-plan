import React, { useState } from 'react';
import { WardrobeItem, BagAsset, DeviceAsset } from '../data';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  Luggage,
  Shirt,
  Smartphone,
  Info,
} from 'lucide-react';

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
  const [infoPopupBag, setInfoPopupBag] = useState<BagAsset | null>(null);
  const [infoPopupDevice, setInfoPopupDevice] = useState<DeviceAsset | null>(null);

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

  // Total physical calculations (200% system)
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

  const unboughtCount =
    bags.filter((b) => !b.isBought).length +
    devices.filter((d) => !d.isBought).length +
    wardrobe.filter((w) => !w.isBought).length;

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* iOS Styled Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#003580]" />
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

      {/* 200% Dual Taskbar Overview Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Gear Readiness Progress
            </h2>
            <p className="text-xs text-slate-500">
              Line 1 tracks acquisition (unbought items turn green once bought) • Line 2 fills as items are packed
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {unboughtCount > 0 ? (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                <span>{unboughtCount} Need to Buy</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>All Acquired</span>
              </span>
            )}
            <span className="text-xs font-mono font-bold text-[#003580] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {dualTotalPercent} / 200%
            </span>
          </div>
        </div>

        {/* Dual Lines */}
        <div className="space-y-2 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${unboughtCount > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span>Line 1: Items Procured & Owned ({totalAcquiredItems}/{totalPhysicalItems})</span>
              </span>
              <span className="font-mono font-bold text-slate-700">{acquiredPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-300 ${
                  unboughtCount > 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${acquiredPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#003580]" />
                <span>Line 2: Items Packed into Luggage ({totalPackedItems}/{totalPhysicalItems})</span>
              </span>
              <span className="font-mono font-bold text-[#003580]">{packedPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-[#003580] h-full transition-all duration-300"
                style={{ width: `${packedPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3-Part Apple Style Navigation: Luggage, Wardrobe, Electronics */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl max-w-md mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('bags')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'bags'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Luggage className="w-4 h-4 text-[#003580]" />
          <span>Luggage ({bags.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('wardrobe')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'wardrobe'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shirt className="w-4 h-4 text-purple-600" />
          <span>Wardrobe ({wardrobe.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'devices'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>Electronics ({devices.length})</span>
        </button>
      </div>

      {/* PART 1: 4-BAG LUGGAGE ALLOCATION */}
      {activeTab === 'bags' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bags.map((bag) => {
            const isUnbought = !bag.isBought;

            return (
              <div
                key={bag.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isUnbought
                    ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    {/* Visual Vector Silhouette */}
                    <div className="shrink-0">
                      {bag.kind === 'rolling-large' && (
                        <div className="w-11 h-16 rounded-md border-2 border-slate-800 bg-slate-200 flex flex-col items-center justify-between py-1 relative shadow-2xs">
                          <div className="w-5 h-2 bg-slate-800 rounded-t-sm" />
                          <div className="w-7 h-0.5 bg-slate-500" />
                          <div className="w-7 h-0.5 bg-slate-500" />
                          <div className="flex justify-between w-7 px-0.5">
                            <span className="w-2 h-2 rounded-full bg-slate-900" />
                            <span className="w-2 h-2 rounded-full bg-slate-900" />
                          </div>
                        </div>
                      )}

                      {bag.kind === 'rolling-medium' && (
                        <div className="w-10 h-14 rounded-md border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-1 relative shadow-2xs">
                          <div className="w-4 h-1.5 bg-slate-700 rounded-t-sm" />
                          <div className="w-6 h-0.5 bg-slate-400" />
                          <div className="flex justify-between w-6 px-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          </div>
                        </div>
                      )}

                      {bag.kind === 'backpack' && (
                        <div className="w-10 h-13 rounded-t-2xl rounded-b-md border-2 border-slate-800 bg-amber-50 flex flex-col items-center justify-between py-1 relative shadow-2xs">
                          <div className="w-3.5 h-1 bg-slate-800 rounded-t-full" />
                          <div className="w-6 h-5 rounded-b-md border-b-2 border-slate-600 bg-white/80" />
                          <div className="w-8 h-1 bg-slate-700 rounded-xs" />
                        </div>
                      )}

                      {bag.kind === 'fannypack' && (
                        <div className="w-12 h-6 rounded-full border-2 border-rose-900 bg-rose-50 flex items-center justify-center relative shadow-2xs mt-2">
                          <span className="w-8 h-1 bg-rose-900 rounded-full" />
                          <span className="w-2 h-2 rounded-full bg-slate-800 absolute right-1" />
                        </div>
                      )}
                    </div>

                    {/* Name & Dimension */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-slate-900">{bag.name}</span>
                        {/* Corner Info Icon for uncluttered details */}
                        <button
                          type="button"
                          onClick={() => setInfoPopupBag(bag)}
                          className="w-7 h-7 rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#003580] flex items-center justify-center transition-colors shadow-2xs shrink-0"
                          title="View bag details & airline rules"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#003580] block mt-0.5">
                        {bag.dimensions}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                        {bag.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Front Dots & Checkbox Controls */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleBagBought(bag.id)}
                      className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
                        bag.isBought
                          ? 'bg-emerald-500 ring-2 ring-emerald-200'
                          : 'border-2 border-red-500 bg-white'
                      }`}
                    >
                      {bag.isBought && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                    <span className={isUnbought ? 'text-red-700 font-bold' : 'text-slate-700 font-semibold'}>
                      {isUnbought ? 'Need to Buy' : 'Owned'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleBagPacked?.(bag.id)}
                      className={`w-4 h-4 rounded-full transition-all flex items-center justify-center ${
                        bag.isPacked
                          ? 'bg-[#003580] ring-2 ring-blue-200'
                          : 'border-2 border-slate-300 hover:border-[#003580] bg-white'
                      }`}
                    >
                      {bag.isPacked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                    <span className={bag.isPacked ? 'text-[#003580] font-bold' : 'text-slate-400 font-medium'}>
                      {bag.isPacked ? 'Packed' : 'Not Packed'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PART 2: WARDROBE STUDIO */}
      {activeTab === 'wardrobe' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Filter Pills */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900">Wardrobe Studio</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Apparel checklist with destination suitcase mapping
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                {wardrobe.filter((w) => w.isPacked).length} of {wardrobe.length} Packed
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    activeCategory === cat
                      ? 'bg-[#003580] text-white border-[#003580]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Add Row */}
          <form onSubmit={handleAddSubmit} className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Add clothing item (e.g. Lab coat, frock)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-xl bg-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-2.5 py-2 border border-slate-300 rounded-xl bg-white"
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
              className="px-2.5 py-2 border border-slate-300 rounded-xl bg-white max-w-[200px]"
            >
              <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase (30×40×70cm)</option>
              <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
              <option value="Cabin Laptop Backpack">Cabin Backpack</option>
              <option value="Fanny Pack">Fanny Pack</option>
              <option value="Wear on Flight">Wear on Flight</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-[#003580] text-white font-bold rounded-xl flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Clothing Items Grid */}
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredWardrobe.map((item) => {
              const isEditing = editingId === item.id;
              const isUnbought = !item.isBought;

              if (isEditing) {
                return (
                  <div key={item.id} className="p-3 bg-blue-50/60 border border-blue-400 rounded-2xl space-y-2 text-xs">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1.5 border border-blue-300 rounded-lg bg-white font-bold"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full px-2 py-1 border border-blue-300 rounded-lg bg-white"
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
                      className="w-full px-2 py-1 border border-blue-300 rounded-lg bg-white"
                    >
                      <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase (30×40×70cm)</option>
                      <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                      <option value="Cabin Laptop Backpack">Cabin Backpack</option>
                      <option value="Fanny Pack">Fanny Pack</option>
                      <option value="Wear on Flight">Wear on Flight</option>
                    </select>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button onClick={() => setEditingId(null)} className="px-2 py-1 border rounded-lg bg-white">
                        Cancel
                      </button>
                      <button onClick={() => handleSaveEdit(item.id)} className="px-3 py-1 rounded-lg bg-[#003580] text-white font-bold">
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUnbought
                      ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
                      : item.isPacked
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleStartEdit(item)} className="p-1 text-slate-400 hover:text-[#003580]">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDeleteWardrobeItem(item.id)} className="p-1 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`text-xs font-bold leading-tight ${item.isPacked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {item.name}
                    </h4>

                    {item.quantity > 1 && (
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        x{item.quantity} pieces
                      </span>
                    )}

                    <div className="text-[11px] text-[#003580] font-medium mt-1 truncate">
                      🎯 {item.targetBag}
                    </div>
                  </div>

                  {/* Dual Front Dots */}
                  <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={() => onToggleWardrobeBought(item.id)}
                        className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                          item.isBought
                            ? 'bg-emerald-500 ring-2 ring-emerald-200'
                            : 'border-2 border-red-500 bg-white'
                        }`}
                      >
                        {item.isBought && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
                      <span className={`text-[10px] font-semibold ${isUnbought ? 'text-red-700' : 'text-slate-600'}`}>
                        {isUnbought ? 'To Buy' : 'Owned'}
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={() => onToggleWardrobePacked(item.id)}
                        className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                          item.isPacked
                            ? 'bg-[#003580] ring-2 ring-blue-200'
                            : 'border-2 border-slate-300 hover:border-[#003580] bg-white'
                        }`}
                      >
                        {item.isPacked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
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
      )}

      {/* PART 3: CONNECTED HARDWARE & ELECTRONICS */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {devices.map((device) => {
            const isUnbought = !device.isBought;

            return (
              <div
                key={device.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  isUnbought
                    ? 'border-red-300 bg-red-50/40 ring-1 ring-red-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {/* Vector Devices */}
                      {device.type === 'phone-ios' && (
                        <div className="w-5 h-9 rounded-[5px] border-2 border-slate-800 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0">
                          <div className="w-2 h-0.5 bg-slate-800 rounded-full" />
                          <div className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
                        </div>
                      )}

                      {device.type === 'phone-android' && (
                        <div className="w-5 h-9 rounded-[3px] border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between py-0.5 shrink-0">
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
                        <div className="w-6 h-9 rounded border-2 border-slate-700 bg-slate-800 flex flex-col items-center justify-between py-0.5 shrink-0">
                          <div className="flex gap-0.5">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                          </div>
                          <span className="text-[7px] font-bold text-white font-mono leading-none">CCC</span>
                        </div>
                      )}

                      <div>
                        <span className="text-sm font-bold text-slate-900 block leading-tight">{device.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{device.model}</span>
                      </div>
                    </div>

                    {/* Corner Info Button */}
                    <button
                      type="button"
                      onClick={() => setInfoPopupDevice(device)}
                      className="w-7 h-7 rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#003580] flex items-center justify-center transition-colors shadow-2xs shrink-0"
                      title="View aviation safety instructions"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-[#003580] font-semibold mt-2 bg-blue-50/60 p-2 rounded-xl">
                    📍 {device.carryLocation}
                  </div>
                </div>

                {/* Dual Dots */}
                <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleDeviceBought(device.id)}
                      className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                        device.isBought
                          ? 'bg-emerald-500 ring-2 ring-emerald-200'
                          : 'border-2 border-red-500 bg-white'
                      }`}
                    >
                      {device.isBought && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                    <span className={`text-[11px] font-semibold ${isUnbought ? 'text-red-700' : 'text-slate-600'}`}>
                      {isUnbought ? 'Need to Buy' : 'Owned'}
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleDevicePacked?.(device.id)}
                      className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                        device.isPacked
                          ? 'bg-[#003580] ring-2 ring-blue-200'
                          : 'border-2 border-slate-300 hover:border-[#003580] bg-white'
                      }`}
                    >
                      {device.isPacked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </button>
                    <span className={`text-[11px] font-bold ${device.isPacked ? 'text-[#003580]' : 'text-slate-400'}`}>
                      {device.isPacked ? 'Packed' : 'Unpacked'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bag Details Clean Info Popup */}
      {infoPopupBag && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#003580]" />
                <h3 className="font-bold text-base text-slate-900">{infoPopupBag.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoPopupBag(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <div><strong>Dimensions:</strong> <span className="font-mono text-[#003580] font-bold">{infoPopupBag.dimensions}</span></div>
              <div><strong>Weight Limit:</strong> {infoPopupBag.weightLimit}</div>
              <div><strong>Assigned Role:</strong> {infoPopupBag.type}</div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <strong>Recommended Contents:</strong><br />
                {infoPopupBag.recommendedContents}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoPopupBag(null)}
                className="px-5 py-2 rounded-xl bg-[#003580] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Aviation Info Popup */}
      {infoPopupDevice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#003580]" />
                <h3 className="font-bold text-base text-slate-900">{infoPopupDevice.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoPopupDevice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <div><strong>Model & Specs:</strong> {infoPopupDevice.model} ({infoPopupDevice.carrierOrOs})</div>
              <div><strong>Carry Location:</strong> {infoPopupDevice.carryLocation}</div>
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-[#003580]">
                <strong>Role & Airport Guidelines:</strong><br />
                {infoPopupDevice.role}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoPopupDevice(null)}
                className="px-5 py-2 rounded-xl bg-[#003580] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
