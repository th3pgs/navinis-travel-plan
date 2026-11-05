import React from 'react';
import { Briefcase, Backpack, Shield, Smartphone } from 'lucide-react';

export const GoldenStrategyTable: React.FC = () => {
  const bags = [
    {
      name: 'Main Large Rolling Suitcase',
      dimensions: '65 cm × 43 cm',
      role: 'Checked Baggage 1 (Colombo to Haikou, re-checked at PVG)',
      contents: 'Heavy apparel, frocks, jeans, bedsheets, full-size liquids (>100ml), flattened 43cm blue school bag. Strict rule: No lithium batteries or original document certificates.',
    },
    {
      name: 'Medium Rolling Suitcase',
      dimensions: '58 cm × 34 cm',
      role: 'Checked Baggage 2 (China Eastern 2nd Allowance)',
      contents: 'Secondary wardrobe, jackets, lab footwear, dorm bathroom slippers (top layer), Sri Lankan spices, umbrella, emergency clothing set. Check this bag in.',
    },
    {
      name: 'Structured Laptop Backpack',
      dimensions: '~45 cm (25–30L)',
      role: 'Cabin Carry-On (Kept with passenger)',
      contents: 'Dell Latitude 5410, Apple iPad 11, CCC certified power bank (10,000mAh+), universal adapter, cables, A4 waterproof folder (original medical & degree papers), 1 light sweater.',
    },
    {
      name: 'Compact Fanny Pack / Crossbody',
      dimensions: 'Worn across chest',
      role: 'Personal Lifeline (Always accessible)',
      contents: 'Passport (with X1 Visa), iPhone 17 (Travel eSIM), Samsung S20 FE (Dialog SIM, roaming off), boarding passes, 4 passport photos, physical RMB cash (1,000–2,000 RMB), bank cards, black ink pen.',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">4-Bag Allocation Framework</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Standardized luggage roles for smooth airport security and transit through Shanghai
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bags.map((bag, i) => (
          <div key={i} className="p-4 border border-slate-200 rounded bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm">{bag.name}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {bag.dimensions}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#003580] mt-1">
                {bag.role}
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 mt-3">
              <span className="font-medium text-slate-700">Contents:</span> {bag.contents}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
