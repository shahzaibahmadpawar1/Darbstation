# Design Guidelines: Petroleum Asset Register System

## Design Approach

**Selected Approach:** Design System - Material Design 3 Principles with Business Application Focus

**Justification:** This is a utility-focused, data-intensive business application requiring efficiency, clarity, and professional presentation. The petroleum industry context demands a trustworthy, stable interface that prioritizes functionality while maintaining visual polish.

**Key Design Principles:**
1. **Clarity First:** Every element serves a functional purpose with clear visual hierarchy
2. **Data Density with Breathing Room:** Display rich information without overwhelming users
3. **Efficient Workflows:** Minimize clicks and cognitive load for repetitive tasks
4. **Professional Trust:** Visual design reflects the serious nature of asset management
5. **Scannable Information:** Users should quickly locate and process data

---

## Typography System

### Font Families
- **Primary (Interface):** Inter or IBM Plex Sans via Google Fonts - clean, highly legible for data-heavy interfaces
- **Secondary (Data/Numbers):** JetBrains Mono for barcodes, serial numbers, and asset codes - monospace for alignment and scannability

### Type Scale
- **Page Headers:** text-3xl font-bold (36px) - Dashboard titles, main page headers
- **Section Headers:** text-2xl font-semibold (24px) - Card headers, panel titles
- **Subsection Headers:** text-lg font-semibold (18px) - Table headers, form section labels
- **Body Text:** text-base (16px) - Form labels, table content, general text
- **Secondary Text:** text-sm (14px) - Helper text, timestamps, metadata
- **Monospace Data:** text-sm font-mono - Asset codes, barcodes, serial numbers

### Typography Guidelines
- Form labels: font-medium for clear distinction from input fields
- Table headers: font-semibold with uppercase tracking for organization
- Error messages: text-sm with appropriate semantic styling
- Button text: font-medium for emphasis

---

## Layout System

### Spacing Primitives
**Core Units:** Tailwind spacing units of **2, 4, 6, 8, 12, 16**

**Application:**
- Micro spacing (form field gaps, icon padding): 2, 4
- Component spacing (card padding, button spacing): 4, 6, 8
- Section spacing (page margins, card gaps): 8, 12, 16
- Page-level spacing (header height, sidebar width): 12, 16, 20

### Grid Structure
- **Desktop:** max-w-7xl container with responsive padding (px-8)
- **Tablet:** max-w-full with px-6
- **Mobile:** Full width with px-4

### Layout Patterns
1. **Dashboard Layout:** Sidebar navigation (w-64) + Main content area with cards grid
2. **List Views:** Full-width data tables with action buttons
3. **Form Layouts:** Two-column responsive grid (grid-cols-1 md:grid-cols-2) for efficiency
4. **Detail Views:** Card-based layout with clear sections

---

## Component Library

### Navigation Components

**Top Navigation Bar**
- Fixed header (h-16) with logo, page title, and user profile dropdown
- Logout button positioned at top-right
- Simple, uncluttered design with clear section indicators

**Sidebar Navigation (Desktop)**
- Width: w-64
- Persistent on desktop, collapsible on mobile
- Navigation items with icons from Heroicons
- Active state with clear visual indicator
- Menu items: Dashboard, Petrol Pumps, (future expandability)

### Authentication

**Login Page**
- Centered card (max-w-md) on full viewport
- Company branding/logo at top
- Username and password fields with clear labels
- Primary action button (full width)
- Clean, focused design without distractions
- Error messages displayed inline below inputs

### Data Display Components

**Petrol Pump Cards (Dashboard)**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure:
  - Header with pump name (text-xl font-semibold)
  - Location and manager info in organized rows
  - Action buttons section (View Assets, Edit, Delete)
  - Quick stats indicator (number of assets)
- Hover state: subtle elevation increase

**Asset Tables**
- Responsive table with fixed header
- Columns: Serial Number, Asset Name, Asset Number, Barcode, Quantity, Units, Remarks, Actions
- Row striping for readability (alternate background)
- Sticky header on scroll
- Actions column aligned right with icon buttons
- Mobile: Stack table into card-based layout

**Empty States**
- Centered message with icon
- Descriptive text explaining what to do
- Primary action button to add first item

### Form Components

**Add/Edit Petrol Pump Form**
- Two-column responsive layout
- Fields: Pump Name, Location, Manager Name, Contact Number, Additional Details
- Clear field labels with text-sm font-medium
- Input styling: border, rounded corners, focus states
- Required field indicators (asterisk)
- Action buttons: Save (primary), Cancel (secondary)

**Add/Edit Asset Form**
- Fields: Asset Name, Asset Number, Serial Number, Barcode (with scan button), Quantity, Units, Remarks
- Barcode field with integrated camera scan button
- Number inputs with appropriate constraints
- Textarea for remarks (3-4 rows)
- Form validation with inline error messages

**Barcode Scanner Modal**
- Full-screen modal overlay
- Live camera preview (centered, max-w-lg)
- Cancel button and auto-close on successful scan
- Instructions text clearly visible
- Scanning indicator/feedback

### Action Components

**Primary Buttons**
- Height: h-10 or h-12 for prominent actions
- Padding: px-6 py-2
- Rounded: rounded-lg
- Font: font-medium
- States: default, hover (subtle darkening), active, disabled

**Secondary Buttons**
- Similar sizing to primary
- Border style with transparent background
- Hover: background fill

**Icon Buttons**
- Size: w-10 h-10 for table actions
- Icon size: w-5 h-5 (Heroicons)
- Rounded: rounded-md
- Common icons: Edit (pencil), Delete (trash), View (eye), Print (printer), Download (arrow-down)

**Action Button Groups**
- Top-right of lists: Print and Export to Excel
- Spacing between buttons: gap-4
- Consistent sizing and alignment

### Utility Components

**Print View**
- Clean, printer-friendly layout
- Company header with logo
- Table formatting optimized for paper
- Hide action buttons and interactive elements
- Page breaks managed appropriately
- Generated date/time stamp

**Modals/Dialogs**
- Centered on viewport
- Max width: max-w-2xl for forms
- Backdrop overlay (semi-transparent)
- Close button (X) at top-right
- Clear title and action buttons at bottom
- Delete confirmations with warning styling

**Toast Notifications**
- Fixed position: top-right
- Success, error, info variants
- Auto-dismiss after 3-5 seconds
- Icon + message format
- Slide-in animation

### Feedback & States

**Loading States**
- Spinner icon for async operations
- Skeleton loaders for table rows
- Disabled state for buttons during submission

**Error States**
- Inline validation messages (text-sm, red tone)
- Form-level error summary if needed
- Clear error icons from Heroicons

**Success States**
- Toast notification for successful operations
- Subtle success indicators in forms

---

## Icons

**Library:** Heroicons (via CDN)
**Usage:**
- Navigation: home, document-text, cog
- Actions: pencil-square (edit), trash (delete), eye (view), printer (print), arrow-down-tray (download)
- Forms: camera (barcode scan), plus (add), x-mark (close)
- States: check-circle (success), exclamation-circle (error), information-circle (info)
- Misc: magnifying-glass (search), funnel (filter), bars-3 (menu)

**Sizing:** w-5 h-5 for buttons, w-6 h-6 for larger touch targets

---

## Animations

**Minimal Animation Philosophy:** Use sparingly for feedback only

**Permitted Animations:**
- Modal/dialog entrance: fade-in with slight scale
- Toast notifications: slide-in from top-right
- Loading spinners: rotation animation
- Hover states: subtle transition (150ms) for buttons and cards
- Dropdown menus: fade and slide

**Avoid:** Page transitions, decorative animations, scroll-triggered effects

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (simplified two-column where appropriate)
- Desktop: > 1024px (full multi-column layouts)

**Mobile Adaptations:**
- Sidebar becomes hamburger menu
- Tables convert to card-based stacked layout
- Form columns stack vertically
- Action buttons stack or use icon-only variants
- Reduced padding and spacing