# Design Guidelines: AI Tools Directory Clone

## Design Approach
**Reference-Based Approach**: Clone of "There's An AI For That" - capturing the modern, tech-forward aesthetic of the original while maintaining production quality. The design emphasizes discoverability, clean information hierarchy, and efficient browsing of AI tools.

## Core Design Principles
1. **Information Density**: Display maximum tools while maintaining readability
2. **Quick Scanning**: Clear visual hierarchy for rapid tool evaluation
3. **Accessibility First**: Keyboard shortcuts, semantic structure, high contrast
4. **Performance**: Optimized for fast loading with hundreds of tool cards

---

## Typography

**Font Stack**: 
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts CDN)
- Monospace: 'JetBrains Mono' for code/technical elements

**Hierarchy**:
- Hero Headlines: text-4xl md:text-5xl lg:text-6xl, font-bold
- Section Headers: text-2xl md:text-3xl, font-bold
- Tool Names: text-lg font-semibold
- Tool Descriptions: text-sm md:text-base, font-normal
- Category Labels: text-xs uppercase tracking-wide font-medium
- Metadata (pricing, votes): text-xs md:text-sm

---

## Layout System

**Spacing Units**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20** consistently
- Card padding: p-4 md:p-6
- Section spacing: py-12 md:py-16 lg:py-20
- Grid gaps: gap-4 md:gap-6
- Container max-width: max-w-7xl

**Grid System**:
- Tool Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Featured Tools Carousel: Horizontal scroll with snap points
- Category Filters: Flexbox with wrap

---

## Component Library

### Navigation Header
- Sticky positioned (sticky top-0)
- Logo + Search bar (prominent, centered) + Auth buttons
- Secondary nav row: Category links, filter toggles
- Mobile: Hamburger menu with slide-out drawer
- Search: Full-width modal on Ctrl+K with backdrop blur
- Include notification bell icon (Heroicons)

### Tool Cards
**Structure**:
- Rounded corners (rounded-lg)
- Border treatment with hover elevation
- Icon slot (64x64px) - top-left or centered
- Tool name + "Featured" badge if applicable
- One-line description (truncate with ellipsis)
- Footer: Pricing label + vote count + bookmark icon
- "Open" button (subtle, secondary style)
- Share button (icon only)

**States**: Hover lift effect (shadow transition), active state

### Search Modal
- Centered overlay (max-w-2xl)
- Large search input with icon
- Recent searches / trending below
- Keyboard navigation indicators
- ESC to close functionality

### Filters Bar
- Horizontal pill buttons: "Free mode", "100% free", "Freemium", "Free Trial"
- Active state: filled style
- Mobile: Horizontal scroll

### Category Navigation
- Horizontal scroll/wrap layout
- Categories: Personal, Work, Creativity, Tasks, etc.
- Icon + label format
- Active indicator

### Tool Detail Page
- Two-column layout (lg:): Left: Tool info | Right: Screenshots/demo
- Hero section: Tool icon, name, tagline, CTA buttons
- Feature list with checkmarks
- Pricing tiers comparison
- User reviews/ratings section
- Related tools carousel at bottom

### Footer
- Four-column grid (collapse to single on mobile)
- Sections: Product, Company, Resources, Social
- Newsletter signup form
- Copyright + links

---

## Icons & Assets

**Icons**: Use Heroicons (outline style) via CDN
- Search, Menu, X (close), Bell, Bookmark, Share, External Link, ChevronRight, Filter, Star

**Tool Icons**: 
- Placeholder: 64x64px rounded squares with initials or generic icon
- Support for uploaded logos (SVG preferred)

**Images**:
- Hero Section: No large hero image - focus on search functionality
- Tool Detail Pages: Screenshot gallery (2-3 images per tool)
- Avatar placeholders: For user profiles/testimonials

---

## Key Interactions

**Search**:
- Instant results as typing
- Highlight matching text
- Arrow key navigation
- Enter to open first result

**Tool Cards**:
- Hover: Subtle lift + shadow increase
- Click anywhere to open detail page
- Bookmark icon: Toggle saved state
- Share: Open native share or copy link

**Infinite Scroll**:
- Load more tools as user scrolls
- Loading skeleton cards while fetching

**Filtering**:
- Instant filtering (no page reload)
- Show result count
- Clear filters option

---

## Responsive Behavior

**Mobile** (< 768px):
- Single column tool grid
- Hamburger menu
- Search triggers full-screen modal
- Horizontal scroll for categories
- Sticky category filter bar

**Tablet** (768px - 1024px):
- 2-column tool grid
- Compressed navigation
- Side-by-side layout for tool details

**Desktop** (> 1024px):
- 3-4 column tool grid
- Full navigation visible
- Hover interactions enabled

---

## Special Features

**Keyboard Shortcuts**:
- Ctrl/Cmd + K: Open search
- ESC: Close modals
- Arrow keys: Navigate search results

**Dark Mode Ready**: Structure with theme-agnostic spacing (colors applied separately)

**Performance**:
- Lazy load tool card images
- Virtual scrolling for long lists (if 100+ tools visible)
- Skeleton loading states