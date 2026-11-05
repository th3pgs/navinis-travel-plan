# Architecture & Content Mapping Guide for Anti-Gravity

> **Developer Note:** This website serves as a critical, step-by-step relocation and task-management application for **Parana Gamage Navini Ravishka Priyantha** traveling from Sri Lanka (`CMB`) to Haikou, China (`HAK` via Shanghai `PVG`) for her Master's at Hainan University. The UI must be structured chronologically with persistent local-storage checkboxes (`localStorage`) so she can track every task, app installation, and clothing item in real time.

---

## 1. Site Structure & Chronological File Mapping

Please organize the website into **three primary chronological phases** plus an interactive **Full-Screen Wardrobe & Luggage Drawer/Modal**. Pull the content for these phases from the designated Markdown files in the repository:

### Phase 1: Pre-Departure Preparation (Sri Lanka — Nov 5 to Nov 8, 2026)
**Goal:** Ensure all financial, digital, luggage, and packing safety nets are completed before leaving Colombo. A single missed step here cascades into major issues inside China.
*   **Source File 1:** `Sri Lanka Banking & Financial Protocol.md`
    *   *UI Requirements:* High-visibility red/amber alert boxes for BOC, People's Bank, and NSB card unlocking, Dialog SMS Roaming activation, and Alipay/WeChat card binding + passport verification.
*   **Source File 2:** `Internet & Device Blueprint.md`
    *   *UI Requirements:* Render an **Interactive Multi-Device App Installation Matrix** (Checklist Table/Cards) where she must explicitly tick checkboxes confirming each required app and VPN/proxy profile is installed and tested on her **iPhone 17**, **Samsung S20 FE**, **Dell Latitude 5410**, and **Apple iPad 11**.
*   **Source File 3:** `Wardrobe & Luggage Strategy.md` *(New Module)*
    *   *UI Requirements:*
        1.  **CRITICAL LUGGAGE MISTAKE WARNING BOX:** Explain why she **MUST NOT** pack her backpack inside her suitcase and drag the $58\text{ cm} \times 34\text{ cm}$ sideways-opening hard-shell suitcase into the cabin. Detail the **4-Bag Golden Strategy** and the recommendation to upgrade her $43\text{ cm}$ blue school bag to a structured **Tech/Travel Laptop Backpack**.
        2.  **Interactive Wardrobe & Packing Manager (Maximizable Modal/View):** Build a dedicated interactive component with a **"Maximize Window / Full-Screen"** toggle so she can manage her clothes and essentials easily.

### Phase 2: Flight Day & Shanghai PVG Transit (Nov 8 – Nov 9, 2026)
**Goal:** Guide her seamlessly from Colombo (`MU6018`) through the 4-hour 50-minute International-to-Domestic transfer at Shanghai Pudong Airport (`PVG` Terminal 1) onto her Haikou flight (`MU6381`).
*   **Source File:** `University Arrival & Registration Guide.md` (Section 0 & Transit Protocol) + `Wardrobe & Luggage Strategy.md` (Airport Bag Handling).
*   **UI Requirements:**
    *   Step-by-step countdown checklist for Shanghai `PVG` Terminal 1:
        1. Activate Saily/Airalo eSIM on iPhone 17 upon landing at `06:05`.
        2. Clear Chinese Immigration (Present Passport + X1 Visa + Admission Notice from Fanny Pack).
        3. Collect **both Checked Suitcases (Bag 1: $65\text{ cm}$ & Bag 2: $58\text{ cm}$)** at International Baggage Claim.
        4. Clear Customs & Re-Check both suitcases at the China Eastern Domestic Transfer Desk for `MU6381` (departs `10:55`).
        5. Message Ms. Sun (`sun_admission`) and her University Support Buddy before boarding `MU6381`.

### Phase 3: Haikou Arrival, Taxi Transit & University Registration (Nov 9, 2026)
**Goal:** Get her safely from Haikou Meilan Airport (`HAK` Terminal 1) at `14:35` to Hainan University before offices close at `17:00–17:30` on the final day of registration.
*   **Source File:** `University Arrival & Registration Guide.md`
*   **UI Requirements:**
    *   **Pre-Departure Buddy Gate Check:** Interactive checklist reminding her to ask her University Support Buddy for the exact Hainan University Haidian Campus gate & dorm name in Chinese *before* flying.
    *   **Full-Screen "Show to Taxi Driver" Card:** A button that expands the Chinese address and university phone numbers into huge, high-contrast Chinese characters so she can hand her phone screen to the Haikou Official Taxi Queue attendant and driver with zero spoken Chinese.
    *   **17:00 Office Closure Countdown Alert:** Highlight the urgency of heading straight to the School of International Education upon reaching campus.

---

## 2. Interactive Feature Specifications for Anti-Gravity

### A. Multi-Device App Checklist Component (`Internet & Device Blueprint.md`)
*   Create a 4-tab or 4-column interactive grid representing her 4 hardware devices:
    1.  **iPhone 17** (Primary Lifeline)
    2.  **Samsung S20 FE** (Sri Lankan OTP Vault)
    3.  **Dell Latitude 5410** (Windows Workstation)
    4.  **Apple iPad 11** (Tablet Workstation)
*   Every single app, VPN client (`Shadowrocket`, `v2rayNG`, `Clash Verge Rev`), subscription node (`Ji Chang`), and SIM/eSIM setting must have an independent checkbox (`[ ] Installed & Configured`).
*   Display a **Master Readiness Progress Bar** (e.g., `18 / 18 Apps & Configs Verified`) that turns green only when all checkboxes across all 4 devices are ticked.

### B. Maximizable Wardrobe & Packing Manager (`Wardrobe & Luggage Strategy.md`)
*   **Window Controls:** Include a **"Maximize / Full-Screen Mode"** button on the Wardrobe card so she can expand it across the entire screen while packing.
*   **Emoji Category Filter Pills:** Allow her to filter items dynamically by clicking visual emoji category tabs:
    *   `All Items` | `👗 Frocks & Dresses` | `👚 Tops & T-Shirts` | `👖 Pants & Skirts` | `🧥 Jackets & Layers` | `👟 Shoes & Footwear` | `👜 Bags & Organizers` | `🧴 Toiletries & Essentials`
*   **Add / Remove Custom Items:**
    *   Include an input bar at the top: `[Item Name]` + `[Select Emoji/Category Dropdown]` + `[Select Target Bag: 65cm Suitcase / 58cm Suitcase / Backpack]` + **`[+ Add Item]`** button.
    *   Every item row must have a **`[🗑️ Remove]`** button so she can delete shoes, frocks, or accessories she decides not to bring.
*   **Dual-Checkbox System (Mandatory):**
    *   Every single clothing/wardrobe item must have **TWO separate interactive checkboxes**:
        *   **Checkbox 1: `[ ] 🛒 Bought / Ready`** (Confirms she owns or has purchased the item in Sri Lanka).
        *   **Checkbox 2: `[ ] 🧳 Packed in Bag`** (Confirms the item is physically packed inside the designated suitcase).
    *   *Logic Rule:* Visually dim or badge the item as `"Complete ✅"` when both `Bought` and `Packed` are checked!