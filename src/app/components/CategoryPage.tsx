import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { Heart, Loader2 } from "lucide-react";
import { ALL_PRODUCTS } from "../data";
import type { Page, ProductType } from "../data";
import { categoryService } from "../services/category.service";
import { Category, SubCategory, Brand, Color, Size } from "../types/product.types";
import { productService } from "../services/product.service";
import { formatImageUrl } from "../utils/imageUrl";

interface Props {
  page: NonNullable<Page>;
  onBack: () => void;
  onNavigate: (category: string, sub: string) => void;
  onProductClick: (p: ProductType) => void;
}

export default function CategoryPage({ page, onBack, onNavigate, onProductClick }: Props) {
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [liveBrands, setLiveBrands] = useState<Brand[]>([]);
  const [liveColors, setLiveColors] = useState<Color[]>([]);
  const [liveSizes, setLiveSizes] = useState<Size[]>([]);
  const [liveProducts, setLiveProducts] = useState<ProductType[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const categorySlugOrName = (page as any).categorySlug || page.category;
    const subSlugOrName = (page as any).subCategorySlug || page.sub;

    const cleanCategoryStr = page.category.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanCategorySlug = (categorySlugOrName || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    categoryService.getCategoriesWithSubCategories()
      .then((allCats) => {
        if (!mounted) return;
        setCategories(allCats || []);

        const match = (allCats || []).find(c => {
          const cSlugClean = (c.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const cNameClean = (c.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          return cSlugClean === cleanCategoryStr ||
                 cSlugClean === cleanCategorySlug ||
                 cNameClean === cleanCategoryStr ||
                 cNameClean === cleanCategorySlug;
        });

        const activeCat = match || (allCats && allCats.length > 0 ? allCats[0] : null);
        if (activeCat) {
          setCurrentCategory(activeCat);
          if (activeCat.subCategories) {
            setSubCategories(activeCat.subCategories);
          }
        }

        const cleanSubStr = page.sub.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanSubSlug = (subSlugOrName || "").toLowerCase().replace(/[^a-z0-9]/g, "");

        const subMatch = page.sub !== "all" && activeCat?.subCategories?.find(s => {
          const sSlugClean = (s.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const sNameClean = (s.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          return sSlugClean === cleanSubStr ||
                 sSlugClean === cleanSubSlug ||
                 sNameClean === cleanSubStr ||
                 sNameClean === cleanSubSlug;
        });

        // Build product params with matched category / subcategory IDs
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get("search") || (page.category === "search" ? page.sub : "");

        const queryParams: any = { page: 1, limit: 100 };
        if (match?.id && page.category !== "all" && page.category !== "search") {
          queryParams.category_id = match.id;
        }
        if (subMatch && (subMatch as any).id) {
          queryParams.sub_category_id = (subMatch as any).id;
        }
        if (searchParam && searchParam !== "all") {
          queryParams.search = searchParam;
        }

        return Promise.all([
          categoryService.getBrands(),
          categoryService.getColors(),
          categoryService.getSizes(),
          productService.getProducts(queryParams)
        ]);
      })
      .then((resArray) => {
        if (!mounted || !resArray) return;
        const [allBrands, allColors, allSizes, prodsRes] = resArray;
        if (allBrands && allBrands.length > 0) setLiveBrands(allBrands);
        if (allColors && allColors.length > 0) setLiveColors(allColors);
        if (allSizes && allSizes.length > 0) setLiveSizes(allSizes);

        const prodsList = prodsRes?.data?.products || prodsRes?.data?.items || prodsRes?.data || [];
        if (Array.isArray(prodsList)) {
          const mapped: ProductType[] = prodsList.map((item: any) => {
            const raw1 = item.thumbnail || (item.images && item.images[0]?.image) || (item.images && item.images[0]?.image_url);
            const raw2 = item.secondary_image || (item.images && item.images[1]?.image) || (item.images && item.images[1]?.image_url) || raw1;
            return {
              id: item.id,
              name: item.name,
              slug: item.slug,
              price: Number(item.sale_price || item.price),
              mrp: Number(item.price || item.sale_price),
              img1: formatImageUrl(raw1),
              img2: formatImageUrl(raw2),
              colors: ["#FAF7F4", "#D4145A", "#1A1A1A"],
              tag: item.is_best_seller ? "Bestseller" : item.is_trending ? "Trending" : item.is_new_arrival ? "New" : "Featured",
            } as any;
          });
          setLiveProducts(mapped);
        }
      })
      .catch((err) => {
        console.error("[CategoryPage] Error fetching page data:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page.category, (page as any).categorySlug, page.sub, (page as any).subCategorySlug]);

  const rawProducts = liveProducts;
  const sorted = [...rawProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  }).filter(p => {
    if (priceFilter === "under2k") return p.price < 2000;
    if (priceFilter === "2k-4k") return p.price >= 2000 && p.price <= 4000;
    if (priceFilter === "above4k") return p.price > 4000;
    return true;
  });

  const categoryTitle = currentCategory ? currentCategory.name : page.category;
  const categoryDescription = currentCategory?.description || "Explore curated luxury women's fashion.";
  const bannerImage = currentCategory?.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-white">
      {/* Category hero banner */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-[#faf7f4] flex items-end">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0">
          <img src={bannerImage} alt={categoryTitle} className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(250,247,244,0.95) 0%, rgba(252,232,239,0.85) 50%, rgba(250,240,245,0.95) 100%)" }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #d4145a 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        </div>

        <div className="relative z-10 px-8 md:px-20 pb-8 w-full max-w-[1440px] mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-3">
            <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Home</button>
            <span>/</span>
            <span className="text-[#1a1a1a] font-semibold">{categoryTitle}</span>
            {page.sub !== page.category && page.sub !== "all" && (
              <>
                <span>/</span>
                <span className="text-[#d4145a]">{page.sub}</span>
              </>
            )}
          </nav>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a]">{page.sub !== "all" ? page.sub : categoryTitle}</h1>
          <p className="text-[#6e6e6e] text-sm mt-1 font-light max-w-xl">{categoryDescription}</p>
        </div>
      </div>

      {/* Filters + grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        {/* Live Sub-category pills (Only show subcategories with active products) */}
        {subCategories.filter(s => (s.product_count ?? s.products_count ?? 1) > 0).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[#f0f0f0]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9e9e9e] font-semibold mr-2">Sub-Categories:</span>
            <button
              onClick={() => onNavigate(currentCategory?.slug || page.category, "all")}
              className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${page.sub === "all" ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
            >
              All {categoryTitle}
            </button>
            {subCategories.filter(s => (s.product_count ?? s.products_count ?? 1) > 0).map(s => {
              const active = page.sub.toLowerCase() === s.slug.toLowerCase() || page.sub.toLowerCase() === s.name.toLowerCase();
              return (
                <button
                  key={s.id}
                  onClick={() => onNavigate(currentCategory?.slug || page.category, s.slug)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${active ? "bg-[#d4145a] text-white border-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Live Brands Filter Pills */}
        {liveBrands.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-[#f0f0f0]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9e9e9e] font-semibold mr-2">Brand:</span>
            <button
              onClick={() => setSelectedBrand("all")}
              className={`px-3 py-1 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${selectedBrand === "all" ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
            >
              All Brands
            </button>
            {liveBrands.slice(0, 8).map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBrand(b.slug)}
                className={`px-3 py-1 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${selectedBrand === b.slug ? "bg-[#d4145a] text-white border-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        {/* Live Sizes & Colors Filter Bars */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#f0f0f0]">
          {/* Sizes */}
          {liveSizes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#9e9e9e] font-semibold mr-2">Size:</span>
              <button
                onClick={() => setSelectedSize("all")}
                className={`px-3 py-1 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${selectedSize === "all" ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                All Sizes
              </button>
              {liveSizes.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSize(s.slug || s.code)}
                  className={`px-3 py-1 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${selectedSize === (s.slug || s.code) ? "bg-[#d4145a] text-white border-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
                >
                  {s.name || s.code}
                </button>
              ))}
            </div>
          )}

          {/* Colors */}
          {liveColors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#9e9e9e] font-semibold mr-2">Color:</span>
              <button
                onClick={() => setSelectedColor("all")}
                className={`px-3 py-1 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${selectedColor === "all" ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                All Colors
              </button>
              {liveColors.slice(0, 7).map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.slug)}
                  className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === c.slug ? "border-[#d4145a] scale-110 ring-2 ring-[#d4145a] ring-offset-1" : "border-[#ececec] hover:border-[#1a1a1a]"}`}
                  style={{ backgroundColor: c.hex_code || "#ececec" }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sort + filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[#ececec]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] font-medium">Filter:</span>
            {[["all", "All Prices"], ["under2k", "Under ₹2,000"], ["2k-4k", "₹2,000–₹4,000"], ["above4k", "Above ₹4,000"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPriceFilter(val)}
                className={`text-[10px] tracking-wide px-3 py-1 border transition-colors ${priceFilter === val ? "bg-[#d4145a] text-white border-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs bg-transparent border border-[#ececec] px-3 py-1.5 text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Products count & Grid */}
        {sorted.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs text-[#6e6e6e] tracking-wide font-light">
              Showing <strong className="text-[#1a1a1a] font-semibold">{sorted.length}</strong> {sorted.length === 1 ? "style" : "styles"}
            </p>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#9e9e9e]">
            <Loader2 size={32} className="animate-spin text-[#d4145a] mb-3" />
            <p className="text-xs tracking-[0.2em] uppercase">Loading collection styles…</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#faf7f4] border border-[#ececec] rounded-sm max-w-md mx-auto my-8">
            <p className="font-['Playfair_Display'] text-xl font-semibold text-[#1a1a1a] mb-2">No Styles Currently Available</p>
            <p className="text-xs text-[#6e6e6e] mb-6 font-light leading-relaxed">
              We are working on bringing new collections for this category. Please check back soon or browse our latest new arrivals.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#d4145a] transition-colors"
            >
              Explore All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
            {sorted.map(p => {
              const isWish = isWishlisted(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => onProductClick(p)}
                  className="group relative cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#faf7f4] mb-3 rounded-sm">
                    <img
                      src={p.img1}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {p.img2 && (
                      <img
                        src={p.img2}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    {p.tag && (
                      <span className="absolute top-2.5 left-2.5 bg-[#1a1a1a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold px-2 py-0.5">
                        {p.tag}
                      </span>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleWishlist(p);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#1a1a1a] hover:text-[#d4145a] transition-colors shadow-sm"
                    >
                      <Heart size={15} fill={isWish ? "#d4145a" : "none"} className={isWish ? "text-[#d4145a]" : ""} />
                    </button>
                  </div>
                  <h3 className="text-xs font-medium text-[#1a1a1a] group-hover:text-[#d4145a] transition-colors leading-snug line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-[#1a1a1a]">₹{p.price.toLocaleString("en-IN")}</span>
                    {p.mrp > p.price && (
                      <span className="text-[11px] text-[#9e9e9e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
