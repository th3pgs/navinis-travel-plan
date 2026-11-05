# Navini's Travel Plan 🇱🇰 ✈️ 🇨🇳
### Private Relocation & Transit Mission Control — Hainan University (2026–2029)
**Student:** Parana Gamage Navini Ravishka Priyantha  
**Admission Notice:** `263660001` | **E-Ticket:** `7812903731438` | **PNR:** `JKZ2YN`  
**Flights:** China Eastern `MU6018` (CMB → PVG T1) & `MU6381` (PVG T1 → HAK T1)

---

## 🔒 Security Gate
- **Passcode:** `101926`
- **Auto-unlock persistence:** Stored in `localStorage` once entered.

---

## 🚀 Running the App Locally

```bash
# Install dependencies (already installed)
npm install

# Run development server
npm run dev

# Build for production with PWA Service Worker caching
npm run build

# Preview production build
npm run preview
```

---

## 🗄️ Supabase Schema (Optional Cloud Sync)

If connecting to Supabase, provide `.env` with:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run this SQL in your Supabase SQL Editor:
```sql
-- 1. Checklist State Table
create table if not exists public.checklist_items (
  id text primary key,
  category text not null,
  label text not null,
  is_checked boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Wardrobe Items Table
create table if not exists public.wardrobe_items (
  id text primary key,
  name text not null,
  category text not null,
  icon text not null,
  quantity integer default 1,
  target_bag text,
  is_bought boolean default false,
  is_packed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.checklist_items enable row level security;
alter table public.wardrobe_items enable row level security;

create policy "Allow public read/write on checklist_items" on public.checklist_items
  for all using (true) with check (true);

create policy "Allow public read/write on wardrobe_items" on public.wardrobe_items
  for all using (true) with check (true);
```

---

## ✨ Features Built
1. **0ms Latency Local-First Architecture:** Instant state updates stored locally, resilient to China's Great Firewall.
2. **PWA Offline Service Worker:** Precaching assets for offline execution on iOS, Android, and Windows.
3. **Multi-Device Matrix:** 30 apps & proxy configs tracked across iPhone 17, Samsung S20 FE (OTP Vault), Dell Latitude 5410, and Apple iPad 11.
4. **Maximizable Wardrobe & Packing Manager:** Full-screen mode, emoji category pills, dual checkboxes (`Bought` + `Packed`), custom item creation/deletion.
5. **Luggage Warning & 4-Bag Golden Strategy:** Detailed layout for Checked Bags 1 & 2, Carry-on Tech Backpack, and Fanny Pack.
6. **Zero-Spoken-Chinese Taxi Destination Card:** Huge Chinese typography with direct university emergency numbers.
7. **Offline Snapshot Exporter:** Single-click standalone HTML and JSON backup generator.
