import React, { useState } from 'react';
import {
  X,
  Check,
  Plus,
  Trash2,
  Edit3,
  Luggage,
  Package,
  FileText,
  Smartphone,
  Shirt,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  BagAsset,
  WardrobeItem,
  GiftItem,
  DeviceAsset,
  DocumentItem,
  isItemInBag,
} from '../data';
import { DynamicSelect } from './DynamicSelect';
import { IOSConfirmModal } from './IOSConfirmModal';

interface LuggageContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bag: BagAsset | null;
  bags?: BagAsset[];
  wardrobe?: WardrobeItem[];
  wardrobeItems?: WardrobeItem[];
  gifts?: GiftItem[];
  giftItems?: GiftItem[];
  devices?: DeviceAsset[];
  deviceItems?: DeviceAsset[];
  documents?: DocumentItem[];
  documentItems?: DocumentItem[];
  locationOptions?: string[];
  wardrobeCategories?: string[];
  onAddCustomLocation?: (name: string) => void;
  onAddCustomCategory?: (cat: string) => void;
  onToggleWardrobePacked?: (id: string) => void;
  onToggleGiftPacked?: (id: string) => void;
  onToggleDevicePacked?: (id: string) => void;
  onToggleDocPacked?: (id: string) => void;
  onUpdateWardrobeItem?: (id: string, partial: Partial<WardrobeItem>) => void;
  onUpdateGift?: (id: string, partial: Partial<GiftItem>) => void;
  onUpdateDevice?: (id: string, partial: Partial<DeviceAsset>) => void;
  onUpdateDoc?: (id: string, partial: Partial<DocumentItem>) => void;
  onDeleteWardrobeItem?: (id: string) => void;
  onDeleteGift?: (id: string) => void;
  onDeleteDevice?: (id: string) => void;
  onDeleteDoc?: (id: string) => void;
  onAddWardrobeItem?: (item: Omit<WardrobeItem, 'id'>) => void;
  onAddGift?: (item: Omit<GiftItem, 'id'>) => void;
  onAddDevice?: (item: Omit<DeviceAsset, 'id'>) => void;
  onAddDoc?: (item: Omit<DocumentItem, 'id'>) => void;
  renderBagIcon?: (kind: any, sizeClass?: string, title?: string) => React.ReactNode;
}

export const LuggageContentsModal: React.FC<LuggageContentsModalProps> = ({
  isOpen,
  onClose,
  bag,
  bags = [],
  wardrobe = [],
  wardrobeItems,
  gifts = [],
  giftItems,
  devices = [],
  deviceItems,
  documents = [],
  documentItems,
  locationOptions = [],
  wardrobeCategories = [],
  onAddCustomLocation = () => {},
  onAddCustomCategory = () => {},
  onToggleWardrobePacked = () => {},
  onToggleGiftPacked = () => {},
  onToggleDevicePacked = () => {},
  onToggleDocPacked = () => {},
  onUpdateWardrobeItem = () => {},
  onUpdateGift = () => {},
  onUpdateDevice = () => {},
  onUpdateDoc = () => {},
  onDeleteWardrobeItem,
  onDeleteGift,
  onDeleteDevice,
  onDeleteDoc,
  onAddWardrobeItem = () => {},
  onAddGift = () => {},
  onAddDevice = () => {},
  onAddDoc = () => {},
  renderBagIcon,
}) => {
  const activeWardrobe = wardrobeItems || wardrobe;
  const activeGifts = giftItems || gifts;
  const activeDevices = deviceItems || devices;
  const activeDocs = documentItems || documents;
  const activeRenderBagIcon = renderBagIcon || (() => <Luggage className="w-6 h-6 text-slate-700" />);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'wardrobe' | 'gifts' | 'devices' | 'docs'>('all');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemName, setEditingItemName] = useState('');

  // Quick Add Form State
  const [quickAddType, setQuickAddType] = useState<'wardrobe' | 'gift' | 'device' | 'doc'>('wardrobe');
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState('Tops');
  const [quickAddQty, setQuickAddQty] = useState(1);
  const [quickAddNotes, setQuickAddNotes] = useState('');

  // Custom iOS In-App Confirm Dialog state
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

  if (!isOpen || !bag) return null;

  // Cross-portal inventory querying for this bag
  const bagWardrobe = activeWardrobe.filter((w) => isItemInBag(w.targetBag, bag));
  const bagGifts = activeGifts.filter((g) => isItemInBag(g.targetBag, bag));
  const bagDevices = activeDevices.filter((d) => isItemInBag(d.carryLocation, bag));
  const bagDocs = activeDocs.filter((doc) => isItemInBag(doc.carryLocation, bag));

  const totalItems = bagWardrobe.length + bagGifts.length + bagDevices.length + bagDocs.length;
  const packedItems =
    bagWardrobe.filter((w) => w.isPacked).length +
    bagGifts.filter((g) => g.isPacked).length +
    bagDevices.filter((d) => d.isPacked).length +
    bagDocs.filter((doc) => doc.isPacked).length;

  const bagProgress = Math.round((packedItems / (totalItems || 1)) * 100);

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingItemId(id);
    setEditingItemName(currentName);
  };

  const handleSaveEdit = (type: 'wardrobe' | 'gift' | 'device' | 'doc', id: string) => {
    if (!editingItemName.trim()) {
      setEditingItemId(null);
      return;
    }
    const name = editingItemName.trim();
    if (type === 'wardrobe') onUpdateWardrobeItem(id, { name });
    else if (type === 'gift') onUpdateGift(id, { name });
    else if (type === 'device') onUpdateDevice(id, { name });
    else if (type === 'doc') onUpdateDoc(id, { title: name });
    setEditingItemId(null);
  };

  const handleReassignLocation = (
    type: 'wardrobe' | 'gift' | 'device' | 'doc',
    id: string,
    newLocation: string
  ) => {
    if (type === 'wardrobe') onUpdateWardrobeItem(id, { targetBag: newLocation });
    else if (type === 'gift') onUpdateGift(id, { targetBag: newLocation });
    else if (type === 'device') onUpdateDevice(id, { carryLocation: newLocation });
    else if (type === 'doc') onUpdateDoc(id, { carryLocation: newLocation });
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddName.trim()) return;

    try {
      const assignedLoc = bag.name;

      if (quickAddType === 'wardrobe') {
        onAddWardrobeItem({
          name: quickAddName.trim(),
          category: quickAddCategory,
          quantity: Math.max(1, quickAddQty),
          targetBag: assignedLoc,
          isBought: true,
          isPacked: false,
          notes: quickAddNotes.trim() || undefined,
        });
      } else if (quickAddType === 'gift') {
        onAddGift({
          name: quickAddName.trim(),
          quantity: Math.max(1, quickAddQty),
          targetBag: assignedLoc,
          recipient: quickAddNotes.trim() || 'Professors & Campus Buddies',
          packagingNote: 'Pack safely in ' + bag.name,
          isPacked: false,
        });
      } else if (quickAddType === 'device') {
        onAddDevice({
          name: quickAddName.trim(),
          model: quickAddNotes.trim() || 'Portable Hardware',
          role: 'Essential academic & travel tech',
          carrierOrOs: 'Hardware',
          carryLocation: assignedLoc,
          isBought: true,
          isPacked: false,
          type: 'phone-ios',
        });
      } else if (quickAddType === 'doc') {
        onAddDoc({
          title: quickAddName.trim(),
          issuer: quickAddNotes.trim() || 'Official Document',
          carryLocation: assignedLoc,
          isReady: true,
          isPacked: false,
          priority: 'High',
          notes: 'Assigned to ' + bag.name,
        });
      }
    } catch (err) {
      console.error('Error adding item to bag:', err);
    } finally {
      setQuickAddName('');
      setQuickAddNotes('');
      setQuickAddQty(1);
      setShowQuickAdd(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-xl max-h-[90vh] bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-black/10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. STICKY HEADER */}
        <div className="bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-black/10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-1 rounded-xl bg-[#F2F2F7] border border-black/5 flex items-center justify-center shrink-0">
                {activeRenderBagIcon(bag.kind, 'w-10 h-14', bag.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 truncate">
                    {bag.name}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#007AFF] shrink-0">
                    {bag.dimensions}
                  </span>
                </div>
                <p className="text-xs text-[#8E8E93] mt-0.5 truncate">
                  Weight Limit: <strong className="text-slate-800">{bag.weightLimit}</strong> • {bag.type}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#F2F2F7] text-slate-500 hover:text-slate-800 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Tracker */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">
                {packedItems} of {totalItems} items packed in this bag
              </span>
              <span className="text-[#007AFF]">{bagProgress}%</span>
            </div>
            <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#007AFF] h-full rounded-full transition-all duration-300"
                style={{ width: `${bagProgress}%` }}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'bg-[#F2F2F7] text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({totalItems})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('wardrobe')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === 'wardrobe'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-[#F2F2F7] text-slate-600 hover:bg-slate-200'
              }`}
            >
              👗 Wardrobe ({bagWardrobe.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('gifts')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === 'gifts'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-[#F2F2F7] text-slate-600 hover:bg-slate-200'
              }`}
            >
              🎁 Gifts ({bagGifts.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('devices')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === 'devices'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#F2F2F7] text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚡ Tech ({bagDevices.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('docs')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === 'docs'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-[#F2F2F7] text-slate-600 hover:bg-slate-200'
              }`}
            >
              📄 Docs ({bagDocs.length})
            </button>
          </div>
        </div>

        {/* 2. SCROLLABLE CONTENTS LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {totalItems === 0 && (
            <div className="ios-card p-6 text-center space-y-2 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center text-2xl mx-auto shadow-2xs">
                🧳
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                No items packed in this bag yet
              </h3>
              <p className="text-xs text-[#8E8E93] max-w-sm mx-auto">
                Use the button below to add an item directly into {bag.name}, or reassign items from other bags.
              </p>
            </div>
          )}

          {/* A. Wardrobe Items */}
          {(selectedFilter === 'all' || selectedFilter === 'wardrobe') &&
            bagWardrobe.map((item) => {
              const isEditing = editingItemId === item.id;
              return (
                <div
                  key={item.id}
                  className="ios-card p-3 sm:p-3.5 bg-white space-y-2 hover:border-[#007AFF]/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Packed Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleWardrobePacked(item.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0 ${
                        item.isPacked
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                      }`}
                    >
                      {item.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingItemName}
                            onChange={(e) => setEditingItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit('wardrobe', item.id)}
                            className="flex-1 px-2.5 py-1 text-xs border border-[#007AFF] rounded-lg bg-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit('wardrobe', item.id)}
                            className="px-2 py-1 bg-[#007AFF] text-white rounded-lg text-xs font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item.id, item.name)}
                            className="text-[#8E8E93] hover:text-[#007AFF] p-0.5 cursor-pointer"
                            title="Edit name"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E93] mt-0.5 flex-wrap">
                        <span className="font-semibold text-slate-700">Qty: {item.quantity}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-pink-50 text-pink-700 font-medium">
                          {item.category}
                        </span>
                        {item.notes && (
                          <>
                            <span>•</span>
                            <span className="truncate italic max-w-[180px]">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {onDeleteWardrobeItem && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Delete Item?',
                            message: `Are you sure you want to remove "${item.name}" from ${bag.name}?`,
                            onConfirm: () => {
                              onDeleteWardrobeItem(item.id);
                              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                            },
                          });
                        }}
                        className="text-slate-300 hover:text-[#FF3B30] p-1 transition-colors cursor-pointer shrink-0"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Reassign Bag Dropdown */}
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="text-[#8E8E93] text-[11px]">Assigned Location:</span>
                    <div className="w-56">
                      <DynamicSelect
                        value={item.targetBag}
                        options={locationOptions}
                        onChange={(newLoc) => handleReassignLocation('wardrobe', item.id, newLoc)}
                        onAddCustom={onAddCustomLocation}
                        addCustomLabel="+ Add Custom Bag..."
                        selectClassName="py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          {/* B. Gift Items */}
          {(selectedFilter === 'all' || selectedFilter === 'gifts') &&
            bagGifts.map((gift) => {
              const isEditing = editingItemId === gift.id;
              return (
                <div
                  key={gift.id}
                  className="ios-card p-3 sm:p-3.5 bg-white space-y-2 hover:border-[#007AFF]/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => onToggleGiftPacked(gift.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0 ${
                        gift.isPacked
                          ? 'bg-[#007AFF] text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                      }`}
                    >
                      {gift.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingItemName}
                            onChange={(e) => setEditingItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit('gift', gift.id)}
                            className="flex-1 px-2.5 py-1 text-xs border border-[#007AFF] rounded-lg bg-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit('gift', gift.id)}
                            className="px-2 py-1 bg-[#007AFF] text-white rounded-lg text-xs font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {gift.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(gift.id, gift.name)}
                            className="text-[#8E8E93] hover:text-[#007AFF] p-0.5 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E93] mt-0.5 flex-wrap">
                        <span className="font-semibold text-slate-700">Qty: {gift.quantity}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 font-medium">
                          For: {gift.recipient}
                        </span>
                      </div>
                    </div>

                    {onDeleteGift && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Delete Gift?',
                            message: `Are you sure you want to remove "${gift.name}"?`,
                            onConfirm: () => {
                              onDeleteGift(gift.id);
                              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                            },
                          });
                        }}
                        className="text-slate-300 hover:text-[#FF3B30] p-1 transition-colors cursor-pointer shrink-0"
                        title="Delete gift"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="text-[#8E8E93] text-[11px]">Assigned Location:</span>
                    <div className="w-56">
                      <DynamicSelect
                        value={gift.targetBag}
                        options={locationOptions}
                        onChange={(newLoc) => handleReassignLocation('gift', gift.id, newLoc)}
                        onAddCustom={onAddCustomLocation}
                        addCustomLabel="+ Add Custom Bag..."
                        selectClassName="py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          {/* C. Connected Electronics */}
          {(selectedFilter === 'all' || selectedFilter === 'devices') &&
            bagDevices.map((device) => (
              <div
                key={device.id}
                className="ios-card p-3 sm:p-3.5 bg-white space-y-2 hover:border-[#007AFF]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleDevicePacked(device.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0 ${
                      device.isPacked
                        ? 'bg-[#007AFF] text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                    }`}
                  >
                    {device.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {device.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E93] mt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-700">{device.model}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                        {device.carrierOrOs}
                      </span>
                    </div>
                  </div>

                  {onDeleteDevice && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Delete Device?',
                          message: `Are you sure you want to remove "${device.name}" from your packing list?`,
                          onConfirm: () => {
                            onDeleteDevice(device.id);
                            setConfirmModal(prev => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="text-slate-300 hover:text-[#FF3B30] p-1 transition-colors cursor-pointer shrink-0"
                      title="Delete device"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93] text-[11px]">Assigned Location:</span>
                  <div className="w-56">
                    <DynamicSelect
                      value={device.carryLocation}
                      options={locationOptions}
                      onChange={(newLoc) => handleReassignLocation('device', device.id, newLoc)}
                      onAddCustom={onAddCustomLocation}
                      addCustomLabel="+ Add Custom Bag..."
                      selectClassName="py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}

          {/* D. Documents */}
          {(selectedFilter === 'all' || selectedFilter === 'docs') &&
            bagDocs.map((doc) => (
              <div
                key={doc.id}
                className="ios-card p-3 sm:p-3.5 bg-white space-y-2 hover:border-[#007AFF]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleDocPacked(doc.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0 ${
                      doc.isPacked
                        ? 'bg-[#007AFF] text-white shadow-xs'
                        : 'border-2 border-slate-300 hover:border-[#007AFF] bg-white'
                    }`}
                  >
                    {doc.isPacked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E93] mt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-700">{doc.issuer}</span>
                      <span>•</span>
                      <span className={`px-1.5 py-0.2 rounded-md font-medium ${doc.priority === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                        {doc.priority}
                      </span>
                    </div>
                  </div>

                  {onDeleteDoc && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: 'Delete Document?',
                          message: `Are you sure you want to remove "${doc.title}" from your packing list?`,
                          onConfirm: () => {
                            onDeleteDoc(doc.id);
                            setConfirmModal(prev => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="text-slate-300 hover:text-[#FF3B30] p-1 transition-colors cursor-pointer shrink-0"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className="text-[#8E8E93] text-[11px]">Assigned Location:</span>
                  <div className="w-56">
                    <DynamicSelect
                      value={doc.carryLocation}
                      options={locationOptions}
                      onChange={(newLoc) => handleReassignLocation('doc', doc.id, newLoc)}
                      onAddCustom={onAddCustomLocation}
                      addCustomLabel="+ Add Custom Bag..."
                      selectClassName="py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 3. QUICK ADD ITEM ACCORDION / FOOTER */}
        <div className="bg-white border-t border-black/10 p-3.5 sm:p-4 shrink-0 space-y-2.5">
          <button
            type="button"
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="w-full py-2 px-3 rounded-xl bg-[#007AFF]/10 text-[#007AFF] font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:bg-[#007AFF]/15 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item Directly to {bag.name}</span>
            {showQuickAdd ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>

          {showQuickAdd && (
            <form onSubmit={handleQuickAddSubmit} className="space-y-3 pt-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-1 bg-[#F2F2F7] p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setQuickAddType('wardrobe')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    quickAddType === 'wardrobe' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  👗 Wardrobe
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddType('gift')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    quickAddType === 'gift' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  🎁 Gift
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddType('device')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    quickAddType === 'device' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  ⚡ Tech
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddType('doc')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    quickAddType === 'doc' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  📄 Doc
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Item Name</label>
                  <input
                    type="text"
                    value={quickAddName}
                    onChange={(e) => setQuickAddName(e.target.value)}
                    placeholder="e.g. Travel Cardigan, Adapter"
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#F2F2F7] border border-black/10 focus:outline-[#007AFF]"
                    required
                  />
                </div>

                {quickAddType === 'wardrobe' ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Category</label>
                    <DynamicSelect
                      value={quickAddCategory}
                      options={wardrobeCategories}
                      onChange={setQuickAddCategory}
                      onAddCustom={onAddCustomCategory}
                      addCustomLabel="+ Add Custom Category..."
                      selectClassName="py-1.5 text-xs bg-[#F2F2F7]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      {quickAddType === 'gift' ? 'Recipient' : quickAddType === 'device' ? 'Model / Specs' : 'Issuer / Authority'}
                    </label>
                    <input
                      type="text"
                      value={quickAddNotes}
                      onChange={(e) => setQuickAddNotes(e.target.value)}
                      placeholder={quickAddType === 'gift' ? 'e.g. Buddy' : 'e.g. Official / Specs'}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#F2F2F7] border border-black/10 focus:outline-[#007AFF]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#8E8E93]">
                  Will be assigned to <strong className="text-slate-700">{bag.name}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="px-3 py-1.5 text-xs text-[#8E8E93] hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-[#007AFF] text-white text-xs font-semibold shadow-xs hover:bg-[#007AFF]/90"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
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
