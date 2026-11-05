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

export interface WardrobeItem {
  id: string;
  name: string;
  category: any;
  quantity: number;
  targetBag: any;
  isBought: boolean;
  isPacked: boolean;
  colorHex?: string;
  notes?: string;
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

export interface BagAsset {
  id: string;
  name: string;
  type: 'Checked Bag 1' | 'Checked Bag 2' | 'Carry-On Backpack' | 'Fanny Pack';
  dimensions: string;
  weightLimit: string;
  targetBag: string;
  recommendedContents: string;
  isBought: boolean;
  isPacked: boolean;
  kind: 'rolling-large' | 'rolling-medium' | 'backpack' | 'fannypack';
}

export interface InternetAppItem {
  id: string;
  platform: 'iOS' | 'Android' | 'Windows';
  name: string;
  category: 'Firewall Bypass' | 'Essential Daily' | 'AI & Academic' | 'Transit & Maps';
  role: string;
  isInstalled: boolean;
  isConfigured: boolean;
  appIcon: string;
}

export const INITIAL_BAGS: BagAsset[] = [
  {
    id: 'bag-large',
    name: 'Main Large Rolling Suitcase',
    type: 'Checked Bag 1',
    dimensions: '30 × 40 × 70 cm',
    weightLimit: '23 kg (China Eastern)',
    targetBag: 'Checked at Colombo',
    recommendedContents: 'Heavy clothes, dresses, winter wear, full-size liquids (>100ml), flattened blue school bag. NO batteries or original certificates!',
    isBought: true,
    isPacked: false,
    kind: 'rolling-large',
  },
  {
    id: 'bag-medium',
    name: 'Medium Rolling Suitcase',
    type: 'Checked Bag 2',
    dimensions: '27 × 41 × 57 cm',
    weightLimit: '23 kg (China Eastern)',
    targetBag: 'Checked at Colombo',
    recommendedContents: 'Secondary wardrobe, jackets, lab footwear, dorm bathroom slippers (top layer), Sri Lankan spices, emergency clothing set. Check this bag in.',
    isBought: true,
    isPacked: false,
    kind: 'rolling-medium',
  },
  {
    id: 'bag-backpack',
    name: 'Structured Tech Laptop Backpack',
    type: 'Carry-On Backpack',
    dimensions: '~45 cm (25–30L Structured)',
    weightLimit: 'Cabin Carry-On (With passenger)',
    targetBag: 'Primary Cabin Carry-On',
    recommendedContents: 'Dell Latitude 5410, Apple iPad 11, Anker Soundcore Earbuds, CCC Power Bank (10,000mAh+), universal adapter, cables, A4 waterproof folder, 1 sweater.',
    isBought: false, // Highlighted Red until marked bought
    isPacked: false,
    kind: 'backpack',
  },
  {
    id: 'bag-fanny',
    name: 'Compact Fanny Pack / Crossbody',
    type: 'Fanny Pack',
    dimensions: 'Worn across chest at all times',
    weightLimit: 'Personal Lifeline',
    targetBag: 'Worn on Body',
    recommendedContents: 'Passport with X1 Visa, iPhone 17 (Travel eSIM), Samsung S20 FE (Dialog SIM, roaming off), boarding passes, 4 passport photos, 1,000–2,000 RMB cash, bank cards, black pen.',
    isBought: true,
    isPacked: false,
    kind: 'fannypack',
  },
];

export const INITIAL_DEVICES: DeviceAsset[] = [
  {
    id: 'dev-1',
    name: 'iPhone 17',
    model: 'Primary Daily Phone',
    role: 'Saily/Airalo Travel eSIM + Shadowrocket + Alipay & WeChat Pay',
    carrierOrOs: 'iOS 20 • Saily eSIM',
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
    model: 'Certified External Battery',
    role: 'Aviation Rule: MUST carry in cabin backpack. Confiscated if checked!',
    carrierOrOs: 'CCC / CE Certified Mark',
    carryLocation: 'Backpack (NEVER Checked)',
    isBought: false, // Highlighted Red until marked bought
    isPacked: false,
    type: 'powerbank',
  },
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'time-fri-nov6',
    dayBadge: 'Tomorrow • Friday',
    dateStr: 'November 6, 2026',
    title: 'Financial Deadlines & Sri Lanka Banking Close',
    subtitle: 'Branches close for the weekend this afternoon. Lock in international unlocks before 3:00 PM.',
    status: 'current',
    isReady: false,
    isPacked: false,
    items: [
      {
        id: 't-fri-1',
        label: 'Visit BOC, People\'s Bank & NSB Branches',
        detail: 'Submit formal Foreign Study Declaration (Nov 2026 – July 2029) with Admission Notice copy.',
        isDone: false,
        appIcon: 'bank',
      },
      {
        id: 't-fri-2',
        label: 'Unlock International E-Commerce & POS/ATM on All Cards',
        detail: 'Explicitly request international authorization so Chinese IP transactions are not frozen.',
        isDone: false,
        appIcon: 'bank',
      },
      {
        id: 't-fri-3',
        label: 'Exchange 1,000–2,000 Physical RMB Cash',
        detail: 'Obtain smaller 50 & 100 RMB notes for Haikou airport taxi and campus deposits.',
        isDone: false,
        appIcon: 'bank',
        targetBag: 'Fanny Pack',
      },
      {
        id: 't-fri-4',
        label: 'Buy Structured Carry-On Backpack (~45cm) & CCC Power Bank',
        detail: 'Check for clearly marked 10,000mAh+ capacity and factory CCC/CE safety logo.',
        isDone: false,
        appIcon: 'battery',
      },
      {
        id: 't-fri-5',
        label: 'WeChat Touchpoint: Message Student Support Buddy & Ms. Sun',
        detail: 'Confirm arrival date/flight MU6381 and ask about campus gate and airport taxi queue.',
        isDone: false,
        appIcon: 'wechat',
        mustContactBuddy: true,
      },
    ],
  },
  {
    id: 'time-sat-nov7',
    dayBadge: 'Saturday',
    dateStr: 'November 7, 2026',
    title: 'Dry Run, Packing Audit & Digital Test Drill',
    subtitle: 'Full operational drill: weigh suitcases, test VPN configs on Wi-Fi, verify OTP receipt.',
    status: 'upcoming',
    isReady: false,
    isPacked: false,
    items: [
      {
        id: 't-sat-1',
        label: 'Digital Test Run: Test OTP on Samsung S20 FE',
        detail: 'Test Dialog SMS roaming while in Colombo. Ensure Mobile Data & Data Roaming are permanently OFF.',
        isDone: false,
        appIcon: 'dialog',
      },
      {
        id: 't-sat-2',
        label: 'Proxy Subscriptions Verified on All 4 Devices',
        detail: 'Test Shadowrocket (iPhone/iPad), v2rayNG (Samsung), and Clash Verge Rev (Dell).',
        isDone: false,
        appIcon: 'shadowrocket',
      },
      {
        id: 't-sat-3',
        label: 'Pack & Weigh Suitcase 1 (30×40×70cm) — Max 23kg',
        detail: 'Heavy clothes, dresses, winter jacket, flattened school bag. No batteries or papers!',
        isDone: false,
        appIcon: 'bag',
        targetBag: 'Large Suitcase',
      },
      {
        id: 't-sat-4',
        label: 'Pack & Weigh Suitcase 2 (27×41×57cm) — Max 23kg',
        detail: 'Secondary clothes, slippers on top layer, umbrella, Sri Lankan snacks. Lock both bags.',
        isDone: false,
        appIcon: 'bag',
        targetBag: 'Medium Suitcase',
      },
      {
        id: 't-sat-5',
        label: 'A4 Waterproof Folder Sealed Inside Laptop Backpack',
        detail: 'Original Medical Exam Form with hospital stamps, Blood Test Report, JW202, Degree Certificate.',
        isDone: false,
        appIcon: 'doc',
        targetBag: 'Laptop Backpack',
      },
      {
        id: 't-sat-6',
        label: 'Charge All 6 Devices & 10,000mAh Power Bank to 100%',
        detail: 'iPhone 17, Samsung S20 FE, Dell 5410, iPad 11, Soundcore Earbuds, Power Bank.',
        isDone: false,
        appIcon: 'battery',
      },
    ],
  },
  {
    id: 'time-sun-nov8',
    dayBadge: 'Departure Day • Sunday',
    dateStr: 'November 8, 2026 (17:20 CMB & 20:50 Takeoff)',
    title: 'Colombo Airport Departure (Flight MU6018)',
    subtitle: 'Arrive at Bandaranaike International Airport 3.5 hours before flight. Keep lifeline fanny pack on body.',
    status: 'future',
    isReady: false,
    isPacked: false,
    items: [
      {
        id: 't-sun-1',
        label: '17:20 — Arrive at Colombo CMB International Terminal',
        detail: 'Have passport with X1 Visa, E-Ticket #7812903731438, and PNR JKZ2YN ready in Fanny Pack.',
        isDone: false,
        appIcon: 'doc',
      },
      {
        id: 't-sun-2',
        label: 'Check in Both Suitcases (30×40×70cm & 27×41×57cm)',
        detail: 'Confirm baggage tags show transfer via Shanghai PVG. Keep carry-on backpack on back.',
        isDone: false,
        appIcon: 'trip',
      },
      {
        id: 't-sun-3',
        label: 'Security Scan: Laptop, iPad & Power Bank in Carry-On',
        detail: 'Place Dell 5410, iPad 11, and CCC power bank in inspection trays. NEVER check power banks.',
        isDone: false,
        appIcon: 'battery',
      },
      {
        id: 't-sun-4',
        label: '20:50 — China Eastern Flight MU6018 Takes Off to Shanghai',
        detail: 'Airbus A330-200. Wear comfortable joggers and cushioned sneakers. Keep jacket handy.',
        isDone: false,
        appIcon: 'trip',
      },
    ],
  },
  {
    id: 'time-mon-pvg',
    dayBadge: 'Transit Day • Monday Morning',
    dateStr: 'November 9, 2026 (06:05 – 10:55 Shanghai PVG T1)',
    title: 'Shanghai Pudong Transfer (4h 50m Layover)',
    subtitle: 'International-to-Domestic transfer protocol. Chinese border clearance and mandatory bag re-check.',
    status: 'future',
    isReady: false,
    isPacked: false,
    items: [
      {
        id: 't-pvg-1',
        label: '06:05 — Touchdown Shanghai PVG T1: Switch to eSIM',
        detail: 'Toggle Saily/Airalo China eSIM line ON on iPhone 17. Verify data connectivity immediately.',
        isDone: false,
        appIcon: 'dialog',
      },
      {
        id: 't-pvg-2',
        label: 'Clear Chinese Immigration & Border Control',
        detail: 'Complete blue arrival card. Present Passport with X1 Visa & Admission Notice #263660001.',
        isDone: false,
        appIcon: 'doc',
      },
      {
        id: 't-pvg-3',
        label: 'MANDATORY: Collect BOTH Checked Suitcases at Baggage Belts',
        detail: 'Retrieve the 30×40×70cm and 27×41×57cm suitcases from International Baggage Claim.',
        isDone: false,
        appIcon: 'bag',
      },
      {
        id: 't-pvg-4',
        label: 'Clear Customs & Drop Bags at China Eastern Domestic Transfer Desk',
        detail: 'Re-check both suitcases for Flight MU6381 to Haikou (departs at 10:55).',
        isDone: false,
        appIcon: 'bag',
      },
      {
        id: 't-pvg-5',
        label: 'WeChat Touchpoint: Message Ms. Sun & Student Support Buddy',
        detail: 'Confirm successful transit through Shanghai customs and boarding gate for MU6381.',
        isDone: false,
        appIcon: 'wechat',
        mustContactBuddy: true,
      },
      {
        id: 't-pvg-6',
        label: '10:55 — Board Flight MU6381 to Haikou Meilan (HAK)',
        detail: 'Boeing 737-800 domestic flight to Hainan Island (~3 hours 40 minutes).',
        isDone: false,
        appIcon: 'trip',
      },
    ],
  },
  {
    id: 'time-mon-hak',
    dayBadge: 'Arrival Day • Monday Afternoon',
    dateStr: 'November 9, 2026 (14:35 HAK & Campus Setup)',
    title: 'Haikou Landing & Hainan University Arrival',
    subtitle: 'Domestic arrival. Outdoor taxi queue directly to Haidian campus before afternoon office close.',
    status: 'future',
    isReady: false,
    isPacked: false,
    items: [
      {
        id: 't-hak-1',
        label: '14:35 — Land at Haikou Meilan Airport (HAK) Terminal 1',
        detail: '100% domestic arrival. No immigration or customs in Haikou! Follow Baggage Claim signs.',
        isDone: false,
        appIcon: 'trip',
      },
      {
        id: 't-hak-2',
        label: 'Collect Both Suitcases from Luggage Carousel',
        detail: 'Load 30×40×70cm & 27×41×57cm suitcases onto free airport luggage cart.',
        isDone: false,
        appIcon: 'bag',
      },
      {
        id: 't-hak-3',
        label: 'Join Official Outdoor Taxi Queue & Show Destination Pocket Card',
        detail: 'Follow overhead Taxi signs. Hand the Chinese Driver Card to dispatcher and driver (~50–80 RMB).',
        isDone: false,
        appIcon: 'didi',
      },
      {
        id: 't-hak-4',
        label: 'WeChat Touchpoint: Share Live Location & Taxi Plate with Buddy',
        detail: 'Turn on WeChat live location so your buddy can meet you at Haidian campus gate in 35–45 mins.',
        isDone: false,
        appIcon: 'wechat',
        mustContactBuddy: true,
      },
      {
        id: 't-hak-5',
        label: 'Meet Buddy at Campus Gate (人民大道58号) & Dorm Check-in',
        detail: 'Receive dormitory room key card, test air conditioning, and unpack essentials.',
        isDone: false,
        appIcon: 'doc',
      },
      {
        id: 't-hak-6',
        label: 'School of International Education Registration (Ms. Sun)',
        detail: 'Submit Page 1 stamped Admission Notice, JW202, degree certificates, and confirm full scholarship.',
        isDone: false,
        appIcon: 'doc',
      },
    ],
  },
];

export const INITIAL_INTERNET_APPS: InternetAppItem[] = [
  // FireWall Bypass & Proxy
  {
    id: 'app-shadowrocket',
    platform: 'iOS',
    name: 'Shadowrocket',
    category: 'Firewall Bypass',
    role: 'Primary iOS rule-based proxy client with Ji Chang subscription imported.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'shadowrocket',
  },
  {
    id: 'app-v2rayng',
    platform: 'Android',
    name: 'v2rayNG',
    category: 'Firewall Bypass',
    role: 'Android proxy client for Samsung S20 FE with backup Ji Chang nodes.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'shadowrocket',
  },
  {
    id: 'app-clash',
    platform: 'Windows',
    name: 'Clash Verge Rev',
    category: 'Firewall Bypass',
    role: 'Windows Research research proxy with System Proxy & TUN Mode on Dell Latitude 5410.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'shadowrocket',
  },

  // Essential Chinese Ecosystem
  {
    id: 'app-wechat',
    platform: 'iOS',
    name: 'WeChat (微信)',
    category: 'Essential Daily',
    role: 'Daily campus lifeline, faculty messaging with Ms. Sun, and student buddy voice calls.',
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
    id: 'app-baidu-maps',
    platform: 'iOS',
    name: 'Baidu Maps (百度地图)',
    category: 'Transit & Maps',
    role: 'Pinpoint GPS campus gate navigation inside mainland China.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'didi',
  },
  {
    id: 'app-metroman',
    platform: 'iOS',
    name: 'MetroMan (地铁通)',
    category: 'Transit & Maps',
    role: 'Offline Shanghai and national metro maps with transfer calculators.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'trip',
  },

  // AI & Academic Research
  {
    id: 'app-chatgpt',
    platform: 'iOS',
    name: 'ChatGPT',
    category: 'AI & Academic',
    role: 'AI research assistant for Master\'s thesis and technical query drafting (routes via proxy).',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'doc',
  },
  {
    id: 'app-gemini',
    platform: 'iOS',
    name: 'Google Gemini',
    category: 'AI & Academic',
    role: 'Multimodal AI research tool for Food Science and Engineering literature analysis.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'doc',
  },
  {
    id: 'app-google-suite',
    platform: 'iOS',
    name: 'Google Suite (Gmail, Drive, Scholar)',
    category: 'AI & Academic',
    role: 'Essential global academic services routed through Shadowrocket proxy.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'doc',
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
    id: 'app-deepl',
    platform: 'iOS',
    name: 'DeepL Translate',
    category: 'AI & Academic',
    role: 'High accuracy document and paper translation for academic coursework.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'pleco',
  },
  {
    id: 'app-meituan',
    platform: 'iOS',
    name: 'Meituan (美团)',
    category: 'Essential Daily',
    role: 'Campus food delivery, water jug replenishment, and grocery deliveries in Haikou.',
    isInstalled: true,
    isConfigured: true,
    appIcon: 'didi',
  },
];

export const INITIAL_WARDROBE_ITEMS: WardrobeItem[] = [
  // Dresses (Interactive dress-up catalog)
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
    colorHex: '#a855f7',
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
    colorHex: '#f43f5e',
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
    colorHex: '#10b981',
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
    colorHex: '#6366f1',
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
    colorHex: '#eab308',
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
    colorHex: '#64748b',
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
    colorHex: '#ec4899',
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
    colorHex: '#0f172a',
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
    isBought: false, // NOT BOUGHT YET -> Highlighted Red
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
