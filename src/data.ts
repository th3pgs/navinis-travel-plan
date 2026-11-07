export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  quantity: string | number;
  targetBag: string;
  isBought: boolean;
  isPacked: boolean;
  colorHex?: string;
  notes?: string;
  photoUrl?: string;
  subType?: string; // For Medicine (Painkillers, Prescription, Antibiotics, Vitamins, Motion Sickness, Balm/Inhaler)
  syncStatus?: 'uploading' | 'synced' | 'error';
  uploadProgress?: number;
  localPhotoPreview?: string;
}

export interface GiftItem {
  id: string;
  name: string;
  quantity: number;
  targetBag: string;
  packagingNote: string;
  recipient: string;
  isPacked: boolean;
}

export interface BankingTaskItem {
  id: string;
  bank: string;
  title: string;
  detail: string;
  isDone: boolean;
  priority?: 'Critical' | 'High' | 'Medium';
}

export interface BagAsset {
  id: string;
  name: string;
  type: string;
  dimensions: string;
  weightLimit: string;
  targetBag: string;
  recommendedContents: string;
  isBought: boolean;
  isPacked: boolean;
  kind: 'rolling-large' | 'rolling-medium' | 'backpack' | 'fannypack' | 'custom' | string;
}

export interface DeviceAsset {
  id: string;
  name: string;
  model: string;
  role: string;
  carrierOrOs: string;
  carryLocation: string;
  isBought: boolean;
  isPacked: boolean;
  type: 'phone-ios' | 'phone-android' | 'laptop' | 'tablet' | 'earbuds' | 'powerbank';
}

export interface DocumentItem {
  id: string;
  title: string;
  issuer: string;
  carryLocation: string;
  isReady: boolean;
  isPacked: boolean;
  notes: string;
  priority: 'High' | 'Critical' | 'Medium';
}

export interface AppConfigItem {
  id: string;
  platform: 'iOS' | 'Android' | 'Windows';
  devices?: ('iPhone 17' | 'Samsung S20 FE' | 'Dell Laptop' | 'Apple iPad 11')[];
  name: string;
  category: 'Proxy & Bypass' | 'Essential Daily' | 'Stock AI & Academic' | 'Transit & Maps';
  role: string;
  isInstalled: boolean;
  isLoggedIn?: boolean;
  isVerified?: boolean;
  isConfigured: boolean;
  appIcon: string;
}

export type InternetAppItem = AppConfigItem;

export interface TimelineMilestone {
  id: string;
  dateBadge: string;
  dateFull: string;
  title: string;
  summary: string;
  isCompleted: boolean;
  keyAction: string;
  targetCategory: 'physical' | 'documents' | 'connectivity';
}

export interface ProcedureStep {
  id: string;
  stage: 'prep-srilanka' | 'airport-cmb' | 'transit-pvg' | 'flight-hak' | 'arrival-campus';
  category: string;
  title: string;
  detail: string;
  carryBag?: string;
  isDone: boolean;
  isEditable?: boolean;
}

export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  detail?: string;
  tag?: string;
  isChecked: boolean;
}

export interface TaskItem {
  id: string;
  stage: string;
  category: string;
  title: string;
  detail?: string;
  location?: string;
  status?: string;
  isReady: boolean;
  isPacked: boolean;
  isEditable?: boolean;
  appIcon?: string;
}

export interface TimelineEventItem {
  id: string;
  label: string;
  detail?: string;
  isDone: boolean;
  appIcon?: string;
  targetBag?: string;
  mustContactBuddy?: boolean;
}

export interface TimelineEvent {
  id: string;
  dayBadge: string;
  dateStr: string;
  title: string;
  subtitle: string;
  status: 'upcoming' | 'current' | 'future';
  isReady: boolean;
  isPacked: boolean;
  items: TimelineEventItem[];
}

// 9 Original Canonical Packing Categories
export const DEFAULT_WARDROBE_CATEGORIES: string[] = [
  'Dresses & Frocks',
  'Tops & T-Shirts',
  'Bottoms & Jeans',
  'Undergarments & Innerwear',
  'Footwear & Slippers',
  'Bottles, Liquids & Toiletries',
  'Medicine & First Aid',
  'Gifts & Souvenirs',
  'Daily Essentials, Cutlery & Folders',
];

const KNOWN_APP_PATTERNS = [
  'alipay',
  'wechat',
  'google',
  'gmail',
  'baidu',
  'amap',
  'gaode',
  'shadowrocket',
  'v2rayng',
  'clash',
  'hiddify',
  'chatgpt',
  'gemini',
  'claude',
  'deepl',
  'pleco',
  'meituan',
  'taobao',
  'didi',
  'metroman',
  'rednote',
  'xiaohongshu',
  'astrill',
  'whatsapp',
  'youtube',
  'dialog',
  'trip.com',
  'ele.me',
  'bilibili',
  'douyin',
  'authenticator',
  'pinduoduo',
];

/**
 * Accurately detects whether an item is a software app, device, bag, doc, or non-wardrobe artifact.
 */
export function isSoftwareAppOrNonWardrobe(item: any): boolean {
  if (!item) return true;
  const id = String(item.id || '').toLowerCase();
  if (
    id.startsWith('app-') ||
    id.startsWith('bag-') ||
    id.startsWith('dev-') ||
    id.startsWith('doc-') ||
    id.startsWith('step-') ||
    id.startsWith('gift-') ||
    id.startsWith('m-')
  ) {
    return true;
  }
  // Software app attributes
  if (
    item.platform !== undefined ||
    item.carrierOrOs !== undefined ||
    item.appIcon !== undefined ||
    Array.isArray(item.devices) ||
    item.isConfigured !== undefined ||
    item.isLoggedIn !== undefined ||
    item.isVerified !== undefined
  ) {
    return true;
  }
  const name = String(item.name || '').toLowerCase();
  for (const pattern of KNOWN_APP_PATTERNS) {
    if (name.includes(pattern)) return true;
  }
  return false;
}

/**
 * Returns true if the item has no user-typed name or was generated as an automated photo recovery placeholder.
 */
export function isUnnamedRetake(item: WardrobeItem): boolean {
  if (!item || !item.name) return true;
  const lower = item.name.trim().toLowerCase();
  return (
    lower === '' ||
    lower === 'untitled' ||
    lower.startsWith('recovered item') ||
    lower.startsWith('item ')
  );
}

/**
 * Splits an item title into main title and color label if separated by " - " (space-hyphen-space).
 * Requires spaces around the hyphen so words like "T-Shirt" or "Short-Sleeve" are never split!
 */
export function parseTitleAndColor(rawName: string): { mainTitle: string; colorLabel?: string } {
  if (!rawName) return { mainTitle: '' };
  const trimmed = rawName.trim();
  const delimiter = ' - ';
  const lastIdx = trimmed.lastIndexOf(delimiter);
  if (lastIdx === -1) {
    return { mainTitle: trimmed };
  }
  const mainTitle = trimmed.substring(0, lastIdx).trim();
  const colorLabel = trimmed.substring(lastIdx + delimiter.length).trim();
  if (!colorLabel) {
    return { mainTitle: trimmed };
  }
  return { mainTitle, colorLabel };
}

/**
 * Formats a quantity value into a badge string.
 * Plain digits like "1" or "3" become "x1" or "x3".
 * Values with units/symbols like "50g * 5" or "500g x 5" remain as typed.
 */
export function formatQuantityBadge(rawQuantity: string | number | undefined): string {
  const qStr = String(rawQuantity ?? '1').trim();
  if (!qStr) return 'x1';
  if (/^\d+$/.test(qStr)) {
    return `x${qStr}`;
  }
  return qStr;
}

/**
 * Normalizes any category string into one of the 9 canonical categories,
 * purges app categories, and preserves custom user categories.
 */
export function normalizeCategoryName(rawCategory?: string): string {
  if (!rawCategory || !rawCategory.trim()) {
    return 'Daily Essentials, Cutlery & Folders';
  }
  const trimmed = rawCategory.trim();
  const lower = trimmed.toLowerCase();

  // Purge app categories from wardrobe
  if (
    lower.includes('proxy') ||
    lower.includes('bypass') ||
    lower.includes('stock ai') ||
    lower.includes('transit & maps') ||
    lower.includes('transit and maps') ||
    lower.includes('essential daily')
  ) {
    return 'Daily Essentials, Cutlery & Folders';
  }

  // Match Tops & T-Shirts
  if (
    lower === 'tops' ||
    lower === 'top' ||
    lower === 't-shirts' ||
    lower === 't-shirt' ||
    lower === 'shirts' ||
    lower === 'shirt' ||
    lower === 'blouse' ||
    lower === 'blouses' ||
    lower === 'tops & t-shirts' ||
    lower === 'tops and t-shirts' ||
    lower.startsWith('top')
  ) {
    return 'Tops & T-Shirts';
  }

  // Match Dresses & Frocks
  if (
    lower === 'dresses' ||
    lower === 'dress' ||
    lower === 'frocks' ||
    lower === 'frock' ||
    lower === 'dresses & frocks' ||
    lower === 'frocks & dresses' ||
    lower.includes('frock') ||
    lower.includes('dress')
  ) {
    return 'Dresses & Frocks';
  }

  // Match Bottoms & Jeans
  if (
    lower === 'bottoms' ||
    lower === 'bottom' ||
    lower === 'jeans' ||
    lower === 'jean' ||
    lower === 'pants' ||
    lower === 'pant' ||
    lower === 'trousers' ||
    lower === 'trouser' ||
    lower === 'skirts' ||
    lower === 'skirt' ||
    lower === 'bottoms & jeans' ||
    lower === 'bottoms and jeans'
  ) {
    return 'Bottoms & Jeans';
  }

  // Match Undergarments & Innerwear
  if (
    lower === 'undergarments' ||
    lower === 'undergarment' ||
    lower === 'innerwear' ||
    lower === 'underwear' ||
    lower === 'undergarments & innerwear' ||
    lower === 'undergarments and innerwear' ||
    lower.includes('bra') ||
    lower.includes('panty') ||
    lower.includes('panties') ||
    lower.includes('underpant')
  ) {
    return 'Undergarments & Innerwear';
  }

  // Match Footwear & Slippers
  if (
    lower === 'footwear' ||
    lower === 'slippers' ||
    lower === 'slipper' ||
    lower === 'shoes' ||
    lower === 'shoe' ||
    lower === 'sandals' ||
    lower === 'sandal' ||
    lower === 'footwear & slippers' ||
    lower === 'footwear and slippers'
  ) {
    return 'Footwear & Slippers';
  }

  // Match Bottles, Liquids & Toiletries
  if (
    lower === 'bottles, liquids & toiletries' ||
    lower === 'bottles & liquids' ||
    lower === 'bottles and liquids' ||
    lower === 'liquids' ||
    lower === 'liquid' ||
    lower === 'toiletries' ||
    lower === 'toiletry' ||
    lower === 'bottles' ||
    lower === 'bottle'
  ) {
    return 'Bottles, Liquids & Toiletries';
  }

  // Match Medicine & First Aid
  if (
    lower === 'medicine & first aid' ||
    lower === 'medicine and first aid' ||
    lower === 'medicine' ||
    lower === 'medicines' ||
    lower === 'first aid' ||
    lower === 'pharmacy'
  ) {
    return 'Medicine & First Aid';
  }

  // Match Gifts & Souvenirs
  if (
    lower === 'gifts & souvenirs' ||
    lower === 'gifts and souvenirs' ||
    lower === 'gifts' ||
    lower === 'gift' ||
    lower === 'souvenirs' ||
    lower === 'souvenir'
  ) {
    return 'Gifts & Souvenirs';
  }

  // Match Daily Essentials, Cutlery & Folders
  if (
    lower === 'daily essentials, cutlery & folders' ||
    lower === 'daily essentials' ||
    lower === 'essentials' ||
    lower === 'essential' ||
    lower === 'cutlery' ||
    lower === 'folders' ||
    lower === 'folder' ||
    lower === 'lab coats & gear' ||
    lower === 'lab coat' ||
    lower === 'lab coats'
  ) {
    return 'Daily Essentials, Cutlery & Folders';
  }

  // Exact case-insensitive match against canonical categories
  const exactDefault = DEFAULT_WARDROBE_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (exactDefault) return exactDefault;

  return trimmed;
}

// 4 Exact Canonical Luggage / Bag Names (Requirement #5 - No Dimensions!)
export const DEFAULT_BAG_LOCATIONS: string[] = [
  'Main Large Rolling Suitcase',
  'Medium Rolling Suitcase',
  'Tech Laptop Backpack',
  'Compact Fanny Pack',
];

/**
 * Normalizes any luggage location string (stripping dimensions and variant text)
 * to one of the 4 exact canonical bag names, or returns the custom location.
 */
export function normalizeBagLocation(rawLoc?: string): string {
  if (!rawLoc || !rawLoc.trim()) {
    return 'Main Large Rolling Suitcase';
  }
  const trimmed = rawLoc.trim();
  const lower = trimmed.toLowerCase();

  // 1. Main Large Rolling Suitcase
  if (
    lower.includes('large') ||
    lower.includes('30×40×70') ||
    lower.includes('30x40x70') ||
    lower.includes('checked bag 1') ||
    lower === 'checked at colombo'
  ) {
    return 'Main Large Rolling Suitcase';
  }

  // 2. Medium Rolling Suitcase
  if (
    lower.includes('medium') ||
    lower.includes('27×41×57') ||
    lower.includes('27x41x57') ||
    lower.includes('checked bag 2')
  ) {
    return 'Medium Rolling Suitcase';
  }

  // 3. Tech Laptop Backpack
  if (
    lower.includes('backpack') ||
    lower.includes('tech laptop') ||
    lower.includes('cabin laptop') ||
    lower.includes('cabin carry-on')
  ) {
    return 'Tech Laptop Backpack';
  }

  // 4. Compact Fanny Pack
  if (
    lower.includes('fanny') ||
    lower.includes('crossbody') ||
    lower.includes('chest') ||
    lower.includes('lifeline')
  ) {
    return 'Compact Fanny Pack';
  }

  const exactDefault = DEFAULT_BAG_LOCATIONS.find((b) => b.toLowerCase() === lower);
  if (exactDefault) return exactDefault;

  return trimmed;
}

/**
 * Automatically purges software apps, normalizes wardrobe items to canonical categories, canonical bags,
 * and recovers locked-in packed booleans (Requirement #2, #4, #5).
 */
export function migrateWardrobeItems(items: WardrobeItem[]): WardrobeItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => !isSoftwareAppOrNonWardrobe(item))
    .map((item) => {
      const normalizedCategory = normalizeCategoryName(item.category);
      const normalizedBag = normalizeBagLocation(item.targetBag);
      const isPacked =
        item.isPacked === true ||
        (item as any).packed === true ||
        (item as any).checked === true ||
        (item as any).status === 'packed';
      const quantity = item.quantity !== undefined && item.quantity !== null
        ? String(item.quantity).trim()
        : '1';

      return {
        ...item,
        category: normalizedCategory,
        targetBag: normalizedBag,
        quantity,
        isPacked,
      };
    });
}

export const MEDICINE_SUBTYPES: string[] = [
  'Painkillers',
  'Prescription',
  'Antibiotics',
  'Vitamins',
  'Motion Sickness',
  'Balm/Inhaler',
  'General First Aid',
];

export const DEFAULT_BANKS: string[] = [
  'Bank of Ceylon (BOC)',
  "People's Bank",
  'National Savings Bank (NSB)',
  'General / Cash Stash',
];

export const DEFAULT_APP_CATEGORIES: string[] = [
  'Proxy & Bypass',
  'Essential Daily',
  'Stock AI & Academic',
  'Transit & Maps',
];

export const DEFAULT_APP_DEVICES: string[] = [
  'iPhone 17',
  'Samsung S20 FE',
  'Dell Laptop',
  'Apple iPad 11',
];

/**
 * Universal matcher for cross-portal inventory in luggage inspection.
 * Accurately matches items against a BagAsset even with slight naming differences.
 */
export function isItemInBag(itemLocation: string | undefined, bag: BagAsset): boolean {
  if (!itemLocation) return false;
  const loc = itemLocation.trim().toLowerCase();
  const bagName = bag.name.trim().toLowerCase();
  const bagId = bag.id.trim().toLowerCase();

  // Direct exact match
  if (loc === bagName || loc === bagId) return true;

  // Normalized matching for core bags
  if (bag.kind === 'rolling-large' || bagName.includes('large')) {
    if (
      loc.includes('large') ||
      loc.includes('30×40×70') ||
      loc.includes('checked bag 1') ||
      loc === 'checked at colombo'
    ) {
      return true;
    }
  }
  if (bag.kind === 'rolling-medium' || bagName.includes('medium')) {
    if (
      loc.includes('medium') ||
      loc.includes('27×41×57') ||
      loc.includes('checked bag 2')
    ) {
      return true;
    }
  }
  if (bag.kind === 'backpack' || bagName.includes('backpack')) {
    if (
      loc.includes('backpack') ||
      loc.includes('cabin laptop') ||
      loc.includes('a4 waterproof folder') ||
      loc.includes('cabin carry-on')
    ) {
      return true;
    }
  }
  if (bag.kind === 'fannypack' || bagName.includes('fanny') || bagName.includes('crossbody')) {
    if (
      loc.includes('fanny') ||
      loc.includes('crossbody') ||
      loc.includes('worn on chest') ||
      loc.includes('chest') ||
      loc.includes('lifeline')
    ) {
      return true;
    }
  }

  // Custom location substring / equality
  if (loc.length > 2 && (loc.includes(bagName) || bagName.includes(loc))) {
    return true;
  }

  return false;
}

// Initial 4 Luggage Bags
export const INITIAL_BAGS: BagAsset[] = [
  {
    id: 'bag-large',
    name: 'Main Large Rolling Suitcase',
    type: 'Checked Bag 1 (China Eastern Included)',
    dimensions: '30 × 40 × 70 cm',
    weightLimit: '23 kg Checked Limit',
    targetBag: 'Checked at Colombo',
    recommendedContents: 'Heavy apparel, frocks, jeans, bedsheets, full-size liquids (>100ml), flattened 43cm school bag. Strict rule: NO lithium batteries or original certificates.',
    isBought: true,
    isPacked: false,
    kind: 'rolling-large',
  },
  {
    id: 'bag-medium',
    name: 'Medium Rolling Suitcase',
    type: 'Checked Bag 2 (China Eastern Included)',
    dimensions: '27 × 41 × 57 cm',
    weightLimit: '23 kg Checked Limit',
    targetBag: 'Checked at Colombo',
    recommendedContents: 'Secondary wardrobe, jackets, lab footwear, bathroom slippers (top layer), Sri Lankan spices, emergency clothing set. Check this bag in.',
    isBought: true,
    isPacked: false,
    kind: 'rolling-medium',
  },
  {
    id: 'bag-backpack',
    name: 'Tech Laptop Backpack',
    type: 'Cabin Carry-On (With Passenger)',
    dimensions: '~45 cm (25–30L Structured)',
    weightLimit: 'Cabin Carry-On',
    targetBag: 'Primary Cabin Carry-On',
    recommendedContents: 'Dell Latitude 5410, Apple iPad 11, Anker Soundcore Earbuds, CCC Power Bank (10,000mAh+), universal adapter, cables, A4 waterproof folder, 1 sweater.',
    isBought: false, // Default unbought (Red)
    isPacked: false,
    kind: 'backpack',
  },
  {
    id: 'bag-fanny',
    name: 'Compact Fanny Pack',
    type: 'Personal Lifeline (Worn Across Chest)',
    dimensions: 'Worn across chest at all times',
    weightLimit: 'Lifeline Bag',
    targetBag: 'Worn on Body',
    recommendedContents: 'Passport with X1 Visa, iPhone 17 (Travel eSIM), Samsung S20 FE (Dialog SIM, roaming off), boarding passes, 4 passport photos, 1,000–2,000 RMB cash, bank cards, black pen.',
    isBought: true,
    isPacked: false,
    kind: 'fannypack',
  },
];

// Initial 6 Hardware Devices
export const INITIAL_DEVICES: DeviceAsset[] = [
  {
    id: 'dev-1',
    name: 'iPhone 17',
    model: 'Primary Daily Phone',
    role: 'CMLink 5G Travel eSIM + Hiddify + Alipay & WeChat Pay',
    carrierOrOs: 'iOS 20 • Travel eSIM',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isBought: true,
    isPacked: false,
    type: 'phone-ios',
  },
  {
    id: 'dev-2',
    name: 'Samsung S20 FE',
    model: 'Sri Lankan OTP Vault',
    role: 'Dialog SMS Roaming (Mobile Data & Data Roaming HARD-LOCKED OFF)',
    carrierOrOs: 'Android • Dialog SIM',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isBought: true,
    isPacked: false,
    type: 'phone-android',
  },
  {
    id: 'dev-3',
    name: 'Dell Latitude 5410',
    model: '14" Windows Research Laptop',
    role: 'Food Science coursework + Hiddify TUN Mode + Offline Document Vault',
    carrierOrOs: 'Windows 11 Pro',
    carryLocation: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    type: 'laptop',
  },
  {
    id: 'dev-4',
    name: 'Apple iPad 11',
    model: 'Tablet Workstation',
    role: 'Hiddify + Pleco + Offline Taxi Address Sign display',
    carrierOrOs: 'iPadOS',
    carryLocation: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    type: 'tablet',
  },
  {
    id: 'dev-5',
    name: 'Anker Soundcore Earbuds',
    model: 'Wireless ANC Stem Earbuds',
    role: 'In-flight noise cancellation & voice calls with campus buddy',
    carrierOrOs: 'Bluetooth 5.3',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isBought: true,
    isPacked: false,
    type: 'earbuds',
  },
  {
    id: 'dev-6',
    name: '10,000mAh+ CCC Power Bank',
    model: 'Safety Certified Battery',
    role: 'Aviation Rule: MUST carry in cabin backpack. Confiscated if checked!',
    carrierOrOs: 'CCC / CE Certified Mark',
    carryLocation: 'Structured Tech Laptop Backpack',
    isBought: false, // Default unbought (Red)
    isPacked: false,
    type: 'powerbank',
  },
];

// Initial 8 Streamlined Credentials (Document Checker)
export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-pass',
    title: 'Original Passport with Valid Chinese X1 Visa',
    issuer: 'Department of Immigration (Sri Lanka) & Chinese Embassy',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isReady: true,
    isPacked: false,
    notes: 'Undamaged bio page with single/multi-entry X1 study visa attached. Keep on chest at all times.',
    priority: 'Critical',
  },
  {
    id: 'doc-admit',
    title: 'Printed Admission Notice (#263660001)',
    issuer: 'School of Food Science and Engineering, Hainan University',
    carryLocation: 'Structured Tech Laptop Backpack',
    isReady: true,
    isPacked: false,
    notes: 'Page 1 (Chinese stamped full scholarship) & Page 2 (English). Signed & official red university stamp.',
    priority: 'Critical',
  },
  {
    id: 'doc-jw202',
    title: 'Confirmation Form for Study in China (JW201/JW202)',
    issuer: 'Ministry of Education of the People\'s Republic of China',
    carryLocation: 'Structured Tech Laptop Backpack',
    isReady: true,
    isPacked: false,
    notes: 'Official government stamped visa authorization certificate in A4 waterproof folder.',
    priority: 'Critical',
  },
  {
    id: 'doc-visa',
    title: 'Chinese Study Visa (X1 Visa Sticker in Passport)',
    issuer: 'Embassy of the People\'s Republic of China in Sri Lanka',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isReady: true,
    isPacked: false,
    notes: 'Affixed inside passport. Must convert to Foreigner Residence Permit within 30 days of arrival.',
    priority: 'Critical',
  },
  {
    id: 'doc-med',
    title: 'ORIGINAL Physical Examination Record & Blood Test Reports',
    issuer: 'Designated Government Hospital Stamp',
    carryLocation: 'Structured Tech Laptop Backpack',
    isReady: true,
    isPacked: false,
    notes: 'Physical clinic/physician ink stamp, HIV/Hepatitis/Syphilis blood slips, chest X-ray report.',
    priority: 'High',
  },
  {
    id: 'doc-photo',
    title: 'Eight (8) Printed Matte Passport Photos (33×48mm)',
    issuer: 'Standard Chinese Visa Specs (White Background)',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isReady: true,
    isPacked: false,
    notes: 'Required for campus student ID badge, physical exam verification, and Haikou residence permit.',
    priority: 'High',
  },
  {
    id: 'doc-deg',
    title: 'Bachelor\'s Degree Certificate & Official Transcripts',
    issuer: 'Graduating University',
    carryLocation: 'Structured Tech Laptop Backpack',
    isReady: true,
    isPacked: false,
    notes: 'Original diploma + certified English notarized copies for Master\'s degree registration.',
    priority: 'High',
  },
  {
    id: 'doc-taxi',
    title: 'Printed Bilingual Chinese Taxi Pocket Pass',
    issuer: 'Hainan University Haidian Campus Address Sign',
    carryLocation: 'Compact Fanny Pack / Crossbody',
    isReady: true,
    isPacked: false,
    notes: 'High-contrast large print (海南大学海甸校区南门 - 人民大道58号) ready to show driver immediately at Haikou Meilan Airport.',
    priority: 'High',
  },
];

// Initial Curated Applications Roster (Strictly NO Chinese Apps on Samsung S20 FE)
export const INITIAL_APPS: AppConfigItem[] = [
  // 1. Firewall Bypass & VPN (All 4 Devices — NO Shadowrocket!)
  {
    id: 'app-hiddify',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11', 'Samsung S20 FE', 'Dell Laptop'],
    name: 'Hiddify',
    category: 'Proxy & Bypass',
    role: 'Primary free cross-platform firewall client for campus Wi-Fi & SIM. Ready for Alipay node package import.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'hiddify',
  },
  {
    id: 'app-astrill',
    platform: 'iOS',
    devices: ['iPhone 17', 'Dell Laptop', 'Samsung S20 FE'],
    name: 'Astrill VPN Client',
    category: 'Proxy & Bypass',
    role: 'Dormant emergency backup ($30 USD). Pre-configured credentials: naviniravishka@icloud.com / RKB38R.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'astrill',
  },

  // 2. Chinese Social, Entertainment & Lifestyle (iPhone 17 & iPad 11 ONLY — NEVER on S20 FE!)
  {
    id: 'app-rednote',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'RedNote / Xiaohongshu (小红书)',
    category: 'Essential Daily',
    role: 'Essential lifestyle, campus dorm tips, Hainan food/travel guides & entertainment.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'rednote',
  },
  {
    id: 'app-douyin-bilibili',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'Douyin (抖音) / Bilibili (哔哩哔哩)',
    category: 'Essential Daily',
    role: 'Chinese video entertainment, student vlogs & academic study/tech tutorials.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'douyin',
  },
  {
    id: 'app-wechat',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'WeChat (微信)',
    category: 'Essential Daily',
    role: 'Campus lifeline, faculty messaging with Ms. Sun, student guide calls & campus mini-programs.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'wechat',
  },
  {
    id: 'app-alipay',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Alipay (支付宝)',
    category: 'Essential Daily',
    role: 'Primary QR mobile payment bound to international Visa card, transport QR & node purchases.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'alipay',
  },
  {
    id: 'app-meituan',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Meituan (美团)',
    category: 'Essential Daily',
    role: 'Campus food delivery, bottled water replenishment & Haikou dorm supplies.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'meituan',
  },
  {
    id: 'app-eleme',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Ele.me (饿了么)',
    category: 'Essential Daily',
    role: 'Alibaba food & grocery delivery in Haikou (Login via Alipay).',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'eleme',
  },
  {
    id: 'app-taobao-pdd',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'Taobao (淘宝) & Pinduoduo (拼多多)',
    category: 'Essential Daily',
    role: 'Buying dorm bedding, pillows, lamps, and essentials cheaply (Login via Alipay/WeChat).',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'taobao',
  },
  {
    id: 'app-didi',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'DiDi (滴滴出行)',
    category: 'Transit & Maps',
    role: 'English ride-hailing app with automatic driver chat translation and cashless billing.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'didi',
  },
  {
    id: 'app-amap',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Amap / Gaode Maps (高德地图)',
    category: 'Transit & Maps',
    role: 'Most accurate GPS navigation & campus gate walking maps in Haikou.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'amap',
  },
  {
    id: 'app-baidu',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Baidu Maps (百度地图)',
    category: 'Transit & Maps',
    role: 'Secondary campus gate GPS walking routes & offline map downloads.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'baidu',
  },
  {
    id: 'app-trip',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Trip.com',
    category: 'Transit & Maps',
    role: 'Flight booking check, domestic high-speed train tickets & e-ticket verification.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'tripdotcom',
  },
  {
    id: 'app-metroman',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'MetroMan (地铁通)',
    category: 'Transit & Maps',
    role: 'Offline national metro transit network maps with transfer calculators.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'metroman',
  },

  // 3. Specific Google Apps (Individual Apps, NEVER group as "Google Suite")
  {
    id: 'app-gmail',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'Gmail',
    category: 'Stock AI & Academic',
    role: 'Logged into primary & academic emails for Hainan University correspondence.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'gmail',
  },
  {
    id: 'app-gtrans',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11'],
    name: 'Google Translate',
    category: 'Essential Daily',
    role: 'CRITICAL: Download "Chinese (Simplified)" Offline Translation Pack in Sri Lanka so camera/voice translation works without VPN!',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'google-translate',
  },
  {
    id: 'app-gmaps',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE'],
    name: 'Google Maps',
    category: 'Transit & Maps',
    role: 'Logged in for international transit & Sri Lanka/transit airport navigation.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'google-maps',
  },
  {
    id: 'app-gdrive',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'Google Drive',
    category: 'Stock AI & Academic',
    role: 'Offline copies of scholarship docs, admission letters, and certificates synced.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'google-drive',
  },
  {
    id: 'app-chrome',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'Google Chrome',
    category: 'Essential Daily',
    role: 'Bookmarks, passwords, and university portal logins synced across devices.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'chrome',
  },
  {
    id: 'app-youtube',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'YouTube',
    category: 'Essential Daily',
    role: 'Video learning, research tutorials, and entertainment via proxy.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'youtube',
  },

  // 4. AI & Academic Research
  {
    id: 'app-gpt',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'ChatGPT',
    category: 'Stock AI & Academic',
    role: 'Installed & logged in for Master\'s thesis literature reviews and food science research.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'chatgpt',
  },
  {
    id: 'app-gemini',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'Google Gemini',
    category: 'Stock AI & Academic',
    role: 'Multimodal AI research tool for Food Science and Engineering problem solving.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'gemini',
  },
  {
    id: 'app-claude',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Apple iPad 11', 'Dell Laptop'],
    name: 'Claude',
    category: 'Stock AI & Academic',
    role: 'Installed & logged in for Master\'s academic writing and research paper synthesis.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'claude',
  },
  {
    id: 'app-deepl',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11', 'Dell Laptop'],
    name: 'DeepL Translate',
    category: 'Stock AI & Academic',
    role: 'Installed for high accuracy academic document translation for Food Science coursework.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'deepl',
  },
  {
    id: 'app-pleco',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'Pleco Chinese Dictionary',
    category: 'Essential Daily',
    role: 'Offline Chinese-English dictionary with optical OCR camera scanner (download packs in Sri Lanka).',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'pleco',
  },

  // 5. Samsung S20 FE Specific Android Essentials (NO Chinese Apps!)
  {
    id: 'app-dialog',
    platform: 'Android',
    devices: ['Samsung S20 FE'],
    name: 'Dialog MyAccount',
    category: 'Essential Daily',
    role: 'Monitor Sri Lankan SIM balance & SMS roaming status (Mobile data hard-locked off).',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'dialog',
  },
  {
    id: 'app-whatsapp',
    platform: 'Android',
    devices: ['Samsung S20 FE', 'iPhone 17'],
    name: 'WhatsApp',
    category: 'Essential Daily',
    role: 'Family calls and texts when connected to proxy / travel eSIM.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'whatsapp',
  },
  {
    id: 'app-auth',
    platform: 'Android',
    devices: ['Samsung S20 FE'],
    name: 'Google Authenticator',
    category: 'Essential Daily',
    role: '2FA backup security codes for university and banking logins.',
    isInstalled: false,
    isLoggedIn: false,
    isVerified: false,
    isConfigured: false,
    appIcon: 'authenticator',
  },
];

export const INITIAL_INTERNET_APPS = INITIAL_APPS;

/**
 * Automatically purges legacy apps (Shadowrocket, v2rayNG, Clash Verge)
 * and migrates cached state to the modern 2026 roster.
 */
export function migrateLegacyApps(currentApps: AppConfigItem[]): AppConfigItem[] {
  if (!currentApps || !Array.isArray(currentApps) || currentApps.length === 0) {
    return INITIAL_APPS;
  }

  const hasLegacyForbidden = currentApps.some(
    (a) =>
      a.id.includes('shadowrocket') ||
      a.name.toLowerCase().includes('shadowrocket') ||
      a.id.includes('v2ray') ||
      a.name.toLowerCase().includes('v2ray') ||
      a.id.includes('clash') ||
      a.name.toLowerCase().includes('clash')
  );

  const missingModernApps =
    !currentApps.some((a) => a.name.toLowerCase().includes('hiddify')) ||
    !currentApps.some((a) => a.name.toLowerCase().includes('xiaohongshu') || a.name.toLowerCase().includes('rednote')) ||
    !currentApps.some((a) => a.name.toLowerCase().includes('youtube'));

  if (hasLegacyForbidden || missingModernApps) {
    return INITIAL_APPS.map((initial) => {
      const existing = currentApps.find(
        (c) => c.name.toLowerCase().trim() === initial.name.toLowerCase().trim() || c.id === initial.id
      );
      if (existing) {
        return {
          ...initial,
          isInstalled: existing.isInstalled,
          isLoggedIn: existing.isLoggedIn ?? existing.isConfigured,
          isVerified: existing.isVerified ?? existing.isConfigured,
          isConfigured: existing.isConfigured,
        };
      }
      return initial;
    });
  }

  return currentApps;
}

// Initial 9-Category Wardrobe & Packing Studio Inventory
export const INITIAL_WARDROBE: WardrobeItem[] = [
  // 1. Dresses & Frocks
  {
    id: 'w-1',
    name: 'Casual Cotton/Linen Day Frocks',
    category: 'Dresses & Frocks',
    quantity: 4,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#38bdf8',
    notes: 'Breathable lightweight fabrics for tropical island weather',
  },
  {
    id: 'w-2',
    name: 'Smart-Casual Modest Midi Dress',
    category: 'Dresses & Frocks',
    quantity: 2,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#6366f1',
    notes: 'For Welcome Ceremony / Faculty presentations',
  },
  {
    id: 'w-3',
    name: 'Lightweight Tropical Sundresses',
    category: 'Dresses & Frocks',
    quantity: 3,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#ec4899',
    notes: 'Warm weather campus wear',
  },

  // 2. Tops & T-Shirts
  {
    id: 'w-4',
    name: 'Breathable Cotton T-Shirts',
    category: 'Tops & T-Shirts',
    quantity: 6,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#f59e0b',
    notes: 'Daily campus rotation',
  },
  {
    id: 'w-5',
    name: 'Smart Collared Blouses / Shirts',
    category: 'Tops & T-Shirts',
    quantity: 3,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#10b981',
    notes: 'Meeting professors & academic supervisors',
  },
  {
    id: 'w-6',
    name: 'Spare Fresh Top (Transit Emergency)',
    category: 'Tops & T-Shirts',
    quantity: 1,
    targetBag: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#8b5cf6',
    notes: 'Emergency outfit change during long transit',
  },

  // 3. Bottoms & Jeans
  {
    id: 'w-7',
    name: 'Full-Length Jeans / Safety Trousers',
    category: 'Bottoms & Jeans',
    quantity: 3,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#1e3a8a',
    notes: 'Mandatory Food Science laboratory safety wear',
  },
  {
    id: 'w-8',
    name: 'Wide-Leg Linen / Cotton Pants',
    category: 'Bottoms & Jeans',
    quantity: 3,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#d97706',
    notes: 'Comfortable classroom lecture wear',
  },
  {
    id: 'w-9',
    name: 'Casual Skirts / Shorts',
    category: 'Bottoms & Jeans',
    quantity: 3,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#059669',
    notes: 'Dorm & casual wear',
  },
  {
    id: 'w-10',
    name: 'Travel Joggers / Track Pants',
    category: 'Bottoms & Jeans',
    quantity: 1,
    targetBag: 'Wear on Flight',
    isBought: true,
    isPacked: false,
    colorHex: '#334155',
    notes: 'Comfortable clothing for 10+ hours transit',
  },

  // 4. Undergarments & Innerwear
  {
    id: 'w-11',
    name: 'Undergarments & Bras (2-Week Supply)',
    category: 'Undergarments & Innerwear',
    quantity: 14,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#cbd5e1',
    notes: 'Packed inside zippered mesh laundry cubes',
  },
  {
    id: 'w-12',
    name: 'Cotton Pajama Sets / Nightwear',
    category: 'Undergarments & Innerwear',
    quantity: 3,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#fbcfe8',
    notes: 'Light breathable cotton for humid nights',
  },

  // 5. Footwear & Slippers
  {
    id: 'w-13',
    name: 'Closed-Toe Walking Sneakers',
    category: 'Footwear & Slippers',
    quantity: 1,
    targetBag: 'Wear on Flight',
    isBought: true,
    isPacked: false,
    colorHex: '#ffffff',
    notes: 'Required for Food Science labs and long transit walks',
  },
  {
    id: 'w-14',
    name: 'Backup Everyday Sneakers / Flats',
    category: 'Footwear & Slippers',
    quantity: 1,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#f1f5f9',
    notes: 'Alternate walking pair for rainy campus days',
  },
  {
    id: 'w-15',
    name: 'Comfortable Walking Sandals',
    category: 'Footwear & Slippers',
    quantity: 1,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#d97706',
    notes: 'Warm campus days',
  },
  {
    id: 'w-16',
    name: 'Waterproof Bathroom Slippers',
    category: 'Footwear & Slippers',
    quantity: 1,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#06b6d4',
    notes: 'Top layer of suitcase — essential immediately upon dorm check-in',
  },
  {
    id: 'w-17',
    name: 'Cotton Ankle Socks (Pairs)',
    category: 'Footwear & Slippers',
    quantity: 8,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#e2e8f0',
    notes: 'Breathable cotton',
  },

  // 6. Bottles, Liquids & Toiletries
  {
    id: 'w-18',
    name: 'Shampoo & Conditioner Bottles (>100ml)',
    category: 'Bottles, Liquids & Toiletries',
    quantity: 2,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#0284c7',
    notes: 'Double sealed in Ziploc bags. MUST be in checked luggage (>100ml)',
  },
  {
    id: 'w-19',
    name: 'Shower Gel & Body Lotion',
    category: 'Bottles, Liquids & Toiletries',
    quantity: 2,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#0d9488',
    notes: 'Checked luggage only. Taped caps to prevent cabin pressure leakage',
  },
  {
    id: 'w-20',
    name: 'Sunscreen SPF 50+ & Aloe Vera Gel',
    category: 'Bottles, Liquids & Toiletries',
    quantity: 2,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#eab308',
    notes: 'Intense tropical Hainan ultraviolet protection',
  },
  {
    id: 'w-21',
    name: 'Toothbrush & Travel Toothpaste (<100ml)',
    category: 'Bottles, Liquids & Toiletries',
    quantity: 1,
    targetBag: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#14b8a6',
    notes: 'Freshen up during Shanghai PVG 4h 50m layover',
  },
  {
    id: 'w-22',
    name: 'Microfiber Quick-Dry Towels',
    category: 'Bottles, Liquids & Toiletries',
    quantity: 2,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#67e8f9',
    notes: 'Fast drying travel towels for dorm arrival',
  },

  // 7. Medicine & First Aid (with sub-type tags)
  {
    id: 'w-med-1',
    name: 'Paracetamol / Panadol (500mg)',
    category: 'Medicine & First Aid',
    subType: 'Painkillers',
    quantity: 20,
    targetBag: 'Compact Fanny Pack / Crossbody',
    isBought: true,
    isPacked: false,
    colorHex: '#ef4444',
    notes: 'Headache, fever, and bodily fatigue relief during travel',
  },
  {
    id: 'w-med-2',
    name: 'Cetirizine / Antihistamines',
    category: 'Medicine & First Aid',
    subType: 'Prescription',
    quantity: 15,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#f97316',
    notes: 'Climate transition allergies & island humidity rash relief',
  },
  {
    id: 'w-med-3',
    name: 'Amoxicillin / Broad-Spectrum Antibiotics',
    category: 'Medicine & First Aid',
    subType: 'Antibiotics',
    quantity: 10,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#84cc16',
    notes: 'Prescription bacterial infection backup course',
  },
  {
    id: 'w-med-4',
    name: 'Daily Multivitamins & Zinc Capsules',
    category: 'Medicine & First Aid',
    subType: 'Vitamins',
    quantity: 30,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#10b981',
    notes: 'Immunity booster for first month adjustment',
  },
  {
    id: 'w-med-5',
    name: 'Dimenhydrinate (Motion Sickness Tablets)',
    category: 'Medicine & First Aid',
    subType: 'Motion Sickness',
    quantity: 10,
    targetBag: 'Compact Fanny Pack / Crossbody',
    isBought: true,
    isPacked: false,
    colorHex: '#06b6d4',
    notes: 'Flight air turbulence & airport taxi ride nausea prevention',
  },
  {
    id: 'w-med-6',
    name: 'Siddhalepa Herbal Balm & Inhaler',
    category: 'Medicine & First Aid',
    subType: 'Balm/Inhaler',
    quantity: 2,
    targetBag: 'Compact Fanny Pack / Crossbody',
    isBought: true,
    isPacked: false,
    colorHex: '#8b5cf6',
    notes: 'Head cold, muscular stiffness & nasal congestion relief',
  },

  // 8. Gifts & Souvenirs (Pre-populated)
  {
    id: 'w-gift-1',
    name: '3x Seashell Gifts',
    category: 'Gifts & Souvenirs',
    quantity: 3,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#ec4899',
    notes: 'Bubble-wrap and cushion carefully in checked luggage to prevent cracking during flight transit.',
  },
  {
    id: 'w-gift-2',
    name: '2x Handmade Wooden Wind-Sail Ships',
    category: 'Gifts & Souvenirs',
    quantity: 2,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#d97706',
    notes: 'Rigid cardboard padding so masts and rigging do not snap. For Academic Supervisor & Faculty.',
  },
  {
    id: 'w-gift-3',
    name: '2x Tiny Souvenir Elephants',
    category: 'Gifts & Souvenirs',
    quantity: 2,
    targetBag: 'Medium Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#64748b',
    notes: 'Wrap in decorative tissue paper for campus buddies and international student guides.',
  },
  {
    id: 'w-gift-4',
    name: 'Gift Wrapping & Protective Cushioning Task',
    category: 'Gifts & Souvenirs',
    quantity: 1,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#a855f7',
    notes: 'Wrap all 7 gift items securely in bubble wrap before Saturday suitcase lock-up.',
  },

  // 9. Daily Essentials, Cutlery & Folders (Pre-populated)
  {
    id: 'w-ess-1',
    name: 'Stainless Steel Cups & Coffee Mug',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 2,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#3b82f6',
    notes: 'Campus dorm daily tea/coffee and hot water drinking',
  },
  {
    id: 'w-ess-2',
    name: 'Stainless Steel Spoons & Forks',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 4,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#6366f1',
    notes: 'Personal cutlery set packed in travel pouch',
  },
  {
    id: 'w-ess-3',
    name: 'A4 Waterproof Zippered Document Folder',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 1,
    targetBag: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#059669',
    notes: 'Protects original medical, degree certificates, JW201, and admission letters',
  },
  {
    id: 'w-ess-4',
    name: 'Compact Windproof Sturdy Umbrella',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 1,
    targetBag: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#0284c7',
    notes: 'Immediate essential upon arrival for Haikou tropical downpours',
  },
  {
    id: 'w-ess-5',
    name: 'Academic Stationery & Black Ink Pens',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 4,
    targetBag: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#1e293b',
    notes: 'For filling arrival customs cards, campus registration forms, and notebook notes',
  },
  {
    id: 'w-ess-6',
    name: 'Universal Travel Power Adaptors (China Type A/I)',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 2,
    targetBag: 'Structured Tech Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#b45309',
    notes: 'China 3-prong slanted & 2-prong flat plug conversion for laptop and chargers',
  },
  {
    id: 'w-ess-7',
    name: 'Blue 43cm School Backpack (Packed Flat)',
    category: 'Daily Essentials, Cutlery & Folders',
    quantity: 1,
    targetBag: 'Main Large Rolling Suitcase',
    isBought: true,
    isPacked: false,
    colorHex: '#2563eb',
    notes: 'Packed flat inside large suitcase for lightweight daily campus classes',
  },
];

export const INITIAL_WARDROBE_ITEMS = INITIAL_WARDROBE;

// Initial Sequential Milestones
export const INITIAL_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm-1',
    dateBadge: 'Nov 6 • Friday',
    dateFull: 'Friday, November 6, 2026',
    title: 'Cash Stash & Roaming Clearances',
    summary: 'Morning bank currency conversion (USD & RMB cash). Afternoon gift packaging and testing Hiddify client across devices.',
    isCompleted: false,
    keyAction: 'Cash stash (USD $100s & RMB) • Gift wrapping (7 items) • Hiddify client setup',
    targetCategory: 'documents',
  },
  {
    id: 'm-2',
    dateBadge: 'Nov 7 • Saturday',
    dateFull: 'Saturday, November 7, 2026',
    title: 'Dry Run, OTP Drill & Luggage Lock-Up',
    summary: 'Test Dialog SMS OTP receipt on Samsung S20 FE, weigh both rolling suitcases to max 23.0kg, 100% full battery charge across 6 devices, and final suitcase lock-up.',
    isCompleted: false,
    keyAction: 'OTP drill • 23kg suitcase weigh-in • 100% full device charge • Suitcase lock-up',
    targetCategory: 'physical',
  },
  {
    id: 'm-3',
    dateBadge: 'Nov 8 • Sunday',
    dateFull: 'Sunday, November 8, 2026',
    title: 'Colombo CMB Departure (MU6018 at 20:50)',
    summary: 'Arrive at CMB at 17:20. Bag drop for 30×40×70cm & 27×41×57cm suitcases. Carry Dell, iPad, and power bank into cabin.',
    isCompleted: false,
    keyAction: '17:20 arrival • Check in 2 bags • Power bank cabin scan • 20:50 China Eastern takeoff',
    targetCategory: 'physical',
  },
  {
    id: 'm-4',
    dateBadge: 'Nov 9 • 06:05 AM',
    dateFull: 'Monday, November 9, 2026',
    title: 'Shanghai PVG T1 Transit (4h 50m Layover)',
    summary: 'Switch to CMLink travel eSIM. Clear immigration, collect BOTH checked suitcases from belts, clear customs, and re-check bags at domestic transfer counter for MU6381.',
    isCompleted: false,
    keyAction: 'eSIM data ON • Clear border • Collect 2 bags • Re-check bags at transfer desk • WeChat buddy touchpoint',
    targetCategory: 'connectivity',
  },
  {
    id: 'm-5',
    dateBadge: 'Nov 9 • 14:35 PM',
    dateFull: 'Monday, November 9, 2026',
    title: 'Haikou Landing & University Registration',
    summary: 'Domestic arrival. Collect both bags, take official outdoor taxi queue with driver pocket card, meet buddy at Haidian campus gate, check in dorm, and register with Ms. Sun.',
    isCompleted: false,
    keyAction: 'Domestic exit • Outdoor taxi queue (50-80 RMB) • Live location to buddy • Dorm key & registration',
    targetCategory: 'documents',
  },
];

// Preserved for fallback/types
export const INITIAL_PROCEDURE_STEPS: ProcedureStep[] = [
  {
    id: 'step-1',
    stage: 'arrival-campus',
    category: 'Airport Arrival',
    title: 'Step 1: Haikou Meilan Airport Arrival',
    detail: 'Touch down at 14:35. Follow domestic baggage exit signs to collect both rolling suitcases. Proceed directly to the official outdoor metered Taxi Stand (出租车) or meet your student buddy.',
    carryBag: 'Chest Fanny Pack & Taxi Card',
    isDone: false,
    isEditable: true,
  },
];

export const INITIAL_BANKING_TASKS: BankingTaskItem[] = [];
export const INITIAL_GIFTS: GiftItem[] = [];
