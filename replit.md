# نبض (Nabdh) - دليل أدوات الذكاء الاصطناعي

## Overview

نبض (Nabdh) is an Arabic-language AI Tools Directory application inspired by "There's An AI For That" (TAAFT). It's a full-stack web application that allows Arabic-speaking users to discover, browse, and explore AI tools across multiple categories. The platform features a modern, information-dense design optimized for quick scanning and discoverability of AI tools with full RTL (right-to-left) support.

The application provides comprehensive filtering, sorting, and search capabilities to help users find the perfect AI tool for their needs. It includes features like trending tools, popular tools, detailed tool pages, category browsing, and a leaderboard system.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 29, 2025 - Performance & Mobile Responsiveness
- Fixed critical memoization bug where ToolCard was double-wrapped with memo()
- Implemented React.lazy for code splitting across all pages
- Enhanced mobile responsiveness with improved grid layouts and touch targets
- Added CSS performance optimizations including GPU acceleration and smooth scrolling

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**Language Support**: Full RTL (right-to-left) layout for Arabic language with proper text direction throughout.

**Routing**: Uses Wouter for client-side routing - a lightweight alternative to React Router that provides simple declarative routing patterns.

**Performance Optimizations**:
- React.lazy and Suspense for page-level code splitting
- Memoized ToolCard component to prevent unnecessary re-renders
- CSS GPU acceleration with transform and will-change properties
- Touch-optimized scrolling with -webkit-overflow-scrolling

**UI Component System**: Built with Radix UI primitives and shadcn/ui components following the "New York" style variant. This provides:
- Accessible, unstyled component primitives from Radix UI
- Pre-styled components from shadcn/ui with consistent design tokens
- Full TypeScript support with type-safe component APIs

**Styling**: Tailwind CSS with custom design tokens defined in CSS variables for theming. The design system supports both light and dark modes with:
- Custom color palette using HSL color space
- Consistent spacing scale (2, 3, 4, 6, 8, 12, 16, 20)
- Typography using Tajawal (Arabic) and JetBrains Mono fonts
- Elevation/shadow system for depth
- Responsive breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

**State Management**: 
- TanStack Query (React Query) v5 for server state management, data fetching, and caching
- React's built-in useState/useContext for local UI state
- Custom theme provider for dark/light mode toggle

**Key Pages**:
- Home (`/`) - Featured tools, filters, and main tool grid
- Tool Detail (`/tool/:slug`) - Individual tool information with related tools
- Category (`/category/:category`) - Category-specific tool listings
- Trending (`/trending`) - Trending AI tools
- Popular (`/popular`) - Most upvoted tools
- Leaderboard (`/leaderboard`) - Rankings by votes, ratings, and views

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Build System**: 
- tsup for backend TypeScript bundling
- Vite for client bundling
- Custom build script that bundles select dependencies to reduce cold start times
- Development mode uses Vite middleware for HMR (Hot Module Replacement)

**API Design**: RESTful API endpoints providing:
- `GET /api/tools` - List all tools with optional filters (query, category, pricing, sort, pagination)
- `GET /api/tools/featured` - Get featured, trending, and new tools
- `GET /api/tools/:slug` - Get single tool by slug
- `GET /api/tools/related/:category` - Get related tools by category

**Data Layer**: Currently using an in-memory mock storage implementation (`server/storage.ts`) that:
- Implements the `IStorage` interface for type safety
- Generates mock data for AI tools with realistic properties
- Provides search, filtering, and sorting capabilities
- **Note**: This is designed to be replaced with a real database implementation (Drizzle ORM + PostgreSQL)

**Development Tools**:
- Replit-specific plugins for development banner and error overlay
- Custom logging middleware for request/response tracking
- Source map support for debugging

### Database Schema (Prepared for Migration)

**ORM**: Drizzle ORM configured for PostgreSQL with schema defined in `shared/schema.ts`.

**Current Tables**:
- `users` - User authentication table with id, username, password

**Expected AI Tools Schema** (defined in TypeScript types but not yet in database):
- Tool properties: id, name, slug, tagline, description, category, pricing, website URL
- Engagement metrics: votes, saves, views, rating
- Feature flags: isFeatured, isNew, isTrending
- Arrays: features, tags
- Timestamps: releasedAt

**Migration Strategy**: The application is structured to use Drizzle ORM, but currently operates with mock data. The schema types are defined and ready for database migration using `drizzle-kit push`.

### External Dependencies

**UI Component Library**: 
- Radix UI - Unstyled, accessible component primitives
- shadcn/ui - Pre-built components with consistent styling

**Database & ORM** (configured but not active):
- @neondatabase/serverless - Neon serverless PostgreSQL driver
- Drizzle ORM - Type-safe SQL query builder
- drizzle-zod - Schema validation

**State Management**:
- @tanstack/react-query - Server state management

**Styling**:
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Component variant management
- clsx + tailwind-merge - Conditional class name utilities

**Forms & Validation**:
- react-hook-form - Form state management
- @hookform/resolvers - Form validation resolvers
- zod - Schema validation
- zod-validation-error - User-friendly validation messages

**UI Enhancements**:
- embla-carousel-react - Carousel component for featured tools
- cmdk - Command palette/search interface
- lucide-react - Icon library
- date-fns - Date formatting utilities

**Development Tools**:
- Replit-specific Vite plugins for development experience
- TypeScript for type safety across the stack
- PostCSS with Autoprefixer for CSS processing

### Important Development Notes

**Memoization**: ToolCard is memoized at the export level in `client/src/components/tool-card.tsx`. Do NOT wrap it with additional memo() calls in parent components - this negates performance benefits.

**Port Configuration**: The application runs on port 5000 for Replit compatibility.

### Design Philosophy

The application follows a reference-based design approach, cloning the visual aesthetic of "There's An AI For That" with emphasis on:
- **Arabic-First**: Full RTL support with Arabic typography and cultural adaptations
- **Information density**: Maximum tools visible while maintaining readability
- **Quick scanning**: Clear visual hierarchy for rapid tool evaluation  
- **Accessibility**: Keyboard shortcuts (Cmd/Ctrl+K for search), semantic HTML, high contrast
- **Performance**: Code splitting, memoization, and GPU-accelerated animations
- **Mobile Responsiveness**: Touch-optimized interactions and adaptive layouts
