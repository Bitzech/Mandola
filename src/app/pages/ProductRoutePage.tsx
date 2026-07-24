import { useNavigate, useParams, useOutletContext } from "react-router";
import ProductDetailPage from "../components/ProductDetailPage";
import { ALL_PRODUCTS } from "../data";
import type { ProductType } from "../data";
import type { PublicOutletCtx } from "../layouts/PublicLayout";
import NotFoundPage from "./NotFoundPage";

export default function ProductRoutePage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { addToBag } = useOutletContext<PublicOutletCtx>();

  const product = ALL_PRODUCTS.find((p) => p.id === parseInt(productId ?? "", 10));

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
