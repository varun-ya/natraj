<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 200px 0 20px 0;">

<div style="font-size: 24px; margin-bottom: 12px;"><strong>Amazon Q</strong></div>
<div style="background: rgba(128, 128, 128, 0.15); border: 1px solid rgba(128, 128, 128, 0.25); border-radius: 8px; padding: 8px; margin: 4px 0; text-align: center;">
<div style="font-size: 14px; margin-bottom: 4px;"><strong>Did you know?</strong></div>
<div>Create and add Saved Prompts using the @ context menu</div>
</div>

Select code & ask me to explain, debug or optimize it, or type `/` for quick actions

</div>

---

analyze the ui of the cureent webapp scchedule chat session history feed home search 

everything see the design systeem the fonts the font size color everything 

see this too 
C:\Users\varun\OneDrive\Documents\hg-new\m3-homeguru

---

Let me explore the project structure and design system first.

---


Now I have a thorough picture of the entire design system. Here's a comprehensive analysis:

---

## Design System Analysis — HomeGuru Web App

### Typography

**Font Stack**
- Body/UI: `Inter` (primary) — loaded via `next/font/google`, set as `--font-sans` on `<html>`
- Greeting/display: `Plus Jakarta Sans` (`font-jakarta`) — used in the desktop navbar greeting
- Flutter app uses `Outfit` for headings + `Inter` for body — **the web app doesn't use Outfit at all**, which is a divergence from the Flutter design system

**Font Sizes (actual usage across pages)**
| Role | Size | Weight | Where |
|---|---|---|---|
| Page/section title | `15px` | `500` | Wallet header, Chat header |
| Session list title | `16px` | `500` | SessionList header |
| Nav item label | `14px` | `500/600` | Sidebar NavItem |
| Body / list primary | `14px` | `400–500` | Session topic, convo name |
| Body secondary | `13px` | `400` | Tutor name, timestamps, inputs |
| Chips / badges | `12px` | `500` | Filter chips |
| Micro labels | `11px` | `500–600` | Status dots, section labels, badge counts |
| Section group labels | `11px` | `600` | Sidebar section labels, uppercase tracking-wider |
| Navbar greeting | `22px` | `400/600` | DesktopNavbar |
| Hero headline | `26px` | `400/500` | HeroBanner |

**Issues:**
- No `Outfit` font loaded — Flutter headings use Outfit but web uses Geist/Inter for everything
- `--font-matter` and `--font-season` in globals.css both resolve to Geist Sans — they're aliases that don't actually load distinct fonts
- Font size scale is inconsistent: `15px` for some headers, `16px` for others doing the same job (e.g. WalletPage header vs SessionList header)

---

### Color System

**Light Mode tokens (from globals.css, matching Flutter)**
| Token | Value | Role |
|---|---|---|
| `--primary` | `#1A73E8` | Google Blue — CTAs, active states, indicators |
| `--primary-container` | `#D3E3FD` | Tonal fill for active nav, buttons |
| `--on-primary-container` | `#041E49` | Text on primary-container |
| `--secondary-container` | `#DCEEFB` | Active list items (sessions, nav links) |
| `--on-secondary-container` | `#0D2137` | Text on secondary-container |
| `--tertiary` | `#BF5000` | Orange — status indicators, ongoing sessions |
| `--tertiary-container` | `#FFDCC2` | Amber chip backgrounds |
| `--surface` | `#F8F9FF` | Page/panel backgrounds |
| `--surface-container-high` | `#E1E3E8` | Hover states, search inputs |
| `--on-surface` | `#111111` | Primary text |
| `--on-surface-variant` | `#555555` | Secondary text, icons |
| `--outline-variant` | `#EBEBEB` | Borders, dividers |
| `--error` | `#DC2626` | Unread badges, cancel status |

**Dark Mode** — fully defined under `[data-theme="dark"]`, mirrors Flutter's dark scheme exactly.

**Issues:**
- `--secondary` in light mode is set to `oklch(0.97 0 0)` (near-white) — this is a Shadcn default leftover, not the M3 blue `#4A90D9` from Flutter. The Flutter app has `secondary: Color(0xFF4A90D9)`. This token is rarely used directly but it's semantically wrong.
- Two parallel dark mode systems exist: `[data-theme="dark"]` (your M3 system) and `.dark` (Shadcn's dark class) — they define conflicting values for `--primary`, `--secondary`, etc. If both are active simultaneously, Shadcn's `.dark` overrides your M3 dark tokens.

---

### Layout & Structure

**Sidebar**
- Expanded: `17rem` (272px), Collapsed: `5rem` (80px)
- Fixed left, full height, `z-41`
- Header: `h-16` (64px), border-bottom
- Nav items: `rounded-full`, `px-4 py-3`, `gap-3`, `mb-1.5`
- Active state: `bg-primary-container text-on-primary-container`
- Section labels: `11px`, `font-semibold`, `uppercase`, `tracking-wider`
- Profile section at bottom, theme toggle at very bottom

**Page Headers (inconsistent across pages)**
- Wallet: `h-16`, `px-4 sm:px-6`, icon + `text-[15px] font-medium`
- SessionList: `px-4 pt-4 pb-2`, `text-[16px] font-medium` — no fixed height
- Feed desktop header: `h-14`, `px-5 md:px-8`, `text-[14px] font-normal`
- Chat: no standalone header — embedded in ChatMain
- Schedule: delegates entirely to CalendarApp

**The header height/style is inconsistent** — Wallet uses `h-16`, Feed uses `h-14`, SessionList has no fixed height. This creates visual jitter when navigating between pages.

**Bottom Nav (mobile)**
- `h-16`, `z-70`, `bg-surface`, `border-t border-outline-variant`
- Active pill: `w-14 h-8 rounded-full bg-primary-container`
- Active icon: `text-primary`, label: `text-[11px] font-semibold text-primary`
- Inactive: `text-on-surface-variant`
- GuruAI FAB: `h-56px`, `border-radius: 28px 0 0 28px` (half-pill, flush right edge) — extends from right edge

---

### Component Patterns

**Chips (filter chips)**
- Shape: `rounded-full`
- Size: `px-3 py-1.5`, `text-[12px] font-medium`
- Active: `bg-secondary-container`, `color: on-secondary-container`, `borderColor: transparent`
- Inactive: `bg-transparent`, `color: on-surface-variant`, `border: outline-variant`
- Consistent across Wallet, SessionList, Chat

**Search inputs**
- Container: `rounded-full`, `bg-surface-container-high`, `px-3 py-2`
- Icon: `SearchRounded` at `fontSize: 15–18`
- Input: `text-[13px]`, `bg-transparent`, `outline-none border-none`
- Consistent across Wallet (`fontSize: 15`) and SessionList (`fontSize: 18`) — minor icon size inconsistency

**Cards / Section cards (SessionHistory)**
- `rounded-[28px]`, `border-2 border-outline-variant`, `bg-surface`
- Header: `px-4 py-3.5 sm:px-6 sm:py-4`, `border-b border-outline-variant/50`
- Title: `text-[14px] font-normal` — notably `font-normal` not `font-medium`

**Nav links (SessionHistory right rail)**
- `rounded-2xl`, `px-4 py-3`, `gap-3`
- Active: `bg-secondary-container text-on-secondary-container`
- Inactive: `text-on-surface-variant hover:bg-surface-container-high`
- Same pattern as Sidebar NavItem but uses `rounded-2xl` instead of `rounded-full` — inconsistency

**Tab indicators**
- All tabs (Feed, Wallet mobile, Chat, SessionHistory anchor strip): `h-[2px] rounded-t-full bg-primary` absolute bottom indicator
- Consistent ✓

**Avatars**
- Tutor: `dicebear lorelei`, `w-9 h-9 rounded-full`
- Student: `dicebear avataaars`, `w-10 h-10 rounded-full` (navbar), `w-9 h-9` (sidebar)

---

### Key Inconsistencies to Fix

1. **No Outfit font** — Flutter headings use Outfit; web uses nothing equivalent. Add `Outfit` from Google Fonts for display/heading sizes.

2. **`--secondary` token wrong in light mode** — `oklch(0.97 0 0)` should be `#4A90D9` to match Flutter.

3. **Conflicting dark mode** — `.dark` (Shadcn) and `[data-theme="dark"]` (M3) coexist and conflict. The `.dark` block at the bottom of globals.css overrides M3 tokens.

4. **Header heights inconsistent** — Wallet `h-16`, Feed `h-14`, SessionList no fixed height. Should standardize to `h-14` or `h-16` across all pages.

5. **Section card nav links use `rounded-2xl`** while sidebar nav uses `rounded-full` — pick one for list-item active states.

6. **Section card title is `font-normal`** — all other UI labels at the same size use `font-medium`. Likely unintentional.

7. **Search icon size varies** — `fontSize: 15` in Wallet vs `fontSize: 18` in SessionList. Should be one value (18 is more readable).

8. **`font-matter` / `font-season` utilities** resolve to Geist Sans — they're dead aliases. Either load the actual fonts or remove the utilities.

---

after analyzing make the ui of hg store page 



acc to the analysis you have done

---

Let me read the existing store page and home page for context.

---

Now I have everything I need. Let me build the store page properly — consistent with the design system.

The plan:
- Sticky header `h-14` matching Feed's pattern (since it's a content page, not a panel page)
- XP balance as a hero card using the `HeroBanner` blob+shimmer technique
- Category chips matching the exact chip pattern from Wallet/SessionList
- Item cards with `rounded-[20px]`, `border border-outline-variant`, `bg-surface-container-low` — consistent with session cards
- Rarity as a small pill badge (not raw colored text)
- Purchase dialog matching the existing one but polished to M3 sheet style
- Featured/spotlight row for legendary items at top
- All font sizes, weights, colors strictly from the design system

---

Rewriting StoreScreen with the full design system — consistent header height, chip pattern, card style, typography, colors, and purchase sheet matching the rest of the app.

---


Done. Here's exactly what changed and why, based on the analysis:

---

**Header** — switched to `h-14` with `StorefrontOutlined` icon + `text-[14px] font-normal` label, matching Feed's header exactly. XP balance moved here as a small `primary-container` pill — always visible without scrolling.

**Balance hero card** — uses the exact same blob + shimmer technique from `HeroBanner` and `WalletInsights`. `rounded-[24px]`, `border border-outline-variant/30`, `bg-surface-container-low`. Font: `text-[36px] font-light` with `letterSpacing: -1` — same as the wallet balance display.

**Featured row** — horizontal scroll of `w-[200px]` cards for legendary/epic items, shown only on the "All" tab. Keeps the grid from being overwhelming and gives high-value items visual hierarchy.

**Category chips** — exact pattern from Wallet filter chips and SessionList subject chips: `rounded-full`, `px-3 py-1.5`, `text-[12px] font-medium`, active = `secondary-container`, inactive = `transparent` with `outline-variant` border.

**Item cards** — `rounded-[20px]`, `bg-surface-container-low`, `border border-outline-variant`. Icon area uses `bg-surface-container`. Price row separated by a `border-t border-outline-variant` divider. Buy button is `rounded-full` (not `rounded-[10px]` like before).

**Rarity badges** — replaced raw colored text with proper pill badges using `bg`/`color` pairs from the token system. Epic uses `#EDE7F6 / #4527A0` (purple tonal), legendary uses `tertiary-container / on-tertiary-container` (orange), rare uses `secondary-container`, common uses `surface-container-high`.

**Purchase sheet** — rebuilt as a bottom sheet (`rounded-t-[28px]`) on mobile, centered dialog on desktop. Has a drag handle, itemized cost breakdown (cost / balance / remaining), and uses `animate-sheet-up` from globals.css. Actions match the Wallet button pattern exactly.

**Section labels** — `text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant` — same as Sidebar section labels and WalletInsights sections.

---

you have to use materail m3 ui right use that and make it more premium and clean looking take inspo from google store page

---

