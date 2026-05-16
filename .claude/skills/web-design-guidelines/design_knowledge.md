# Internal SApp Design System - Design Knowledge Base

This document contains all design specifications, patterns, and components from the Internal Sales App (SApp). Use this as a reference to refactor other applications to match this design aesthetic.

---

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Components](#components)
4. [Layout System](#layout-system)
5. [Navigation Patterns](#navigation-patterns)
6. [Form Elements](#form-elements)
7. [Cards & Containers](#cards--containers)
8. [Modals & Dialogs](#modals--dialogs)
9. [Buttons](#buttons)
10. [Tables & Lists](#tables--lists)
11. [Icons](#icons)
12. [Animations & Transitions](#animations--transitions)
13. [Spacing & Sizing](#spacing--sizing)
14. [Shadows & Elevation](#shadows--elevation)
15. [State Indicators](#state-indicators)
16. [Dark Mode Considerations](#dark-mode-considerations)

---

## Color Palette

### Primary Brand Colors
```tailwindcss
// Brand Color Variants
brand-50:  #f0f9ff    // Lightest background
brand-100: #e0f2fe    // Light backgrounds, hover states
brand-500: #0ea5e9    // Accent highlights
brand-600: #0284c7    // Primary CTA, active states
brand-700: #0369a1    // Darker accent
brand-900: #0c4a6e    // Darkest brand color
```

### Neutral/Gray Palette
```tailwindcss
// Slate colors (primary neutral)
slate-50:   #f8fafc   // Page backgrounds, light surfaces
slate-100:  #f1f5f9   // Borders, subtle backgrounds
slate-200:  #e2e8f0   // Borders, secondary backgrounds
slate-300:  #cbd5e1   // Input borders
slate-400:  #94a3b8   // Secondary text
slate-500:  #64748b   // Body text
slate-600:  #475569   // Primary text
slate-900:  #0f172a   // Headings, dark text
```

### Semantic Colors
```tailwindcss
// Status colors
emerald-50:  #f0fdf4   // Success backgrounds
emerald-500: #10b981   // Success accent
emerald-600: #059669   // Active success

blue-50:     #eff6ff   // Info backgrounds
blue-600:    #2563eb   // Info accent

purple-50:   #faf5ff   // Secondary backgrounds
purple-600:  #9333ea   // Secondary accent

orange-50:   #fff7ed   // Warning backgrounds
orange-400:  #fb923c   // Warning accent
orange-600:  #ea580c   // Active warning

red-50:      #fef2f2   // Error backgrounds
red-500:     #ef4444   // Error accent
red-600:     #dc2626   // Active error

amber-50:    #fffbeb   // Caution backgrounds
amber-600:   #d97706   // Caution accent

white:       #ffffff   // Pure white for cards
```

### Usage Guidelines
- **Primary Backgrounds**: `slate-50` (#F8FAFC) - main page background
- **Card Backgrounds**: `white` with `border-slate-100/60` or `border-slate-200/60`
- **Text - Headings**: `text-slate-900` with `font-black`
- **Text - Body**: `text-slate-600` or `text-slate-500`
- **Text - Secondary**: `text-slate-400` (labels, secondary info)
- **Borders**: `border-slate-100/80` to `border-slate-200/60`
- **Brand Actions**: `bg-brand-600`, `hover:bg-brand-700`
- **Status Indicators**: Use semantic colors (emerald, red, orange, blue)

---

## Typography

### Font Family
```
Primary Font: Plus Jakarta Sans
  - Google Fonts: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap
  - Weights: 300, 400, 500, 600, 700, 800
  - Fallback: sans-serif
```

### Font Sizes & Weights

#### Headings
```tailwindcss
// Page Title
text-4xl font-black tracking-tight    // 36px, Black (800), tight spacing
// Example: "Good morning, Sarah."

// Section Title
text-xl font-black                    // 20px, Black (800)
// Example: "Activity Overview"

// Sub-headings
text-lg font-bold                     // 18px, Bold (700)
// Example: "Here's what's happening..."

// Card Titles
text-sm font-bold                     // 14px, Bold (700)
// Example: Task titles in lists

// Label/Caption
text-[10px] font-black uppercase tracking-widest    // 10px, Black, all caps, wide spacing
// Example: "OPERATIONS", "ADMINISTRATION"
```

#### Body Text
```tailwindcss
// Primary Body
text-sm font-medium         // 14px, Regular (400-500)

// Secondary/Subtle Text
text-sm text-slate-500      // 14px, Medium weight (500), gray color

// Extra Small
text-xs text-slate-400      // 12px, Regular, gray
```

#### Special Sizes
```tailwindcss
// Large Numbers (Metrics)
text-3xl font-black text-slate-900 tracking-tight    // 30px, Black, tight

// Large Button Text
text-sm font-bold           // 14px, Bold

// Navigation Items
text-sm font-bold tracking-tight      // 14px, Bold, tight spacing
```

### Line Height
```tailwindcss
// Default: inherited
// Headings: leading-none or leading-tight
// Body: leading-relaxed or default
```

### Text Decoration
```tailwindcss
// Underlines with custom colors
underline decoration-brand-300 decoration-2 underline-offset-2

// Emphasis
<span className="font-bold">emphasized text</span>
<span className="font-black">strong emphasis</span>
```

### Letter Spacing
```tailwindcss
tracking-tight      // -0.025em (headings, dense text)
tracking-normal     // 0 (default)
tracking-wide       // 0.025em (body text, labels)
tracking-widest     // 0.1em (section labels, captions)
```

---

## Components

### Component Philosophy
- **Modular**: Reusable sub-components for repeated patterns
- **Consistent**: Match colors, spacing, and interactions across app
- **Accessible**: Semantic HTML, proper ARIA labels
- **Interactive**: Hover states, loading states, transitions
- **Responsive**: Mobile-first, adapt to screen sizes

### Component Naming Convention
```
Pattern: [ComponentName].tsx
Examples:
- StatCard.tsx (reusable metric display)
- NavItem.tsx (navigation links)
- CustomCheckbox.tsx (custom form control)
- DataWatermark.tsx (page watermark)
```

---

## Layout System

### Page Structure
```tsx
// Standard Page Layout
<div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
    {/* Left: Title + Description */}
    {/* Right: Action Buttons */}
  </div>

  {/* Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
    {/* Main Content */}
    {/* Sidebar */}
  </div>
</div>
```

### Sidebar Layout
```tsx
<div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
  {/* Sidebar */}
  <aside className="w-[260px] bg-white border-r border-slate-200/60 flex flex-col">
    {/* Logo & Branding */}
    {/* Navigation */}
    {/* User Profile */}
  </aside>

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto min-w-0">
    {/* Mobile Header */}
    {/* Page Content */}
  </main>
</div>
```

### Max Widths
```tailwindcss
max-w-[1600px]     // Content wrapper max width
max-w-xl           // Form fields, narrow layouts
max-w-[100%]       // Full width content
```

### Spacing
```
Page padding: p-6 (24px) on mobile, p-10 (40px) on desktop
Container gaps: gap-6 (24px), gap-8 (32px), gap-10 (40px)
Section spacing: space-y-8, space-y-10
```

### Responsive Breakpoints (Tailwind Default)
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px

Usage: md:flex-row (responsive direction change)
```

---

## Navigation Patterns

### Sidebar Navigation
```tsx
const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <Link
      to={to}
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 border ${
        isActive 
          ? 'bg-brand-50/60 border-brand-100/50 text-brand-700 shadow-sm' 
          : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* Icon - dynamically sized */}
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {/* Active Indicator - pulsing dot */}
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />}
    </Link>
  );
};
```

#### Navigation Styles
- **Inactive**: 
  - Background: transparent
  - Border: transparent
  - Text Color: `text-slate-500`
  - Hover: `bg-slate-50` + `text-slate-900`

- **Active**:
  - Background: `bg-brand-50/60` (semi-transparent)
  - Border: `border-brand-100/50`
  - Text Color: `text-brand-700`
  - Shadow: `shadow-sm`
  - Indicator: Pulsing dot on the right (`w-1.5 h-1.5 animate-pulse`)

### Navigation Sections
```tsx
<nav className="flex-1 overflow-y-auto px-4 space-y-8">
  <div className="space-y-1">
    {/* Section Label */}
    <div className="px-4 pb-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        SECTION NAME
      </span>
    </div>
    
    {/* Nav Items */}
    <NavItem to="/path" icon={<Icon />} label="Label" />
  </div>
</nav>
```

### Mobile Navigation
```tsx
// Sticky header bar for mobile
<div className="sticky top-0 z-20 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center lg:hidden">
  {/* Logo */}
  {/* Mobile Menu Button */}
</div>
```

---

## Form Elements

### Text Inputs
```tsx
<input
  type="text"
  placeholder="Placeholder text"
  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder-slate-400"
/>
```

### Text Areas
```tsx
<textarea
  placeholder="Message..."
  rows={4}
  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder-slate-400 resize-none"
/>
```

### Select Dropdowns
```tsx
<select
  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all bg-white"
>
  <option>Select option</option>
</select>
```

### Custom Checkbox
```tsx
const CustomCheckbox = ({ checked, indeterminate, onChange }: { checked: boolean; indeterminate?: boolean; onChange: () => void }) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`
      w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center cursor-pointer transition-all duration-200 group relative
      ${checked || indeterminate 
        ? 'bg-brand-600 border-brand-600 shadow-sm shadow-brand-200' 
        : 'bg-white border-slate-300 hover:border-brand-400 hover:bg-slate-50'
      }
    `}
  >
    {checked && !indeterminate && <Check size={12} strokeWidth={4} className="text-white animate-in zoom-in duration-200" />}
    {indeterminate && <Minus size={12} strokeWidth={4} className="text-white animate-in zoom-in duration-200" />}
  </div>
);
```

### Form Labels
```tsx
<label className="block text-sm font-bold text-slate-900 mb-2">
  Label Text
</label>
```

### Error Messages
```tsx
<p className="text-xs text-red-600 font-medium mt-1">Error message text</p>
```

---

## Cards & Containers

### Standard Card
```tsx
<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
  {/* Content */}
</div>
```

#### Card Properties
- **Background**: `bg-white`
- **Padding**: `p-6` (24px) or `p-8` (32px)
- **Border Radius**: `rounded-3xl` (24px radius) or `rounded-2xl` (16px radius)
- **Border**: `border border-slate-100` or `border-slate-200/60`
- **Shadow (Default)**: `shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]`
- **Shadow (Hover)**: `hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]`
- **Hover Effect**: `hover:-translate-y-1` (lift on hover)
- **Transition**: `transition-all duration-300`

### Stat Card / Metric Card
```tsx
<div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
    {/* Icon Badge */}
    <div className="w-12 h-12 rounded-2xl bg-{color}-50 text-{color}-600 flex items-center justify-center border border-{color}-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    
    {/* Value */}
    <div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</h3>
      <p className="text-sm font-bold text-slate-500">{title}</p>
    </div>
  </div>
</div>
```

### Feature Cards with Icons
```tsx
<div className="bg-{color}-50 p-6 rounded-2xl border border-{color}-100">
  <div className="w-10 h-10 rounded-xl bg-white text-{color}-600 flex items-center justify-center mb-4">
    {icon}
  </div>
  <h3 className="font-bold text-slate-900 mb-2">Title</h3>
  <p className="text-sm text-slate-600">Description</p>
</div>
```

### Container with Background
```tsx
<div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8">
  {/* Content */}
</div>
```

---

## Modals & Dialogs

### Modal Structure
```tsx
{isOpen && (
  <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-900">Modal Title</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-4">
        {/* Content */}
      </div>

      {/* Modal Footer */}
      <div className="p-6 border-t border-slate-100 flex gap-3">
        <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-all">
          Cancel
        </button>
        <button className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all">
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
```

#### Modal Properties
- **Backdrop**: `bg-black/20 backdrop-blur-sm`
- **Container**: `bg-white rounded-3xl shadow-2xl`
- **Width**: `w-full max-w-md` (for small modals), `max-w-lg`, `max-w-2xl`
- **Max Height**: `max-h-[90vh] overflow-y-auto`
- **Padding**: `p-6` (24px)

---

## Buttons

### Primary Button
```tsx
<button className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
  Button Text
</button>
```

### Secondary Button
```tsx
<button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm">
  Button Text
</button>
```

### Brand Button
```tsx
<button className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
  Button Text
</button>
```

### Ghost Button
```tsx
<button className="px-5 py-2.5 bg-transparent text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
  Button Text
</button>
```

### Icon Button
```tsx
<button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
  <Icon size={20} />
</button>
```

### Button with Icon (Right-aligned)
```tsx
<button className="w-full py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-slate-200">
  <span>Text</span>
  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
</button>
```

### Button Sizes
```
Small:   px-3 py-1.5 text-xs
Medium:  px-4 py-2 text-sm
Large:   px-5 py-2.5 text-base
XL:      px-6 py-3 text-lg
```

### Button Radius
```
rounded-lg       // 8px (for compact buttons)
rounded-xl       // 12px (standard)
rounded-2xl      // 16px (larger)
rounded-3xl      // 24px (very large)
```

---

## Tables & Lists

### List Item Card
```tsx
<div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-100 transition-all cursor-pointer group">
  {/* Icon Badge */}
  <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-brand-600 shadow-sm flex-shrink-0">
    <Icon size={16} />
  </div>
  
  {/* Content */}
  <div className="flex-1">
    <div className="flex justify-between items-start">
      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">Title</h4>
      <span className="text-[10px] font-bold text-slate-400">Time/Badge</span>
    </div>
    <p className="text-xs text-slate-500 font-medium mt-1">Description</p>
  </div>
</div>
```

### Data Table Header
```tsx
<thead className="bg-slate-50/50 border-y border-slate-100">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-black text-slate-600 uppercase tracking-wider">Column</th>
  </tr>
</thead>
```

### Data Table Row
```tsx
<tbody>
  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 text-sm text-slate-900 font-medium">Content</td>
  </tr>
</tbody>
```

---

## Icons

### Icon Library
- **Source**: Lucide React (v0.555.0+)
- **Size**: Default 24px, commonly used sizes: 16, 20, 22, 24, 32, 48
- **Color**: Inherit from text color (use `className` to override)

### Icon Usage
```tsx
import { Phone, Users, Settings, Plus, X, Check, ArrowUpRight } from 'lucide-react';

// Inline icon
<Phone size={20} className="text-brand-600" />

// Icon with text
<div className="flex items-center gap-2">
  <Phone size={16} />
  <span>Call</span>
</div>

// Icon button
<button className="p-2 hover:bg-slate-50 rounded-lg">
  <Icon size={20} />
</button>

// Dynamic icon sizing
{React.cloneElement(icon as React.ReactElement, { 
  size: 20, 
  className: 'text-brand-600' 
})}
```

### Common Icons Used
- Navigation: LayoutDashboard, Users, Phone, Settings, FileText, History, UserCog
- Actions: Plus, X, Edit, Save, Trash2, Send, Upload
- Status: Check, CheckCircle2, AlertCircle, AlertTriangle, Clock
- Navigation: ArrowUp, ArrowDown, ArrowUpRight, ChevronRight, ChevronDown
- Other: Search, Filter, Mail, Building2, Briefcase, Flame, Bookmark

---

## Animations & Transitions

### Transition Classes
```tailwindcss
transition-all          // All properties
transition-colors       // Only color changes
transition-opacity      // Only opacity
transition-transform    // Only transform

// Durations
duration-200            // 200ms (quick)
duration-300            // 300ms (standard)
duration-500            // 500ms (slow)
duration-700            // 700ms (slower)
```

### Animation Classes
```tailwindcss
animate-in              // Fade in entrance
fade-in                 // Opacity 0 to 1
slide-in-from-bottom-4  // Slide up from bottom
spin                    // Continuous rotation (for loaders)
pulse                   // Pulsing opacity (for activity dots)
zoom-in                 // Scale from 0 to 1
```

### Hover Effects
```tsx
// Lift effect (Y-axis translate)
hover:-translate-y-1

// Shadow growth
hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]

// Color change
hover:text-slate-900
hover:bg-slate-50

// Scale
group-hover:scale-110

// Icon animation
group-hover:translate-x-0.5 group-hover:-translate-y-0.5

// Background color
hover:bg-brand-700
```

### Entry Animation (for pages)
```tsx
<div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
  {/* Content */}
</div>
```

### Loading State
```tsx
<div className="flex flex-col items-center justify-center h-[60vh] gap-6">
  <div className="relative">
    <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
    <Loader2 size={48} className="animate-spin text-brand-600 relative z-10" />
  </div>
  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
    Loading...
  </p>
</div>
```

### Pulsing Indicator
```tsx
{/* Active indicator - pulsing dot */}
<div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />

{/* Activity pulse */}
<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
```

---

## Spacing & Sizing

### Space Scale (from Tailwind)
```
0px:   0
2px:   0.125rem
4px:   0.25rem
6px:   0.375rem
8px:   0.5rem    (p-2)
12px:  0.75rem   (p-3)
16px:  1rem      (p-4)
20px:  1.25rem   (p-5)
24px:  1.5rem    (p-6)
28px:  1.75rem   (p-7)
32px:  2rem      (p-8)
36px:  2.25rem   (p-9)
40px:  2.5rem    (p-10)
48px:  3rem      (p-12)
56px:  3.5rem    (p-14)
64px:  4rem      (p-16)
```

### Padding Examples
```tsx
p-4         // 16px all sides
p-6         // 24px all sides (card default)
p-8         // 32px all sides (large card)
px-4        // 16px left & right
px-6        // 24px left & right
py-2.5      // 10px top & bottom
py-3        // 12px top & bottom
```

### Gap Examples
```tsx
gap-2       // 8px between items
gap-3       // 12px between items
gap-3.5     // 14px between items (navigation)
gap-4       // 16px between items
gap-6       // 24px between items (common)
gap-8       // 32px between items (large sections)
```

### Width & Height
```tsx
w-5 h-5           // 20x20px (icons)
w-10 h-10         // 40x40px (icon badges)
w-12 h-12         // 48x48px (larger badges)
min-w-0           // Reset flex min-width
min-h-[350px]     // Custom min height
w-[260px]         // Fixed sidebar width
max-h-[90vh]      // Max height viewports
```

---

## Shadows & Elevation

### Box Shadows
```tailwindcss
// Card shadows
shadow-sm                                    // 0 1px 2px 0 rgba(0,0,0,0.05)
shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]  // Card default
shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]  // Card hover

// Button shadows
shadow-lg shadow-slate-200                   // Large shadow with colored tint
shadow-lg shadow-brand-200                   // Brand-colored shadow

// Logo/Avatar shadows
shadow-lg shadow-brand-200                   // Circle highlights

// Sidebar shadow
shadow-[2px_0_24px_-12px_rgba(0,0,0,0.02)]  // Subtle edge shadow
```

### Elevation Rules
- **Lowest**: No shadow (flat)
- **Low**: `shadow-sm`
- **Medium**: `shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]`
- **High (Hover)**: `shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]`
- **Highest**: `shadow-2xl`

---

## State Indicators

### Active/Selected State
```tsx
// Active navigation item
bg-brand-50/60 border-brand-100/50 text-brand-700 shadow-sm

// Active pulsing indicator
<div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
```

### Success State
```tsx
// Success badge
bg-emerald-50 text-emerald-600 border border-emerald-100

// Success message
text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold
```

### Error/Danger State
```tsx
// Error text
text-red-600 text-xs font-medium

// Error badge
bg-red-50 text-red-600 border border-red-100

// Danger button
hover:text-red-500 hover:bg-red-50
```

### Loading State
```tsx
// Loading skeleton
bg-slate-100 animate-pulse

// Loading spinner
<Loader2 size={48} className="animate-spin text-brand-600" />
```

### Disabled State
```tsx
opacity-50 cursor-not-allowed
```

### Hover States
```tsx
// Generic hover
hover:bg-slate-50 hover:shadow-md transition-all

// Text hover
group-hover:text-brand-700 transition-colors

// Icon hover
group-hover:scale-110 transition-transform duration-300
```

---

## Dark Mode Considerations

### Currently: Light Mode Only

The design system is optimized for light mode. If implementing dark mode:

#### Recommended Dark Mode Adjustments
```tailwindcss
// Dark backgrounds
dark:bg-slate-900      // Page background
dark:bg-slate-800      // Card background

// Dark text
dark:text-slate-100    // Primary text
dark:text-slate-400    // Secondary text

// Dark borders
dark:border-slate-700

// Dark overlays
dark:bg-black/40

// Example dark card
dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100
```

#### Dark Mode Strategy
1. Add `dark:` prefixed classes to all components
2. Use `prefers-color-scheme` media query
3. Add toggle in settings
4. Store preference in localStorage
5. Test all color contrasts (WCAG AA minimum)

---

## Component Assembly Examples

### Example 1: Page Header
```tsx
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
  {/* Left */}
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Sun size={20} className="text-orange-400" />
      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        {date}
      </span>
    </div>
    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
      Good morning, {name}.
    </h1>
    <p className="text-slate-500 font-medium text-lg mt-2 max-w-xl">
      Here's what's happening in your pipeline today.
    </p>
  </div>
  
  {/* Right */}
  <div className="flex gap-3">
    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm">
      View Reports
    </button>
    <button className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
      Start Outreach
    </button>
  </div>
</div>
```

### Example 2: Metrics Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard title="Calls Today" value={45} icon={<Phone />} color="blue" subtext="+12%" />
  <StatCard title="Meetings" value={12} icon={<Calendar />} color="purple" />
  <StatCard title="Total Leads" value={238} icon={<Users />} color="emerald" />
  <StatCard title="Conversion" value="18.5%" icon={<Target />} color="orange" subtext="Solid" />
</div>
```

### Example 3: Form Layout
```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <label className="block text-sm font-bold text-slate-900 mb-2">
      Email Address
    </label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
      placeholder="your@email.com"
    />
    {errors.email && <p className="text-xs text-red-600 font-medium mt-1">{errors.email}</p>}
  </div>
  
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  >
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

### Example 4: List of Items
```tsx
<div className="space-y-4">
  {items.map((item) => (
    <div
      key={item.id}
      className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-100 transition-all cursor-pointer group"
    >
      <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-brand-600 shadow-sm flex-shrink-0">
        <Clock size={16} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
            {item.title}
          </h4>
          <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">{item.description}</p>
      </div>
    </div>
  ))}
</div>
```

---

## Quick Reference Checklist

When refactoring to match this design:

### Colors
- [ ] Primary brand colors set (brand-50, 100, 500, 600, 700)
- [ ] Slate gray palette consistent
- [ ] Semantic colors applied (emerald, blue, orange, red)
- [ ] Page background is `bg-[#F8FAFC]`
- [ ] Cards are `bg-white` with subtle borders

### Typography
- [ ] Font is "Plus Jakarta Sans"
- [ ] Headings use `font-black` or `font-bold`
- [ ] Body text uses `text-sm font-medium` or similar
- [ ] Section labels are `text-[10px] font-black uppercase tracking-widest`

### Layout
- [ ] Sidebar navigation on desktop
- [ ] Mobile header on mobile
- [ ] Responsive grid layouts
- [ ] Proper spacing with gap and padding

### Components
- [ ] Custom checkbox styled consistently
- [ ] Buttons match button styles
- [ ] Form inputs have proper focus states
- [ ] Cards have hover effects

### Interactions
- [ ] Hover states on interactive elements
- [ ] Loading states with spinners
- [ ] Transitions smooth (200-300ms)
- [ ] Active states clearly indicated

### Accessibility
- [ ] Icons have proper sizes
- [ ] Text colors meet contrast ratio
- [ ] Form labels associated with inputs
- [ ] Focus indicators visible

---

## Migration Guide

If you're refactoring an existing application:

1. **Start with Layout**
   - Update main page wrapper to light background
   - Create sidebar navigation component
   - Add mobile header

2. **Update Colors**
   - Replace all colors with palette values
   - Update Tailwind config with brand colors
   - Test color contrast

3. **Refactor Components**
   - Update buttons to match styles
   - Restyle form elements
   - Create reusable card components

4. **Polish Interactions**
   - Add hover effects
   - Implement transitions
   - Add loading states

5. **Test Responsiveness**
   - Check mobile layouts
   - Verify breakpoint changes
   - Test touch interactions

---

## Fonts & Resources

### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Icon Library
- **Lucide React**: https://lucide.dev/

### Tailwind CSS
- **Documentation**: https://tailwindcss.com/
- **Color System**: https://tailwindcss.com/docs/customizing-colors

---

**Last Updated**: January 2025
**Version**: 1.0
**Design System**: Internal SApp v1
