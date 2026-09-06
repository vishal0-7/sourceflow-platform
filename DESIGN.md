# TRUST-X Enterprise Design System Specification (DESIGN.md)

> **Document Type:** Institutional Design System Specification  
> **Source Project:** TRUST-X Government Enterprise Workspace (`projects/18174963148908167786`)  
> **Design Philosophy:** Defense-grade, high-density government intelligence & compliance console. Combines strict visual hierarchy, cryptographic auditability, high contrast data legibility, and refined micro-interactions.

---

## 1. Design System Overview & Philosophy

The **TRUST-X Enterprise Workspace** is an institutional-grade platform engineered for mission-critical government workflows, automated document intelligence, structured transformation pipelines, and human-in-the-loop statutory verification.

### Core Visual Principles
1. **Institutional Dignity & Authority**: Deep navy/slate foundations (`#0F172A`, `#131B2E`) paired with crisp surface layers (`#F8F9FF` to `#FFFFFF`) and high-contrast typography.
2. **Deterministic Clarity & Auditability**: Fixed-width mono telemetry (`JetBrains Mono`) for SHA-256 hashes, clearance levels, statutory claims, and timestamped telemetry.
3. **Calibrated Semantic Density**: Clean tabular data, multi-column split workbenches (50/50 evidence verifier, 70/30 output studio), compact pill badges, and structured metric cards without visual clutter.
4. **Dual-Mode Attestation Feedback**: Explicit color-coded evidence signals—institutional emerald (`#15803D`) for verified statutory claims and amber/crimson (`#B45309`, `#BA1A1A`) for flagged inferences requiring human sign-off.

---

## 2. Color Palette & Token System

The color system is derived from Material 3 Enterprise tokens calibrated for high-clarity government consoles.

### 2.1 Primary & Base Theme Colors

| Token Name | Hex Code | Purpose / Usage | Contrast Pairing |
| :--- | :--- | :--- | :--- |
| `primary` | `#000000` / `#0F172A` | Primary brand authority, top institutional bars, active buttons | `on_primary` (`#FFFFFF`) |
| `primary_container` | `#131B2E` | High-security card headers, primary dropdowns, dark telemetry bars | `on_primary_container` (`#7C839B`) |
| `primary_fixed` | `#DAE2FD` | Highlighted selection indicators, focus rings | `on_primary_fixed` (`#131B2E`) |
| `primary_fixed_dim` | `#BEC6E0` | Subtle active states | `on_primary_fixed_variant` (`#3F465C`) |
| `secondary` | `#0369A1` / `#006399` | Interactive navigation links, primary action triggers, citations | `on_secondary` (`#FFFFFF`) |
| `secondary_container` | `#7BC2FF` | Active step chips, highlighted text badges | `on_secondary_container` (`#004F7B`) |
| `secondary_fixed` | `#CDE5FF` | Step status ribbons, tag backgrounds | `on_secondary_fixed` (`#001D32`) |
| `tertiary` | `#15803D` | Statutory verification, cryptographic integrity, system online | `on_tertiary` (`#FFFFFF`) |
| `tertiary_fixed` | `#95F8A7` | Verified status indicators, live telemetry pulse dots | `on_tertiary_fixed` (`#00210A`) |
| `neutral_override` | `#64748B` | Secondary icons, muted metadata, timestamp labels | `surface` |

### 2.2 Surface Elevation & Container System

| Surface Token | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| `surface` / `background` | `#F8F9FF` | Global application workspace canvas |
| `surface_container_lowest`| `#FFFFFF` | Primary white cards, memorandum sheets, modal bodies |
| `surface_container_low` | `#EFF4FF` | Filter bars, table search inputs, nested card bodies |
| `surface_container` | `#E5EEFF` | Table headers, secondary buttons, idle step pill tags |
| `surface_container_high`| `#DCE9FF` | Hover states for surface items, subtle card dividers |
| `surface_container_highest`| `#D3E4FE` | Active tab highlights, badge containers |
| `surface_dim` | `#CBDBF5` | Backdrop overlays, disabled element fills |
| `inverse_surface` | `#213145` | Tooltip containers, dark command palettes |
| `inverse_on_surface` | `#EAF1FF` | Text inside dark tooltips and command bars |

### 2.3 Semantic & Validation States

| State | Background / Container | Text / Foreground | Border | Semantic Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Verified / Success** | `#DCFCE7` (`bg-emerald-100`) | `#15803D` (`text-emerald-700`) | `#86EFAC` | 100% Grounded claim, cryptographic hash matched |
| **Review Required / Warning** | `#FEF3C7` (`bg-amber-100`) | `#B45309` (`text-amber-800`) | `#FCD34D` | Flagged inference, low-confidence extraction |
| **Critical / Security Error** | `#FFDAD6` (`bg-error-container`) | `#BA1A1A` (`text-error`) | `#FCA5A5` | Integrity mismatch, validation failure, deletion |
| **Processing / Ingestion** | `#E0F2FE` (`bg-sky-100`) | `#0369A1` (`text-sky-700`) | `#7DD3FC` | Pipeline active, real-time token extraction |
| **Restricted Clearance** | `#0F172A` (`bg-slate-900`) | `#94A3B8` (`text-slate-400`) | `#334155` | Institutional security classification strip |

---

## 3. Typography Hierarchy

The typography pairs **Inter** (for institutional UI, labels, and analytical documents) with **JetBrains Mono** (for cryptographic digests, telemetry, and structured code values).

### 3.1 Font Families
* **Primary Sans:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Technical Monospace:** `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
* **System Icons:** `'Material Symbols Outlined'` (Optical Size: 20–48px, Weight: 100–700)

### 3.2 Type Scale & Semantic Tokens

| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | Inter | `30px` (1.875rem) | 700 (Bold) | `38px` | `-0.02em` | Page-level title, major module headers |
| `headline-lg` | Inter | `22px` (1.375rem) | 600 (SemiBold) | `28px` | `-0.015em` | Card section titles, modal headers |
| `headline-md` | Inter | `18px` (1.125rem) | 600 (SemiBold) | `24px` | `-0.01em` | Panel titles, table summary headers |
| `body-lg` | Inter | `15px` (0.9375rem) | 400 / 500 | `22px` | `-0.005em` | Lead paragraphs, official memorandum text |
| `body-md` | Inter | `13px` (0.8125rem) | 400 / 500 | `18px` | `0em` | Standard interface text, table cells, form labels |
| `body-sm` | Inter | `12px` (0.75rem) | 400 / 500 | `16px` | `0em` | Secondary table descriptions, helper notes |
| `label-caps` | Inter | `11px` (0.6875rem) | 600 (SemiBold) | `14px` | `0.06em` | Uppercase category tags, table column headers |
| `code-md` | JetBrains Mono | `12px` (0.75rem) | 500 (Medium) | `16px` | `-0.02em` | File paths, telemetry readouts, raw parameters |
| `code-sm` | JetBrains Mono | `11px` (0.6875rem) | 500 (Medium) | `14px` | `-0.01em` | SHA-256 hashes, timestamps, clearance tags |

---

## 4. Spacing, Layout Grid & Sizing

Spacing adheres to a strict 4px/8px incremental grid with specialized density variables for dense consoles.

### 4.1 Spacing Tokens

| Token | Value | Rem | Common Usage |
| :--- | :--- | :--- | :--- |
| `space-2xs` | `2px` | `0.125rem` | Micro-badge internal spacing, border offsets |
| `space-xs` | `4px` | `0.25rem` | Icon + text inline gaps, compact tag padding |
| `space-sm` | `8px` | `0.5rem` | Button horizontal padding, table cell vertical gap |
| `space-md` | `12px` | `0.75rem` | Standard element gap, card internal padding (compact) |
| `space-lg` | `16px` | `1.0rem` | Standard card body padding, split-pane gutters |
| `space-xl` | `24px` | `1.5rem` | Section headers margin, grid spacing |
| `space-2xl` | `32px` | `2.0rem` | Page container padding, major module separation |
| `console-margin`| `24px` | `1.5rem` | Left/right edge gutter for institutional headers & footers |
| `gutter-table` | `8px` | `0.5rem` | Data table column spacing |

### 4.2 Layout Grid & Breakpoints
* **Base Target Viewport:** `2560px × 1440px` (Ultra-wide desktop intelligence workstation)
* **Minimum Supported Desktop:** `1280px × 800px`
* **Grid Structure:** 12-column flex/grid system with responsive collapse at `lg` (1024px) and `xl` (1280px).
* **Workplace Split Ratios:**
  * **Source Evidence Verification Screen:** `50%` Left (Claim Inspector) / `50%` Right (Original PDF Evidence Viewer).
  * **Output Studio Screen:** `70%` Left (Document Canvas) / `30%` Right (Audit Trail & Citations Inspector).
  * **New Transformation Ingestion:** `5-col` (41.6%) Upload Zone / `7-col` (58.4%) Realtime Telemetry & Grounding Showcase.

---

## 5. Borders, Radius & Elevation

### 5.1 Border Tokens
* **Standard Border:** `1px solid var(--outline-variant, #C6C6CD)` (Subtle, non-distracting containment)
* **Active / Focus Border:** `1.5px solid var(--secondary, #0369A1)`
* **Flagged / Warning Border:** `1.5px solid #F59E0B` (`amber-500`)
* **Verified Border:** `1px solid #86EFAC` (`emerald-300`)
* **Dividers & Separators:** `1px solid #E2E8F0` (`border-slate-200`)

### 5.2 Border Radius Scale (`ROUND_FOUR` Philosophy)
To maintain an authoritative, technical precision aesthetic, the system employs restrained, slightly squared corners:
* `rounded-sm`: `2px` (Micro-badges, code snippets)
* `rounded`: `4px` (Buttons, table action chips, standard inputs)
* `rounded-md`: `6px` (Status badges, pill tabs, dropdown menus)
* `rounded-lg`: `8px` (Standard cards, modal containers, split-pane frames)
* `rounded-xl`: `12px` (Document memorandum sheet preview containers)
* `rounded-full`: `9999px` (Status pulse dots, avatar circular marks)

### 5.3 Elevation & Shadows
* **Flat (Default):** `box-shadow: none` with `border: 1px solid #C6C6CD`
* **Level 1 (Card Rest):** `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`
* **Level 2 (Hover / Active Card):** `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)`
* **Level 3 (Floating Menus / Modals):** `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)`
* **Document Paper Sheet:** `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`

---

## 6. Component Specifications

### 6.1 Buttons & Action Triggers

```
+-------------------------------------------------------------------------------+
| PRIMARY: [ (icon) Approve for Dispatch ] -> bg-primary, text-on-primary        |
| SECONDARY: [ (icon) View Evidence (Split) ] -> bg-surface-container-low       |
| OUTLINE: [ (icon) Dismiss Warning & Keep ] -> border-outline, text-on-surface |
| DESTRUCTIVE: [ (icon) Delete Claim ] -> bg-error-container, text-error         |
+-------------------------------------------------------------------------------+
```

1. **Primary Action Button:**
   - Class: `px-space-md py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded font-body-sm font-semibold flex items-center gap-1 shadow-sm transition-colors`
   - Use: Main dispatch triggers, stage completions, document approvals.
2. **Secondary / Utility Button:**
   - Class: `px-space-sm py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-body-sm font-medium flex items-center gap-1 transition-colors`
   - Use: View split, regenerate, download artifacts.
3. **Table & Inline Action Chip:**
   - Class: `px-2.5 py-1 font-code-sm text-code-sm rounded bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-1`
   - Use: "Focus in PDF", "Inspect Claims", "View Diff".
4. **Destructive / Flag Button:**
   - Class: `px-2.5 py-1.5 font-code-sm text-code-sm rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors flex items-center gap-1`
   - Use: Delete claim, abort transformation pipeline.

---

### 6.2 Forms, Inputs & Reviewer Fields

1. **Global Search Input (`⌘K` Command Bar):**
   - Class: `w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-code-sm text-code-sm pl-9 pr-space-lg py-1.5 rounded-lg border border-outline-variant focus:outline-none focus:border-secondary transition-colors`
   - Leading icon: `search` (Material Symbol, 18px).
2. **Reviewer Annotation Textarea / Input:**
   - Class: `w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none border-b border-outline-variant focus:border-secondary py-1`
   - Use: Entering human officer audit remarks on flagged claims.
3. **File Drag & Drop Upload Zone:**
   - Outer container: `border-2 border-dashed border-outline-variant hover:border-secondary bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-space-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer`
   - Icon: `upload_file` (48px, text-secondary).
   - Accepted file badges: `PDF`, `DOCX`, `ZIP`, `JSON-LD` (`px-2 py-0.5 font-code-sm rounded bg-surface-container text-on-surface-variant`).

---

### 6.3 Cards & Data Containers

1. **Institutional KPI Metric Card:**
   - Background: `bg-surface-container-lowest`
   - Border: `1px solid var(--outline-variant)`
   - Padding: `p-space-lg`
   - Structure:
     - Top row: Uppercase label (`font-label-caps text-on-surface-variant`) + trailing icon.
     - Value: `headline-xl font-bold text-on-surface`.
     - Footer: Micro-trend badge (`+12.4% vs last cycle` in emerald or neutral).
2. **Transformation Dossier Showcase Card:**
   - Header strip: Dark slate badge with document category + SHA-256 hash.
   - Body: Extracted key-value entities, page count, document classification, statutory compliance score bar (`88/100`).
3. **Evidence Verification Claim Card (Dual State):**
   - **Verified State:** Border `border-emerald-300`, background `bg-emerald-50/40`.
   - **Flagged State:** Border `border-amber-400`, background `bg-amber-50/50`. Contains amber alert icon, confidence badge (`Confidence: 64%`), highlighted discrepancy text, and reviewer action buttons.

---

### 6.4 Tables & Data Grids

1. **Grid Container:** `w-full bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden`
2. **Table Header (`thead`):**
   - Background: `bg-surface-container`
   - Cell style: `px-space-md py-2 text-left font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold border-b border-outline-variant`
3. **Table Row (`tr`):**
   - Border: `border-b border-outline-variant hover:bg-surface-container-low transition-colors`
   - Cell style: `px-space-md py-2.5 font-body-md text-body-md text-on-surface`
   - Mono column cells (Job ID, SHA-256): `font-code-sm text-code-sm text-on-surface-variant`

---

### 6.5 Navigation, Steppers & Institutional Top Bars

```
+-------------------------------------------------------------------------------------------------------------+
| RESTRICTED // OFFICIAL GOVERNMENT USE ONLY // NIC-CERT LEVEL-4   |   UTC +05:30 IST   |   INTEGRITY: ONLINE   |
+-------------------------------------------------------------------------------------------------------------+
| (LOGO) TRUST-X | Command Dashboard  | Ingestion  | Verifier  | Studio  | [Search ⌘K] | (Officer Clearance)  |
+-------------------------------------------------------------------------------------------------------------+
| 01 INGEST (Done) -> 02 EXTRACT (Done) -> 03 TRANSFORM (Done) -> 04 AUDIT (Done) -> 05 REVIEW (Active Studio) |
+-------------------------------------------------------------------------------------------------------------+
```

1. **Security Classification Banner (Fixed Top 24px):**
   - Background: `bg-primary` (`#0F172A`)
   - Text: `font-code-sm text-code-sm text-on-primary tracking-wider font-semibold uppercase flex items-center justify-between px-console-margin`
   - Left: Live pulse indicator dot (`bg-tertiary-fixed` emerald) + Classification statement.
   - Right: Timezone stamp + `[SHA-256 VERIFIED]` integrity status.
2. **Main Application Navigation Bar (Height 56px):**
   - Background: `bg-surface-container-lowest border-b border-outline-variant`
   - Brand mark: SVG TRUST-X Institutional Emblem + Title (`font-headline-md font-bold text-on-surface`).
   - Center: Navigation links (`font-body-md text-on-surface-variant hover:text-on-surface font-medium`).
   - Right: Search input + Notification bell with unread badge + User officer avatar badge.
3. **Linear Workflow Stepper Ribbon (Height 40px):**
   - Background: `bg-surface-container-low border-b border-outline-variant`
   - Step items:
     - **Completed:** Emerald checkmark + `font-label-caps text-emerald-800`.
     - **Active:** `bg-secondary-fixed text-on-secondary-fixed font-bold rounded px-2.5 py-1`.
     - **Upcoming:** Muted text `text-on-surface-variant opacity-60`.

---

### 6.6 Status Badges & Pill Indicators

| Badge Type | CSS Token Classes | Visual Representation |
| :--- | :--- | :--- |
| **Clearance Level** | `px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-code-sm font-semibold` | `NIC-CERT L4` |
| **Statutory 100%** | `px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-code-sm font-semibold flex items-center gap-1` | `✓ VERIFIED (100%)` |
| **Requires Review** | `px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-code-sm font-semibold flex items-center gap-1` | `⚠ NEEDS REVIEW` |
| **Cryptographic Hash** | `px-2 py-0.5 rounded bg-surface-container font-code-sm text-on-surface-variant font-mono select-all` | `SHA256: 4f8a...9c12` |
| **Active Pipeline** | `px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-code-sm font-semibold flex items-center gap-1` | `● RUNNING STAGE 03` |

---

## 7. Responsive Behavior & Viewport Breakpoints

| Breakpoint | Width | Layout Strategy |
| :--- | :--- | :--- |
| `2xl` / Baseline | `≥ 1920px` | Full multi-column dashboard, 50/50 evidence split workbench with expanded PDF page inspector, 70/30 studio canvas. |
| `xl` | `1280px – 1919px` | Retains split workbench; secondary inspector drawers become collapsible via toggle button. |
| `lg` | `1024px – 1279px` | 12-column grids collapse to stacked 2-column or tabbed views (Tab 1: Claim List, Tab 2: Document Grounding Viewer). |
| `md` | `768px – 1023px` | Header actions collapse to quick action drawer; metrics cards display in 2x2 grid. |
| `sm` | `< 768px` | Stepper ribbon scrolls horizontally; tables switch to responsive card stacks. |

---

## 8. Component Hierarchy & Application Architecture

```
Application Root Shell
│
├── [Global Top Strip] Institutional Security Clearance & Integrity Telemetry Bar
│
├── [Main Header] TRUST-X Institutional Brand Mark + Global Search (⌘K) + Officer Clearance Avatar
│
├── [Workflow Stepper Ribbon] 5-Stage Pipeline (01 Ingest -> 02 Extract -> 03 Transform -> 04 Audit -> 05 Review)
│
├── [Workspace Body] (Screen Dependent)
│   │
│   ├── [Screen 1: Command Dashboard]
│   │   ├── Executive Intelligence Summary Ribbon
│   │   ├── 4x Institutional KPI Metric Cards
│   │   ├── Active Transformation Pipelines Data Grid (Realtime progress & status chips)
│   │   └── Pending Officer Reviews Panel
│   │
│   ├── [Screen 2: New Transformation Workflow]
│   │   ├── Multi-format Ingestion Drag & Drop Zone (5-col)
│   │   └── Realtime Extraction & Semantic Metadata Grounding Showcase (7-col)
│   │
│   ├── [Screen 3: Source Evidence Verification & Human Review]
│   │   ├── Top Filter Bar (Claims Navigator + "Show Flagged Only" filter)
│   │   ├── Left Pane (50%): Generated AI Claim Cards (Verified vs Flagged / Review Notes)
│   │   └── Right Pane (50%): Original PDF Evidence Sheet Viewer with Highlighted Snippets
│   │
│   └── [Screen 4: Output Studio]
│       ├── Header Context Bar & Multi-Artifact Tab Navigation (Memo / Summary / Data / Diff)
│       ├── Left Canvas (70%): Official Government Memorandum Document Viewer
│       └── Right Sidebar (30%): Audit Trail, Grounding Citations & Export Controls
│
└── [Global Audit Footer] Cryptographic Hash Attestation & Timestamped Session Telemetry
```

---

## 9. Stitch MCP Asset Reference

* **Official Logo Asset:** `projects/18174963148908167786/screens/be769385a88240a4be7ea76fe87108cc`
* **Command Dashboard Screen:** `projects/18174963148908167786/screens/fcda294123e946e68e8d90258771b673`
* **New Transformation Screen:** `projects/18174963148908167786/screens/f17c5807d30c4a7e91890943f711789f`
* **Source Evidence Verification Screen:** `projects/18174963148908167786/screens/e3da42aff0a74dc58b131a66c4cf4c98`
* **Output Studio Screen:** `projects/18174963148908167786/screens/87b975ffacc34a969854ae72417157df`
