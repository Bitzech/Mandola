import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";
import ProductDetailPage from "../components/ProductDetailPage";
import { ALL_PRODUCTS } from "../data";
import type { ProductType } from "../data";
import type { PublicOutletCtx } from "../layouts/PublicLayout";
import NotFoundPage from "./NotFoundPage";
import { productService } from "../services/product.service";
import { Loader2 } from "lucide-react";

export default function ProductRoutePage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { addToBag } = useOutletContext<PublicOutletCtx>();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const pId = parseInt(productId ?? "", 10);

    if (isNaN(pId)) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Try local match first for instant render
    const localMatch = ALL_PRODUCTS.find((p) => p.id === pId);
    if (localMatch) {
      setProduct(localMatch);
    }

    // 2. Fetch live data from backend for full accuracy (handles IDs > 12)
    productService
      .getProductById(pId)
      .then((res) => {
        if (!mounted) return;
        const live = res?.data;
        if (live) {
          const mapped: ProductType = {
            id: live.id,
            name: live.name,
            price: Number(live.sale_price || live.price),
            mrp: Number(live.price),
            img1: live.thumbnail || "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=500&h=650&fit=crop",
            img2: (live as any).secondary_image || live.thumbnail || "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=500&h=650&fit=crop",
            colors: ["#FAF7F4", "#D4145A", "#1A1A1A"],
            tag: live.is_best_seller ? "Bestseller" : live.is_trending ? "Trending" : live.is_new_arrival ? "New" : "Featured",
          };
          setProduct(mapped);
        }
      })
      .catch((err) => {
        console.error("[ProductRoutePage] Error fetching product:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading && !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#9e9e9e]">
        <Loader2 size={36} className="animate-spin text-[#d4145a] mb-4" />
        <p className="text-xs tracking-[0.2em] uppercase font-medium text-[#1a1a1a]">Loading Product Details…</p>
      </div>
    );
  }

  if (!product) return <NotFoundPage />;

  return (
    <ProductDetailPage
      product={product}
      onBack={() => navigate(-1)}
      onProductClick={(p: ProductType) => {
        window.scrollTo(0, 0);
        navigate(`/product/${p.id}`);
      }}
      onAddToBag={addToBag}
    />
  );
}
