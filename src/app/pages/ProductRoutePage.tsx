import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";
import ProductDetailPage from "../components/ProductDetailPage";
import type { ProductType } from "../data";
import type { PublicOutletCtx } from "../layouts/PublicLayout";
import NotFoundPage from "./NotFoundPage";
import { productService } from "../services/product.service";
import { Loader2 } from "lucide-react";
import { formatImageUrl } from "../utils/imageUrl";

export default function ProductRoutePage() {
  const navigate = useNavigate();
  const params = useParams<{ slug?: string; productId?: string; productSlug?: string }>();
  const rawParam = params.slug || params.productSlug || params.productId || "";
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
      const rawPrimary = live.thumbnail || (live.images && live.images[0]?.image) || (live.images && live.images[0]?.image_url);
      const primaryImg = formatImageUrl(rawPrimary);
      const rawSec = (live as any).secondary_image || (live.images && live.images[1]?.image) || (live.images && live.images[1]?.image_url);
      const secImg = formatImageUrl(rawSec || rawPrimary);
      const catSlug = live.category_slug || (live.category_name ? live.category_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "ethnic-wear");

      return {
        ...(live as any),
        id: live.id,
        name: live.name,
        slug: live.slug || rawParam,
        category_name: live.category_name || "Ethnic Wear",
        category_slug: catSlug,
        price: Number(live.sale_price && Number(live.sale_price) > 0 ? live.sale_price : live.price),
        mrp: Number(live.price || live.sale_price),
        sale_price: Number(live.sale_price && Number(live.sale_price) > 0 ? live.sale_price : live.price),
        img1: primaryImg,
        img2: secImg,
        colors: ["#FAF7F4", "#D4145A", "#1A1A1A"],
        tag: live.is_best_seller ? "Bestseller" : live.is_trending ? "Trending" : live.is_new_arrival ? "New" : "Featured",
      } as any;
    };

    // Fetch live data from backend by slug (fallback to ID if numeric)
    const numId = parseInt(rawParam, 10);
    const isNumeric = !isNaN(numId) && numId > 0 && String(numId) === rawParam.trim();

    // 2. Fetch live data from backend by slug (fallback to ID if numeric)
    const fetchPromise = isNumeric
      ? productService.getProductBySlug(rawParam).catch(() => productService.getProductById(numId))
      : productService.getProductBySlug(rawParam).catch((err) => (isNumeric ? productService.getProductById(numId) : Promise.reject(err)));

    fetchPromise
      .then((res: any) => {
        if (!mounted) return;
        const live = res?.data || res;
        if (live && live.id) {
          setProduct(mapLiveToProduct(live));
        } else {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error("[ProductRoutePage] Error fetching product:", err);
        if (mounted) {
          setProduct(null);
        }
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

  if (!product) {
    return (
      <NotFoundPage
        title="Product Not Found"
        description="The product you're looking for doesn't exist, is unavailable, or has been removed. Let's get you back to something beautiful."
      />
    );
  }

  return (
    <ProductDetailPage
      product={product}
      onBack={() => navigate(-1)}
      onProductClick={(p: ProductType) => {
        window.scrollTo(0, 0);
        const targetParam = (p as any).slug || (p.name ? p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : p.id);
        navigate(`/product/${targetParam}`);
      }}
      onAddToBag={addToBag}
    />
  );
}
