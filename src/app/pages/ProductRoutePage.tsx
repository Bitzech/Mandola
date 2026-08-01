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
  const params = useParams<{ productId?: string; productSlug?: string }>();
  const rawParam = params.productId || params.productSlug || "";
  const { addToBag } = useOutletContext<PublicOutletCtx>();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!rawParam) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Helper mapper from live backend model to frontend ProductType
    const mapLiveToProduct = (live: any): ProductType => {
      const primaryImg = live.thumbnail || (live.images && live.images[0]?.image) || (live.images && live.images[0]?.image_url) || "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=500&h=650&fit=crop";
      const secImg = (live as any).secondary_image || (live.images && live.images[1]?.image) || (live.images && live.images[1]?.image_url) || primaryImg;
      return {
        id: live.id,
        name: live.name,
        slug: live.slug,
        price: Number(live.sale_price || live.price),
        mrp: Number(live.price || live.sale_price),
        img1: primaryImg,
        img2: secImg,
        colors: ["#FAF7F4", "#D4145A", "#1A1A1A"],
        tag: live.is_best_seller ? "Bestseller" : live.is_trending ? "Trending" : live.is_new_arrival ? "New" : "Featured",
      } as any;
    };

    // 1. Try local match first for instant render
    const numId = parseInt(rawParam, 10);
    const localMatch = ALL_PRODUCTS.find((p) => 
      (!isNaN(numId) && p.id === numId) ||
      ((p as any).slug && (p as any).slug === rawParam) ||
      p.name.toLowerCase().replace(/\s+/g, "-") === rawParam.toLowerCase()
    );
    if (localMatch) {
      setProduct(localMatch);
    }

    // 2. Fetch live data from backend (by ID if numeric, by Slug if string)
    const isNumeric = !isNaN(numId) && numId > 0 && String(numId) === rawParam.trim();

    const fetchPromise = isNumeric
      ? productService.getProductById(numId).catch(() => productService.getProductBySlug(rawParam))
      : productService.getProductBySlug(rawParam).catch(() => (!isNaN(numId) ? productService.getProductById(numId) : null));

    fetchPromise
      .then((res: any) => {
        if (!mounted) return;
        const live = res?.data || res;
        if (live && live.id) {
          setProduct(mapLiveToProduct(live));
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
  }, [rawParam]);

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
        const targetParam = (p as any).slug || p.id;
        navigate(`/product/${targetParam}`);
      }}
      onAddToBag={addToBag}
    />
  );
}
