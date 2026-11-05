import React, { useState } from 'react';
import { WardrobeItem, BagAsset, DeviceAsset } from '../data';
import {
  ChevronLeft,
  Plus,
  Minus,
  Edit3,
  Check,
  ChevronRight,
  Camera,
  RotateCcw,
  RefreshCw,
  Luggage,
  Shirt,
  Smartphone,
  Info,
  Battery,
  Wifi,
} from 'lucide-react';
import { uploadPhotoToSupabase } from '../cloudSync';

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

// Maps female apparel to visual product emoji thumbnails
function getCategoryVisual(name: string, category: string): { emoji: string; bg: string } {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (c.includes('dress') || n.includes('dress') || n.includes('frock')) {
    return { emoji: '👗', bg: 'bg-pink-50 text-pink-600' };
  }
  if (c.includes('top') || n.includes('shirt') || n.includes('blouse') || n.includes('t-shirt')) {
    return { emoji: '👚', bg: 'bg-amber-50 text-amber-600' };
  }
  if (c.includes('bottom') || n.includes('pant') || n.includes('jean') || n.includes('trouser') || n.includes('skirt')) {
    return { emoji: '👖', bg: 'bg-blue-50 text-blue-600' };
  }
  if (c.includes('outerwear') || n.includes('jacket') || n.includes('hoodie') || n.includes('cardigan') || n.includes('umbrella')) {
    return { emoji: '🧥', bg: 'bg-slate-100 text-slate-700' };
  }
  if (c.includes('footwear') || n.includes('sneaker') || n.includes('sandal') || n.includes('slipper') || n.includes('sock')) {
    return { emoji: '👟', bg: 'bg-emerald-50 text-emerald-600' };
  }
  if (n.includes('pajama') || n.includes('night') || n.includes('undergarment') || n.includes('bra') || n.includes('towel')) {
    return { emoji: '👘', bg: 'bg-purple-50 text-purple-600' };
  }
  return { emoji: '🎒', bg: 'bg-rose-50 text-rose-600' };
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
  // Navigation: 'overview' (widgets + 3 portals) | 'wardrobe' | 'luggage' | 'electronics'
  const [currentSubView, setCurrentSubView] = useState<'overview' | 'wardrobe' | 'luggage' | 'electronics'>('overview');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  // New item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeItem['category']>('Dresses');
  const [targetBag, setTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [quantity, setQuantity] = useState(1);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [isNewPhotoUploading, setIsNewPhotoUploading] = useState(false);

  // Edit item form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<WardrobeItem['category']>('Dresses');
  const [editTargetBag, setEditTargetBag] = useState<WardrobeItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [editQuantity, setEditQuantity] = useState(1);

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Essentials'];

  // Live completion metrics
  const wardrobePacked = wardrobe.filter((w) => w.isPacked).length;
  const wardrobePercent = Math.round((wardrobePacked / (wardrobe.length || 1)) * 100);

  const bagsPacked = bags.filter((b) => b.isPacked).length;
  const bagsPercent = Math.round((bagsPacked / (bags.length || 1)) * 100);

  const devicesPacked = devices.filter((d) => d.isPacked).length;
  const devicesPercent = Math.round((devicesPacked / (devices.length || 1)) * 100);

  // Camera capture / photo upload for specific item (Requirement #6)
  const handleItemPhotoUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingItemId(itemId);
      const publicUrl = await uploadPhotoToSupabase(file, 'wardrobe');
      onUpdateWardrobeItem(itemId, { photoUrl: publicUrl });
    } catch (err) {
      console.error('Failed to upload wardrobe photo:', err);
      alert('Photo upload failed. Please check internet connection.');
    } finally {
      setUploadingItemId(null);
    }
  };

  const handleNewItemPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsNewPhotoUploading(true);
      const publicUrl = await uploadPhotoToSupabase(file, 'wardrobe');
      setNewPhotoUrl(publicUrl);
    } catch (err) {
      console.error('Failed to upload photo for new item:', err);
    } finally {
      setIsNewPhotoUploading(false);
    }
  };

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
      photoUrl: newPhotoUrl || undefined,
    });
    setName('');
    setQuantity(1);
    setNewPhotoUrl('');
    setShowAddForm(false);
  };

  const filteredWardrobe = wardrobe.filter((item) =>
    activeCategory === 'All' ? true : item.category === activeCategory
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* 1. iOS STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/10 -mx-4 sm:-mx-6 px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentSubView === 'overview') {
              onBack();
            } else {
              setCurrentSubView('overview');
            }
          }}
          className="text-[#007AFF] text-base font-medium flex items-center gap-0.5 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>{currentSubView === 'overview' ? 'Overview' : 'Luggage & Wardrobe'}</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          {currentSubView === 'overview' && 'Luggage & Wardrobe'}
          {currentSubView === 'wardrobe' && 'Wardrobe Studio'}
          {currentSubView === 'luggage' && 'Luggage Allocations'}
          {currentSubView === 'electronics' && 'Connected Electronics'}
        </h1>

        {currentSubView !== 'overview' ? (
          <button
            type="button"
            onClick={() => setIsSectionEditMode(!isSectionEditMode)}
            className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity"
          >
            {isSectionEditMode ? 'Done' : 'Edit'}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      {/* ========================================================= */}
      {/* VIEW A: OVERVIEW (HARDWARE WIDGETS + 3 PORTAL CARDS)      */}
      {/* ========================================================= */}
      {currentSubView === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* iOS Connected-Device / Battery Style Showcase (Requirement #5) */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 block">
              Connected Hardware & Scale Showcase
            </span>

            {/* 4 Luggage Bags Scaled Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {bags.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setCurrentSubView('luggage')}
                  className="ios-card p-3 flex flex-col justify-between hover:border-[#007AFF]/40 cursor-pointer transition-all active:scale-98"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1">
                    <span className="font-mono font-bold text-slate-800">{b.dimensions}</span>
                    <span className={`w-2 h-2 rounded-full ${b.isPacked ? 'bg-[#34C759]' : 'bg-slate-300'}`} />
                  </div>

                  <div className="py-2 flex items-center justify-center text-slate-700">
                    {b.kind === 'rolling-large' && (
                      <div className="w-10 h-14 rounded-lg border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between p-1 shadow-2xs">
                        <div className="w-4 h-1 bg-slate-500 rounded-sm" />
                        <span className="text-[9px] font-bold text-slate-700">23kg</span>
                        <div className="w-full flex justify-between px-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        </div>
                      </div>
                    )}
                    {b.kind === 'rolling-medium' && (
                      <div className="w-8 h-12 rounded-lg border-2 border-slate-600 bg-slate-100 flex flex-col items-center justify-between p-1 shadow-2xs">
                        <div className="w-3 h-1 bg-slate-500 rounded-sm" />
                        <span className="text-[8px] font-bold text-slate-700">23kg</span>
                        <div className="w-full flex justify-between px-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        </div>
                      </div>
                    )}
                    {b.kind === 'backpack' && (
                      <div className="w-9 h-11 rounded-t-xl rounded-b-md border-2 border-slate-700 bg-amber-50 flex flex-col items-center justify-center p-1 shadow-2xs">
                        <div className="w-3 h-0.5 bg-slate-600 rounded-sm mb-1" />
                        <span className="text-[8px] font-bold text-amber-900">45cm</span>
                      </div>
                    )}
                    {b.kind === 'fannypack' && (
                      <div className="w-11 h-6 rounded-full border-2 border-slate-700 bg-rose-50 flex items-center justify-center px-1 shadow-2xs">
                        <span className="text-[8px] font-bold text-rose-900">Chest</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-1 border-t border-black/5">
                    <span className="text-xs font-bold text-slate-900 block truncate">{b.name}</span>
                    <span className="text-[10px] text-[#8E8E93]">{b.isPacked ? 'Packed' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 6 Electronic Devices Carousel (Battery / Bluetooth Style) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {devices.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setCurrentSubView('electronics')}
                  className="ios-card p-2.5 text-center flex flex-col justify-between hover:border-[#007AFF]/40 cursor-pointer transition-all active:scale-98"
                >
                  <div className="flex items-center justify-between text-[9px] text-[#8E8E93]">
                    <span className="truncate">{d.model.split(' ')[0]}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${d.isPacked ? 'bg-[#34C759]' : 'bg-slate-300'}`} />
                  </div>

                  <div className="py-1.5 flex items-center justify-center">
                    {d.type === 'phone-ios' && (
                      <div className="w-6 h-11 rounded-md border border-slate-700 bg-slate-900 flex flex-col items-center justify-between p-0.5 shadow-2xs">
                        <div className="w-2 h-0.5 bg-slate-600 rounded-full" />
                        <div className="w-3 h-3 rounded-full border border-blue-400 bg-blue-500/30" />
                        <div className="w-2.5 h-0.5 bg-slate-600 rounded-full" />
                      </div>
                    )}
                    {d.type === 'phone-android' && (
                      <div className="w-6 h-11 rounded-md border border-slate-600 bg-blue-900 flex flex-col items-center justify-between p-0.5 shadow-2xs">
                        <div className="w-1.5 h-0.5 bg-blue-400 rounded-full" />
                        <span className="text-[7px] text-white">S20</span>
                        <div className="w-2 h-0.5 bg-blue-400 rounded-full" />
                      </div>
                    )}
                    {d.type === 'tablet' && (
                      <div className="w-8 h-11 rounded-md border border-slate-700 bg-slate-800 flex items-center justify-center p-0.5 shadow-2xs">
                        <span className="text-[7px] text-white font-mono">iPad</span>
                      </div>
                    )}
                    {d.type === 'laptop' && (
                      <div className="w-10 h-7 rounded-t-sm border border-slate-700 bg-slate-800 flex flex-col items-center justify-end shadow-2xs">
                        <div className="w-7 h-4 bg-slate-900 border border-slate-700 rounded-xs mb-0.5" />
                        <div className="w-11 h-1 bg-slate-600 rounded-b-xs" />
                      </div>
                    )}
                    {d.type === 'earbuds' && (
                      <div className="w-7 h-7 rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center shadow-2xs">
                        <span className="text-xs">🎧</span>
                      </div>
                    )}
                    {d.type === 'powerbank' && (
                      <div className="w-7 h-9 rounded-md border border-slate-700 bg-emerald-900 flex flex-col items-center justify-center p-0.5 shadow-2xs">
                        <span className="text-[7px] text-emerald-300 font-bold font-mono">CCC</span>
                        <Battery className="w-3 h-3 text-emerald-400 mt-0.5" />
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-800 truncate block">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Dedicated Sub-Portal Cards (Requirement #5) */}
          <div className="space-y-2.5 pt-2">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 block">
              Dedicated Management Portals
            </span>

            {/* Portal 1: Wardrobe Studio */}
            <button
              type="button"
              onClick={() => setCurrentSubView('wardrobe')}
              className="w-full ios-card p-4 sm:p-5 flex items-center justify-between text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  👗
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Wardrobe Studio
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-pink-100 text-pink-800">
                      Visual Grid
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5 truncate">
                    Female apparel, camera photo snap & suitcase packing allocation.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{wardrobePercent}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{wardrobePacked}/{wardrobe.length} Packed</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </button>

            {/* Portal 2: Luggage Allocations */}
            <button
              type="button"
              onClick={() => setCurrentSubView('luggage')}
              className="w-full ios-card p-4 sm:p-5 flex items-center justify-between text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  🧳
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Luggage Allocations
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-blue-100 text-[#007AFF]">
                      4 Bags
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5 truncate">
                    23kg rolling suitcases, 45cm cabin backpack, and fanny pack rules.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{bagsPercent}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{bagsPacked}/{bags.length} Packed</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </button>

            {/* Portal 3: Connected Electronics */}
            <button
              type="button"
              onClick={() => setCurrentSubView('electronics')}
              className="w-full ios-card p-4 sm:p-5 flex items-center justify-between text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  ⚡
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Connected Electronics
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      6 Devices
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5 truncate">
                    iPhone 17, Samsung S20 FE, Dell laptop, iPad, Soundcore & CCC battery.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{devicesPercent}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{devicesPacked}/{devices.length} Packed</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#007AFF] transition-colors" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: WARDROBE STUDIO (2-COLUMN GRID + CAMERA CAPTURE)  */}
      {/* ========================================================= */}
      {currentSubView === 'wardrobe' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Progress summary card */}
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Wardrobe Readiness
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {wardrobePacked} of {wardrobe.length} Items Packed
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{wardrobePercent}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${wardrobePercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>Tap checkmark when packed into suitcase</span>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-black/5 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 2-Column E-Commerce Style Visual Grid with Camera Capture (Requirement #6) */}
          <div className="grid grid-cols-2 gap-3">
            {filteredWardrobe.map((item) => {
              const visual = getCategoryVisual(item.name, item.category);
              const isEditing = editingId === item.id;
              const isUploadingThis = uploadingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="ios-card overflow-hidden flex flex-col justify-between relative group hover:border-[#007AFF]/30 transition-all"
                >
                  {/* Delete Badge in Edit Mode */}
                  {isSectionEditMode && (
                    <button
                      type="button"
                      onClick={() => onDeleteWardrobeItem(item.id)}
                      className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shadow-md active:scale-95"
                      title="Delete item"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  )}

                  {/* Thumbnail Container: Real Camera Photo OR Clothing Emoji */}
                  <div className="relative aspect-4/3 w-full bg-[#F2F2F7] flex items-center justify-center overflow-hidden border-b border-black/5">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xs ${visual.bg}`}>
                        {visual.emoji}
                      </div>
                    )}

                    {/* Camera Snap/Upload Button (Requirement #6) */}
                    <label
                      title="Snap / Upload real clothing photo"
                      className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#007AFF] active:scale-90 transition-all z-10"
                    >
                      {isUploadingThis ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleItemPhotoUpload(item.id, e)}
                        className="hidden"
                      />
                    </label>

                    {item.photoUrl && isSectionEditMode && (
                      <button
                        type="button"
                        onClick={() => onUpdateWardrobeItem(item.id, { photoUrl: undefined })}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-[10px]"
                        title="Remove photo & use emoji"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#8E8E93] mt-0.5">
                        Qty: {item.quantity} • {item.category}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#007AFF] border border-blue-100 truncate max-w-full">
                        🧳 {item.targetBag.split(' ')[0]} {item.targetBag.split(' ')[1]}
                      </span>
                    </div>

                    {/* Bottom Row: Checkbox & Edit Toggle */}
                    <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                      {isSectionEditMode ? (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="text-[#007AFF] text-xs font-semibold flex items-center gap-0.5"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <span className={`text-[11px] font-semibold ${item.isPacked ? 'text-[#34C759]' : 'text-[#8E8E93]'}`}>
                          {item.isPacked ? 'Packed' : 'Unpacked'}
                        </span>
                      )}

                      {/* Single Circular iOS Checkmark Circle (Requirement #4) */}
                      <button
                        type="button"
                        onClick={() => onToggleWardrobePacked(item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          item.isPacked
                            ? 'bg-[#007AFF] text-white shadow-xs'
                            : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                        }`}
                      >
                        {item.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW C: LUGGAGE BAGS FULL VIEW                            */}
      {/* ========================================================= */}
      {currentSubView === 'luggage' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Luggage Status
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {bagsPacked} of {bags.length} Bags Packed
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{bagsPercent}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${bagsPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {bags.map((b) => (
              <div key={b.id} className="ios-card p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{b.name}</h3>
                    <p className="text-xs text-[#8E8E93] mt-0.5">
                      {b.dimensions} • Weight limit: <strong className="text-slate-800">{b.weightLimit}</strong>
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${b.kind.includes('rolling') ? 'bg-blue-100 text-[#007AFF]' : 'bg-amber-100 text-amber-900'}`}>
                    {b.kind.includes('rolling') ? 'Checked (23kg)' : 'Cabin / Chest'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F2F2F7] text-xs text-slate-700 leading-relaxed">
                  <strong>Recommended Contents:</strong> {b.recommendedContents}
                </div>

                {/* Dual Checkboxes for Luggage */}
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleBagBought(b.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        b.isBought
                          ? 'bg-[#34C759] text-white shadow-xs'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {b.isBought && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span className="text-slate-700 font-medium">Owned / Ready</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleBagPacked && onToggleBagPacked(b.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        b.isPacked
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {b.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span className="text-slate-700 font-medium">Fully Packed</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW D: CONNECTED ELECTRONICS FULL VIEW                   */}
      {/* ========================================================= */}
      {currentSubView === 'electronics' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Hardware Status
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {devicesPacked} of {devices.length} Devices Cleared & Packed
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{devicesPercent}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${devicesPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {devices.map((d) => (
              <div key={d.id} className="ios-card p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{d.name}</h3>
                    <p className="text-xs text-[#8E8E93] mt-0.5">
                      Model: {d.model} • OS / Band: <strong className="text-slate-800">{d.carrierOrOs}</strong>
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-100">
                    📍 {d.carryLocation}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-[#F2F2F7] p-2.5 rounded-xl">
                  {d.role}
                </p>

                {/* Dual Checkboxes for Electronics */}
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleDeviceBought(d.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        d.isBought
                          ? 'bg-[#34C759] text-white shadow-xs'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {d.isBought && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span className="text-slate-700 font-medium">Charged & Ready</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      onClick={() => onToggleDevicePacked && onToggleDevicePacked(d.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        d.isPacked
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {d.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span className="text-slate-700 font-medium">Packed in Cabin Bag</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Clothing Item Modal (with Camera Snap Option) */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleAddSubmit}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 border border-black/10 text-xs"
          >
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Add Clothing Item</h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Item Description
              </label>
              <input
                type="text"
                placeholder="e.g. Cotton Summer Sundress"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-2 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                >
                  <option value="Dresses">Dresses</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Essentials">Essentials</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Destination Suitcase
              </label>
              <select
                value={targetBag}
                onChange={(e) => setTargetBag(e.target.value as any)}
                className="w-full px-2 py-2 border border-black/10 rounded-xl bg-[#F2F2F7]"
              >
                <option value="Main Large Suitcase (30×40×70cm)">Main Large Suitcase (30×40×70cm)</option>
                <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                <option value="Cabin Laptop Backpack">Cabin Laptop Backpack</option>
                <option value="Fanny Pack">Fanny Pack</option>
              </select>
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">
                Photo (Optional)
              </label>
              <label className="w-full py-2 px-3 rounded-xl border border-dashed border-black/20 bg-[#F2F2F7] flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200">
                <Camera className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700 font-medium">
                  {isNewPhotoUploading ? 'Uploading...' : newPhotoUrl ? 'Photo Attached ✓' : 'Snap / Upload Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleNewItemPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#007AFF] text-white font-semibold shadow-xs"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
