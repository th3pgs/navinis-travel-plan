import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { WardrobeItem } from '../data';

interface WardrobeManagerProps {
  items: WardrobeItem[];
  onToggleBought: (id: string) => void;
  onTogglePacked: (id: string) => void;
  onAddItem: (item: Omit<WardrobeItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

export const WardrobeManager: React.FC<WardrobeManagerProps> = ({
  items,
  onToggleBought,
  onTogglePacked,
  onAddItem,
  onDeleteItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dresses');
  const [targetBag, setTargetBag] = useState('65cm Main Suitcase');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Essentials', 'Luggage'];

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
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Wardrobe & Luggage Packing Inventory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured itemized list with easy upfront checkboxes for verification and packing status
          </p>
        </div>

        {/* Excel-style summary statistics */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="border border-slate-200 px-3 py-1.5 rounded bg-slate-50">
            <span className="text-slate-500">Total Items:</span>{' '}
            <strong className="text-slate-800 font-mono">{totalItems}</strong>
          </div>
          <div className="border border-slate-200 px-3 py-1.5 rounded bg-slate-50">
            <span className="text-slate-500">Purchased / Ready:</span>{' '}
            <strong className="text-slate-800 font-mono">{boughtCount}/{totalItems}</strong>
          </div>
          <div className="border border-slate-200 px-3 py-1.5 rounded bg-slate-50">
            <span className="text-slate-500">Packed in Luggage:</span>{' '}
            <strong className="text-[#003580] font-mono font-bold">{packedCount}/{totalItems}</strong>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold">
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

      {/* Add Item Row (Excel entry form format) */}
      <form onSubmit={handleAddSubmit} className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          placeholder="Item name (e.g., Food science lab coat)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003580]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded bg-white text-slate-700"
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
          className="px-3 py-2 border border-slate-300 rounded bg-white text-slate-700"
        >
          <option value="65cm Main Suitcase">65cm Main Suitcase</option>
          <option value="58cm Medium Suitcase">58cm Medium Suitcase</option>
          <option value="Carry-On Laptop Backpack">Carry-On Laptop Backpack</option>
          <option value="Wear on Flight">Wear on Flight</option>
          <option value="Worn on Body">Worn on Body</option>
        </select>

        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-16 px-2 py-2 border border-slate-300 rounded bg-white text-slate-800 text-center font-mono"
          title="Quantity"
        />

        <input
          type="text"
          placeholder="Notes / instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-48 px-3 py-2 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 hidden sm:block"
        />

        <button
          type="submit"
          className="px-3.5 py-2 bg-[#003580] hover:bg-[#00224f] text-white font-medium rounded flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Structured Excel-Style Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3 w-16 text-center">Packed</th>
              <th className="py-2.5 px-3 w-16 text-center">Ready</th>
              <th className="py-2.5 px-3">Item Description</th>
              <th className="py-2.5 px-3 w-28">Category</th>
              <th className="py-2.5 px-3 w-44">Target Bag</th>
              <th className="py-2.5 px-3 w-14 text-center">Qty</th>
              <th className="py-2.5 px-3">Notes</th>
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item, idx) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50 transition-colors ${
                  item.isPacked ? 'bg-slate-50/50' : ''
                }`}
              >
                {/* 1. FRONT TICK: PACKED */}
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.isPacked}
                    onChange={() => onTogglePacked(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#003580] focus:ring-[#003580] cursor-pointer"
                    title="Mark as Packed"
                  />
                </td>

                {/* 2. FRONT TICK: READY/BOUGHT */}
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={item.isBought}
                    onChange={() => onToggleBought(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                    title="Mark as Purchased / Ready"
                  />
                </td>

                {/* Item Name */}
                <td className="py-2.5 px-3 font-medium text-slate-800">
                  <span className={item.isPacked ? 'text-slate-400 line-through' : ''}>
                    {item.name}
                  </span>
                </td>

                {/* Category */}
                <td className="py-2.5 px-3 text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                    {item.category}
                  </span>
                </td>

                {/* Target Bag */}
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
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

                {/* Delete action */}
                <td className="py-2.5 px-2 text-center">
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
