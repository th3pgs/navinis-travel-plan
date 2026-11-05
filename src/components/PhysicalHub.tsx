import React, { useState } from 'react';
import { WardrobeItem, BagAsset, DeviceAsset, GiftItem, INITIAL_GIFTS } from '../data';
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
  Gift,
  Package,
} from 'lucide-react';
import { uploadPhotoToSupabase } from '../cloudSync';

interface PhysicalHubProps {
  onBack: () => void;
  wardrobe: WardrobeItem[];
  bags: BagAsset[];
  devices: DeviceAsset[];
  gifts?: GiftItem[];
  onToggleWardrobeBought: (id: string) => void;
  onToggleWardrobePacked: (id: string) => void;
  onAddWardrobeItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onUpdateWardrobeItem: (id: string, updated: Partial<WardrobeItem>) => void;
  onDeleteWardrobeItem: (id: string) => void;
  onToggleBagBought: (id: string) => void;
  onToggleBagPacked?: (id: string) => void;
  onToggleDeviceBought: (id: string) => void;
  onToggleDevicePacked?: (id: string) => void;
  onToggleGiftPacked?: (id: string) => void;
  onAddGift?: (gift: Omit<GiftItem, 'id'>) => void;
  onUpdateGift?: (id: string, updated: Partial<GiftItem>) => void;
  onDeleteGift?: (id: string) => void;
}

// Reusable Bag Icon Graphic for Overview & Sub-Views
export function renderBagIcon(kind: BagAsset['kind'], sizeClass = 'w-10 h-14') {
  if (kind === 'rolling-large') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0`}>
        <div className="w-4 h-1 bg-slate-500 rounded-sm" />
        <div className="flex flex-col items-center leading-none">
          <span className="text-[9px] font-bold text-slate-800">23kg</span>
          <span className="text-[7px] text-slate-500 font-mono">Large</span>
        </div>
        <div className="w-full flex justify-between px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
        </div>
      </div>
    );
  }
  if (kind === 'rolling-medium') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-slate-600 bg-slate-100 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0`}>
        <div className="w-3 h-1 bg-slate-500 rounded-sm" />
        <div className="flex flex-col items-center leading-none">
          <span className="text-[8px] font-bold text-slate-800">23kg</span>
          <span className="text-[7px] text-slate-500 font-mono">Med</span>
        </div>
        <div className="w-full flex justify-between px-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
        </div>
      </div>
    );
  }
  if (kind === 'backpack') {
    return (
      <div className={`${sizeClass} rounded-t-xl rounded-b-md border-2 border-slate-700 bg-amber-50 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0`}>
        <div className="w-3 h-0.5 bg-slate-600 rounded-sm" />
        <span className="text-[8px] font-bold text-amber-900">45cm</span>
        <div className="w-full flex justify-center gap-1">
          <span className="w-1 h-2 bg-amber-300 rounded-xs" />
          <span className="w-1 h-2 bg-amber-300 rounded-xs" />
        </div>
      </div>
    );
  }
  // Crossbody / Fanny Pack - Clean recognizable crossbody sling / waist bag with diagonal strap & buckle
  return (
    <div className="w-12 h-10 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 48 32" className="w-11 h-7" fill="none">
        {/* Adjustable Crossbody Strap with Buckle */}
        <path d="M4 11 C10 3, 38 3, 44 11" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="22" y="3" width="4" height="4" rx="1" fill="#94A3B8" />
        {/* Curved Sling Pouch Body */}
        <path d="M8 12 C8 8, 40 8, 40 12 L38 24 C38 27, 10 27, 10 24 Z" fill="#E11D48" stroke="#9F1239" strokeWidth="1.5" />
        {/* Front Zipper line and slider */}
        <path d="M12 16 L36 16" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 1" />
        <circle cx="24" cy="16" r="1.5" fill="#FFE4E6" />
        <path d="M14 20 L34 20" stroke="#BE123C" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Reusable Device Icon Graphic for Overview & Sub-Views
export function renderDeviceIcon(type: DeviceAsset['type'], sizeClass = 'w-7 h-11') {
  // 1. iPhone 17: Sleek titanium frame with Dynamic Island pill at top + Apple silhouette
  if (type === 'phone-ios') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-slate-700 bg-slate-900 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0 relative overflow-hidden`}>
        {/* Dynamic Island Pill */}
        <div className="w-3.5 h-1 bg-black rounded-full border border-slate-700 mt-0.5 shadow-xs" />
        {/* Apple Logo Silhouette */}
        <div className="w-full flex items-center justify-center my-auto">
          <svg viewBox="0 0 170 170" className="w-3 h-3 text-slate-300 opacity-80" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.98-12.24-14.7-5.99-9.04-10.74-19.19-14.24-30.45-3.5-11.26-5.26-21.84-5.26-31.74 0-14.28 3.73-25.79 11.2-34.52 7.47-8.73 16.9-13.19 28.3-13.38 4.79 0 10.14 1.25 16.06 3.76 5.92 2.51 9.77 3.82 11.56 3.92 1.45-.1 5.42-1.46 11.91-4.08 6.49-2.62 12.08-3.79 16.78-3.51 12.85.65 22.94 5.34 30.27 14.07-11.09 6.74-16.53 15.93-16.32 27.57.21 9.04 3.63 16.65 10.26 22.84 6.63 6.19 14.47 9.87 23.52 11.04-2.28 6.94-5.07 14.02-8.36 21.24zM119.22 31.81c0-7.07 2.6-13.79 7.8-20.15 5.2-6.36 11.66-10.38 19.38-12.06.43 1.3.65 2.61.65 3.91 0 7.07-2.67 13.9-8.01 20.48-5.34 6.58-11.96 10.37-19.82 11.37v-3.55z" />
          </svg>
        </div>
        <div className="w-3 h-0.5 bg-slate-500 rounded-full mb-0.5" />
      </div>
    );
  }

  // 2. Samsung S20 FE: Punch-hole dot display, Mint/Teal accent border, Android / "SIM OTP" badge
  if (type === 'phone-android') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-teal-500 bg-slate-900 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0 relative overflow-hidden`}>
        {/* Punch-Hole Camera Dot */}
        <div className="w-1 h-1 rounded-full bg-teal-400 mt-0.5 shadow-2xs" />
        {/* SIM OTP Badge */}
        <div className="flex flex-col items-center my-auto leading-none">
          <span className="text-[6px] font-bold text-teal-300 font-mono">OTP</span>
          <span className="text-[5px] text-teal-400/90 font-mono">SIM</span>
        </div>
        <div className="w-3 h-0.5 bg-teal-400/60 rounded-full mb-0.5" />
      </div>
    );
  }

  // 3. Apple iPad 11
  if (type === 'tablet') {
    return (
      <div className="w-8 h-11 rounded-md border-2 border-slate-700 bg-slate-800 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0">
        <div className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="text-[7px] text-white font-mono font-bold">iPad</span>
        <div className="w-2.5 h-0.5 bg-slate-600 rounded-full" />
      </div>
    );
  }

  // 4. Dell Latitude 5410 Laptop
  if (type === 'laptop') {
    return (
      <div className="w-10 h-7 rounded-t-sm border border-slate-700 bg-slate-800 flex flex-col items-center justify-end shadow-2xs shrink-0">
        <div className="w-8 h-4.5 bg-slate-900 border border-slate-700 rounded-xs mb-0.5 flex items-center justify-center">
          <span className="text-[6px] font-mono text-blue-400 font-bold">DELL</span>
        </div>
        <div className="w-11 h-1 bg-slate-600 rounded-b-xs" />
      </div>
    );
  }

  // 5. Anker Soundcore Earbuds: Distinct wireless in-ear earbuds & charging case SVG
  if (type === 'earbuds') {
    return (
      <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <line x1="4" y1="14" x2="28" y2="14" stroke="#334155" strokeWidth="1" />
        <ellipse cx="11" cy="11" rx="2.5" ry="3" fill="#0EA5E9" />
        <rect x="10" y="13" width="2" height="4" rx="0.5" fill="#38BDF8" />
        <ellipse cx="21" cy="11" rx="2.5" ry="3" fill="#0EA5E9" />
        <rect x="20" y="13" width="2" height="4" rx="0.5" fill="#38BDF8" />
        <circle cx="16" cy="20" r="1" fill="#34D399" />
      </svg>
    );
  }

  // 6. CCC Power Bank
  return (
    <div className="w-7 h-9 rounded-md border-2 border-emerald-700 bg-emerald-950 flex flex-col items-center justify-center p-0.5 shadow-2xs shrink-0">
      <span className="text-[6px] text-emerald-300 font-bold font-mono">10k</span>
      <Battery className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
    </div>
  );
}

// Maps apparel and gifts to visual thumbnails
function getCategoryVisual(name: string, category: string): { emoji: string; bg: string } {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (c.includes('gift') || n.includes('gift') || n.includes('seashell') || n.includes('ship') || n.includes('elephant')) {
    return { emoji: '🎁', bg: 'bg-purple-50 text-purple-600' };
  }
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
  gifts: propsGifts,
  onToggleWardrobePacked,
  onAddWardrobeItem,
  onUpdateWardrobeItem,
  onDeleteWardrobeItem,
  onToggleBagBought,
  onToggleBagPacked,
  onToggleDeviceBought,
  onToggleDevicePacked,
  onToggleGiftPacked: propsToggleGift,
  onAddGift: propsAddGift,
  onUpdateGift: propsUpdateGift,
  onDeleteGift: propsDeleteGift,
}) => {
  // Navigation: 'overview' (widgets + 4 portals) | 'wardrobe' | 'luggage' | 'electronics' | 'gifts'
  const [currentSubView, setCurrentSubView] = useState<'overview' | 'wardrobe' | 'luggage' | 'electronics' | 'gifts'>('overview');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSectionEditMode, setIsSectionEditMode] = useState(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  // Local state fallback for gifts
  const [localGifts, setLocalGifts] = useState<GiftItem[]>(() => {
    try {
      const saved = localStorage.getItem('navini_gifts_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_GIFTS;
  });

  const activeGifts = propsGifts || localGifts;

  const handleToggleGift = (id: string) => {
    if (propsToggleGift) {
      propsToggleGift(id);
    } else {
      const updated = localGifts.map((g) => (g.id === id ? { ...g, isPacked: !g.isPacked } : g));
      setLocalGifts(updated);
      localStorage.setItem('navini_gifts_v5', JSON.stringify(updated));
    }
  };

  const handleAddGiftSubmit = (gift: Omit<GiftItem, 'id'>) => {
    if (propsAddGift) {
      propsAddGift(gift);
    } else {
      const newG: GiftItem = { ...gift, id: `gift-${Date.now()}` };
      const updated = [...localGifts, newG];
      setLocalGifts(updated);
      localStorage.setItem('navini_gifts_v5', JSON.stringify(updated));
    }
  };

  const handleUpdateGiftSubmit = (id: string, updatedFields: Partial<GiftItem>) => {
    if (propsUpdateGift) {
      propsUpdateGift(id, updatedFields);
    } else {
      const updated = localGifts.map((g) => (g.id === id ? { ...g, ...updatedFields } : g));
      setLocalGifts(updated);
      localStorage.setItem('navini_gifts_v5', JSON.stringify(updated));
    }
  };

  const handleDeleteGiftSubmit = (id: string) => {
    if (propsDeleteGift) {
      propsDeleteGift(id);
    } else {
      const updated = localGifts.filter((g) => g.id !== id);
      setLocalGifts(updated);
      localStorage.setItem('navini_gifts_v5', JSON.stringify(updated));
    }
  };

  // Gift Form States
  const [showAddGift, setShowAddGift] = useState(false);
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftQuantity, setNewGiftQuantity] = useState(1);
  const [newGiftTargetBag, setNewGiftTargetBag] = useState<GiftItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [newGiftRecipient, setNewGiftRecipient] = useState('');
  const [newGiftNote, setNewGiftNote] = useState('');

  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [editGiftName, setEditGiftName] = useState('');
  const [editGiftQuantity, setEditGiftQuantity] = useState(1);
  const [editGiftTargetBag, setEditGiftTargetBag] = useState<GiftItem['targetBag']>('Main Large Suitcase (30×40×70cm)');
  const [editGiftRecipient, setEditGiftRecipient] = useState('');
  const [editGiftNote, setEditGiftNote] = useState('');

  // New Wardrobe item form
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

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Essentials', 'Gifts & Packaging'];

  // Live completion metrics
  const wardrobePacked = wardrobe.filter((w) => w.isPacked).length;
  const wardrobePercent = Math.round((wardrobePacked / (wardrobe.length || 1)) * 100);

  const bagsPacked = bags.filter((b) => b.isPacked).length;
  const bagsPercent = Math.round((bagsPacked / (bags.length || 1)) * 100);

  const devicesPacked = devices.filter((d) => d.isPacked).length;
  const devicesPercent = Math.round((devicesPacked / (devices.length || 1)) * 100);

  const giftsPacked = activeGifts.filter((g) => g.isPacked).length;
  const giftsPercent = Math.round((giftsPacked / (activeGifts.length || 1)) * 100);

  // Camera capture / photo upload for specific item
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

  const handleAddItemSubmit = (e: React.FormEvent) => {
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

  const handleStartEditGift = (g: GiftItem) => {
    setEditingGiftId(g.id);
    setEditGiftName(g.name);
    setEditGiftQuantity(g.quantity);
    setEditGiftTargetBag(g.targetBag);
    setEditGiftRecipient(g.recipient);
    setEditGiftNote(g.packagingNote);
  };

  const handleSaveGiftEdit = (id: string) => {
    if (!editGiftName.trim()) return;
    handleUpdateGiftSubmit(id, {
      name: editGiftName.trim(),
      quantity: Math.max(1, editGiftQuantity),
      targetBag: editGiftTargetBag,
      recipient: editGiftRecipient.trim(),
      packagingNote: editGiftNote.trim(),
    });
    setEditingGiftId(null);
  };

  const handleAddGiftFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName.trim()) return;
    handleAddGiftSubmit({
      name: newGiftName.trim(),
      quantity: Math.max(1, newGiftQuantity),
      targetBag: newGiftTargetBag,
      recipient: newGiftRecipient.trim() || 'Professors & Buddies',
      packagingNote: newGiftNote.trim() || 'Protect with bubble wrap before flight',
      isPacked: false,
    });
    setNewGiftName('');
    setNewGiftQuantity(1);
    setNewGiftRecipient('');
    setNewGiftNote('');
    setShowAddGift(false);
  };

  const filteredWardrobe = wardrobe.filter(
    (w) => activeCategory === 'All' || w.category === activeCategory
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
          className="text-[#007AFF] text-base font-medium flex items-center gap-0.5 active:opacity-60 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 -ml-1.5" />
          <span>{currentSubView === 'overview' ? 'Overview' : 'Luggage & Gear'}</span>
        </button>

        <h1 className="font-semibold text-sm sm:text-base text-slate-900 truncate px-2 text-center">
          {currentSubView === 'overview' && 'Luggage & Wardrobe'}
          {currentSubView === 'wardrobe' && 'Wardrobe Studio'}
          {currentSubView === 'luggage' && 'Luggage Allocations'}
          {currentSubView === 'electronics' && 'Connected Electronics'}
          {currentSubView === 'gifts' && 'Gifts & Souvenirs'}
        </h1>

        {currentSubView !== 'overview' ? (
          <button
            type="button"
            onClick={() => setIsSectionEditMode(!isSectionEditMode)}
            className="text-[#007AFF] text-sm sm:text-base font-semibold active:opacity-60 transition-opacity cursor-pointer"
          >
            {isSectionEditMode ? 'Done' : 'Edit'}
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      {/* ========================================================= */}
      {/* VIEW A: OVERVIEW WITH HARDWARE SHOWCASE & 4 PORTALS        */}
      {/* ========================================================= */}
      {currentSubView === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* HARDWARE SHOWCASE GRID */}
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
                    {renderBagIcon(b.kind)}
                  </div>

                  <div className="text-center pt-1 border-t border-black/5">
                    <span className="text-xs font-bold text-slate-900 block truncate">{b.name}</span>
                    <span className="text-[10px] text-[#8E8E93]">{b.isPacked ? 'Packed' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 6 Electronic Devices Carousel (Anker Soundcore & iPhone 17 vs S20 FE Fixed) */}
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
                    {renderDeviceIcon(d.type)}
                  </div>

                  <span className="text-[10px] font-bold text-slate-800 truncate block">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Dedicated Management Portals (Wardrobe, Luggage, Tech, Gifts) */}
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

            {/* Portal 4: Gifts & Souvenirs (Requirement #4C) */}
            <button
              type="button"
              onClick={() => setCurrentSubView('gifts')}
              className="w-full ios-card p-4 sm:p-5 flex items-center justify-between text-left hover:border-[#007AFF]/40 active:opacity-90 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  🎁
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#007AFF] transition-colors">
                      Gifts & Souvenirs
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-purple-100 text-purple-800">
                      Sri Lankan Gifts
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8E93] mt-0.5 truncate">
                    Seashell gifts, handmade wooden wind-ships & souvenir elephants.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 block">{giftsPercent}%</span>
                  <span className="text-[10px] text-[#8E8E93]">{giftsPacked}/{activeGifts.length} Packed</span>
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
              <span>Tap checkmark once placed inside assigned suitcase</span>
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

          {/* iOS Segmented Category Switcher */}
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

          {/* Add Wardrobe Item Form */}
          {showAddForm && (
            <form onSubmit={handleAddItemSubmit} className="ios-card p-4 space-y-3 bg-blue-50/40 border-[#007AFF]/30">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#007AFF]">New Wardrobe Item</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-[#8E8E93] hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cotton Summer Dress"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Gifts & Packaging">Gifts & Packaging</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Bag</label>
                  <select
                    value={targetBag}
                    onChange={(e) => setTargetBag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  >
                    <option value="Main Large Suitcase (30×40×70cm)">Main Large Suitcase (30×40×70cm)</option>
                    <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                    <option value="Cabin Laptop Backpack">Cabin Laptop Backpack</option>
                    <option value="Fanny Pack">Fanny Pack</option>
                    <option value="Wear on Flight">Wear on Flight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  />
                </div>
              </div>

              {/* Photo Snap / Upload for New Item */}
              <div className="pt-1 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs text-[#007AFF] font-medium cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <span>{newPhotoUrl ? 'Photo Uploaded ✓' : isNewPhotoUploading ? 'Uploading...' : 'Snap / Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleNewItemPhotoUpload}
                  />
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#007AFF] text-white text-xs font-semibold shadow-xs hover:bg-[#007AFF]/90"
                >
                  Save Item
                </button>
              </div>
            </form>
          )}

          {/* 2-Column Responsive Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredWardrobe.map((item) => {
              const visual = getCategoryVisual(item.name, item.category);
              const isUploadingThis = uploadingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="ios-card p-3.5 flex flex-col justify-between hover:border-[#007AFF]/40 transition-all bg-white"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {isSectionEditMode && (
                          <button
                            type="button"
                            onClick={() => onDeleteWardrobeItem(item.id)}
                            className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                            title="Delete item"
                          >
                            <Minus className="w-3 h-3 stroke-[3]" />
                          </button>
                        )}

                        {/* Thumbnail: Real Photo if uploaded, else visual emoji thumbnail */}
                        <div className="relative group shrink-0">
                          {item.photoUrl ? (
                            <img
                              src={item.photoUrl}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-black/10 shadow-2xs"
                            />
                          ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-2xs ${visual.bg}`}>
                              {visual.emoji}
                            </div>
                          )}

                          {/* Quick camera icon button overlay to snap/replace photo */}
                          <label
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#007AFF] transition-colors"
                            title="Snap / Upload real photo"
                          >
                            <Camera className="w-3 h-3" />
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              disabled={isUploadingThis}
                              onChange={(e) => handleItemPhotoUpload(item.id, e)}
                            />
                          </label>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#8E8E93] block truncate">
                            Qty: <strong className="text-slate-700">{item.quantity}</strong> • {item.category}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F2F2F7] text-slate-600 shrink-0">
                        {item.targetBag.split(' ')[0]}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-1">
                        {item.notes}
                      </p>
                    )}

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

                      {/* Single Circular iOS Checkmark Circle */}
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
      {/* VIEW C: LUGGAGE BAGS FULL VIEW (WITH REUSED SHOWCASE ICONS) */}
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
              <div key={b.id} className="ios-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Reused custom bag icon on left (Requirement #4B) */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-1 rounded-xl bg-[#F2F2F7] border border-black/5 flex items-center justify-center shrink-0">
                      {renderBagIcon(b.kind)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">{b.name}</h3>
                      <p className="text-xs text-[#8E8E93] mt-0.5">
                        {b.dimensions} • Limit: <strong className="text-slate-800">{b.weightLimit}</strong>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${b.kind.includes('rolling') ? 'bg-blue-100 text-[#007AFF]' : 'bg-amber-100 text-amber-900'}`}>
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
      {/* VIEW D: CONNECTED ELECTRONICS (WITH REUSED SHOWCASE ICONS) */}
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
              <div key={d.id} className="ios-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Reused custom device icon on left (Requirement #4B) */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-xl bg-[#F2F2F7] border border-black/5 flex items-center justify-center shrink-0">
                      {renderDeviceIcon(d.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">{d.name}</h3>
                      <p className="text-xs text-[#8E8E93] mt-0.5">
                        Model: {d.model} • OS: <strong className="text-slate-800">{d.carrierOrOs}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-100 shrink-0">
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
                    <span className="text-slate-700 font-medium">Fully Packed</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW E: GIFTS & SOUVENIRS FULL VIEW (Requirement #4C)     */}
      {/* ========================================================= */}
      {currentSubView === 'gifts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="ios-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
                  Sri Lankan Souvenirs & Campus Gifts
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {giftsPacked} of {activeGifts.length} Gifts Packed
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#007AFF]">{giftsPercent}%</span>
              </div>
            </div>

            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${giftsPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E8E93] pt-1">
              <span>Bubble-wrap & protect all traditional souvenirs in checked baggage</span>
              <button
                type="button"
                onClick={() => setShowAddGift(true)}
                className="text-[#007AFF] font-semibold flex items-center gap-1 active:opacity-60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gift</span>
              </button>
            </div>
          </div>

          {/* Add Gift Modal/Form */}
          {showAddGift && (
            <form onSubmit={handleAddGiftFormSubmit} className="ios-card p-4 space-y-3 bg-purple-50/40 border-purple-200">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-purple-700">Add New Gift / Souvenir</h4>
                <button
                  type="button"
                  onClick={() => setShowAddGift(false)}
                  className="text-xs text-[#8E8E93] hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gift Item Name</label>
                  <input
                    type="text"
                    value={newGiftName}
                    onChange={(e) => setNewGiftName(e.target.value)}
                    placeholder="e.g. 3x Seashell Gifts"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newGiftQuantity}
                    onChange={(e) => setNewGiftQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Bag</label>
                  <select
                    value={newGiftTargetBag}
                    onChange={(e) => setNewGiftTargetBag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  >
                    <option value="Main Large Suitcase (30×40×70cm)">Main Large Suitcase (30×40×70cm)</option>
                    <option value="Medium Suitcase (27×41×57cm)">Medium Suitcase (27×41×57cm)</option>
                    <option value="Cabin Laptop Backpack">Cabin Laptop Backpack</option>
                    <option value="Fanny Pack">Fanny Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Recipient</label>
                  <input
                    type="text"
                    value={newGiftRecipient}
                    onChange={(e) => setNewGiftRecipient(e.target.value)}
                    placeholder="e.g. Professors / Campus Buddies"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Packaging & Cushioning Note</label>
                <textarea
                  value={newGiftNote}
                  onChange={(e) => setNewGiftNote(e.target.value)}
                  placeholder="e.g. Bubble-wrap and cushion carefully to prevent cracking"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 focus:outline-[#007AFF] text-xs"
                  rows={2}
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-purple-700 text-white text-xs font-semibold shadow-xs hover:bg-purple-800"
                >
                  Save Gift
                </button>
              </div>
            </form>
          )}

          {/* List of Gifts */}
          <div className="space-y-3">
            {activeGifts.map((gift) => {
              const isEditing = editingGiftId === gift.id;

              return (
                <div key={gift.id} className="ios-card p-4 space-y-3">
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={editGiftName}
                          onChange={(e) => setEditGiftName(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-black/10"
                        />
                        <input
                          type="text"
                          value={editGiftRecipient}
                          onChange={(e) => setEditGiftRecipient(e.target.value)}
                          placeholder="Recipient"
                          className="px-2.5 py-1.5 rounded-lg border border-black/10"
                        />
                      </div>
                      <textarea
                        value={editGiftNote}
                        onChange={(e) => setEditGiftNote(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingGiftId(null)}
                          className="px-3 py-1 rounded-full text-xs text-[#8E8E93]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveGiftEdit(gift.id)}
                          className="px-3 py-1 rounded-full bg-[#007AFF] text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {isSectionEditMode && (
                            <button
                              type="button"
                              onClick={() => handleDeleteGiftSubmit(gift.id)}
                              className="w-5 h-5 rounded-full bg-[#FF3B30] text-white flex items-center justify-center shrink-0 active:opacity-60 transition-opacity"
                              title="Delete gift"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>
                          )}
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                            🎁
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                              {gift.name}
                            </h4>
                            <span className="text-xs text-[#8E8E93] block truncate">
                              For: <strong className="text-slate-700">{gift.recipient}</strong> • Qty: {gift.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-100 shrink-0">
                          {gift.targetBag.split(' ')[0]}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F2F2F7] text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                        <Package className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Packaging & Cushioning Task:</strong> {gift.packagingNote}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                        {isSectionEditMode ? (
                          <button
                            type="button"
                            onClick={() => handleStartEditGift(gift)}
                            className="text-[#007AFF] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Gift</span>
                          </button>
                        ) : (
                          <span className={`font-semibold ${gift.isPacked ? 'text-[#34C759]' : 'text-[#8E8E93]'}`}>
                            {gift.isPacked ? 'Gift Wrapped & Packed ✓' : 'Packaging Pending'}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleGift(gift.id)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            gift.isPacked
                              ? 'bg-[#007AFF] text-white shadow-xs'
                              : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                          }`}
                        >
                          {gift.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
