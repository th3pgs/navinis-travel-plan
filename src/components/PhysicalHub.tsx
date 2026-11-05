import React, { useState } from 'react';
import { WardrobeItem, BagAsset, DeviceAsset } from '../data';
import {
  ChevronLeft,
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

// Maps female apparel and travel categories to visual product emoji thumbnails
function getCategoryVisual(name: string, category: string): { emoji: string; bg: string; label: string } {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (c.includes('dress') || n.includes('dress') || n.includes('frock')) {
    return { emoji: '👗', bg: 'bg-pink-50 text-pink-600', label: 'Dresses & Frocks' };
  }
  if (c.includes('top') || n.includes('shirt') || n.includes('blouse') || n.includes('t-shirt')) {
    return { emoji: '👚', bg: 'bg-amber-50 text-amber-600', label: 'Tops & Blouses' };
  }
  if (c.includes('bottom') || n.includes('pant') || n.includes('jean') || n.includes('trouser') || n.includes('skirt') || n.includes('jogger')) {
    return { emoji: '👖', bg: 'bg-blue-50 text-blue-600', label: 'Trousers & Bottoms' };
  }
  if (c.includes('outerwear') || n.includes('jacket') || n.includes('hoodie') || n.includes('cardigan') || n.includes('windbreaker') || n.includes('umbrella')) {
    return { emoji: '🧥', bg: 'bg-slate-100 text-slate-700', label: 'Outerwear' };
  }
  if (c.includes('footwear') || n.includes('sneaker') || n.includes('sandal') || n.includes('slipper') || n.includes('sock')) {
    return { emoji: '👟', bg: 'bg-emerald-50 text-emerald-600', label: 'Footwear' };
  }
  if (n.includes('pajama') || n.includes('night') || n.includes('sleep') || n.includes('undergarment') || n.includes('bra') || n.includes('towel')) {
    return { emoji: '👘', bg: 'bg-purple-50 text-purple-600', label: 'Nightwear & Essentials' };
  }
  return { emoji: '🎒', bg: 'bg-rose-50 text-rose-600', label: 'Luggage & Gear' };
}

export const PhysicalHub: React.FC<PhysicalHubProps> = ({
  onBack,
  wardrobe,
  bags,
  devices,
  onToggleWardrobePacked,
  onAddWardrobeItem,
  onUpdateWardrobeItem,
  onDeleteWardrobeItem,
  onToggleBagBought,
  onToggleBagPacked,
  onToggleDeviceBought,
  onToggleDevicePacked,
}) => {
  const [activeTab, setActiveTab] = useState<'bags' | 'wardrobe' | 'devices'>('wardrobe');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);
  const [infoPopupBag, setInfoPopupBag] = useState<BagAsset | null>(null);
  const [infoPopupDevice, setInfoPopupDevice] = useState<DeviceAsset | null>(null);

  // New item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeItem['category']>('Dresses');
  const [targetBag, setTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [quantity, setQuantity] = useState(1);

  // Edit item form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<WardrobeItem['category']>('Dresses');
  const [editTargetBag, setEditTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [editQuantity, setEditQuantity] = useState(1);

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Essentials'];

  // Simplified Standard 0-100% Math (Requirement #4)
  const totalPhysicalItems = bags.length + devices.length + wardrobe.length;
  const totalPackedItems =
    bags.filter((b) => b.isPacked).length +
    devices.filter((d) => d.isPacked).length +
    wardrobe.filter((w) => w.isPacked).length;
  const progressPercent = Math.round((totalPackedItems / (totalPhysicalItems || 1)) * 100);

  const unboughtCount =
    bags.filter((b) => !b.isBought).length +
    devices.filter((d) => !d.isBought).length;

  const handleStartEdit = (w: WardrobeItem) => {
    setEditingId(w.id);
    setEditName(w.name);
    setEditCategory(w.category);
    setEditTargetBag(w.targetBag);
    setEditQuantity(w.quantity);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    onUpdateWardrobeItem(id, {
      name: editName.trim(),
      category: editCategory,
      targetBag: editTargetBag,
      quantity: Math.max(1, editQuantity),
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
    });
    setName('');
    setQuantity(1);
    setShowAddForm(false);
  };

  const filteredWardrobe = wardrobe.filter((item) =>
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* 1. iOS STICKY NAVIGATION BAR (Requirement #1) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-[#007AFF] text-base font-medium flex items-center gap-0.5 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>Overview</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          Luggage & Wardrobe
        </h1>

        <button
          type="button"
          onClick={() => setIsSectionEditMode(!isSectionEditMode)}
          className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity"
        >
          {isSectionEditMode ? 'Done' : 'Edit'}
        </button>
      </header>

      {/* 2. iOS STANDARD 0-100% READINESS CARD (Requirement #4) */}
      <div className="ios-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wide">
              Physical Preparation
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {progressPercent}% Packed
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-600 block">
              {totalPackedItems} of {totalPhysicalItems} Items Ready
            </span>
            {unboughtCount > 0 ? (
              <span className="text-[11px] font-bold text-red-600">
                {unboughtCount} item{unboughtCount > 1 ? 's' : ''} to buy
              </span>
            ) : (
              <span className="text-[11px] font-bold text-emerald-600">
                All gear acquired
              </span>
            )}
          </div>
        </div>

        {/* Clean iOS Progress Track */}
        <div className="w-full bg-[#E5E5EA] rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-[#007AFF] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. iOS NATIVE SEGMENTED CONTROL (Requirement #1) */}
      <div className="ios-segmented max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('wardrobe')}
          className={`ios-segmented-item ${activeTab === 'wardrobe' ? 'active' : ''}`}
        >
          Wardrobe ({wardrobe.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bags')}
          className={`ios-segmented-item ${activeTab === 'bags' ? 'active' : ''}`}
        >
          Luggage ({bags.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('devices')}
          className={`ios-segmented-item ${activeTab === 'devices' ? 'active' : ''}`}
        >
          Electronics ({devices.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WARDROBE STUDIO (E-Commerce Style Visual Grid - Requirement #3)    */}
      {/* ========================================================================= */}
      {activeTab === 'wardrobe' && (
        <div className="space-y-4">
          {/* Category Filter Pills (Horizontal Scrolling) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-black/10 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Add Bar / Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8E8E93] font-medium">
              Showing {filteredWardrobe.length} apparel items
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs font-semibold text-[#007AFF] flex items-center gap-1 active:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Cancel' : 'Add Clothing'}</span>
            </button>
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="ios-card p-4 space-y-3 animate-in fade-in duration-150">
              <div className="font-bold text-xs text-slate-800">Add New Apparel Item</div>
              <input
                type="text"
                placeholder="Item name (e.g., Casual Linen Day Frock)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 text-xs"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="px-2.5 py-2 border border-slate-300 rounded-xl bg-slate-50"
                >
                  <option value="Dresses">Dresses & Frocks</option>
                  <option value="Tops">Tops & Blouses</option>
                  <option value="Bottoms">Trousers & Bottoms</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Essentials">Nightwear & Essentials</option>
                </select>
                <select
                  value={targetBag}
                  onChange={(e) => setTargetBag(e.target.value as any)}
                  className="px-2.5 py-2 border border-slate-300 rounded-xl bg-slate-50"
                >
                  <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase (70cm)</option>
                  <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (57cm)</option>
                  <option value="Cabin Laptop Backpack">Cabin Backpack</option>
                  <option value="Fanny Pack">Fanny Pack</option>
                  <option value="Wear on Flight">Wear on Flight</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#007AFF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Add to Wardrobe
              </button>
            </form>
          )}

          {/* 2-Column Mobile Visual Grid (Requirement #3) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredWardrobe.map((item) => {
              const visual = getCategoryVisual(item.name, item.category);
              const isPacked = item.isPacked;

              if (editingId === item.id) {
                return (
                  <div key={item.id} className="ios-card p-3 space-y-2 text-xs border-2 border-blue-400">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-1 border rounded bg-white text-xs font-bold"
                    />
                    <select
                      value={editTargetBag}
                      onChange={(e) => setEditTargetBag(e.target.value as any)}
                      className="w-full p-1 border rounded bg-white text-[11px]"
                    >
                      <option value="Main Large Suitcase (30×40×70cm)">Main Suitcase</option>
                      <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase</option>
                      <option value="Cabin Laptop Backpack">Cabin Backpack</option>
                      <option value="Wear on Flight">Wear on Flight</option>
                    </select>
                    <div className="flex justify-end gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-2 py-0.5 border rounded text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-2.5 py-0.5 bg-[#007AFF] text-white rounded text-[11px] font-bold"
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
                  className={`ios-card p-3 flex flex-col justify-between relative group transition-all ${
                    isPacked ? 'bg-slate-50/70 border-emerald-300' : 'bg-white'
                  }`}
                >
                  {/* Edit Mode Delete Badge (Top Corner) */}
                  {isSectionEditMode && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteWardrobeItem(item.id)}
                        className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Top: Large Centered Emoji Inside Tinted Rounded Header (Product Photo Aesthetic) */}
                  <div
                    onClick={() => onToggleWardrobePacked(item.id)}
                    className={`w-full aspect-square rounded-xl ${visual.bg} flex items-center justify-center text-4xl sm:text-5xl cursor-pointer select-none mb-2.5 transition-transform active:scale-95`}
                  >
                    <span>{visual.emoji}</span>
                  </div>

                  {/* Middle: Title & Quantity */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs sm:text-sm font-bold leading-tight line-clamp-2 ${
                        isPacked ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-[#8E8E93] font-medium block mt-0.5 truncate">
                      x{item.quantity} • {item.category}
                    </span>
                  </div>

                  {/* Bottom: Suitcase Badge + SINGLE Circular iOS Checkbox (Requirement #4) */}
                  <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold text-slate-600 truncate bg-slate-100 px-1.5 py-0.5 rounded max-w-[90px]">
                      {item.targetBag.includes('Main')
                        ? 'Main Luggage'
                        : item.targetBag.includes('Medium')
                        ? 'Medium Suitcase'
                        : item.targetBag.includes('Cabin')
                        ? 'Backpack'
                        : 'Wear Flight'}
                    </span>

                    {/* Single Smooth Circular iOS Checkbox (Requirement #4) */}
                    <button
                      type="button"
                      onClick={() => onToggleWardrobePacked(item.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isPacked
                          ? 'bg-[#34C759] text-white shadow-xs'
                          : 'border-2 border-[#C7C7CC] bg-white hover:border-[#007AFF]'
                      }`}
                      title={isPacked ? 'Packed' : 'Mark as Packed'}
                    >
                      {isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LUGGAGE COMPARTMENTS (Retains Dual-Checks per Requirement #4)     */}
      {/* ========================================================================= */}
      {activeTab === 'bags' && (
        <div className="space-y-3">
          {bags.map((bag) => {
            const isUnbought = !bag.isBought;

            return (
              <div
                key={bag.id}
                className={`ios-card p-4 transition-all ${
                  isUnbought ? 'border-red-200 bg-red-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {bag.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setInfoPopupBag(bag)}
                        className="text-[#8E8E93] hover:text-[#007AFF] p-1 shrink-0"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-bold text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded">
                        {bag.dimensions}
                      </span>
                      <span className="text-xs text-[#8E8E93]">
                        {bag.weightLimit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {bag.recommendedContents}
                    </p>
                  </div>
                </div>

                {/* Dual Checkboxes ONLY for Luggage (Bought + Packed) */}
                <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleBagBought(bag.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        bag.isBought
                          ? 'bg-[#34C759] text-white shadow-xs'
                          : 'border-2 border-red-500 bg-white'
                      }`}
                    >
                      {bag.isBought ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      )}
                    </button>
                    <span className={isUnbought ? 'text-red-700 font-bold' : 'text-slate-700 font-medium'}>
                      {isUnbought ? 'Need to Buy' : 'Owned'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleBagPacked?.(bag.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        bag.isPacked
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-[#C7C7CC] bg-white'
                      }`}
                    >
                      {bag.isPacked && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span className={bag.isPacked ? 'text-[#007AFF] font-bold' : 'text-slate-400 font-medium'}>
                      {bag.isPacked ? 'Packed' : 'Unpacked'}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONNECTED ELECTRONICS (Retains Dual-Checks per Requirement #4)   */}
      {/* ========================================================================= */}
      {activeTab === 'devices' && (
        <div className="space-y-3">
          {devices.map((device) => {
            const isUnbought = !device.isBought;

            return (
              <div
                key={device.id}
                className={`ios-card p-4 transition-all ${
                  isUnbought ? 'border-red-200 bg-red-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#007AFF]" />
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                          {device.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInfoPopupDevice(device)}
                        className="text-[#8E8E93] hover:text-[#007AFF] p-1 shrink-0"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-[#8E8E93] font-medium">
                        {device.model}
                      </span>
                      <span className="text-[11px] font-semibold text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded">
                        📍 {device.carryLocation}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2">
                      {device.role}
                    </p>
                  </div>
                </div>

                {/* Dual Checkboxes ONLY for Devices (Bought + Packed) */}
                <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleDeviceBought(device.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        device.isBought
                          ? 'bg-[#34C759] text-white shadow-xs'
                          : 'border-2 border-red-500 bg-white'
                      }`}
                    >
                      {device.isBought ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      )}
                    </button>
                    <span className={isUnbought ? 'text-red-700 font-bold' : 'text-slate-700 font-medium'}>
                      {isUnbought ? 'Need to Buy' : 'Owned'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleDevicePacked?.(device.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        device.isPacked
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-[#C7C7CC] bg-white'
                      }`}
                    >
                      {device.isPacked && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span className={device.isPacked ? 'text-[#007AFF] font-bold' : 'text-slate-400 font-medium'}>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <h3 className="font-bold text-base text-slate-900">{infoPopupBag.name}</h3>
              <button
                type="button"
                onClick={() => setInfoPopupBag(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div><strong>Dimensions:</strong> {infoPopupBag.dimensions}</div>
              <div><strong>Airline Rule:</strong> {infoPopupBag.weightLimit}</div>
              <div><strong>Target Location:</strong> {infoPopupBag.targetBag}</div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong>Recommended Contents:</strong> {infoPopupBag.recommendedContents}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Aviation Info Popup */}
      {infoPopupDevice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <h3 className="font-bold text-base text-slate-900">{infoPopupDevice.name}</h3>
              <button
                type="button"
                onClick={() => setInfoPopupDevice(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div><strong>Role:</strong> {infoPopupDevice.role}</div>
              <div><strong>System / Carrier:</strong> {infoPopupDevice.carrierOrOs}</div>
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900">
                <strong>Carry Location:</strong> {infoPopupDevice.carryLocation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
