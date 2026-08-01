import { useState, useEffect, useRef } from "react";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { type SellerNavigateFn } from "./sellerData";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { Category, SubCategory, Brand, Collection, Size, Color } from "../../types/product.types";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { formatApiErrorMessage } from "../../services/apiClient";

// Compress client-side image files to max 1200px width/height and 0.8 JPEG quality
const compressImageFile = (file: File, maxDimension = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const srcData = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(srcData);
        }
      };
      img.onerror = () => resolve(srcData);
      img.src = srcData;
    };
    reader.readAsDataURL(file);
  });
};

export default function AddProduct({ onNavigate, editId }: { onNavigate: SellerNavigateFn; editId?: string | null }) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState<string | number>("");
  const [subCategoryId, setSubCategoryId] = useState<string | number>("");
  const [brandId, setBrandId] = useState<string | number>("");
  const [collectionId, setCollectionId] = useState<string | number>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("10");
  const [status, setStatus] = useState<"active" | "draft">("active");

  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");

  // Live Dropdowns Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [liveSizes, setLiveSizes] = useState<Size[]>([]);
  const [liveColors, setLiveColors] = useState<Color[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        const [cats, subs, brs, cols, szs, cls] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getSubCategories(),
          categoryService.getBrands(),
          categoryService.getCollections(),
          categoryService.getSizes(),
          categoryService.getColors()
        ]);
        if (isMounted) {
          setCategories(cats || []);
          setSubCategories(subs || []);
          setBrands(brs || []);
          setCollections(cols || []);
          setLiveSizes(szs || []);
          setLiveColors(cls || []);
        }
      } catch {
        // quiet fallback
      }
    };
    fetchMetadata();
    return () => { isMounted = false; };
  }, []);

  // Fetch Subcategories when Category changes
  useEffect(() => {
    if (categoryId) {
      categoryService.getSubCategoriesByCategory(categoryId).then(subs => {
        setSubCategories(subs || []);
      });
    }
  }, [categoryId]);

  // Load existing product if editing
  useEffect(() => {
    if (editId) {
      setLoading(true);
      productService.getProductById(editId)
        .then(res => {
          const p = (res.data || res) as any;
          if (p) {
            setName(p.name || "");
            setSku(p.sku || "");
            setCategoryId(p.category_id || "");
            setSubCategoryId(p.sub_category_id || "");
            setBrandId(p.brand_id || "");
            setCollectionId(p.collection_id || "");
            setDescription(p.description || "");
            setPrice(p.regular_price || p.mrp || p.price ? String(p.regular_price || p.mrp || p.price) : "");
            setSalePrice(p.sale_price ? String(p.sale_price) : "");
            setStock(p.stock_quantity !== undefined ? String(p.stock_quantity) : (p.stock !== undefined ? String(p.stock) : "0"));
            setStatus(p.status === "draft" ? "draft" : "active");
            setTags(p.tags ? (Array.isArray(p.tags) ? p.tags.join(", ") : p.tags) : "");
            setMetaTitle(p.meta_title || "");
            setMetaDesc(p.meta_description || "");

            if (p.images && Array.isArray(p.images)) {
              setImages(p.images.map((img: any) => typeof img === "string" ? img : (img.image || img.url || img.image_url)));
            } else if (p.image || p.thumbnail) {
              setImages([p.image || p.thumbnail]);
            }
          }
        })
        .catch(err => {
          setError(err?.message || "Failed to load product details for editing.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [editId]);

  // Handle local computer image file selection with client-side compression
  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter(f => f.type.startsWith("image/"));

    if (validImageFiles.length === 0) {
      toast.error("Please select valid image files (JPG, PNG, WEBP).");
      return;
    }

    setUploadingFiles(true);
    try {
      const compressedResults = await Promise.all(
        validImageFiles.map(file => compressImageFile(file, 1200, 0.8))
      );
      setImages(prev => [...prev, ...compressedResults]);
      toast.success(`Processed ${validImageFiles.length} image(s).`);
    } catch {
      toast.error("Failed to process image files.");
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
      toast.success("Image URL added.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    setImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
    toast.info("Set as primary product cover image.");
  };

  const toggleSize = (val: string) => {
    setSelectedSizes(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const toggleColor = (val: string) => {
    setSelectedColors(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus?: "active" | "draft") => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const targetStatus = (submitStatus || status) === "draft" ? "draft" : "pending";

    const sellerUserId = user?.id || user?.user_id || user?.seller_id;
    const payload: any = {
      name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      seller_id: sellerUserId ? Number(sellerUserId) : undefined,
      category_id: Number(categoryId),
      description: description.trim() || undefined,
      price: Number(price || 0),
      regular_price: Number(price || 0),
      stock_quantity: Number(stock || 0),
      status: targetStatus,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      meta_title: metaTitle.trim() || undefined,
      meta_description: metaDesc.trim() || undefined,
      thumbnail: images.length > 0 ? images[0] : undefined,
      images: images.map((imgUrl, i) => ({
        image: imgUrl,
        image_url: imgUrl,
        is_primary: i === 0
      })),
      sizes: selectedSizes,
      colors: selectedColors,
    };

    if (subCategoryId) payload.sub_category_id = Number(subCategoryId);
    if (brandId) payload.brand_id = Number(brandId);
    if (collectionId) payload.collection_id = Number(collectionId);
    if (salePrice && Number(salePrice) > 0 && Number(salePrice) <= Number(price)) {
      payload.sale_price = Number(salePrice);
    }

    console.log("[AddProduct Outgoing Request Payload]:", payload);

    try {
      if (editId) {
        await productService.updateProduct(editId, payload);
        toast.success("Product updated successfully!");
      } else {
        await productService.createProduct(payload);
        toast.success("Product created successfully!");
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onNavigate("products");
      }, 1500);
    } catch (err: any) {
      console.error("[AddProduct Error Response Details]:", err?.response?.data || err);
      const msg = formatApiErrorMessage(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#9e9e9e]">Loading product details…</div>;
  }

  return (
    <div className="font-['Jost',sans-serif]">
      {/* Top Nav Breadcrumbs */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("products")} className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors">← Products</button>
        <span className="text-[#ececec]">/</span>
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#1a1a1a] font-semibold">{editId ? "Edit Product" : "Add Product"}</span>
      </div>

      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">{editId ? "Edit Catalog Item" : "Create Catalog Item"}</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">{editId ? (name || "Edit Product") : "Add New Product"}</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">
          Product saved successfully! Redirecting to products catalog…
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs tracking-wide whitespace-pre-wrap">
          {error}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, "active")} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Basic Details</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Product Name *</label>
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Premium Silk Floral Saree"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Category *</label>
              <select
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Sub Category</label>
              <select
                value={subCategoryId}
                onChange={e => setSubCategoryId(e.target.value)}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Brand</label>
              <select
                value={brandId}
                onChange={e => setBrandId(e.target.value)}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Collection</label>
              <select
                value={collectionId}
                onChange={e => setCollectionId(e.target.value)}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="">Select Collection</option>
                {collections.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">SKU Code</label>
              <input
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="e.g. SAR-FS-001 (auto-generated if left blank)"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Description</h3>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the product material, design, care instructions, weave, etc…"
            className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white resize-none"
          />
        </div>

        {/* Product Images: Multiple Computer File Upload + URL Input */}
        <div className="bg-white border border-[#ececec] p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#ececec]">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a]">Product Images</h3>
            <span className="text-[10px] tracking-[0.1em] text-[#d4145a] font-semibold">{images.length} Image(s) Attached</span>
          </div>

          {/* Hidden HTML File Input for Pick Multiple Files from Computer */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {/* Computer File Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all mb-6 ${
              isDragging
                ? "border-[#d4145a] bg-[#fce8ef]"
                : "border-[#ececec] hover:border-[#d4145a] bg-[#faf7f4]"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white text-[#d4145a] border border-[#fce8ef] flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Upload size={22} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold text-[#1a1a1a] tracking-wide">
              {uploadingFiles ? "Processing Image Files..." : "Click to Pick Images from Computer or Drag & Drop"}
            </p>
            <p className="text-[10px] text-[#6e6e6e] mt-1 font-light">
              Select multiple photos at once. Images are automatically compressed to ensure fast saving.
            </p>
            <button
              type="button"
              disabled={uploadingFiles}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#d4145a] transition-colors disabled:opacity-50"
            >
              <Plus size={12} /> {uploadingFiles ? "Processing…" : "Select Image Files"}
            </button>
          </div>

          {/* Alternative URL Input */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2 font-semibold">Or Add Image via Web URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                placeholder="Paste external image URL (https://…)"
                className="flex-1 border border-[#ececec] px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 border border-[#1a1a1a] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Uploaded Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-[3/4] bg-[#faf7f4] border border-[#ececec] overflow-hidden shadow-sm">
                <img src={img} alt={`Product thumbnail ${idx + 1}`} className="w-full h-full object-cover" />

                {/* Remove Image Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full border border-[#ececec] flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X size={12} />
                </button>

                {/* Primary Badge or Set Primary Action */}
                {idx === 0 ? (
                  <span className="absolute bottom-1.5 left-1.5 bg-[#d4145a] text-white text-[8px] tracking-wider uppercase px-2 py-0.5 font-bold shadow-sm">
                    Primary Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="absolute bottom-1.5 left-1.5 bg-white/90 hover:bg-[#d4145a] hover:text-white text-[#1a1a1a] text-[8px] tracking-wider uppercase px-2 py-0.5 font-semibold transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    Make Primary
                  </button>
                )}
              </div>
            ))}

            {/* Quick Add Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[3/4] bg-[#faf7f4] border-2 border-dashed border-[#ececec] hover:border-[#d4145a] flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
            >
              <ImageIcon size={22} strokeWidth={1.5} className="text-[#9e9e9e] mb-1" />
              <span className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] font-semibold">+ Add More</span>
            </div>
          </div>

          <p className="text-[10px] text-[#9e9e9e] mt-3">The first image is automatically designated as the primary cover photo for your product catalog.</p>
        </div>

        {/* Variants: Sizes & Colors */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Sizes & Colors</h3>
          <div className="space-y-5">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-3">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {(liveSizes.length > 0 ? liveSizes.map(s => s.name || s.code) : ["XS", "S", "M", "L", "XL", "XXL", "Free Size"]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.08em] uppercase border transition-colors ${
                      selectedSizes.includes(s)
                        ? "border-[#d4145a] bg-[#fce8ef] text-[#d4145a]"
                        : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-3">Available Colors</p>
              <div className="flex flex-wrap gap-2">
                {(liveColors.length > 0 ? liveColors.map(c => c.name) : ["Black", "White", "Red", "Pink", "Blue", "Green", "Gold"]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleColor(c)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.08em] uppercase border transition-colors ${
                      selectedColors.includes(c)
                        ? "border-[#d4145a] bg-[#fce8ef] text-[#d4145a]"
                        : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing + Inventory */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white border border-[#ececec] p-6">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">MRP (₹) *</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Sale Price (₹)</label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={e => setSalePrice(e.target.value)}
                  placeholder="0"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#ececec] p-6">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Inventory</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Stock Quantity *</label>
                <input
                  required
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Low Stock Alert Level</label>
                <input
                  type="number"
                  value={lowStockAlert}
                  onChange={e => setLowStockAlert(e.target.value)}
                  placeholder="10"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Meta */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">SEO & Tags</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Meta Title</label>
              <input
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="Page title for search engines"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Meta Description</label>
              <input
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                placeholder="Brief summary snippet for search results"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Tags (Comma Separated)</label>
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="saree, silk, festive, banarasi"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 font-semibold"
          >
            {saving ? "Saving…" : editId ? "Save Changes" : "Publish Product"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e, "draft")}
            className="px-6 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="px-6 py-3 text-[#6e6e6e] text-[10px] tracking-[0.15em] uppercase hover:text-[#d4145a] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
