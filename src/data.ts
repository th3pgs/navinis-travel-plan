export interface WardrobeItem {
  id: string;
  name: string;
  category: 'Dresses' | 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Essentials' | 'Luggage';
  quantity: number;
  targetBag: 'Main Large Suitcase (30×40×70cm)' | 'Medium Suitcase (27×41×57cm)' | 'Cabin Laptop Backpack' | 'Fanny Pack' | 'Wear on Flight';
  isBought: boolean;
  isPacked: boolean;
  colorHex?: string;
  notes?: string;
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
  kind: 'rolling-large' | 'rolling-medium' | 'backpack' | 'fannypack';
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
  {
    id: 'doc-bank',
    title: 'Foreign Study Declaration Notice (BOC, People\'s, NSB)',
    issuer: 'Commercial Banks in Sri Lanka',
    carryLocation: 'Fanny Pack (Zippered Pocket)',
    isReady: false,
    isPacked: false,
    notes: 'Declaration slip confirming foreign study period (Nov 2026 – July 2029).',
    priority: 'High',
  },
];

// Initial Stock Apps & Communication
export const INITIAL_APPS: AppConfigItem[] = [
  // Great Firewall Bypass & Proxy
  {
    id: 'app-sr',
    platform: 'iOS',
    name: 'Shadowrocket',
    category: 'Proxy & Bypass',
    role: 'Primary iOS rule-based proxy client with active Ji Chang subscription imported.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'shadowrocket',
  },
  {
    id: 'app-v2',
    platform: 'Android',
    name: 'v2rayNG',
    category: 'Proxy & Bypass',
    role: 'Android proxy client for Samsung S20 FE with backup Ji Chang nodes on Wi-Fi.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'shadowrocket',
  },
  {
    id: 'app-clash',
    platform: 'Windows',
    name: 'Clash Verge Rev',
    category: 'Proxy & Bypass',
    role: 'Windows Research proxy with System Proxy & TUN Mode on Dell Latitude 5410.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'shadowrocket',
  },

  // Stock AI & Global Services
  {
    id: 'app-gpt',
    platform: 'iOS',
    name: 'ChatGPT',
    category: 'Stock AI & Academic',
    role: 'AI research assistant for Master\'s thesis literature reviews (routes via proxy).',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'chatgpt',
  },
  {
    id: 'app-gemini',
    platform: 'iOS',
    name: 'Google Gemini',
    category: 'Stock AI & Academic',
    role: 'Multimodal AI research tool for Food Science and Engineering problem solving.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'gemini',
  },
  {
    id: 'app-gsuite',
    platform: 'iOS',
    name: 'Google Suite (Gmail, Drive, Scholar)',
    category: 'Stock AI & Academic',
    role: 'Academic paper repositories and university file synchronization.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'google',
  },
  {
    id: 'app-deepl',
    platform: 'iOS',
    name: 'DeepL Translate',
    category: 'Stock AI & Academic',
    role: 'High accuracy academic document translation.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'deepl',
  },

  // Essential Mainland Chinese Ecosystem
  {
    id: 'app-wechat',
    platform: 'iOS',
    name: 'WeChat (微信)',
    category: 'Essential Daily',
    role: 'Campus lifeline, faculty messaging with Ms. Sun, and student buddy voice calls.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'wechat',
  },
  {
    id: 'app-alipay',
    platform: 'iOS',
    name: 'Alipay (支付宝)',
    category: 'Essential Daily',
    role: 'Primary QR mobile payment bound to Sri Lankan Visa/Mastercards + DiDi Mini-program.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'alipay',
  },
  {
    id: 'app-didi',
    platform: 'iOS',
    name: 'DiDi English',
    category: 'Transit & Maps',
    role: 'English ride-hailing app with automatic driver chat translation and cashless billing.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'didi',
  },
  {
    id: 'app-baidu',
    platform: 'iOS',
    name: 'Baidu Maps (百度地图)',
    category: 'Transit & Maps',
    role: 'Accurate campus gate GPS walking routes in China.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'baidu',
  },
  {
    id: 'app-metro',
    platform: 'iOS',
    name: 'MetroMan (地铁通)',
    category: 'Transit & Maps',
    role: 'Offline national metro transit network maps with transfer calculators.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'metroman',
  },
  {
    id: 'app-pleco',
    platform: 'iOS',
    name: 'Pleco Chinese Dictionary',
    category: 'Essential Daily',
    role: 'Offline Chinese-English dictionary with optical OCR camera character scanner.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'pleco',
  },
  {
    id: 'app-meituan',
    platform: 'iOS',
    name: 'Meituan (美团)',
    category: 'Essential Daily',
    role: 'Campus food delivery, bottled water replenishment, and Haikou essentials.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'meituan',
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
    title: 'Bank Deadlines & Roaming Clearances',
    summary: 'Branch visits to BOC, People\'s Bank, and NSB before 3:00 PM close for foreign study declaration and card unlocks.',
    isCompleted: false,
    keyAction: 'BOC/People\'s/NSB branch visit • Dialog Roaming check • Buy 45cm backpack & CCC power bank',
    targetCategory: 'physical',
  },
  {
    id: 'm-2',
    dateBadge: 'Nov 7 • Saturday',
    dateFull: 'Saturday, November 7, 2026',
    title: 'Dry Run, OTP Drill & Luggage Weigh-In',
    summary: 'Test Dialog SMS OTP receipt on Samsung S20 FE, test VPN configs on Wi-Fi, weigh both rolling suitcases to max 23kg.',
    isCompleted: false,
    keyAction: 'OTP test • VPN node latency test • 23kg weigh-in • 100% full charge on all 6 devices',
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

// Initial Procedure Steps across 5 Key Stages (editable, addable, deletable)
export const INITIAL_PROCEDURE_STEPS: ProcedureStep[] = [
  // Stage 1: Pre-Departure Sri Lanka
  {
    id: 'p-1',
    stage: 'prep-srilanka',
    category: 'Banking & Mobile',
    title: 'Visit BOC, People\'s Bank & NSB Branches',
    detail: 'Complete Foreign Study Declaration and verify international debit card unlocks for online transactions before 3:00 PM.',
    carryBag: 'Fanny Pack (Bank cards & cash)',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-2',
    stage: 'prep-srilanka',
    category: 'Mobile Network',
    title: 'Activate Dialog Roaming for SMS OTPs',
    detail: 'Ensure Dialog SMS roaming is enabled on Samsung S20 FE. Turn Mobile Data and Data Roaming OFF to prevent high roaming charges.',
    carryBag: 'Samsung S20 FE in Fanny Pack',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-3',
    stage: 'prep-srilanka',
    category: 'Luggage Prep',
    title: 'Luggage Weigh-In & Labeling',
    detail: 'Weigh Main Suitcase (30×40×70cm) and Medium Suitcase (27×41×57cm) with luggage scale. Must not exceed 23.0 kg each. Fasten name tags.',
    carryBag: 'Checked Bags',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-4',
    stage: 'prep-srilanka',
    category: 'Purchases',
    title: 'Purchase Tech Laptop Backpack & 10,000mAh Power Bank',
    detail: 'Get the ~45cm carry-on backpack and CCC-certified power bank from trusted store in Colombo.',
    carryBag: 'Carry-On Backpack',
    isDone: false,
    isEditable: true,
  },

  // Stage 2: Colombo Airport Departure (CMB)
  {
    id: 'p-5',
    stage: 'airport-cmb',
    category: 'Check-In',
    title: 'Arrive at Bandaranaike Airport (17:20 PM)',
    detail: 'Arrive 3.5 hours prior to China Eastern MU6018 (20:50 takeoff). Have passport, Admission Notice, and e-ticket receipt ready at entrance security.',
    carryBag: 'Fanny Pack',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-6',
    stage: 'airport-cmb',
    category: 'Baggage Drop',
    title: 'China Eastern Check-In & Bag Drop',
    detail: 'Present passport & Admission Notice #263660001. Drop 2 checked suitcases. Note: Luggage tags will read PVG (Must be collected in Shanghai!). Obtain boarding pass for MU6018.',
    carryBag: 'Check-In Counter',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-7',
    stage: 'airport-cmb',
    category: 'Cabin Security',
    title: 'Security Screening (Laptops & Battery Out)',
    detail: 'Remove Dell 5410, iPad 11, and CCC Power Bank into separate security trays. DO NOT put liquids over 100ml in cabin bag.',
    carryBag: 'Cabin Backpack',
    isDone: false,
    isEditable: true,
  },

  // Stage 3: Shanghai Pudong (PVG T1) International Arrival & Transit
  {
    id: 'p-8',
    stage: 'transit-pvg',
    category: 'Connectivity',
    title: 'Turn On Saily/Airalo Travel eSIM',
    detail: 'Upon landing at 06:05 AM, toggle iPhone 17 cellular data to Travel eSIM. Verify network connection and bypass of GFW.',
    carryBag: 'iPhone 17 (Fanny Pack)',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-9',
    stage: 'transit-pvg',
    category: 'Immigration',
    title: 'Immigration & Border Inspection',
    detail: 'Follow "Exit / Baggage Claim" signs to China Border Inspection. Present Passport with X1 Visa, Admission Notice, and JW202 form.',
    carryBag: 'Fanny Pack & A4 Folder',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-10',
    stage: 'transit-pvg',
    category: 'Baggage Reclaim',
    title: 'Collect BOTH Checked Suitcases from Belts',
    detail: 'CRITICAL: You must collect your 30×40×70cm and 27×41×57cm suitcases from the international baggage carousels. China Eastern does NOT transfer international to domestic automatically!',
    carryBag: 'International Baggage Belts',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-11',
    stage: 'transit-pvg',
    category: 'Domestic Transfer',
    title: 'Clear Customs & Domestic Transfer Bag Re-Check',
    detail: 'Walk through China Customs with your 2 suitcases. Follow signs to Domestic Departures (T1). Re-check both bags at China Eastern domestic transfer counters for MU6381 (departs 10:55).',
    carryBag: 'T1 Domestic Transfer Counter',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-12',
    stage: 'transit-pvg',
    category: 'Buddy Contact',
    title: 'Send Transit Status Message to Campus Buddy',
    detail: 'Use the pre-formatted iMessage template on WeChat to inform Hainan University buddy that you have checked in for MU6381 and will arrive in Haikou at 14:35.',
    carryBag: 'WeChat on iPhone 17',
    isDone: false,
    isEditable: true,
  },

  // Stage 4: Haikou Meilan (HAK) Domestic Arrival
  {
    id: 'p-13',
    stage: 'flight-hak',
    category: 'Luggage Reclaim',
    title: 'Haikou Meilan Arrival & Collect Suitcases',
    detail: 'Touch down at 14:35 PM. Follow domestic arrival signs directly to baggage carousels. Retrieve both suitcases.',
    carryBag: 'Domestic Baggage Belts',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-14',
    stage: 'flight-hak',
    category: 'Ground Transit',
    title: 'Proceed to Official Outdoor Taxi Stand',
    detail: 'Follow ground signs for "Taxi (出租车)". Never accept private touts inside the terminal. Stand in official outdoor queue.',
    carryBag: 'Outdoor Taxi Stand',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-15',
    stage: 'flight-hak',
    category: 'Ground Transit',
    title: 'Show Taxi Destination Pocket Card to Driver',
    detail: 'Show driver the Chinese address card: 海南大学（海甸校区）南门 (South Gate). Fare is approx 50–80 RMB on the meter. Pay via Alipay or cash.',
    carryBag: 'Taxi Pocket Card (Mobile/Printed)',
    isDone: false,
    isEditable: true,
  },

  // Stage 5: Hainan University Registration & Early Dorm Check-In
  {
    id: 'p-16',
    stage: 'arrival-campus',
    category: 'Campus Entry',
    title: 'Arrive at Haidian Campus South Gate & Meet Buddy',
    detail: 'Hainan University Haidian Campus South Gate (No. 58 Renmin Avenue). Meet your assigned student guide / international volunteer.',
    carryBag: 'Haidian Campus South Gate',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-17',
    stage: 'arrival-campus',
    category: 'Accommodation',
    title: 'International Student Dormitory Check-In',
    detail: 'Proceed to overseas student apartment front desk. Present Passport and Admission Notice. Collect room key, air conditioning remote, and electricity card.',
    carryBag: 'Overseas Student Building',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-18',
    stage: 'arrival-campus',
    category: 'Registration',
    title: 'Report to International Students Office (Ms. Sun)',
    detail: 'Office phone: 0898-66291354. Submit original physical examination forms, blood test slips, and degree certificates. If arriving before official Nov 17 registration, complete early arrival registry.',
    carryBag: 'A4 Waterproof Folder (Backpack)',
    isDone: false,
    isEditable: true,
  },
  {
    id: 'p-19',
    stage: 'arrival-campus',
    category: 'Settling In',
    title: 'Purchase Local Essentials & Dorm Supplies',
    detail: 'Visit campus supermarket (Canteen 1 / South Gate shops) for drinking water, bedding sheets, pillow, bucket, laundry soap, and dining utensils.',
    carryBag: 'Campus Supermarket',
    isDone: false,
    isEditable: true,
  },
];
