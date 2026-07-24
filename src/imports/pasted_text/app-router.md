Create a complete production-ready routing system for the Mandola Fashion Marketplace.

IMPORTANT:
Do NOT redesign or modify any existing UI. Only create the routing structure, layouts, navigation flow, authentication flow, protected routes, role-based routes, and dynamic URLs. Preserve all existing pages exactly as they are.

The routing architecture should be scalable, clean, modular, and suitable for a large React application.

Use:
- React Router v6+
- Nested Routes
- Layout Components
- Protected Routes
- Role-Based Access Control (RBAC)
- Dynamic Route Parameters
- Lazy Loading
- Code Splitting
- 404 Page
- Unauthorized Page
- Error Boundary
- Scroll To Top on Route Change

==================================================
PUBLIC ROUTES
==================================================

/

Homepage

/login

Customer Login

/seller/login

Seller Login

/admin/login

Admin Login

/register

Customer Registration

/forgot-password

/reset-password

/search

Search Results

/categories

/category/:categorySlug

/category/:categorySlug/:subCategorySlug

/collections

/collection/:collectionSlug

/brands

/brand/:brandSlug

/products

/product/:productSlug

/about

/contact

/privacy-policy

/terms-and-conditions

/shipping-policy

/return-policy

/404

==================================================
PROTECTED CUSTOMER ROUTES
==================================================

Only accessible when user role == CUSTOMER

/customer

Dashboard

/customer/profile

/customer/orders

/customer/orders/:orderId

/customer/order-tracking/:orderId

/customer/wishlist

/customer/cart

/customer/checkout

/customer/payment

/customer/payment/success

/customer/payment/failed

/customer/payment/pending

/customer/invoices

/customer/invoices/:invoiceId

/customer/addresses

/customer/reviews

/customer/notifications

/customer/change-password

==================================================
PROTECTED SELLER ROUTES
==================================================

Only accessible when role == SELLER

/seller

Dashboard

/seller/profile

/seller/products

/seller/products/add

/seller/products/:productId

/seller/products/:productId/edit

/seller/inventory

/seller/orders

/seller/orders/:orderId

/seller/shipments

/seller/returns

/seller/reviews

/seller/settlements

/seller/invoices

/seller/notifications

/seller/settings

/seller/change-password

==================================================
PROTECTED ADMIN ROUTES
==================================================

Only accessible when role == ADMIN

/admin

Dashboard

/admin/users

/admin/users/:userId

/admin/sellers

/admin/sellers/:sellerId

/admin/products

/admin/products/:productId

/admin/categories

/admin/sub-categories

/admin/brands

/admin/collections

/admin/orders

/admin/orders/:orderId

/admin/payments

/admin/refunds

/admin/returns

/admin/shipments

/admin/reviews

/admin/invoices

/admin/notifications

/admin/reports

/admin/settings

/admin/profile

/admin/change-password

==================================================
AUTHENTICATION FLOW
==================================================

If not logged in

→ Redirect to Login Page

Customer Login

→ Redirect to

/customer

Seller Login

→ Redirect to

/seller

Admin Login

→ Redirect to

/admin

If user manually opens another role's dashboard

Example

Seller tries

/admin

Redirect

Unauthorized Page

Example

Customer opens

/seller/orders

Redirect

Unauthorized Page

If JWT expires

Automatically logout

Redirect Login

==================================================
DYNAMIC ROUTES
==================================================

Product Details

/product/:productSlug

Category

/category/:categorySlug

Sub Category

/category/:categorySlug/:subCategorySlug

Brand

/brand/:brandSlug

Collection

/collection/:collectionSlug

Customer Order

/customer/orders/:orderId

Seller Product

/seller/products/:productId

Seller Edit Product

/seller/products/:productId/edit

Admin Product

/admin/products/:productId

Admin User

/admin/users/:userId

Admin Seller

/admin/sellers/:sellerId

Invoice

/customer/invoices/:invoiceId

==================================================
LAYOUTS
==================================================

PublicLayout

Header

Footer

Homepage

Category

Product

Contact

etc

CustomerLayout

Sidebar

Header

Dashboard Content

SellerLayout

Sidebar

Header

Dashboard Content

AdminLayout

Sidebar

Header

Dashboard Content

==================================================
SPECIAL ROUTES
==================================================

Loading Screen

Unauthorized

404 Not Found

Server Error

Maintenance Mode

==================================================
NAVIGATION
==================================================

Highlight Active Menu

Breadcrumb Navigation

Back Button Support

Scroll To Top

Page Transition Animation

==================================================
PERFORMANCE
==================================================

Lazy Load every page

React Suspense

Code Splitting

Prefetch Dashboard after Login

==================================================
BEST PRACTICES
==================================================

Organize routes into

routes/

publicRoutes.jsx

customerRoutes.jsx

sellerRoutes.jsx

adminRoutes.jsx

ProtectedRoute.jsx

RoleProtectedRoute.jsx

AppRoutes.jsx

layouts/

PublicLayout.jsx

CustomerLayout.jsx

SellerLayout.jsx

AdminLayout.jsx

Use reusable route guards.

Use centralized route constants.

Avoid duplicate route definitions.

Use clean URL naming conventions.

Use SEO-friendly URLs for products, brands, collections, and categories.

Implement dynamic breadcrumb generation based on the current route.

Keep the routing architecture scalable for future modules without requiring major changes.

Generate a complete routing structure and navigation flow that is production-ready and suitable for a large-scale React eCommerce application.