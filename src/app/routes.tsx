import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import GuestRoute from "./routes/GuestRoute";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const CategoryRoutePage = lazy(() => import("./pages/CategoryRoutePage"));
const ProductRoutePage = lazy(() => import("./pages/ProductRoutePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-[#d4145a] border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#9e9e9e]">Loading</p>
    </div>
  </div>
);

const wrap = (el: React.ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      // ── Public pages ──────────────────────────────────────────
      { index: true, element: wrap(<HomePage />) },

      // ── Guest routes (Only accessible when NOT logged in) ─────
      {
        element: <GuestRoute />,
        children: [
          { path: "login", element: wrap(<LoginPage />) },
          { path: "seller/login", element: wrap(<LoginPage />) },
          { path: "admin/login", element: wrap(<LoginPage />) },
          { path: "register", element: wrap(<LoginPage />) },
          { path: "forgot-password", element: wrap(<LoginPage />) },
        ],
      },
      { path: "category/:categorySlug", element: wrap(<CategoryRoutePage />) },
      { path: "category/:categorySlug/:subCategorySlug", element: wrap(<CategoryRoutePage />) },
      { path: "product/:productId", element: wrap(<ProductRoutePage />) },
      { path: "checkout", element: wrap(<CheckoutPage />) },
      { path: "search", element: wrap(<HomePage />) },
      { path: "collections", element: wrap(<HomePage />) },
      { path: "collection/:collectionSlug", element: wrap(<HomePage />) },
      { path: "brands", element: wrap(<HomePage />) },
      { path: "brand/:brandSlug", element: wrap(<HomePage />) },
      { path: "products", element: wrap(<CategoryRoutePage />) },
      { path: "about", element: wrap(<HomePage />) },
      { path: "contact", element: wrap(<HomePage />) },
      { path: "privacy-policy", element: wrap(<HomePage />) },
      { path: "terms-and-conditions", element: wrap(<HomePage />) },
      { path: "shipping-policy", element: wrap(<HomePage />) },
      { path: "return-policy", element: wrap(<HomePage />) },
      { path: "unauthorized", element: wrap(<UnauthorizedPage />) },
      { path: "404", element: wrap(<NotFoundPage />) },

      // ── Protected routes ──────────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "customer",
            element: <RoleRoute role="customer" />,
            children: [
              { index: true, element: wrap(<CustomerDashboard />) },
              { path: "profile", element: wrap(<CustomerDashboard />) },
              { path: "orders", element: wrap(<CustomerDashboard />) },
              { path: "orders/:orderId", element: wrap(<CustomerDashboard />) },
              { path: "order-details/:orderId", element: wrap(<CustomerDashboard />) },
              { path: "order-tracking", element: wrap(<CustomerDashboard />) },
              { path: "order-tracking/:orderId", element: wrap(<CustomerDashboard />) },
              { path: "wishlist", element: wrap(<CustomerDashboard />) },
              { path: "cart", element: wrap(<CustomerDashboard />) },
              { path: "checkout", element: wrap(<CustomerDashboard />) },
              { path: "payment", element: wrap(<CustomerDashboard />) },
              { path: "payment/success", element: wrap(<CustomerDashboard />) },
              { path: "payment/failed", element: wrap(<CustomerDashboard />) },
              { path: "payment/pending", element: wrap(<CustomerDashboard />) },
              { path: "invoices", element: wrap(<CustomerDashboard />) },
              { path: "invoices/:invoiceId", element: wrap(<CustomerDashboard />) },
              { path: "addresses", element: wrap(<CustomerDashboard />) },
              { path: "reviews", element: wrap(<CustomerDashboard />) },
              { path: "notifications", element: wrap(<CustomerDashboard />) },
              { path: "change-password", element: wrap(<CustomerDashboard />) },
            ],
          },

          // ── Protected: Seller ───────────────────────────────────
          {
            path: "seller",
            element: <RoleRoute role="seller" />,
            children: [
              { index: true, element: wrap(<SellerDashboard />) },
              { path: "profile", element: wrap(<SellerDashboard />) },
              { path: "products", element: wrap(<SellerDashboard />) },
              { path: "products/add", element: wrap(<SellerDashboard />) },
              { path: "products/:productId", element: wrap(<SellerDashboard />) },
              { path: "products/:productId/edit", element: wrap(<SellerDashboard />) },
              { path: "inventory", element: wrap(<SellerDashboard />) },
              { path: "orders", element: wrap(<SellerDashboard />) },
              { path: "orders/:orderId", element: wrap(<SellerDashboard />) },
              { path: "shipments", element: wrap(<SellerDashboard />) },
              { path: "returns", element: wrap(<SellerDashboard />) },
              { path: "reviews", element: wrap(<SellerDashboard />) },
              { path: "settlements", element: wrap(<SellerDashboard />) },
              { path: "invoices", element: wrap(<SellerDashboard />) },
              { path: "notifications", element: wrap(<SellerDashboard />) },
              { path: "settings", element: wrap(<SellerDashboard />) },
              { path: "change-password", element: wrap(<SellerDashboard />) },
            ],
          },

          // ── Protected: Admin ────────────────────────────────────
          {
            path: "admin",
            element: <RoleRoute role="admin" />,
            children: [
              { index: true, element: wrap(<AdminDashboard />) },
              { path: "users", element: wrap(<AdminDashboard />) },
              { path: "users/:userId", element: wrap(<AdminDashboard />) },
              { path: "sellers", element: wrap(<AdminDashboard />) },
              { path: "sellers/:sellerId", element: wrap(<AdminDashboard />) },
              { path: "products", element: wrap(<AdminDashboard />) },
              { path: "products/:productId", element: wrap(<AdminDashboard />) },
              { path: "categories", element: wrap(<AdminDashboard />) },
              { path: "sub-categories", element: wrap(<AdminDashboard />) },
              { path: "brands", element: wrap(<AdminDashboard />) },
              { path: "collections", element: wrap(<AdminDashboard />) },
              { path: "orders", element: wrap(<AdminDashboard />) },
              { path: "orders/:orderId", element: wrap(<AdminDashboard />) },
              { path: "payments", element: wrap(<AdminDashboard />) },
              { path: "wallet", element: wrap(<AdminDashboard />) },
              { path: "settlements", element: wrap(<AdminDashboard />) },
              { path: "refunds", element: wrap(<AdminDashboard />) },
              { path: "returns", element: wrap(<AdminDashboard />) },
              { path: "shipments", element: wrap(<AdminDashboard />) },
              { path: "reviews", element: wrap(<AdminDashboard />) },
              { path: "invoices", element: wrap(<AdminDashboard />) },
              { path: "notifications", element: wrap(<AdminDashboard />) },
              { path: "reports", element: wrap(<AdminDashboard />) },
              { path: "settings", element: wrap(<AdminDashboard />) },
              { path: "profile", element: wrap(<AdminDashboard />) },
              { path: "change-password", element: wrap(<AdminDashboard />) },
            ],
          },
        ],
      },

      // ── Catch-all 404 ─────────────────────────────────────────
      { path: "*", element: wrap(<NotFoundPage />) },
    ],
  },
]);
