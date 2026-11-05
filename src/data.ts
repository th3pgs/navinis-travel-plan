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
  stage: 'prep-srilanka' | 'airport-cmb' | 'transit-pvg' | 'flight-hak' | 'arrival-campus';
  category: string;
  title: string;
  detail?: string;
  location?: string;
  status: 'pending' | 'ready' | 'completed';
  isReady: boolean;   // Step 1: Ready / Obtained at home
  isPacked: boolean;  // Step 2: In hand / packed in travel bag for departure
  isEditable?: boolean;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  targetBag: string;
  isBought: boolean;
  isPacked: boolean;
  notes?: string;
}

export interface DeviceAsset {
  id: string;
  name: string;
  model: string;
  role: string;
  carrierOrOs: string;
  carryLocation: string;
  status: 'Ready' | 'Configuring';
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
}

export const INITIAL_BAGS: BagAsset[] = [
  {
    id: 'bag-large',
    name: 'Main Large Rolling Suitcase',
    type: 'Checked Bag 1',
    dimensions: '30 × 40 × 70 cm',
    weightLimit: '23 kg (China Eastern Included)',
    targetBag: 'Checked at CMB',
    recommendedContents: 'Heavy clothes, bulk dresses, winter wear, full-size liquids (>100ml), flattened 43cm school bag. NO lithium batteries or original documents.',
  },
  {
    id: 'bag-medium',
    name: 'Medium Rolling Suitcase',
    type: 'Checked Bag 2',
    dimensions: '27 × 41 × 57 cm',
    weightLimit: '23 kg (China Eastern Included)',
    targetBag: 'Checked at CMB',
    recommendedContents: 'Secondary wardrobe, jackets, lab footwear, bathroom slippers (top layer), Sri Lankan spices, emergency clothing set. Check this bag in.',
  },
  {
    id: 'bag-backpack',
    name: 'Structured Tech Laptop Backpack',
    type: 'Carry-On Backpack',
    dimensions: '~45 cm Structured (25–30L)',
    weightLimit: 'Cabin Carry-On (With passenger)',
    targetBag: 'Cabin Carry-On',
    recommendedContents: 'Dell Latitude 5410, Apple iPad 11, Soundcore Earbuds, CCC Power Bank (10,000mAh+), universal adapter, cables, A4 waterproof document folder, 1 sweater.',
  },
  {
    id: 'bag-fanny',
    name: 'Compact Fanny Pack / Crossbody',
    type: 'Fanny Pack',
    dimensions: 'Worn across chest at all times',
    weightLimit: 'Personal Lifeline',
    targetBag: 'Worn on Body',
    recommendedContents: 'Passport with X1 Visa, iPhone 17 (Travel eSIM), Samsung S20 FE (Dialog SIM, roaming off), boarding passes, 4 passport photos, 1,000–2,000 RMB cash, bank cards, black pen.',
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
    status: 'Ready',
    type: 'phone-ios',
  },
  {
    id: 'dev-2',
    name: 'Samsung S20 FE',
    model: 'Sri Lankan OTP Vault',
    role: 'Dialog SMS Roaming (Mobile Data & Data Roaming HARD-LOCKED OFF)',
    carrierOrOs: 'Android • Dialog SIM',
    carryLocation: 'Fanny Pack (Chest)',
    status: 'Ready',
    type: 'phone-android',
  },
  {
    id: 'dev-3',
    name: 'Dell Latitude 5410',
    model: '14" Windows Research Laptop',
    role: 'Food Science coursework + Clash Verge Rev + Offline Document Vault',
    carrierOrOs: 'Windows 11 Pro',
    carryLocation: 'Backpack Laptop Sleeve',
    status: 'Ready',
    type: 'laptop',
  },
  {
    id: 'dev-4',
    name: 'Apple iPad 11',
    model: 'Tablet Workstation',
    role: 'Shadowrocket + Pleco + Offline Taxi Address Sign display',
    carrierOrOs: 'iPadOS',
    carryLocation: 'Backpack Tablet Sleeve',
    status: 'Ready',
    type: 'tablet',
  },
  {
    id: 'dev-5',
    name: 'Anker Soundcore Earbuds',
    model: 'Wireless ANC Earbuds',
    role: 'In-flight noise cancellation & voice calls with campus buddy',
    carrierOrOs: 'Bluetooth 5.3',
    carryLocation: 'Fanny Pack / Backpack Pocket',
    status: 'Ready',
    type: 'earbuds',
  },
  {
    id: 'dev-6',
    name: '10,000mAh+ CCC Power Bank',
    model: 'Certified External Battery',
    role: 'Aviation Rule: MUST carry in cabin backpack. Confiscated if checked!',
    carrierOrOs: 'CCC / CE Certified Mark',
    carryLocation: 'Backpack (NEVER Checked)',
    status: 'Ready',
    type: 'powerbank',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  // --- 1. PREPARATION IN SRI LANKA ---
  {
    id: 'task-doc-passport',
    stage: 'prep-srilanka',
    category: 'Essential Documents',
    title: 'Original Passport with Valid Chinese X1 Visa',
    detail: 'Double check passport is undamaged with entry visa intact. Carry 4 printed passport photos matching the visa.',
    location: 'Fanny Pack (Chest)',
    status: 'pending',
    isReady: true,
    isPacked: false,
  },
  {
    id: 'task-doc-notice',
    stage: 'prep-srilanka',
    category: 'Essential Documents',
    title: 'Admission Notice #263660001 & JW202 Form',
    detail: 'Printed Chinese stamped original Page 1 + English Page 2, and official JW202 visa approval form.',
    location: 'A4 Waterproof Folder (Backpack)',
    status: 'pending',
    isReady: true,
    isPacked: false,
  },
  {
    id: 'task-doc-med',
    stage: 'prep-srilanka',
    category: 'Essential Documents',
    title: 'ORIGINAL Physical Exam Form & Blood Test Reports',
    detail: 'Hospital stamped Foreigner Physical Examination form and blood test laboratory slips. Required for campus health check.',
    location: 'A4 Waterproof Folder (Backpack)',
    status: 'pending',
    isReady: true,
    isPacked: false,
  },
  {
    id: 'task-doc-deg',
    stage: 'prep-srilanka',
    category: 'Essential Documents',
    title: 'Original Bachelor Degree Certificate & Transcripts',
    detail: 'Original degree diploma plus certified English translations / notarized copies.',
    location: 'A4 Waterproof Folder (Backpack)',
    status: 'pending',
    isReady: true,
    isPacked: false,
  },
  {
    id: 'task-bank-declare',
    stage: 'prep-srilanka',
    category: 'Banking & Currency',
    title: 'Foreign Study Declaration (BOC, People\'s Bank, NSB)',
    detail: 'Submit formal notice that you are studying in China (Nov 2026 – July 2029) to prevent account fraud freezing.',
    location: 'Branch visit before Friday close',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-bank-unlock',
    stage: 'prep-srilanka',
    category: 'Banking & Currency',
    title: 'Unlock International E-Commerce & ATM POS',
    detail: 'Instruct all 3 banks to permit recurring international transactions and online charges from Chinese IPs.',
    location: 'Card Management / Phone Banking',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-bank-cash',
    stage: 'prep-srilanka',
    category: 'Banking & Currency',
    title: 'Physical RMB Cash (1,000 – 2,000 RMB)',
    detail: 'Carry 50 & 100 RMB banknotes for Haikou airport metered taxi and initial campus security deposits.',
    location: 'Fanny Pack (Zippered pocket)',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-sim-dialog',
    stage: 'prep-srilanka',
    category: 'Phone & SIM',
    title: 'Dialog SMS Roaming Active on Samsung S20 FE',
    detail: 'Confirm incoming SMS works. Ensure Mobile Data and Data Roaming are permanently OFF in Samsung settings.',
    location: 'Samsung S20 FE Settings',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-apps-pay',
    stage: 'prep-srilanka',
    category: 'Payment Apps',
    title: 'Alipay & WeChat Real-Name Passport Verification',
    detail: 'Upload passport photo to Alipay & WeChat. Link Sri Lankan Visa/Mastercards and test SMS OTP received on S20 FE.',
    location: 'iPhone 17',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-apps-vpn',
    stage: 'prep-srilanka',
    category: 'Connectivity',
    title: 'Shadowrocket, v2rayNG & Clash Verge Rev Subscriptions',
    detail: 'Load active Ji Chang subscription URL on iPhone 17, iPad 11, Samsung S20 FE, and Dell laptop before departure.',
    location: 'All 4 Devices',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },

  // --- 2. COLOMBO AIRPORT (CMB) PROCEDURE ---
  {
    id: 'task-cmb-checkin',
    stage: 'airport-cmb',
    category: 'Colombo Departure',
    title: 'China Eastern Check-in for Flight MU6018 (Departs 20:50)',
    detail: 'Arrive at CMB 3.5 hours early (17:20). Present passport, X1 Visa, and E-Ticket #7812903731438.',
    location: 'CMB International Departures Hall',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-cmb-bags',
    stage: 'airport-cmb',
    category: 'Colombo Departure',
    title: 'Check-in Both Suitcases (Large 30×40×70cm & Med 27×41×57cm)',
    detail: 'Verify both luggage tags read PVG (Shanghai). Keep your structured backpack and fanny pack on you.',
    location: 'China Eastern Baggage Drop Counter',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-cmb-powerbank',
    stage: 'airport-cmb',
    category: 'Colombo Departure',
    title: 'Verify Power Bank & Electronics in Backpack',
    detail: 'Security check: Dell laptop, iPad 11, and 10,000mAh+ CCC power bank must be in cabin carry-on for security scan.',
    location: 'CMB Security Gate',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },

  // --- 3. SHANGHAI PVG TRANSIT PROCEDURE ---
  {
    id: 'task-pvg-esim',
    stage: 'transit-pvg',
    category: 'Shanghai Layover (4h 50m)',
    title: 'Landing at Shanghai PVG T1 (06:05) & Switch to eSIM',
    detail: 'Turn on Saily/Airalo travel eSIM data line on iPhone 17. Keep Dialog SIM on Samsung S20 FE in Airplane mode or Data OFF.',
    location: 'PVG Terminal 1 Gate',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-pvg-immigration',
    stage: 'transit-pvg',
    category: 'Shanghai Layover (4h 50m)',
    title: 'Clear Chinese Border Immigration',
    detail: 'Fill out blue Arrival Card. Present Passport, X1 Visa, and Admission Notice. State destination is Hainan University Master\'s program.',
    location: 'PVG Terminal 1 Immigration Hall',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-pvg-bags',
    stage: 'transit-pvg',
    category: 'Shanghai Layover (4h 50m)',
    title: 'Mandatory Baggage Claim: Collect Both Checked Suitcases',
    detail: 'International-to-Domestic transfer requires physical baggage collection at International Baggage Claim belts.',
    location: 'PVG Terminal 1 Baggage Claim',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-pvg-recheck',
    stage: 'transit-pvg',
    category: 'Shanghai Layover (4h 50m)',
    title: 'Clear Customs & Re-Check Bags for Domestic Flight MU6381',
    detail: 'Pass customs inspection and immediately drop both suitcases at China Eastern Domestic Transfer Counter (departs 10:55).',
    location: 'PVG T1 Domestic Transfer Counter',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-pvg-message',
    stage: 'transit-pvg',
    category: 'Shanghai Layover (4h 50m)',
    title: 'Message Ms. Sun & University Support Buddy on WeChat',
    detail: 'Inform them you cleared Shanghai customs on time and are waiting at the domestic gate for MU6381 to Haikou.',
    location: 'PVG Domestic Gate Area',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },

  // --- 4. HAIKOU AIRPORT (HAK) ARRIVAL ---
  {
    id: 'task-hak-collect',
    stage: 'flight-hak',
    category: 'Haikou Meilan Airport',
    title: 'Land at Haikou Meilan T1 (14:35) & Collect 2 Suitcases',
    detail: 'Pure domestic arrival! No customs or passport control. Collect both suitcases from domestic baggage carousel.',
    location: 'HAK Terminal 1 Baggage Hall',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-hak-taxi',
    stage: 'flight-hak',
    category: 'Haikou Meilan Airport',
    title: 'Join Official Outdoor Taxi Queue & Show Destination Card',
    detail: 'Follow overhead Taxi (出租车) signs. Show the Chinese Destination Card to queue dispatcher and driver. Pay approx 50–80 RMB.',
    location: 'HAK T1 Outdoor Taxi Stand',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },
  {
    id: 'task-hak-location',
    stage: 'flight-hak',
    category: 'Haikou Meilan Airport',
    title: 'Send Taxi Plate Photo & WeChat Live Location to Buddy',
    detail: 'Share your live ride status so your university buddy can meet you at the Haidian campus gate in 35–45 minutes.',
    location: 'Inside Airport Taxi',
    status: 'pending',
    isReady: false,
    isPacked: false,
  },

  // --- 5. CAMPUS & UNIVERSITY PROCEDURES ---
  {
    id: 'task-uni-buddy',
    stage: 'arrival-campus',
    category: 'Campus Coordination',
    title: 'Meet Support Buddy at Haidian Campus Gate (人民大道58号)',
    detail: 'Coordinate which gate to enter (East Gate / Main Gate) and move 2 suitcases with buddy assistance.',
    location: 'Hainan University Haidian Campus',
    status: 'pending',
    isReady: false,
    isPacked: false,
    isEditable: true,
  },
  {
    id: 'task-uni-dorm',
    stage: 'arrival-campus',
    category: 'Dormitory Check-in',
    title: 'International Student Dormitory Room Access & Key Card',
    detail: 'Check into assigned room, test air conditioning, power points, and inspect furniture. Note any maintenance requests.',
    location: 'International Student Dormitory Building',
    status: 'pending',
    isReady: false,
    isPacked: false,
    isEditable: true,
  },
  {
    id: 'task-uni-reg',
    stage: 'arrival-campus',
    category: 'Registration & Verification',
    title: 'School of International Education Registration (Ms. Sun)',
    detail: 'Submit Admission Notice Page 1 (stamped full scholarship), JW202, Bachelor diploma, and photo. Verify scholarship status.',
    location: 'School of International Education Office',
    status: 'pending',
    isReady: false,
    isPacked: false,
    isEditable: true,
  },
  {
    id: 'task-uni-sim',
    stage: 'arrival-campus',
    category: 'Campus Logistics',
    title: 'Get Local Chinese SIM Card (China Mobile / Unicom)',
    detail: 'Obtain local mainland phone number with passport identity registration for campus Wi-Fi and courier deliveries.',
    location: 'Campus Telecom Shop',
    status: 'pending',
    isReady: false,
    isPacked: false,
    isEditable: true,
  },
  {
    id: 'task-uni-residence',
    stage: 'arrival-campus',
    category: 'Legal Compliance',
    title: '30-Day Residence Permit Police Registration',
    detail: 'Convert X1 visa to a Multi-Entry Residence Permit within 30 days of arrival at Haikou Public Security Bureau (PSB).',
    location: 'Haikou Exit-Entry Administration (PSB)',
    status: 'pending',
    isReady: false,
    isPacked: false,
    isEditable: true,
  },
];

export const INITIAL_WARDROBE_ITEMS: WardrobeItem[] = [
  // Dresses
  {
    id: 'w-1',
    name: 'Casual Cotton/Linen Day Frocks',
    category: 'Dresses',
    quantity: 4,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
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
    notes: 'For Welcome Ceremony / Faculty presentations',
  },
  {
    id: 'w-3',
    name: 'Lightweight Tropical Sundresses',
    category: 'Dresses',
    quantity: 3,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    notes: 'Warm weather campus wear',
  },

  // Tops
  {
    id: 'w-4',
    name: 'Breathable Cotton T-Shirts',
    category: 'Tops',
    quantity: 6,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
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
    notes: 'Emergency outfit change during long transit',
  },

  // Bottoms
  {
    id: 'w-7',
    name: 'Full-Length Jeans / Trousers',
    category: 'Bottoms',
    quantity: 3,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
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
    notes: 'Comfortable classroom lecture wear',
  },
  {
    id: 'w-9',
    name: 'Casual Skirts / Shorts',
    category: 'Bottoms',
    quantity: 3,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
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
    notes: 'Comfortable clothing for 10+ hours transit',
  },

  // Outerwear
  {
    id: 'w-11',
    name: 'Light Zip-Up Hoodie / Cardigan',
    category: 'Outerwear',
    quantity: 2,
    targetBag: '1 in Backpack, 1 in Medium Bag',
    isBought: true,
    isPacked: false,
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
    notes: 'Alternate walking pair',
  },
  {
    id: 'w-16',
    name: 'Comfortable Walking Sandals',
    category: 'Footwear',
    quantity: 1,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    notes: 'Warm campus days',
  },
  {
    id: 'w-17',
    name: 'Waterproof Bathroom Slippers',
    category: 'Footwear',
    quantity: 1,
    targetBag: 'Medium Suitcase (Top Layer)',
    isBought: true,
    isPacked: false,
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
    notes: '2-week supply packed in mesh laundry bags',
  },
  {
    id: 'w-21',
    name: 'Microfiber Quick-Dry Towels',
    category: 'Essentials',
    quantity: 2,
    targetBag: 'Main Suitcase (30×40×70cm)',
    isBought: true,
    isPacked: false,
    notes: 'Fast drying travel towels',
  },

  // Luggage & Organizers
  {
    id: 'w-22',
    name: 'Structured Tech Laptop Backpack (~45cm)',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Primary Cabin Carry-On',
    isBought: true,
    isPacked: false,
    notes: 'Holds Dell 5410, iPad 11, Soundcore Earbuds & A4 Folder',
  },
  {
    id: 'w-23',
    name: 'Compact Fanny Pack / Crossbody',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Worn on Body',
    isBought: true,
    isPacked: false,
    notes: 'Passport, iPhone 17, S20 FE, Bank Cards, Cash',
  },
  {
    id: 'w-24',
    name: 'Blue 43cm School Backpack (Packed Flat)',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Inside Main Suitcase',
    isBought: true,
    isPacked: false,
    notes: 'For lightweight daily classes on campus',
  },
  {
    id: 'w-25',
    name: 'A4 Waterproof Zippered Document Folder',
    category: 'Luggage',
    quantity: 1,
    targetBag: 'Inside Laptop Backpack',
    isBought: true,
    isPacked: false,
    notes: 'Original medical and degree certificates',
  },
];
