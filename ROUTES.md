# Mandola Route Architecture

The Mandola frontend uses **React Router v7** (`createBrowserRouter`) with nested layout routes (`<Outlet />`) and role-based route guards (`ProtectedRoute`).

---

## 🔒 Access Control & Role Mappings

In strict compliance with repository rules, numeric role IDs correspond to:

| Role ID | Role Name | Allowed Route Scope | Access Guard |
| :--- | :--- | :--- | :--- |
| `1` | `admin` | `/admin/*` | `ProtectedRoute allowedRoles={[1]}` |
| `2` | `seller` | `/seller/*` | `ProtectedRoute allowedRoles={[2]}` |
| `3` | `customer` | `/dashboard/*` | `ProtectedRoute allowedRoles={[3]}` |
| Unauthenticated | Guest | Public storefront (`/*`) | Open |

---

## 🌐 1. Public Routes (`PublicLayout`)

Mounted inside `PublicLayout` containing storefront Header, Footer, Mobile Navigation, Cart Panel, and Wishlist Panel.

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Home page with Hero, Collections, Featured Products, Trust Badges |
| `/category` | `CategoryPage` | Filterable catalog by category, price, size, fabric |
| `/product/:id` | `ProductDetailPage` | Single product detail view, gallery, size selector, add to cart |
| `/login` | `AuthPage` | Login & Register form with role-switcher demo |

---

## 👤 2. Customer Routes (`CustomerLayout`) — Role `3`

Mounted inside `CustomerLayout` with Customer Sidebar & Navigation.

| Path | Component | Description |
| :--- | :--- | :--- |
| `/dashboard` | `DashboardHomePage` | Overview stats, recent orders, quick actions |
| `/dashboard/profile` | `MyProfilePage` | Edit profile name, email, phone, avatar |
| `/dashboard/orders` | `MyOrdersPage` | Customer order history with status filters |
| `/dashboard/orders/:id` | `OrderDetailsPage` | Itemized order details & courier info |
| `/dashboard/tracking` | `OrderTrackingPage` | Live shipment tracking timeline |
| `/dashboard/wishlist` | `WishlistPage` | Saved wishlist products grid |
| `/dashboard/addresses` | `SavedAddressesPage` | Saved shipping addresses manager |
| `/dashboard/notifications` | `NotificationsPage` | Customer notification inbox |
| `/dashboard/reviews` | `MyReviewsPage` | Product reviews submitted by customer |
| `/dashboard/invoices` | `InvoicesPage` | Downloadable PDF invoices |
| `/dashboard/change-password` | `ChangePasswordPage` | Security & password change form |

---

## 🏪 3. Seller Routes (`SellerLayout`) — Role `2`

Mounted inside `SellerLayout` with Seller Sidebar & Store Header.

| Path | Component | Description |
| :--- | :--- | :--- |
| `/seller` | `SellerHomePage` | Sales analytics, revenue charts, stock alerts |
| `/seller/products` | `ProductListPage` | Product catalog with stock & status filter |
| `/seller/products/add` | `AddProductPage` | Add/Edit product multi-step form |
| `/seller/inventory` | `InventoryPage` | Stock level editor & movement log |
| `/seller/orders` | `SellerOrdersPage` | Order fulfillment & status updater |
| `/seller/shipments` | `ShipmentsPage` | Courier AWB tracking manager |
| `/seller/returns` | `ReturnsPage` | Customer return requests & refund processor |
| `/seller/payments` | `PaymentsPage` | Settlement statements & payout history |
| `/seller/invoices` | `SellerInvoicesPage` | B2B & Tax Invoices |
| `/seller/notifications` | `SellerNotificationsPage` | Seller alert center |
| `/seller/profile` | `SellerProfilePage` | Store banner, logo, GST & bank details |
| `/seller/settings` | `SellerSettingsPage` | Store preferences & notifications |
| `/seller/change-password` | `SellerChangePasswordPage` | Seller account security |

---

## 🛡️ 4. Admin Routes (`AdminLayout`) — Role `1`

Mounted inside `AdminLayout` with Admin Master Navigation, Dark Mode toggle, and Global Search.

| Path | Component | Description |
| :--- | :--- | :--- |
| `/admin` | `AdminHomePage` | Executive dashboard, platform revenue, top categories |
| `/admin/users` | `UsersPage` | Customer accounts & status toggle (Block/Unblock) |
| `/admin/sellers` | `SellersPage` | Seller applications & approval workflow |
| `/admin/products` | `AdminProductsPage` | Catalog moderation & approval |
| `/admin/categories` | `CategoriesPage` | Product categories manager |
| `/admin/brands` | `BrandsPage` | Brand directory manager |
| `/admin/collections` | `CollectionsPage` | Homepage collection banners manager |
| `/admin/orders` | `AdminOrdersPage` | Master platform orders overview |
| `/admin/payments` | `AdminPaymentsPage` | Payment gateway transaction logs |
| `/admin/wallet` | `AdminWalletPage` | Platform commission wallet & balances |
| `/admin/settlements` | `SellerSettlementsPage` | Seller payout batch processor |
| `/admin/returns` | `ReturnsRefundsPage` | Escalated return & refund audit |
| `/admin/reviews` | `AdminReviewsPage` | Customer reviews moderation |
| `/admin/notifications` | `AdminNotificationsPage` | System & platform notifications |
| `/admin/invoices` | `AdminInvoicesPage` | Master platform invoice registry |
| `/admin/reports` | `ReportsPage` | Sales, revenue & product analytics reports |
| `/admin/settings` | `WebsiteSettingsPage` | Site configuration, SMTP & payment keys |
| `/admin/profile` | `AdminProfilePage` | Superadmin profile |
| `/admin/change-password` | `AdminChangePasswordPage` | Superadmin security |
