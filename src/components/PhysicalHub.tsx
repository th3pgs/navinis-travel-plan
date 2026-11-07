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
  normalizeCategoryName,
  migrateWardrobeItems,
  isUnnamedRetake,
  normalizeBagLocation,
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
  Search,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Luggage,
  Sparkles,
  ShoppingBag,
  Eye,
  Filter,
  Settings2,
  Battery,
} from 'lucide-react';
import { uploadPhotoToSupabase, compressPhotoToMax400 } from '../cloudSync';
import { DynamicSelect } from './DynamicSelect';
import { LuggageContentsModal } from './LuggageContentsModal';
import { IOSConfirmModal } from './IOSConfirmModal';
import { ManageCategoriesModal } from './ManageCategoriesModal';

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
  onDeleteCustomCategory?: (category: string) => void;
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
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

// HTML5 Canvas Rotation and Square-Crop helpers with aggressive 400x400 downscaling
async function processImageCanvas(dataUrl: string, action: 'rotate-left' | 'rotate-right' | 'crop-square'): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      let targetW = img.width;
      let targetH = img.height;

      if (action === 'rotate-left' || action === 'rotate-right') {
        const degrees = action === 'rotate-right' ? 90 : -90;
        targetW = img.height;
        targetH = img.width;

        // Downscale to max 400
        const maxDim = 400;
        let scale = 1;
        if (targetW > maxDim || targetH > maxDim) {
          scale = Math.min(maxDim / targetW, maxDim / targetH);
        }
        canvas.width = Math.max(1, Math.round(targetW * scale));
        canvas.height = Math.max(1, Math.round(targetH * scale));

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(
          img,
          -Math.round(img.width * scale) / 2,
          -Math.round(img.height * scale) / 2,
          Math.round(img.width * scale),
          Math.round(img.height * scale)
        );
      } else if (action === 'crop-square') {
        const size = Math.min(img.width, img.height);
        const finalSize = Math.min(400, size);
        canvas.width = finalSize;
        canvas.height = finalSize;
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, finalSize, finalSize);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(dataUrl);
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
  onDeleteCustomCategory,
  onRenameCategory,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogViewMode, setCatalogViewMode] = useState<'detailed' | 'list' | 'pictures'>('detailed');
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

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
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Multi-Select & Batch Actions state (Requirement #6.3)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Inline Title Editing state (Requirement #6.3)
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineEditingTitle, setInlineEditingTitle] = useState('');

  // Custom iOS In-App Frosted-Glass Confirmation Modal state (Requirement #1)
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const toggleSelectionId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (displayedList: WardrobeItem[]) => {
    if (selectedIds.size === displayedList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedList.map((i) => i.id)));
    }
  };

  const handleTriggerBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirmModalState({
      isOpen: true,
      title: `Delete ${selectedIds.size} Items?`,
      message: `Are you sure you want to remove ${selectedIds.size} selected items from your wardrobe?`,
      confirmLabel: `Delete ${selectedIds.size} Items`,
      isDestructive: true,
      onConfirm: () => {
        selectedIds.forEach((id) => onDeleteWardrobeItem(id));
        setSelectedIds(new Set());
        setIsSelectionMode(false);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        setSaveToast(`✓ Deleted ${selectedIds.size} items`);
        setTimeout(() => setSaveToast(null), 2500);
      },
    });
  };

  const handleBulkMarkPacked = (packed: boolean) => {
    selectedIds.forEach((id) => onUpdateWardrobeItem(id, { isPacked: packed }));
    setSaveToast(`✓ Marked ${selectedIds.size} items as ${packed ? 'Packed' : 'To Pack'}`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleBulkChangeBag = (bag: string) => {
    selectedIds.forEach((id) => onUpdateWardrobeItem(id, { targetBag: bag }));
    setSaveToast(`✓ Moved ${selectedIds.size} items to ${bag}`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleBulkChangeCategory = (cat: string) => {
    selectedIds.forEach((id) => onUpdateWardrobeItem(id, { category: cat }));
    setSaveToast(`✓ Reclassified ${selectedIds.size} items to ${cat}`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleSaveInlineTitle = (id: string) => {
    const trimmed = inlineEditingTitle.trim();
    if (trimmed) {
      onUpdateWardrobeItem(id, { name: trimmed });
      setSaveToast('✓ Renamed item');
      setTimeout(() => setSaveToast(null), 2000);
    }
    setInlineEditingId(null);
  };

  // Auto-switch to print mode if window.print() or Ctrl+P is triggered
  React.useEffect(() => {
    const handleBeforePrint = () => {
      setIsPrintMode(true);
    };
    window.addEventListener('beforeprint', handleBeforePrint);
    return () => window.removeEventListener('beforeprint', handleBeforePrint);
  }, []);

  // Close full-screen preview with Escape key
  React.useEffect(() => {
    if (!isPrintMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPrintMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrintMode]);

  // Separate unnamed camera retakes / placeholders from clean items (Requirement #4)
  const unnamedItems = React.useMemo(() => {
    return wardrobe.filter(isUnnamedRetake);
  }, [wardrobe]);

  const cleanItems = React.useMemo(() => {
    return wardrobe.filter((w) => !isUnnamedRetake(w));
  }, [wardrobe]);

  // All categories: standard 9 categories + user custom categories + any distinct categories on items
  const allCategories = React.useMemo(() => {
    const extraCategories = wardrobe
      .map((w) => normalizeCategoryName(w.category))
      .filter((c) => !DEFAULT_WARDROBE_CATEGORIES.includes(c));
    return Array.from(new Set([...DEFAULT_WARDROBE_CATEGORIES, ...customCategories, ...extraCategories]));
  }, [customCategories, wardrobe]);

  // All bag locations
  const allLocations = React.useMemo(() => {
    return Array.from(new Set([...DEFAULT_BAG_LOCATIONS, ...bags.map((b) => b.name), ...customLocations]));
  }, [bags, customLocations]);

  // Filtered Items (isolates unnamed items from regular category views)
  const displayedItems = React.useMemo(() => {
    return wardrobe.filter((item) => {
      // If user explicitly chose the "unnamed" pill
      if (selectedCategory === 'unnamed') {
        if (!isUnnamedRetake(item)) return false;
      } else {
        // If there are clean items, don't mix unnamed retakes into 'all' or categories
        if (cleanItems.length > 0 && isUnnamedRetake(item)) {
          return false;
        }

        if (selectedCategory !== 'all') {
          const itemCat = normalizeCategoryName(item.category);
          const selNorm = normalizeCategoryName(selectedCategory);
          if (itemCat !== selNorm && item.category !== selectedCategory) {
            return false;
          }
        }
      }

      if (selectedSuitcaseFilter !== 'all') {
        const bagMatch = bags.find((b) => b.id === selectedSuitcaseFilter || b.name === selectedSuitcaseFilter);
        if (bagMatch && !isItemInBag(item.targetBag, bagMatch)) return false;
      }
      return true;
    });
  }, [wardrobe, cleanItems.length, selectedCategory, selectedSuitcaseFilter, bags]);

  // Purge all unnamed photo retakes and duplicates (Requirement #4.2)
  const handlePurgeRetakes = () => {
    if (unnamedItems.length === 0) return;
    setConfirmModalState({
      isOpen: true,
      title: `Purge ${unnamedItems.length} Photo Retakes?`,
      message: `Are you sure you want to delete all unnamed camera retakes and draft placeholders? Your ${cleanItems.length} cleanly named wardrobe items will be safely preserved.`,
      confirmLabel: 'Purge Retakes',
      isDestructive: true,
      onConfirm: () => {
        unnamedItems.forEach((u) => onDeleteWardrobeItem(u.id));
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        setSelectedCategory('all');
        setSaveToast(`✓ Purged ${unnamedItems.length} unnamed retakes`);
        setTimeout(() => setSaveToast(null), 3000);
      },
    });
  };

  // Multi-keyword deep matching for the catalog preview
  const filteredCatalogItems = React.useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();
    if (!rawQuery) return wardrobe;

    const tokens = rawQuery.split(/\s+/).filter(Boolean);

    return wardrobe.filter((item) => {
      const searchBlob = [
        item.name,
        item.category,
        normalizeCategoryName(item.category),
        item.targetBag,
        item.subType,
        item.notes,
        item.colorHex,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      // Deep keyword matching: all tokens must match
      return tokens.every((token) => searchBlob.includes(token));
    });
  }, [wardrobe, searchQuery]);

  // Group filtered wardrobe items by category for the print catalog
  // CRITICAL: Derives from filtered items so all matched items appear and empty categories hide
  const printCategoryGroups = React.useMemo(() => {
    const map = new Map<string, WardrobeItem[]>();

    // Pre-populate canonical order of default categories
    DEFAULT_WARDROBE_CATEGORIES.forEach((cat) => {
      map.set(cat, []);
    });

    // Map each filtered wardrobe item to its canonical group or custom category
    filteredCatalogItems.forEach((item) => {
      const normCat = normalizeCategoryName(item.category);
      if (!map.has(normCat)) {
        map.set(normCat, []);
      }
      map.get(normCat)!.push(item);
    });

    // Only return non-empty groups
    const groups: { category: string; items: WardrobeItem[]; totalPieces: number }[] = [];
    map.forEach((items, category) => {
      if (items.length > 0) {
        const totalPieces = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
        groups.push({ category, items, totalPieces });
      }
    });

    return groups;
  }, [filteredCatalogItems]);

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

  const handleSaveModal = async (keepOpenForNext = false) => {
    const trimmedName = formName.trim();
    if (!trimmedName) return;

    try {
      let finalPhotoUrl = formPhotoUrl;
      // If photo is a large uncompressed base64 string, compress it to max 400x400 JPEG at 0.6 quality (~15-25KB)
      if (finalPhotoUrl && finalPhotoUrl.startsWith('data:image') && finalPhotoUrl.length > 30000) {
        try {
          finalPhotoUrl = await compressPhotoToMax400(finalPhotoUrl, 400, 0.6);
        } catch {}
      }

      if (editingItem) {
        onUpdateWardrobeItem(editingItem.id, {
          name: trimmedName,
          category: formCategory,
          subType: formCategory === 'Medicine & First Aid' ? formSubType : undefined,
          quantity: formQuantity,
          targetBag: formTargetBag,
          notes: formNotes.trim(),
          photoUrl: finalPhotoUrl,
          colorHex: formColorHex,
        });
      } else {
        onAddWardrobeItem({
          name: trimmedName,
          category: formCategory,
          subType: formCategory === 'Medicine & First Aid' ? formSubType : undefined,
          quantity: formQuantity,
          targetBag: formTargetBag,
          notes: formNotes.trim(),
          photoUrl: finalPhotoUrl,
          colorHex: formColorHex,
          isBought: true,
          isPacked: false,
        });
      }

      setSaveToast('✓ Saved to iPad & Cloud');
      setTimeout(() => setSaveToast(null), 3200);

      if (keepOpenForNext) {
        // Clear name, notes, and photo, but preserve selected category and luggage allocation
        setFormName('');
        setFormNotes('');
        setFormPhotoUrl('');
        setFormQuantity(1);
        setEditingItem(null);
      } else {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormName('');
        setFormNotes('');
        setFormPhotoUrl('');
      }
    } catch (err) {
      console.error('Error saving wardrobe item:', err);
      if (!keepOpenForNext) {
        setIsModalOpen(false);
      }
    }
  };

  // Image Upload with Instant 400x400 Canvas Compression (~15-25KB) + Background Supabase Sync
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      // 1. Instantly compress camera/gallery photo to max 400x400 JPEG on HTML5 canvas
      const compressedDataUrl = await compressPhotoToMax400(file, 400, 0.6);
      setFormPhotoUrl(compressedDataUrl);

      // 2. In parallel background, upload to Supabase Storage
      try {
        const publicUrl = await uploadPhotoToSupabase(file, 'wardrobe');
        if (publicUrl) {
          setFormPhotoUrl(publicUrl);
        }
      } catch (err) {
        console.warn('Supabase upload background fallback (local compressed photo is safe):', err);
      }
    } catch (err) {
      console.error('Photo processing error:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  // Orientation Controls with 400x400 Downscaling
  const handleRotateImage = async (action: 'rotate-left' | 'rotate-right' | 'crop-square') => {
    if (!formPhotoUrl) return;
    try {
      const transformed = await processImageCanvas(formPhotoUrl, action);
      setFormPhotoUrl(transformed);
    } catch (e) {
      console.error('Rotation failed', e);
    }
  };

  // PRINT VIEW: Full-Screen In-App Preview Window with Search & View Mode Switcher
  if (isPrintMode) {
    const totalCatalogPieces = filteredCatalogItems.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

    return (
      <div className="catalog-modal-container fixed inset-0 z-[9999] overflow-y-auto bg-white text-slate-900 flex flex-col">
        {/* Top Sticky Control Bar Inside Full-Screen Preview (Hidden When Printing via @media print) */}
        <div className="no-print sticky top-0 z-50 bg-slate-900 text-white px-3 sm:px-6 py-2.5 shadow-xl border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            {/* Center/Left: Instant Multi-Keyword Search Bar */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs tracking-tight">Catalog</span>
              </div>

              <div className="relative flex-1 min-w-[180px] max-w-xl">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items, colors, patterns, bags (e.g., flower, red, skirt)..."
                  className="w-full bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-8 py-2 border border-slate-700 focus:outline-hidden focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Layout View Switcher Icons + Action Buttons */}
            <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
              {/* 3-Icon Segmented View Switcher */}
              <div className="bg-slate-800 p-0.5 rounded-xl border border-slate-700 flex items-center">
                <button
                  type="button"
                  onClick={() => setCatalogViewMode('detailed')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    catalogViewMode === 'detailed'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Detailed Grid View (5-Column Compact Cards)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden xs:inline">Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogViewMode('list')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    catalogViewMode === 'list'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="List View (Compact High-Density Rows)"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden xs:inline">List</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogViewMode('pictures')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    catalogViewMode === 'pictures'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Pictures-Only View (Pure Photo Matrix)"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden xs:inline">Photos</span>
                </button>
              </div>

              {/* Action Buttons: Print / Save PDF & Close */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                  title="Print or Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                  <span className="sm:hidden">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintMode(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="Close Preview"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Screen Catalog Body Container */}
        <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-5 print:p-0 print:m-0 print:max-w-none print:w-full">
          {/* Minimal Single-Line Print Header (Visible on Paper & Screen) */}
          <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Navini's Packing Catalog
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Physical inventory & suitcase allocation lookbook
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm text-slate-900 font-mono font-bold block">
                {totalCatalogPieces} pieces ({filteredCatalogItems.length} items)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                China Eastern Airlines • Haikou
              </span>
            </div>
          </div>

          {/* Search Results Summary Banner (Screen Only) */}
          {searchQuery.trim() && filteredCatalogItems.length > 0 && (
            <div className="no-print bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2">
              <span>
                Found <strong>{filteredCatalogItems.length}</strong> matching {filteredCatalogItems.length === 1 ? 'item' : 'items'} for "<span className="font-semibold">{searchQuery.trim()}</span>"
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#007AFF] hover:underline font-bold text-xs shrink-0 cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Partitioned Categorized Clothing Photos Grid */}
          {filteredCatalogItems.length === 0 ? (
            searchQuery.trim() ? (
              <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-slate-800">
                  No items matching "{searchQuery.trim()}"
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching for another keyword (e.g., dress, skirt, linen, large, paracetamol, or sky blue).
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl p-8">
                <p className="font-bold text-sm text-slate-800">Your packing list is currently empty</p>
                <p className="text-xs text-slate-500 mt-1">Add items to Luggage & Wardrobe to generate your printable visual catalog.</p>
                <button
                  type="button"
                  onClick={() => setIsPrintMode(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#007AFF] text-white text-xs font-bold cursor-pointer"
                >
                  Back to Wardrobe
                </button>
              </div>
            )
          ) : (
            <div className="space-y-6 pt-1">
              {printCategoryGroups.map(({ category, items, totalPieces: catPieces }) => (
                <div key={category} className="space-y-2.5 print:break-inside-auto">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1 break-after-avoid">
                    <h2 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                      {category} ({catPieces} pcs)
                    </h2>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* 1. VIEW MODE: DETAILED (Default 5-Column Compact Grid) */}
                  {catalogViewMode === 'detailed' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 catalog-print-grid">
                      {items.map((item) => {
                        const visual = getCategoryVisual(item.name, item.category);
                        return (
                          <div
                            key={item.id}
                            className="catalog-print-card rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between shadow-2xs break-inside-avoid hover:border-slate-300 transition-all"
                          >
                            {/* Photo Container */}
                            <div className="catalog-print-image-wrap w-full aspect-square min-h-[90px] max-h-[110px] sm:max-h-[120px] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                              {item.photoUrl ? (
                                <img
                                  src={item.photoUrl}
                                  alt={item.name}
                                  crossOrigin="anonymous"
                                  loading="eager"
                                  className="catalog-print-image w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
                                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                  }}
                                />
                              ) : null}

                              <div
                                className={`fallback-emoji flex flex-col items-center justify-center p-2 text-center w-full h-full ${
                                  item.photoUrl ? 'hidden' : 'flex'
                                }`}
                              >
                                <span className="text-2xl sm:text-3xl mb-0.5">{visual.emoji}</span>
                              </div>

                              {/* Quantity Badge */}
                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white font-mono font-bold text-[9px]">
                                x{item.quantity || 1}
                              </div>

                              {/* Medicine SubType Badge */}
                              {item.subType && (
                                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[8.5px]">
                                  {item.subType}
                                </div>
                              )}
                            </div>

                            {/* Item Details */}
                            <div className="p-2 space-y-0.5 flex-1 flex flex-col justify-between">
                              <div className="catalog-print-title font-bold text-[11px] sm:text-xs text-slate-900 leading-tight line-clamp-2">
                                {item.name}
                              </div>
                              {item.notes && (
                                <div className="text-[9px] text-slate-400 truncate line-clamp-1">
                                  {item.notes}
                                </div>
                              )}
                              <div className="catalog-print-bag text-[9px] sm:text-[10px] text-slate-500 font-mono truncate pt-1 border-t border-slate-100">
                                📍 {item.targetBag}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. VIEW MODE: LIST (Ultra-Compact High-Density Rows) */}
                  {catalogViewMode === 'list' && (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                      {items.map((item) => {
                        const visual = getCategoryVisual(item.name, item.category);
                        return (
                          <div
                            key={item.id}
                            className="catalog-print-card break-inside-avoid p-2 sm:px-3 sm:py-2 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                          >
                            {/* Left: Thumbnail + Title + Notes */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-9 h-9 rounded-lg bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 relative">
                                {item.photoUrl ? (
                                  <img
                                    src={item.photoUrl}
                                    alt={item.name}
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const fb = e.currentTarget.parentElement?.querySelector('.list-fallback-emoji');
                                      if (fb) (fb as HTMLElement).style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <span className={`list-fallback-emoji text-base ${item.photoUrl ? 'hidden' : 'block'}`}>
                                  {visual.emoji}
                                </span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                                    {item.name}
                                  </span>
                                  {item.subType && (
                                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-semibold text-[9px] shrink-0">
                                      {item.subType}
                                    </span>
                                  )}
                                </div>
                                {item.notes && (
                                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Right: Quantity + Target Bag */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                                x{item.quantity || 1}
                              </span>
                              <span className="text-[10px] sm:text-xs text-slate-600 font-mono bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md max-w-[170px] truncate hidden xs:inline-block">
                                📍 {item.targetBag}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. VIEW MODE: PICTURES-ONLY (Tight Photo Matrix) */}
                  {catalogViewMode === 'pictures' && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 catalog-print-grid">
                      {items.map((item) => {
                        const visual = getCategoryVisual(item.name, item.category);
                        return (
                          <div
                            key={item.id}
                            className="catalog-print-card relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group break-inside-avoid hover:border-slate-400 transition-all"
                          >
                            {item.photoUrl ? (
                              <img
                                src={item.photoUrl}
                                alt={item.name}
                                crossOrigin="anonymous"
                                loading="eager"
                                className="catalog-print-image w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fb = e.currentTarget.parentElement?.querySelector('.pic-fallback-emoji');
                                  if (fb) (fb as HTMLElement).style.display = 'flex';
                                }}
                              />
                            ) : null}

                            <div
                              className={`pic-fallback-emoji flex flex-col items-center justify-center p-2 text-center w-full h-full ${
                                item.photoUrl ? 'hidden' : 'flex'
                              }`}
                            >
                              <span className="text-3xl mb-1">{visual.emoji}</span>
                              <span className="text-[9px] font-bold text-slate-600 px-1 truncate max-w-full">
                                {item.name}
                              </span>
                            </div>

                            {/* Quantity Badge */}
                            <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white font-mono font-bold text-[9px] shadow-xs">
                              x{item.quantity || 1}
                            </div>

                            {/* Medicine SubType Badge */}
                            {item.subType && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[8.5px] shadow-xs">
                                {item.subType}
                              </div>
                            )}

                            {/* Bottom Title & Bag Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-1.5 pt-4 text-white pointer-events-none">
                              <div className="text-[10px] font-bold leading-tight line-clamp-1 drop-shadow-xs">
                                {item.name}
                              </div>
                              <div className="text-[8.5px] text-slate-300 font-mono truncate">
                                📍 {item.targetBag}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200 pb-16">
      {/* FLOATING SAVE TOAST */}
      {saveToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100000] bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{saveToast}</span>
        </div>
      )}

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
          {/* Multi-Select Toggle Button (Requirement #6.3) */}
          <button
            type="button"
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds(new Set());
            }}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
              isSelectionMode
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{isSelectionMode ? 'Done Selecting' : '☑️ Select Multiple'}</span>
          </button>

          {/* Catalog / Print Button */}
          <button
            type="button"
            onClick={() => setIsPrintMode(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Catalog / Print</span>
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

      {/* 2. CATEGORY PILLS (Horizontal Scrolling, Starting Immediately without Summary Card) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All ({cleanItems.length})
        </button>

        {allCategories.map((cat) => {
          const normCat = normalizeCategoryName(cat);
          const count = cleanItems.filter((w) => normalizeCategoryName(w.category) === normCat || w.category === cat).length;
          const isActive = selectedCategory === cat || (selectedCategory !== 'all' && selectedCategory !== 'unnamed' && normalizeCategoryName(selectedCategory) === normCat);
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

        {/* ⚠️ Unnamed / Retakes Filter Pill (Requirement #4.2) */}
        {unnamedItems.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedCategory('unnamed')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'unnamed'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <span>⚠️ Unnamed / Retakes</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === 'unnamed' ? 'bg-white/20 text-white' : 'bg-amber-200/80 text-amber-900'
              }`}
            >
              {unnamedItems.length}
            </span>
          </button>
        )}

        {/* 🧹 Auto-Hide / Purge Retakes & Duplicates Button (Requirement #4.2) */}
        {unnamedItems.length > 0 && (
          <button
            type="button"
            onClick={handlePurgeRetakes}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition-all cursor-pointer"
            title="Purge all unnamed photo retakes"
          >
            <span>🧹 Purge Retakes ({unnamedItems.length})</span>
          </button>
        )}

        {/* ⚙️ Manage Categories Editor Button (Requirement #3) */}
        <button
          type="button"
          onClick={() => setIsManageCategoriesOpen(true)}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
          title="Manage, rename, or delete categories"
        >
          <Settings2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Manage Categories</span>
        </button>
      </div>

      {/* 3. 2-COLUMN SQUARE PHOTO GRID FOR WARDROBE ITEMS (iOS Visual Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayedItems.map((item) => {
          const visual = getCategoryVisual(item.name, item.category);
          const isPacked = item.isPacked;
          const isSelected = selectedIds.has(item.id);

          return (
            <div
              key={item.id}
              className={`ios-card p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between transition-all border shadow-xs relative ${
                isSelected
                  ? 'ring-2 ring-[#007AFF] border-[#007AFF] bg-blue-50/20'
                  : isPacked
                  ? 'bg-emerald-50/25 border-emerald-400 shadow-sm'
                  : 'bg-white border-black/10 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Large Square Photo (aspect-square, rounded-[14px]) */}
                <div className="w-full aspect-square rounded-[14px] bg-slate-100 border border-black/5 overflow-hidden flex items-center justify-center relative group">
                  {/* Multi-Select Checkbox Badge */}
                  {isSelectionMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectionId(item.id);
                      }}
                      className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isSelected ? 'bg-[#007AFF] text-white' : 'bg-white/90 text-slate-400 border border-black/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  )}

                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{visual.emoji}</span>
                  )}

                  {/* Quantity Badge in Corner */}
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white font-mono font-bold text-[10px] shadow-2xs">
                    x{item.quantity || 1}
                  </span>

                  {/* Medicine SubType Badge */}
                  {item.subType && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-600 text-white font-bold text-[9px] shadow-2xs">
                      {item.subType}
                    </span>
                  )}

                  {/* Quick photo change on hover */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    title="Edit photo"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                {/* Inline Editable Item Name (Requirement #6.3) */}
                {inlineEditingId === item.id ? (
                  <div className="mt-2 flex items-center gap-1">
                    <input
                      type="text"
                      value={inlineEditingTitle}
                      onChange={(e) => setInlineEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveInlineTitle(item.id);
                        if (e.key === 'Escape') setInlineEditingId(null);
                      }}
                      className="flex-1 px-2 py-1 text-xs border border-[#007AFF] rounded-lg bg-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveInlineTitle(item.id)}
                      className="px-2 py-1 bg-[#007AFF] text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-start justify-between gap-1 group/title">
                    <h3
                      onClick={() => {
                        setInlineEditingId(item.id);
                        setInlineEditingTitle(item.name);
                      }}
                      className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight leading-snug line-clamp-2 cursor-pointer hover:text-[#007AFF] transition-colors"
                      title="Tap to rename inline"
                    >
                      {item.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setInlineEditingId(item.id);
                        setInlineEditingTitle(item.name);
                      }}
                      className="text-slate-400 hover:text-[#007AFF] p-0.5 opacity-60 group-hover/title:opacity-100 transition-opacity cursor-pointer shrink-0"
                      title="Rename item inline"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Assigned Bag Pill (Clean canonical bag) */}
                <div className="mt-1 text-[10px] font-mono text-slate-600 truncate bg-slate-100 px-2 py-0.5 rounded-md inline-block max-w-full">
                  📍 {normalizeBagLocation(item.targetBag)}
                </div>
              </div>

              {/* 2-State Packed Toggle Pill & Action Icons (Requirement #1 & #2) */}
              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => onToggleWardrobePacked(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isPacked
                      ? 'bg-[#16A34A] text-white hover:bg-[#15803D]'
                      : 'border border-slate-300 hover:border-slate-400 bg-white text-slate-700'
                  }`}
                >
                  <span>{isPacked ? '✓ Packed' : '○ To Pack'}</span>
                </button>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Edit item"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmModalState({
                        isOpen: true,
                        title: 'Delete Item?',
                        message: `Are you sure you want to remove "${item.name}" from your wardrobe?`,
                        confirmLabel: 'Delete',
                        isDestructive: true,
                        onConfirm: () => {
                          onDeleteWardrobeItem(item.id);
                          setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                        },
                      });
                    }}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3 h-3" />
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

              {/* Category Dropdown with + Add Custom... (Requirement #3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold text-xs">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsManageCategoriesOpen(true)}
                      className="text-[11px] text-[#007AFF] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span>Manage</span>
                    </button>
                  </div>
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

                {/* Target Suitcase / Location (Requirement #3) */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Location / Bag
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
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
              {editingItem ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModalState({
                      isOpen: true,
                      title: 'Delete Item?',
                      message: `Are you sure you want to remove "${editingItem.name}" from your wardrobe?`,
                      confirmLabel: 'Delete',
                      isDestructive: true,
                      onConfirm: () => {
                        onDeleteWardrobeItem(editingItem.id);
                        setIsModalOpen(false);
                        setEditingItem(null);
                        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Item</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                {!editingItem && (
                  <button
                    type="button"
                    onClick={() => handleSaveModal(true)}
                    disabled={!formName.trim()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 disabled:opacity-50 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="Save current item and keep form open to quickly add another"
                  >
                    <span>+ Save & Add Another</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveModal(false)}
                  disabled={!formName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#007AFF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>✓ Save Changes</span>
                </button>
              </div>
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

      {/* 7. FLOATING BATCH ACTIONS BAR (Requirement #6.3) */}
      {isSelectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-3 border border-slate-700 flex flex-wrap items-center justify-between gap-2.5 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#007AFF] text-white font-mono font-bold text-xs">
              {selectedIds.size} Selected
            </span>
            <button
              type="button"
              onClick={() => handleToggleSelectAll(displayedItems)}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              {selectedIds.size === displayedItems.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Mark Packed */}
            <button
              type="button"
              onClick={() => handleBulkMarkPacked(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>✓ Packed</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkMarkPacked(false)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>○ To Pack</span>
            </button>

            {/* Quick Bag Change */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkChangeBag(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              <option value="" disabled>Move Bag...</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Quick Category Change */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkChangeCategory(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              <option value="" disabled>Category...</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Bulk Delete */}
            <button
              type="button"
              onClick={handleTriggerBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM IN-APP iOS FROSTED-GLASS CONFIRMATION MODAL (Requirement #1) */}
      <IOSConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmLabel={confirmModalState.confirmLabel || 'Delete'}
        isDestructive={confirmModalState.isDestructive !== false}
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* MANAGE CATEGORIES MODAL (Requirement #3) */}
      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        categories={allCategories}
        wardrobe={wardrobe}
        onAddCategory={(newCat) => {
          onAddCustomCategory?.(newCat);
          setSaveToast(`✓ Added category "${newCat}"`);
          setTimeout(() => setSaveToast(null), 3000);
        }}
        onRenameCategory={(oldCat, newCat) => {
          onRenameCategory?.(oldCat, newCat);
          setSaveToast(`✓ Renamed "${oldCat}" to "${newCat}"`);
          setTimeout(() => setSaveToast(null), 3000);
        }}
        onDeleteCategory={(cat) => {
          onDeleteCustomCategory?.(cat);
          setSaveToast(`✓ Deleted category "${cat}"`);
          setTimeout(() => setSaveToast(null), 3000);
        }}
      />
    </div>
  );
};
