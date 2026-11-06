export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  targetBag: string;
  isBought: boolean;
  isPacked: boolean;
  colorHex?: string;
  notes?: string;
  photoUrl?: string;
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

export interface TimelineEvent {
  id: string;
  dayBadge: string;
  dateStr: string;
  title: string;
  subtitle: string;
  status: 'upcoming' | 'current' | 'future';
  isReady: boolean;
  isPacked: boolean;
  items: {
    id: string;
    label: string;
    detail?: string;
    isDone: boolean;
    appIcon?: string;
    targetBag?: string;
    mustContactBuddy?: boolean;
  }[];
}

// Default Options for Classification & Dropdowns
export const DEFAULT_WARDROBE_CATEGORIES: string[] = [
  'Dresses',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Footwear',
  'Essentials',
  'Undergarments',
  'Bottles & Liquids',
  'Wearables & Accessories',
  'Lab Coats & Gear',
  'Luggage',
  'Gifts & Packaging',
];

export const DEFAULT_BAG_LOCATIONS: string[] = [
  'Main Large Rolling Suitcase',
  'Medium Rolling Suitcase',
  'Structured Tech Laptop Backpack',
  'Compact Fanny Pack / Crossbody',
  'Wear on Flight',
];

export const DEFAULT_BANKS: string[] = [
  'Bank of Ceylon (BOC)',
  "People's Bank",
  'National Savings Bank (NSB)',
  'General / Cash Stash',
];

export const DEFAULT_APP_CATEGORIES: string[] = [
  'Stock AI & Academic',
  'Proxy & Bypass',
  'Essential Daily',
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

// Initial 4 Bags
export const INITIAL_BAGS: BagAsset[] = [
  {
    id: 'bag-large',
    name: 'Main Large Rolling Suitcase',
    type: 'Checked Bag 1 (China Eastern Included)',
    dimensions: '30 × 40 × 70 cm',
    weightLimit: '23 kg Checked Limit',
    targetBag: 'Checked at Colombo',
    recommendedContents: 'Heavy apparel, frocks, jeans, bedsheets, full-size liquids (>100ml), flattened 43cm school bag. Strict rule: NO lithium batteries or original document certificates.',
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
    name: 'Structured Tech Laptop Backpack',
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
    name: 'Compact Fanny Pack / Crossbody',
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

// Initial 6 Devices
export const INITIAL_DEVICES: DeviceAsset[] = [
  {
    id: 'dev-1',
    name: 'iPhone 17',
    model: 'Primary Daily Phone',
    role: 'Saily/Airalo Travel eSIM + Shadowrocket + Alipay & WeChat Pay',
    carrierOrOs: 'iOS 20 • Travel eSIM',
    carryLocation: 'Fanny Pack (Chest)',
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
    carryLocation: 'Fanny Pack (Chest)',
    isBought: true,
    isPacked: false,
    type: 'phone-android',
  },
  {
    id: 'dev-3',
    name: 'Dell Latitude 5410',
    model: '14" Windows Research Laptop',
    role: 'Food Science coursework + Clash Verge Rev + Offline Document Vault',
    carrierOrOs: 'Windows 11 Pro',
    carryLocation: 'Backpack Laptop Sleeve',
    isBought: true,
    isPacked: false,
    type: 'laptop',
  },
  {
    id: 'dev-4',
    name: 'Apple iPad 11',
    model: 'Tablet Workstation',
    role: 'Shadowrocket + Pleco + Offline Taxi Address Sign display',
    carrierOrOs: 'iPadOS',
    carryLocation: 'Backpack Tablet Sleeve',
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
    carryLocation: 'Fanny Pack / Backpack Pocket',
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
    carryLocation: 'Cabin Carry-On Backpack',
    isBought: false, // Default unbought (Red)
    isPacked: false,
    type: 'powerbank',
  },
];

// Initial Official Documents
export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-pass',
    title: 'Original Passport with Valid Chinese X1 Visa',
    issuer: 'Department of Immigration (Sri Lanka) & Chinese Embassy',
    carryLocation: 'Fanny Pack (Worn on Chest)',
    isReady: true,
    isPacked: false,
    notes: 'Undamaged bio page with single/multi-entry X1 study visa attached.',
    priority: 'Critical',
  },
  {
    id: 'doc-admit',
    title: 'Official Admission Notice (#263660001)',
    issuer: 'School of Food Science and Engineering, Hainan University',
    carryLocation: 'A4 Waterproof Folder (Cabin Backpack)',
    isReady: true,
    isPacked: false,
    notes: 'Page 1 (Chinese stamped full scholarship) & Page 2 (English). Signed & dated.',
    priority: 'Critical',
  },
  {
    id: 'doc-jw202',
    title: 'Confirmation Form for Study in China (JW202)',
    issuer: 'Ministry of Education of the People\'s Republic of China',
    carryLocation: 'A4 Waterproof Folder (Cabin Backpack)',
    isReady: true,
    isPacked: false,
    notes: 'Official government stamped visa authorization certificate.',
    priority: 'Critical',
  },
  {
    id: 'doc-med',
    title: 'ORIGINAL Foreigner Physical Examination Form',
    issuer: 'Designated Government Hospital Stamp',
    carryLocation: 'A4 Waterproof Folder (Cabin Backpack)',
    isReady: true,
    isPacked: false,
    notes: 'Must bear real physical clinic/physician ink stamp (not just a scan).',
    priority: 'High',
  },
  {
    id: 'doc-blood',
    title: 'ORIGINAL Blood Test Laboratory Reports',
    issuer: 'Clinical Laboratory Slips',
    carryLocation: 'A4 Waterproof Folder (Cabin Backpack)',
    isReady: true,
    isPacked: false,
    notes: 'HIV, Hepatitis B, Syphilis, and chest X-ray laboratory slips.',
    priority: 'High',
  },
  {
    id: 'doc-deg',
    title: 'Bachelor\'s Degree Certificate & Official Transcripts',
    issuer: 'Graduating University',
    carryLocation: 'A4 Waterproof Folder (Cabin Backpack)',
    isReady: true,
    isPacked: false,
    notes: 'Original diploma + certified English notarized copies for Master\'s verification.',
    priority: 'High',
  },
  {
    id: 'doc-photo',
    title: 'Four (4) Printed Passport Photos',
    issuer: 'Standard 33×48mm Chinese Visa Specs',
    carryLocation: 'Fanny Pack (Worn on Chest)',
    isReady: true,
    isPacked: false,
    notes: 'Matches visa photograph exactly. Required for campus student ID badge.',
    priority: 'Medium',
  },
];

// Initial Stock Apps & Communication (Default 0% unchecked, deduplicated, multi-device)
export const INITIAL_APPS: AppConfigItem[] = [
  // Great Firewall Bypass & Proxy
  {
    id: 'app-sr',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'Shadowrocket',
    category: 'Proxy & Bypass',
    role: 'Primary iOS rule-based proxy client with active Jichang subscription imported in Sri Lanka.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'shadowrocket',
  },
  {
    id: 'app-v2',
    platform: 'Android',
    devices: ['Samsung S20 FE'],
    name: 'v2rayNG',
    category: 'Proxy & Bypass',
    role: 'Android proxy client for Samsung S20 FE with backup Jichang nodes (VLESS/Shadowsocks).',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'v2ray',
  },
  {
    id: 'app-clash',
    platform: 'Windows',
    devices: ['Dell Laptop'],
    name: 'Clash Verge Rev',
    category: 'Proxy & Bypass',
    role: 'Windows research proxy with System Proxy & TUN Mode on Dell Latitude 5410.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'clash',
  },

  // Essential Mainland Chinese Ecosystem
  {
    id: 'app-wechat',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Dell Laptop', 'Apple iPad 11'],
    name: 'WeChat (微信)',
    category: 'Essential Daily',
    role: 'Campus lifeline, faculty messaging with Ms. Sun, student guide calls & campus mini-programs.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'wechat',
  },
  {
    id: 'app-alipay',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE'],
    name: 'Alipay (支付宝)',
    category: 'Essential Daily',
    role: 'Primary QR mobile payment bound to Sri Lankan Visa/Mastercards + DiDi Mini-program.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'alipay',
  },
  {
    id: 'app-didi',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'DiDi Ride Hailing (滴滴出行)',
    category: 'Transit & Maps',
    role: 'English ride-hailing app with automatic driver chat translation and cashless billing.',
    isInstalled: false,
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
    isConfigured: false,
    appIcon: 'amap',
  },
  {
    id: 'app-baidu',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE'],
    name: 'Baidu Maps (百度地图)',
    category: 'Transit & Maps',
    role: 'Secondary campus gate GPS walking routes & offline map downloads.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'baidu',
  },
  {
    id: 'app-metro',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'MetroMan (地铁通)',
    category: 'Transit & Maps',
    role: 'Offline national metro transit network maps with transfer calculators (Shanghai PVG transit).',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'metroman',
  },
  {
    id: 'app-meituan',
    platform: 'iOS',
    devices: ['iPhone 17'],
    name: 'Meituan (美团)',
    category: 'Essential Daily',
    role: 'Campus food delivery, bottled water replenishment & Haikou dorm supplies.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'meituan',
  },
  {
    id: 'app-taobao',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'Taobao (淘宝)',
    category: 'Essential Daily',
    role: 'Online dorm essentials, bedding, kitchen utensils & university stationery shopping.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'taobao',
  },
  {
    id: 'app-trip',
    platform: 'iOS',
    devices: ['iPhone 17', 'Dell Laptop'],
    name: 'Trip.com',
    category: 'Transit & Maps',
    role: 'Flight booking check, domestic high-speed train tickets & e-ticket verification.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'tripdotcom',
  },

  // Academic, AI & Translation
  {
    id: 'app-pleco',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11'],
    name: 'Pleco Chinese Dictionary',
    category: 'Essential Daily',
    role: 'Offline Chinese-English dictionary with optical OCR camera character scanner (download packs in Sri Lanka).',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'pleco',
  },
  {
    id: 'app-deepl',
    platform: 'iOS',
    devices: ['iPhone 17', 'Dell Laptop'],
    name: 'DeepL Translate',
    category: 'Stock AI & Academic',
    role: 'High accuracy academic document translation for Food Science coursework.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'deepl',
  },
  {
    id: 'app-gtrans',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE'],
    name: 'Google Translate',
    category: 'Essential Daily',
    role: 'Offline Chinese language pack downloaded in Sri Lanka for instant camera translation.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'google-translate',
  },
  {
    id: 'app-gpt',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Dell Laptop', 'Apple iPad 11'],
    name: 'ChatGPT',
    category: 'Stock AI & Academic',
    role: 'AI research assistant for Master\'s thesis literature reviews (routes via proxy).',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'chatgpt',
  },
  {
    id: 'app-gemini',
    platform: 'iOS',
    devices: ['iPhone 17', 'Samsung S20 FE', 'Dell Laptop', 'Apple iPad 11'],
    name: 'Google Gemini',
    category: 'Stock AI & Academic',
    role: 'Multimodal AI research tool for Food Science and Engineering problem solving.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'gemini',
  },
  {
    id: 'app-gsuite',
    platform: 'iOS',
    devices: ['iPhone 17', 'Apple iPad 11', 'Dell Laptop'],
    name: 'Google Suite (Gmail, Drive)',
    category: 'Stock AI & Academic',
    role: 'Academic paper repositories and university file cloud synchronization.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'google',
  },
  {
    id: 'app-zotero',
    platform: 'Windows',
    devices: ['Dell Laptop', 'Apple iPad 11'],
    name: 'Zotero & Google Scholar',
    category: 'Stock AI & Academic',
    role: 'Citation management & Food Science and Engineering research paper indexing.',
    isInstalled: false,
    isConfigured: false,
    appIcon: 'zotero',
  },
];

export const INITIAL_INTERNET_APPS = INITIAL_APPS;

// Initial Wardrobe Items
export const INITIAL_WARDROBE: WardrobeItem[] = [
  // Dresses
  {
    id: 'w-1',
    name: 'Casual Cotton/Linen Day Frocks',
    category: 'Dresses',
    quantity: 4,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#38bdf8',
    notes: 'Breathable lightweight fabrics for tropical island weather',
  },
  {
    id: 'w-2',
    name: 'Smart-Casual Modest Midi Dress',
    category: 'Dresses',
    quantity: 2,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#6366f1',
    notes: 'For Welcome Ceremony / Faculty presentations',
  },
  {
    id: 'w-3',
    name: 'Lightweight Tropical Sundresses',
    category: 'Dresses',
    quantity: 3,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#ec4899',
    notes: 'Warm weather campus wear',
  },

  // Tops
  {
    id: 'w-4',
    name: 'Breathable Cotton T-Shirts',
    category: 'Tops',
    quantity: 6,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#f59e0b',
    notes: 'Daily campus rotation',
  },
  {
    id: 'w-5',
    name: 'Smart Collared Blouses / Shirts',
    category: 'Tops',
    quantity: 3,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#10b981',
    notes: 'Meeting professors & academic supervisors',
  },
  {
    id: 'w-6',
    name: 'Spare Fresh Top',
    category: 'Tops',
    quantity: 1,
    targetBag: 'Cabin Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#8b5cf6',
    notes: 'Emergency outfit change during long transit',
  },

  // Bottoms
  {
    id: 'w-7',
    name: 'Full-Length Jeans / Trousers',
    category: 'Bottoms',
    quantity: 3,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#1e3a8a',
    notes: 'Mandatory Food Science laboratory safety wear',
  },
  {
    id: 'w-8',
    name: 'Wide-Leg Linen / Cotton Pants',
    category: 'Bottoms',
    quantity: 3,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#d97706',
    notes: 'Comfortable classroom lecture wear',
  },
  {
    id: 'w-9',
    name: 'Casual Skirts / Shorts',
    category: 'Bottoms',
    quantity: 3,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#059669',
    notes: 'Dorm & casual wear',
  },
  {
    id: 'w-10',
    name: 'Travel Joggers / Track Pants',
    category: 'Bottoms',
    quantity: 1,
    targetBag: 'Wear on Flight',
    isBought: true,
    isPacked: false,
    colorHex: '#334155',
    notes: 'Comfortable clothing for 10+ hours transit',
  },

  // Outerwear
  {
    id: 'w-11',
    name: 'Light Zip-Up Hoodie / Cardigan',
    category: 'Outerwear',
    quantity: 2,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#475569',
    notes: 'Cold airplane cabin & heavily air-conditioned labs',
  },
  {
    id: 'w-12',
    name: 'Light Winter Jacket / Windbreaker',
    category: 'Outerwear',
    quantity: 1,
    targetBag: 'Cabin Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#0284c7',
    notes: 'Shanghai transit & cooler Haikou winter evenings',
  },
  {
    id: 'w-13',
    name: 'Waterproof Rain Jacket + Sturdy Umbrella',
    category: 'Outerwear',
    quantity: 1,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#059669',
    notes: 'Haikou tropical downpours',
  },

  // Footwear
  {
    id: 'w-14',
    name: 'Closed-Toe Walking Sneakers',
    category: 'Footwear',
    quantity: 1,
    targetBag: 'Wear on Flight',
    isBought: true,
    isPacked: false,
    colorHex: '#ffffff',
    notes: 'Required for Food Science labs and long transit walks',
  },
  {
    id: 'w-15',
    name: 'Backup Everyday Sneakers / Flats',
    category: 'Footwear',
    quantity: 1,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#f1f5f9',
    notes: 'Alternate walking pair',
  },
  {
    id: 'w-16',
    name: 'Comfortable Walking Sandals',
    category: 'Footwear',
    quantity: 1,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#d97706',
    notes: 'Warm campus days',
  },
  {
    id: 'w-17',
    name: 'Waterproof Bathroom Slippers',
    category: 'Footwear',
    quantity: 1,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#06b6d4',
    notes: 'Essential immediately upon dorm check-in',
  },
  {
    id: 'w-18',
    name: 'Cotton Ankle Socks (Pairs)',
    category: 'Footwear',
    quantity: 8,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#e2e8f0',
    notes: 'Breathable cotton',
  },

  // Essentials
  {
    id: 'w-19',
    name: 'Cotton Pajama Sets / Nightwear',
    category: 'Essentials',
    quantity: 3,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#fbcfe8',
    notes: 'Light breathable cotton',
  },
  {
    id: 'w-20',
    name: 'Undergarments & Bras',
    category: 'Essentials',
    quantity: 14,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#cbd5e1',
    notes: '2-week supply packed in mesh laundry bags',
  },
  {
    id: 'w-21',
    name: 'Microfiber Quick-Dry Towels',
    category: 'Essentials',
    quantity: 2,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#67e8f9',
    notes: 'Fast drying travel towels',
  },

  // Luggage & Organizers
  {
    id: 'w-22',
    name: 'Structured Tech Laptop Backpack (~45cm)',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Cabin Laptop Backpack',
    isBought: false, // Default unbought (Red)
    isPacked: false,
    colorHex: '#b45309',
    notes: 'Holds Dell 5410, iPad 11, Soundcore Earbuds & A4 Folder',
  },
  {
    id: 'w-23',
    name: 'Compact Fanny Pack / Crossbody',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Fanny Pack',
    isBought: true,
    isPacked: false,
    colorHex: '#881337',
    notes: 'Passport, iPhone 17, S20 FE, Bank Cards, Cash',
  },
  {
    id: 'w-24',
    name: 'Blue 43cm School Backpack (Packed Flat)',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    colorHex: '#2563eb',
    notes: 'For lightweight daily classes on campus',
  },
  {
    id: 'w-25',
    name: 'A4 Waterproof Zippered Document Folder',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Cabin Laptop Backpack',
    isBought: true,
    isPacked: false,
    colorHex: '#475569',
    notes: 'Original medical and degree certificates',
  },
];

export const INITIAL_WARDROBE_ITEMS = INITIAL_WARDROBE;

// Initial Sequential Milestones
export const INITIAL_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm-1',
    dateBadge: 'Nov 6 • Friday',
    dateFull: 'Friday, November 6, 2026',
    title: 'Bank Run, Cash Stash & Roaming Clearances',
    summary: 'Morning bank visits to BOC, People\'s Bank, and NSB before 3:00 PM for foreign study declarations, international card unlocks, and currency conversion (USD & RMB cash). Afternoon gift packaging and testing proxy subscriptions across all devices.',
    isCompleted: false,
    keyAction: 'BOC/People\'s/NSB bank run • Cash stash (USD $100s & RMB) • Gift wrapping (7 items) • Proxy subscription setup',
    targetCategory: 'documents',
  },
  {
    id: 'm-2',
    dateBadge: 'Nov 7 • Saturday',
    dateFull: 'Saturday, November 7, 2026',
    title: 'Dry Run, OTP Drill & Luggage Lock-Up',
    summary: 'Test Dialog SMS OTP receipt on Samsung S20 FE, test proxy nodes on Wi-Fi, weigh both rolling suitcases to max 23.0kg, 100% full battery charge across 6 devices, and final suitcase lock-up.',
    isCompleted: false,
    keyAction: 'OTP drill • Jichang node latency test • 23kg suitcase weigh-in • 100% full device charge • Suitcase lock-up',
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
    summary: 'Switch to Saily/Airalo travel eSIM. Clear immigration, collect BOTH checked suitcases from belts, clear customs, and re-check bags at domestic transfer counter for MU6381.',
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

// Initial 4 Clean Campus Registration & Arrival Action Steps (Read-only visual guide, editable)
export const INITIAL_PROCEDURE_STEPS: ProcedureStep[] = [
  {
    id: 'step-1',
    stage: 'arrival-campus',
    category: 'Airport Arrival',
    title: 'Step 1: Haikou Meilan Airport Arrival',
    detail: 'Touch down at 14:35. Follow domestic baggage exit signs to collect both rolling suitcases. Proceed directly to the official outdoor metered Taxi Stand (出租车) or meet your student buddy. Show the driver the printed bilingual Taxi Pocket Card (海南大学海甸校区南门). Keep Passport with X1 Visa, Admission Notice #263660001, and JW202 in your chest fanny pack. Do NOT follow private unmetered touts inside the terminal.',
    carryBag: 'Chest Fanny Pack & Taxi Card',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'step-2',
    stage: 'arrival-campus',
    category: 'Campus Entry & Dorm',
    title: 'Step 2: Haidian Campus South Gate (No. 58 Renmin Ave) & Dorm Check-in',
    detail: 'Arrive at Hainan University Haidian Campus South Gate (海南大学海甸校区南门 - 人民大道58号). Report directly to the International Student Dormitory front desk (Overseas Student Apartment). Present Passport and Admission Notice. Collect room key, air conditioning remote, and electricity card. Pay the room deposit in physical RMB cash (approx 300–500 RMB) if local WeChat Pay is not active yet.',
    carryBag: 'Dorm Front Desk (Cash Deposit)',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'step-3',
    stage: 'arrival-campus',
    category: 'Faculty Registration',
    title: 'Step 3: International Student Office Registration',
    detail: 'Report to the International Students Office (Ms. Sun, Office Phone: 0898-66291354). Submit: 1) Original Passport with X1 Visa, 2) Official Admission Notice #263660001, 3) JW202 Form, 4) Original Physical Examination Record & Blood Test Slips, and 5) 8 printed matte passport photos (33×48mm). Complete your arrival registry and obtain student orientation handbook.',
    carryBag: 'A4 Waterproof Folder (Backpack)',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'step-4',
    stage: 'arrival-campus',
    category: 'Banking & Residence Permit',
    title: 'Step 4: Local Chinese SIM Card & Chinese Bank Account',
    detail: 'Visit campus China Mobile or China Telecom booth with your passport to activate a local Chinese (+86) phone number. Open a local Chinese bank account on campus (ICBC or Bank of China) with your Admission Notice and Passport to unlock full local WeChat Pay and Alipay functionality. Mandatory: Apply for Foreigner Residence Permit within 30 days of arrival.',
    carryBag: 'Campus Bank Branch & Telecom Booth',
    isDone: false,
    isEditable: true,
  },
];

// Initial Banking Tasks for Friday Morning Bank Run
export const INITIAL_BANKING_TASKS: BankingTaskItem[] = [
  // 1. Cash Stash & Currency Conversion
  {
    id: 'bank-cash-1',
    bank: 'General / Cash Stash',
    title: 'Physical USD & CNY Cash Stash',
    detail: 'Withdraw and convert physical cash reserve: crisp, uncreased USD $100 bills (2013 series or newer, no stamps/tears) + 1,500 to 3,000 CNY in physical Yuan notes (including 10/20/50 RMB denominations for airport arrival, initial meals, and campus essentials before Chinese bank activation).',
    isDone: false,
    priority: 'Critical',
  },
  {
    id: 'bank-cash-2',
    bank: 'General / Cash Stash',
    title: 'Passport Foreign Currency Endorsement',
    detail: 'Have the bank officially endorse the physical passport for foreign currency cash notes issued under the student travel allowance.',
    isDone: false,
    priority: 'High',
  },

  // 2. Bank of Ceylon (BOC)
  {
    id: 'bank-boc-1',
    bank: 'Bank of Ceylon (BOC)',
    title: 'Foreign Travel & E-Commerce Activation',
    detail: 'Submit travel notification for China (Nov 2026 – 2029) to whitelist BOC Debit Card (Visa/Mastercard) for international POS and ATM usage so fraud detection does not block it in Haikou.',
    isDone: false,
    priority: 'Critical',
  },
  {
    id: 'bank-boc-2',
    bank: 'Bank of Ceylon (BOC)',
    title: 'Alipay & WeChat Pay 3DS Whitelisting',
    detail: 'Request activation for international e-commerce / 3D Secure (3DS) transactions specifically so the BOC card can be bound to Alipay and WeChat Pay as an international bank card.',
    isDone: false,
    priority: 'Critical',
  },
  {
    id: 'bank-boc-3',
    bank: 'Bank of Ceylon (BOC)',
    title: 'Dialog SMS Roaming OTP Check',
    detail: 'Confirm primary Sri Lankan Dialog mobile number (on Samsung S20 FE) is linked to receive SMS OTP alerts abroad.',
    isDone: false,
    priority: 'High',
  },
  {
    id: 'bank-boc-4',
    bank: 'Bank of Ceylon (BOC)',
    title: 'Student File & CBSL Form 1 Inquiry (Optional Backup)',
    detail: 'Verify if a formal Student File is needed since she is on an English-Taught Full Scholarship (no tuition wire needed), ensuring emergency family remittances are permitted if ever required.',
    isDone: false,
    priority: 'Medium',
  },

  // 3. People's Bank
  {
    id: 'bank-pb-1',
    bank: "People's Bank",
    title: 'International Debit Card Activation',
    detail: 'Enable overseas POS/ATM swipe and international online gateway access for China.',
    isDone: false,
    priority: 'Critical',
  },
  {
    id: 'bank-pb-2',
    bank: "People's Bank",
    title: 'Daily Withdrawal & Spend Limit Check',
    detail: 'Confirm daily foreign currency ATM withdrawal cap (under Sri Lankan exchange regulations) and POS spend limit in RMB/USD equivalents.',
    isDone: false,
    priority: 'High',
  },
  {
    id: 'bank-pb-3',
    bank: "People's Bank",
    title: "People's Wave App & SMS Alert Verification",
    detail: 'Test login credentials and ensure SMS OTP alerts are routed to the Dialog roaming SIM.',
    isDone: false,
    priority: 'High',
  },

  // 4. National Savings Bank (NSB)
  {
    id: 'bank-nsb-1',
    bank: 'National Savings Bank (NSB)',
    title: 'Card Roaming & Reserve Verification',
    detail: 'Check if NSB Debit Card supports international POS/ATM usage in China, or designate NSB as the Sri Lankan LKR/FD reserve account linked via online banking.',
    isDone: false,
    priority: 'High',
  },
  {
    id: 'bank-nsb-2',
    bank: 'National Savings Bank (NSB)',
    title: 'Standing Instructions & Online Access',
    detail: 'Verify online banking access from overseas and confirm OTP delivery settings.',
    isDone: false,
    priority: 'Medium',
  },
];

// Initial Gifts & Souvenirs for Hainan University Professors & Buddies
export const INITIAL_GIFTS: GiftItem[] = [
  {
    id: 'gift-1',
    name: '3x Seashell Gifts',
    quantity: 3,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    packagingNote: 'Bubble-wrap and cushion carefully in checked luggage to prevent cracking during flight transit.',
    recipient: 'Friends & Dorm Mates',
    isPacked: false,
  },
  {
    id: 'gift-2',
    name: '2x Handmade Wooden Wind-Sail Ships',
    quantity: 2,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    packagingNote: 'Disassemble sails if detachable or box in rigid cardboard padding so masts and rigging do not snap.',
    recipient: 'Academic Supervisor & International Office',
    isPacked: false,
  },
  {
    id: 'gift-3',
    name: '2x Tiny Souvenir Elephants',
    quantity: 2,
    targetBag: 'Medium Suitcase (27×41×57cm)',
    packagingNote: 'Wrap in decorative tissue or gift paper for professors and campus buddies.',
    recipient: 'Campus Buddies & Guides',
    isPacked: false,
  },
  {
    id: 'gift-4',
    name: 'Gift Wrapping & Protective Cushioning Task',
    quantity: 1,
    targetBag: 'Main Large Suitcase (30×40×70cm)',
    packagingNote: 'Wrap all 7 gift items in protective bubble-wrap packaging and label them before Saturday suitcase lock-up.',
    recipient: 'Pre-Departure Preparation',
    isPacked: false,
  },
];
