import React, { useState, useRef } from 'react';
import {
  WardrobeItem,
  BagAsset,
  DeviceAsset,
  DocumentItem,
  DEFAULT_WARDROBE_CATEGORIES,
  DEFAULT_BAG_LOCATIONS,
  MEDICINE_SUBTYPES,
  isItemInBag,
} from '../data';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  ChevronRight,
  Camera,
  RotateCcw,
  RotateCw,
  Crop,
  Printer,
  X,
  Luggage,
  Sparkles,
  ShoppingBag,
  Eye,
  Filter,
} from 'lucide-react';
import { uploadPhotoToSupabase } from '../cloudSync';
import { DynamicSelect } from './DynamicSelect';
import { LuggageContentsModal } from './LuggageContentsModal';
import { Battery } from 'lucide-react';

interface PhysicalHubProps {
  onBack: () => void;
  wardrobe: WardrobeItem[];
  bags: BagAsset[];
  devices: DeviceAsset[];
  gifts?: any[];
  documents?: DocumentItem[];
  customLocations?: string[];
  customCategories?: string[];
  onAddCustomLocation?: (name: string) => void;
  onAddCustomCategory?: (cat: string) => void;
  onToggleWardrobeBought: (id: string) => void;
  onToggleWardrobePacked: (id: string) => void;
  onAddWardrobeItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onUpdateWardrobeItem: (id: string, updated: Partial<WardrobeItem>) => void;
  onDeleteWardrobeItem: (id: string) => void;
  onToggleBagBought: (id: string) => void;
  onToggleBagPacked?: (id: string) => void;
  onAddBag?: (bag: Omit<BagAsset, 'id'>) => void;
  onUpdateBag?: (id: string, updated: Partial<BagAsset>) => void;
  onDeleteBag?: (id: string) => void;
  onToggleDeviceBought: (id: string) => void;
  onToggleDevicePacked?: (id: string) => void;
  onAddDevice?: (device: Omit<DeviceAsset, 'id'>) => void;
  onUpdateDevice?: (id: string, updated: Partial<DeviceAsset>) => void;
  onDeleteDevice?: (id: string) => void;
  onToggleGiftPacked?: (id: string) => void;
  onAddGift?: (gift: any) => void;
  onUpdateGift?: (id: string, updated: any) => void;
  onDeleteGift?: (id: string) => void;
  onToggleDocPacked?: (id: string) => void;
  onAddDoc?: (doc: Omit<DocumentItem, 'id'>) => void;
  onUpdateDoc?: (id: string, updated: Partial<DocumentItem>) => void;
  onDeleteDoc?: (id: string) => void;
}

// Reusable Bag Icon Graphic
export function renderBagIcon(kind: BagAsset['kind'] | string, sizeClass = 'w-9 h-13', title?: string) {
  if (kind === 'rolling-large') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-slate-700 bg-slate-100 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0`}>
        <div className="w-4 h-1 bg-slate-500 rounded-sm" />
        <div className="flex flex-col items-center leading-none">
          <span className="text-[8px] font-bold text-slate-800">23kg</span>
          <span className="text-[6px] text-slate-500 font-mono">Large</span>
        </div>
        <div className="w-full flex justify-between px-0.5">
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
          <span className="text-[6px] text-slate-500 font-mono">Med</span>
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
      <div className={`${sizeClass} rounded-xl border-2 border-amber-600 bg-amber-950 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0`}>
        <div className="w-3 h-1 bg-amber-400 rounded-xs" />
        <span className="text-[7px] text-amber-200 font-bold font-mono">CABIN</span>
        <div className="w-4 h-1.5 border border-amber-400/60 rounded-xs" />
      </div>
    );
  }
  // Fanny pack / Crossbody
  return (
    <div className="w-10 h-7 rounded-full border-2 border-rose-600 bg-rose-950 flex items-center justify-center p-1 shadow-2xs shrink-0">
      <span className="text-[7px] text-rose-200 font-bold font-mono">CHEST</span>
    </div>
  );
}

// Reusable Device Icon Graphic
export function renderDeviceIcon(type: DeviceAsset['type'], sizeClass = 'w-7 h-11') {
  if (type === 'phone-ios') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-slate-700 bg-slate-900 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0 relative overflow-hidden`}>
        <div className="w-3.5 h-1 bg-black rounded-full border border-slate-700 mt-0.5" />
        <span className="text-[6px] font-mono font-bold text-slate-300">iOS</span>
        <div className="w-3 h-0.5 bg-slate-500 rounded-full mb-0.5" />
      </div>
    );
  }
  if (type === 'phone-android') {
    return (
      <div className={`${sizeClass} rounded-lg border-2 border-teal-500 bg-slate-900 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0 relative overflow-hidden`}>
        <div className="w-1 h-1 rounded-full bg-teal-400 mt-0.5" />
        <div className="flex flex-col items-center my-auto leading-none">
          <span className="text-[6px] font-bold text-teal-300 font-mono">OTP</span>
        </div>
        <div className="w-3 h-0.5 bg-teal-400/60 rounded-full mb-0.5" />
      </div>
    );
  }
  if (type === 'tablet') {
    return (
      <div className="w-8 h-11 rounded-md border-2 border-slate-700 bg-slate-800 flex flex-col items-center justify-between p-1 shadow-2xs shrink-0">
        <div className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="text-[7px] text-white font-mono font-bold">iPad</span>
        <div className="w-2.5 h-0.5 bg-slate-600 rounded-full" />
      </div>
    );
  }
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
  if (type === 'earbuds') {
    return (
      <div className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center p-1 shrink-0">
        <span className="text-[8px]">🎧</span>
      </div>
    );
  }
  // CCC Power Bank
  return (
    <div className="w-7 h-9 rounded-md border-2 border-emerald-700 bg-emerald-950 flex flex-col items-center justify-center p-0.5 shadow-2xs shrink-0">
      <span className="text-[6px] text-emerald-300 font-bold font-mono">10k</span>
      <Battery className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
    </div>
  );
}

// Maps category to default visual emoji
function getCategoryVisual(name: string, category: string): { emoji: string; bg: string } {
  const n = name.toLowerCase();
  const c = category.toLowerCase();

  if (c.includes('medicine') || n.includes('paracetamol') || n.includes('pill') || n.includes('balm')) {
    return { emoji: '💊', bg: 'bg-red-50 text-red-600' };
  }
  if (c.includes('gift') || n.includes('gift') || n.includes('seashell') || n.includes('ship') || n.includes('elephant')) {
    return { emoji: '🎁', bg: 'bg-purple-50 text-purple-600' };
  }
  if (c.includes('dress') || n.includes('frock')) {
    return { emoji: '👗', bg: 'bg-pink-50 text-pink-600' };
  }
  if (c.includes('top') || n.includes('shirt') || n.includes('blouse') || n.includes('t-shirt')) {
    return { emoji: '👚', bg: 'bg-amber-50 text-amber-600' };
  }
  if (c.includes('bottom') || n.includes('jean') || n.includes('pant') || n.includes('trouser') || n.includes('skirt')) {
    return { emoji: '👖', bg: 'bg-blue-50 text-blue-600' };
  }
  if (c.includes('undergarment') || n.includes('innerwear') || n.includes('pajama') || n.includes('bra')) {
    return { emoji: '👘', bg: 'bg-indigo-50 text-indigo-600' };
  }
  if (c.includes('footwear') || n.includes('sneaker') || n.includes('sandal') || n.includes('slipper') || n.includes('sock')) {
    return { emoji: '👟', bg: 'bg-emerald-50 text-emerald-600' };
  }
  if (c.includes('bottle') || c.includes('liquid') || n.includes('shampoo') || n.includes('lotion')) {
    return { emoji: '🧴', bg: 'bg-cyan-50 text-cyan-600' };
  }
  if (c.includes('daily') || c.includes('essential') || c.includes('cutlery') || n.includes('cup') || n.includes('folder') || n.includes('umbrella')) {
    return { emoji: '🎒', bg: 'bg-slate-100 text-slate-700' };
  }
  return { emoji: '✨', bg: 'bg-blue-50 text-[#007AFF]' };
}

// HTML5 Canvas Rotation and Square-Crop helpers
async function processImageCanvas(dataUrl: string, action: 'rotate-left' | 'rotate-right' | 'crop-square'): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      if (action === 'rotate-left' || action === 'rotate-right') {
        const degrees = action === 'rotate-right' ? 90 : -90;
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else if (action === 'crop-square') {
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = dataUrl;
  });
}

export const PhysicalHub: React.FC<PhysicalHubProps> = ({
  onBack,
  wardrobe,
  bags,
  devices,
  documents = [],
  customLocations = [],
  customCategories = [],
  onAddCustomLocation,
  onAddCustomCategory,
  onToggleWardrobeBought,
  onToggleWardrobePacked,
  onAddWardrobeItem,
  onUpdateWardrobeItem,
  onDeleteWardrobeItem,
  onToggleBagBought,
  onToggleDeviceBought,
}) => {
  // Active Category Filter ('all' or one of the 9 categories)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSuitcaseFilter, setSelectedSuitcaseFilter] = useState<string>('all');
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Luggage Inspection Drawer state
  const [inspectBag, setInspectBag] = useState<BagAsset | null>(null);

  // Large Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);

  // Form Fields inside Modal
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Dresses & Frocks');
  const [formSubType, setFormSubType] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formTargetBag, setFormTargetBag] = useState('Main Large Rolling Suitcase');
  const [formNotes, setFormNotes] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formColorHex, setFormColorHex] = useState('#38bdf8');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // All categories
  const allCategories = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_WARDROBE_CATEGORIES, ...customCategories]));
  }, [customCategories]);

  // All bag locations
  const allLocations = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_BAG_LOCATIONS, ...bags.map((b) => b.name), ...customLocations]));
  }, [bags, customLocations]);

  // Filtered Items
  const displayedItems = React.useMemo(() => {
    return wardrobe.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedSuitcaseFilter !== 'all') {
        const bagMatch = bags.find((b) => b.id === selectedSuitcaseFilter || b.name === selectedSuitcaseFilter);
        if (bagMatch && !isItemInBag(item.targetBag, bagMatch)) return false;
      }
      return true;
    });
  }, [wardrobe, selectedCategory, selectedSuitcaseFilter, bags]);

  const packedCount = wardrobe.filter((w) => w.isPacked).length;
  const packedPercent = Math.round((packedCount / (wardrobe.length || 1)) * 100);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory(selectedCategory !== 'all' ? selectedCategory : 'Dresses & Frocks');
    setFormSubType('');
    setFormQuantity(1);
    setFormTargetBag('Main Large Rolling Suitcase');
    setFormNotes('');
    setFormPhotoUrl('');
    setFormColorHex('#38bdf8');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: WardrobeItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormSubType(item.subType || '');
    setFormQuantity(item.quantity || 1);
    setFormTargetBag(item.targetBag);
    setFormNotes(item.notes || '');
    setFormPhotoUrl(item.photoUrl || '');
    setFormColorHex(item.colorHex || '#38bdf8');
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!formName.trim()) return;

    if (editingItem) {
      onUpdateWardrobeItem(editingItem.id, {
        name: formName.trim(),
        category: formCategory,
        subType: formCategory === 'Medicine & First Aid' ? formSubType : undefined,
        quantity: formQuantity,
        targetBag: formTargetBag,
        notes: formNotes.trim(),
        photoUrl: formPhotoUrl,
        colorHex: formColorHex,
      });
    } else {
      onAddWardrobeItem({
        name: formName.trim(),
        category: formCategory,
        subType: formCategory === 'Medicine & First Aid' ? formSubType : undefined,
        quantity: formQuantity,
        targetBag: formTargetBag,
        notes: formNotes.trim(),
        photoUrl: formPhotoUrl,
        colorHex: formColorHex,
        isBought: true,
        isPacked: false,
      });
    }

    setIsModalOpen(false);
  };

  // Image Upload with Live Preview
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create immediate local dataUrl for instant orientation editing
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const localDataUrl = ev.target?.result as string;
      setFormPhotoUrl(localDataUrl);

      // Also upload in background to Supabase
      try {
        setIsUploadingPhoto(true);
        const publicUrl = await uploadPhotoToSupabase(file, 'wardrobe');
        setFormPhotoUrl(publicUrl);
      } catch (err) {
        console.error('Supabase upload failed, falling back to local photo:', err);
      } finally {
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Orientation Controls
  const handleRotateImage = async (action: 'rotate-left' | 'rotate-right' | 'crop-square') => {
    if (!formPhotoUrl) return;
    try {
      const transformed = await processImageCanvas(formPhotoUrl, action);
      setFormPhotoUrl(transformed);
    } catch (e) {
      console.error('Rotation failed', e);
    }
  };

  // PRINT VIEW: Dedicated Full Clean Mode
  if (isPrintMode) {
    return (
      <div className="min-h-screen bg-white text-slate-900 p-6 max-w-5xl mx-auto space-y-6">
        {/* Floating Print Controls (Hidden on paper print) */}
        <div className="no-print sticky top-4 z-50 bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-xs sm:text-sm">
              Visual Packing Catalog Ready to Print / Save as PDF
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPrintMode(false)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Catalog
            </button>
          </div>
        </div>

        {/* 1. PRINT HEADER */}
        <div className="border-b border-black/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧳</span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Navini's Master Luggage & Packing Visual Lookbook
                </h1>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Scholar: <strong>Parana Gamage Navini Ravishka Priyantha</strong> • Hainan University • Admission: #263660001
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-600 font-mono">
              <div>Flight: MU6018 / MU6381 • CMB &rarr; PVG &rarr; HAK</div>
              <div className="text-[11px] text-[#007AFF] font-semibold mt-0.5">E-Commerce Visual Packing Grid</div>
            </div>
          </div>
        </div>

        {/* 2. TOP HARDWARE & LUGGAGE WIDGETS (4 Bags + 6 Devices) */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Hardware & Suitcase Allocations (10 Items)</span>
            <span className="font-mono text-[11px] font-normal text-slate-500">4 Suitcases/Packs • 6 Essential Devices</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            {bags.map((b) => (
              <div key={b.id} className="p-3 rounded-xl border border-slate-300 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 truncate">{b.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                      {b.weightLimit}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono mt-0.5">{b.dimensions}</div>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-1.5 pt-1.5 border-t border-slate-200">
                  {b.recommendedContents}
                </div>
              </div>
            ))}
            {devices.map((d) => (
              <div key={d.id} className="p-3 rounded-xl border border-slate-300 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 truncate">{d.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                      {d.carrierOrOs}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{d.model}</div>
                </div>
                <div className="text-[10px] font-mono text-slate-600 truncate mt-1.5 pt-1.5 border-t border-slate-200">
                  📍 {d.carryLocation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. STOREFRONT "T-SHIRT STORE" VISUAL LOOKBOOK GRID */}
        <div className="space-y-8 pt-3">
          {DEFAULT_WARDROBE_CATEGORIES.map((category) => {
            const itemsInCat = wardrobe.filter((w) => w.category === category);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={category} className="space-y-3 break-inside-avoid">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                  <h3 className="font-black text-sm sm:text-base text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <span>{category}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {itemsInCat.reduce((sum, i) => sum + i.quantity, 0)} total pcs
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {itemsInCat.length} items
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {itemsInCat.map((item) => {
                    const visual = getCategoryVisual(item.name, item.category);
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between shadow-2xs break-inside-avoid"
                      >
                        {/* E-Commerce Product Image Frame (Large Square/Portrait Frame) */}
                        <div className="w-full aspect-[4/5] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                          {item.photoUrl ? (
                            <img
                              src={item.photoUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-center">
                              <span className="text-5xl mb-2">{visual.emoji}</span>
                              <span className="text-[11px] font-semibold text-slate-500 line-clamp-1 px-2">
                                {item.name}
                              </span>
                            </div>
                          )}

                          {/* Top-Right Quantity Badge */}
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-white font-mono font-bold text-[11px] shadow-xs">
                            ×{item.quantity}
                          </div>

                          {/* Medicine SubType Badge */}
                          {item.subType && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold text-[10px] shadow-xs">
                              {item.subType}
                            </div>
                          )}
                        </div>

                        {/* Product Card Details */}
                        <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">
                              {item.name}
                            </h4>
                            {item.notes && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-tight">
                                {item.notes}
                              </p>
                            )}
                          </div>

                          {/* Luggage Location Pill */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-medium truncate max-w-[180px]">
                              📍 {item.targetBag}
                            </span>
                            <span className="font-semibold text-emerald-700">
                              {item.isPacked ? 'Packed ✓' : 'Allocated'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="ios-back-button group"
        >
          <ChevronLeft className="w-5 h-5 text-[#007AFF] group-hover:-translate-x-0.5 transition-transform" />
          <span>Overview</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Print Visual Packing Catalog Button */}
          <button
            type="button"
            onClick={() => setIsPrintMode(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Open printable visual catalog for university arrival"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">🖨️ Print Visual Catalog</span>
            <span className="sm:hidden">Print</span>
          </button>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION HEADER & PACKING PROGRESS */}
      <div className="ios-card p-5 sm:p-6 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50 border border-blue-100/60 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🧳</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Luggage & Wardrobe
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Physical packing matrix, suitcase allocations, dual camera/gallery uploads & visual lookbook.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-[#007AFF]">{packedPercent}%</div>
              <div className="text-[11px] font-semibold text-slate-500">
                {packedCount} of {wardrobe.length} Packed
              </div>
            </div>
            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                style={{ width: `${packedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Luggage Allocation Quick Inspectors */}
        <div className="mt-4 pt-3 border-t border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {bags.map((b) => {
            const packedInBag = wardrobe.filter((w) => isItemInBag(w.targetBag, b) && w.isPacked).length;
            const totalInBag = wardrobe.filter((w) => isItemInBag(w.targetBag, b)).length;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setInspectBag(b)}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-left transition-all active:scale-98 flex items-center justify-between shadow-2xs cursor-pointer"
              >
                <div className="min-w-0 pr-1">
                  <div className="font-bold text-xs text-slate-900 truncate">{b.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {packedInBag}/{totalInBag} items packed
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CATEGORY SWITCHER (9 EXACT CATEGORIES) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block">
            Filter by Category (9 Roster Categories)
          </span>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#007AFF] font-semibold hover:underline"
            >
              Reset to All
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Items ({wardrobe.length})
          </button>

          {allCategories.map((cat) => {
            const count = wardrobe.filter((w) => w.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#007AFF] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. VISUAL WARDROBE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {displayedItems.map((item) => {
          const visual = getCategoryVisual(item.name, item.category);
          const isPacked = item.isPacked;

          return (
            <div
              key={item.id}
              className={`ios-card p-4 flex flex-col justify-between transition-all border shadow-xs relative ${
                isPacked
                  ? 'bg-emerald-50/40 border-emerald-300/70'
                  : 'bg-white border-black/10 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start gap-3">
                  {/* Photo or Visual Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-black/5 overflow-hidden flex items-center justify-center shrink-0 relative group">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{visual.emoji}</span>
                    )}

                    {/* Quick photo change on hover */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      title="Edit photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight leading-snug">
                        {item.name}
                      </h3>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                        ×{item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      {item.subType && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          {item.subType}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-black/5 text-[11px] font-mono text-slate-600 truncate flex items-center justify-between">
                  <span className="truncate">📍 {item.targetBag}</span>
                  <span
                    className={`font-semibold ${
                      item.isBought ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {item.isBought ? 'Owned' : 'To Buy'}
                  </span>
                </div>
              </div>

              {/* Action Bar: Single Packed vs Unpacked Checkbox + Edit + Delete */}
              <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between">
                {/* Single Packed State Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleWardrobePacked(item.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    isPacked
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-[#F2F2F7] hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isPacked ? 'text-white' : 'text-slate-400'}`} />
                  <span>{isPacked ? 'Packed in Bag' : 'Mark Packed'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Edit item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteWardrobeItem(item.id)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. ENLARGED "ADD / EDIT ITEM" MODAL WITH LIVE PHOTO & ORIENTATION PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-7 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {editingItem ? 'Edit Wardrobe / Packing Item' : 'Add New Item to Packing Studio'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Item Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Item Name & Description *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Linen Summer Midi Dress, Paracetamol 500mg, Seashells..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-[#007AFF] focus:border-[#007AFF]"
                />
              </div>

              {/* Category Dropdown with + Add Custom... */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Category (9 Standard + Custom)
                  </label>
                  <DynamicSelect
                    value={formCategory}
                    options={allCategories}
                    onChange={(cat) => setFormCategory(cat)}
                    onAddCustom={(cat) => {
                      onAddCustomCategory?.(cat);
                      setFormCategory(cat);
                    }}
                    customPlaceholder="+ Add Custom Category..."
                  />
                </div>

                {/* Target Suitcase / Location */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Luggage Allocation (Target Bag)
                  </label>
                  <DynamicSelect
                    value={formTargetBag}
                    options={allLocations}
                    onChange={(loc) => setFormTargetBag(loc)}
                    onAddCustom={(loc) => {
                      onAddCustomLocation?.(loc);
                      setFormTargetBag(loc);
                    }}
                    customPlaceholder="+ Add Custom Location..."
                  />
                </div>
              </div>

              {/* Medicine Subtype (Conditionally Shown for Medicine & First Aid) */}
              {formCategory === 'Medicine & First Aid' && (
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl space-y-2 animate-in fade-in">
                  <label className="block text-red-900 font-bold text-xs uppercase tracking-wider">
                    Medicine Sub-Type Classification
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {MEDICINE_SUBTYPES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormSubType(st)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          formSubType === st
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'bg-white text-red-800 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center focus:outline-[#007AFF]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Notes / Packing Tips</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Checked bag only, double Ziploc bag..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-[#007AFF]"
                  />
                </div>
              </div>

              {/* LIVE PHOTO PREVIEW BOX & ORIENTATION CONTROLS (Requirement #3.B) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span>Live Photo & Orientation Preview</span>
                  </label>
                  {isUploadingPhoto && (
                    <span className="text-[11px] text-[#007AFF] font-semibold animate-pulse">
                      Uploading to cloud...
                    </span>
                  )}
                </div>

                {/* Large Live Preview Box */}
                <div className="w-full h-48 sm:h-56 rounded-2xl bg-slate-200/80 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center relative">
                  {formPhotoUrl ? (
                    <img
                      src={formPhotoUrl}
                      alt="Preview"
                      className="w-full h-full object-contain bg-slate-900/10"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <Camera className="w-10 h-10 mx-auto mb-2 opacity-60" />
                      <p className="text-xs font-medium">No photo selected yet</p>
                      <p className="text-[10px] text-slate-400">
                        Take a photo or upload from gallery below
                      </p>
                    </div>
                  )}
                </div>

                {/* Dual Upload Buttons: Take Photo (Camera) & Choose from Gallery (Storage) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="py-2.5 px-3 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
                    <Camera className="w-4 h-4" />
                    <span>📷 Take Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                  </label>

                  <label className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <span>🖼️ Choose from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {formPhotoUrl && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setFormPhotoUrl('')}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}

                {/* Orientation Controls (Rotate Left, Rotate Right, Crop Square) */}
                {formPhotoUrl && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Orientation Fix:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRotateImage('rotate-left')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="Rotate 90 degrees left"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Rotate 90° Left ↺</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRotateImage('rotate-right')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="Rotate 90 degrees right"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Rotate 90° Right ↻</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRotateImage('crop-square')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        title="Crop to square"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Crop Square</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={!formName.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#007AFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                {editingItem ? 'Save Changes' : 'Add to Packing Studio'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. LUGGAGE CONTENTS MODAL */}
      <LuggageContentsModal
        isOpen={inspectBag !== null}
        onClose={() => setInspectBag(null)}
        bag={inspectBag}
        wardrobeItems={wardrobe}
        deviceItems={devices}
        documentItems={documents}
        giftItems={[]}
        onToggleWardrobePacked={onToggleWardrobePacked}
      />
    </div>
  );
};
