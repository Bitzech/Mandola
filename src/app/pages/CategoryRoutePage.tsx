import { useNavigate, useParams } from "react-router";
import CategoryPage from "../components/CategoryPage";
import type { ProductType } from "../data";

const fromSlug = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function CategoryRoutePage() {
  const navigate = useNavigate();
  const { categorySlug = "", subCategorySlug = "all" } = useParams<{
    categorySlug: string;
    subCategorySlug?: string;
  }>();

  const page = {
    category: fromSlug(categorySlug),
    sub: fromSlug(subCategorySlug),
    categorySlug,
    subCategorySlug,
  };

  return (
    <CategoryPage
      page={page}
      onBack={() => navigate(-1)}
      onNavigate={(category, sub) =>
        navigate(`/category/${toSlug(category)}/${toSlug(sub)}`)
      }
      onProductClick={(p: ProductType) => {
        window.scrollTo(0, 0);
        const param = (p as any).slug || p.id;
        navigate(`/product/${param}`);
      }}
    />
  );
}
