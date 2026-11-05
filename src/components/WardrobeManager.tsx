import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { WardrobeItem } from '../data';

interface WardrobeManagerProps {
  items: WardrobeItem[];
  onToggleBought: (id: string) => void;
  onTogglePacked: (id: string) => void;
  onAddItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onUpdateItem: (id: string, updated: Partial<WardrobeItem>) => void;
  onDeleteItem: (id: string) => void;
}

export const WardrobeManager: React.FC<WardrobeManagerProps> = ({
  items,
  onToggleBought,
  onTogglePacked,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // New item creation state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [targetBag, setTargetBag] = useState('Main Suitcase (30×40×70cm)');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // In-line editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTargetBag, setEditTargetBag] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);
  const [editNotes, setEditNotes] = useState('');

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Essentials', 'Luggage'];
  const bagOptions = [
    'Main Suitcase (30×40×70cm)',
    'Medium Suitcase (27×41×57cm)',
    'Cabin Laptop Backpack',
    'Fanny Pack (Chest)',
    'Wear on Flight',
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

  const handleCancelEdit = () => {
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
  const boughtCount = items.filter((i) => i.isBought).length;
  const packedCount = items.filter((i) => i.isPacked).length;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Wardrobe & Packing Inventory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Excel-style editable inventory with dual checkboxes. Click edit to alter existing items or reassign luggage.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded border border-slate-200 bg-slate-50">
            <span className="text-slate-500">Total:</span>{' '}
            <strong className="font-mono text-slate-800">{totalItems}</strong>
          </div>
          <div className="px-3 py-1.5 rounded border border-slate-200 bg-slate-50">
            <span className="text-slate-500">Ready/Bought:</span>{' '}
            <strong className="font-mono text-emerald-700">{boughtCount}/{totalItems}</strong>
          </div>
          <div className="px-3 py-1.5 rounded border border-blue-200 bg-blue-50">
            <span className="text-blue-700">Packed:</span>{' '}
            <strong className="font-mono text-[#003580]">{packedCount}/{totalItems}</strong>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
              activeCategory === cat
                ? 'border-[#003580] text-[#003580] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add New Item Row Form */}
      <form
        onSubmit={handleAddSubmit}
        className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs"
      >
        <div className="flex-1 min-w-[180px]">
          <input
            type="text"
            placeholder="Item name (e.g., Food science white lab coat)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-2.5 py-2 border border-slate-300 rounded bg-white text-slate-700"
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
          onChange={(e) => setTargetBag(e.target.value)}
          className="px-2.5 py-2 border border-slate-300 rounded bg-white text-slate-700 max-w-[200px]"
        >
          {bagOptions.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-14 px-2 py-2 border border-slate-300 rounded bg-white text-slate-800 text-center font-mono"
          title="Quantity"
        />

        <input
          type="text"
          placeholder="Notes / instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-36 px-2.5 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 hidden sm:block"
        />

        <button
          type="submit"
          className="px-3.5 py-2 bg-[#003580] hover:bg-[#00224f] text-white font-medium rounded flex items-center gap-1 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Spreadsheet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3 w-16 text-center">Packed</th>
              <th className="py-2.5 px-3 w-16 text-center">Ready</th>
              <th className="py-2.5 px-3 min-w-[180px]">Item Description</th>
              <th className="py-2.5 px-3 w-28">Category</th>
              <th className="py-2.5 px-3 min-w-[160px]">Target Bag</th>
              <th className="py-2.5 px-3 w-14 text-center">Qty</th>
              <th className="py-2.5 px-3 min-w-[150px]">Notes</th>
              <th className="py-2.5 px-2 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const isEditing = editingId === item.id;

              if (isEditing) {
                return (
                  <tr key={item.id} className="bg-blue-50/40">
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        disabled
                        className="w-4 h-4 rounded opacity-50"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.isBought}
                        disabled
                        className="w-4 h-4 rounded opacity-50"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 border border-blue-400 rounded bg-white text-xs font-medium"
                        autoFocus
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-1.5 py-1 border border-blue-400 rounded bg-white text-xs"
                      >
                        <option value="Dresses">Dresses</option>
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Essentials">Essentials</option>
                        <option value="Luggage">Luggage</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={editTargetBag}
                        onChange={(e) => setEditTargetBag(e.target.value)}
                        className="w-full px-1.5 py-1 border border-blue-400 rounded bg-white text-xs"
                      >
                        {bagOptions.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                        className="w-12 px-1 py-1 border border-blue-400 rounded bg-white text-xs text-center font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full px-2 py-1 border border-blue-400 rounded bg-white text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="p-1 text-emerald-700 hover:bg-emerald-100 rounded mr-1"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-slate-500 hover:bg-slate-200 rounded"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    item.isPacked ? 'bg-slate-50/40 text-slate-400' : ''
                  }`}
                >
                  {/* Upfront Checkbox 1: Packed */}
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.isPacked}
                      onChange={() => onTogglePacked(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                      title="Packed in Luggage"
                    />
                  </td>

                  {/* Upfront Checkbox 2: Ready / Bought */}
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.isBought}
                      onChange={() => onToggleBought(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                      title="Purchased / Ready at Home"
                    />
                  </td>

                  {/* Description */}
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    <span className={item.isPacked ? 'line-through text-slate-400' : ''}>
                      {item.name}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  {/* Target Bag with specific dimensions */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                    {item.targetBag}
                  </td>

                  {/* Quantity */}
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                    {item.quantity}
                  </td>

                  {/* Notes */}
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {item.notes || '—'}
                  </td>

                  {/* Action buttons: Edit + Delete */}
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="text-slate-500 hover:text-[#003580] p-1 rounded hover:bg-slate-100 transition-colors mr-1"
                      title="Edit this item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
