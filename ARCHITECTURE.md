# Mandola Frontend Architecture Document

## Overview

Mandola's frontend has been refactored into a scalable React 18 + TypeScript SPA architecture, replacing state-driven single-file tab rendering with **React Router v7** nested layouts and declarative route guards.

---

## Key Architectural Highlights

### 1. Unified Design System & UI Primitives
- **CSS Engine**: Vanilla CSS & Tailwind CSS tokens (`src/styles/index.css`).
- **Class Merger**: `cn()` utility in `src/utils/cn.ts` delegating `clsx` and `tailwind-merge`.
- **Primitives**: 48 modular UI primitives in `src/components/ui/` built using accessible Radix UI primitives.

### 2. State & Context Architecture
- **`AuthContext` (`src/contexts/AuthContext.tsx`)**:
  - Handles authentication state (`user`, `role`, `isAuthenticated`).
  - Implements session persistence via `localStorage`.
  - Mapped role numbers: `1` → `admin`, `2` → `seller`, `3` → `customer`.
- **`UIContext` (`src/contexts/UIContext.tsx`)**:
  - Cart drawer state & line items.
  - Wishlist drawer state.
  - Account dropdown, mobile drawer, search modal, announcement bar toggles.

### 3. Layout Hierarchy & Outlet Composition
- **`RootLayout`**: Encloses `AuthProvider`, `UIProvider`, `<ScrollToTop />`, and renders top-level `<Outlet />`.
- **`PublicLayout`**: Encloses storefront `Header`, `Footer`, `MobileBottomNav`, `CartPanel`, `WishlistPanel`, and `<Outlet />`.
- **`CustomerLayout`**: Encloses Customer Sidebar, Header, notification badges, profile completion progress, and `<Outlet />`.
- **`SellerLayout`**: Encloses Seller Sidebar, Header, store details, metrics, and `<Outlet />`.
- **`AdminLayout`**: Encloses Admin Sidebar, Header, dark mode toggle, quick global search modal, and `<Outlet />`.

### 4. Route Security & Role Guarding
- **`ProtectedRoute` (`src/routes/ProtectedRoute.tsx`)**:
  - Intercepts requests to protected routes.
  - Redirects unauthenticated users to `/login` with location preservation.
  - Verifies user role against `allowedRoles`.
  - Redirects unauthorized roles to their respective role home (`/admin`, `/seller`, or `/dashboard`).

---

## Directory Tree

```
c:\wamp64\www\Bitzech\Mandola\src\
├── assets/          # Static branding images
├── components/      # UI Components
│   ├── common/      # Header, Footer, MobileNav, ProductCard, ImageWithFallback
│   ├── home/        # Home page sections
│   ├── panels/      # CartPanel, WishlistPanel, AccountDropdown
│   └── ui/          # 48 Primitive UI components
├── constants/       # Domain data & static mocks
│   ├── adminData.ts
│   ├── auth.constants.ts
│   ├── customerData.ts
│   ├── mockData.ts
│   └── sellerData.ts
├── contexts/        # AuthContext & UIContext
├── hooks/           # useAuth, useUI, useMobile
├── layouts/         # RootLayout, PublicLayout, CustomerLayout, SellerLayout, AdminLayout
├── pages/           # Pages split into admin, customer, public, seller
├── routes/          # ProtectedRoute, AppRouter, and domain route definitions
├── services/        # Axios API client stub
├── styles/          # index.css with custom design tokens
├── types/           # Domain TypeScript contracts
└── utils/           # cn utility
```
