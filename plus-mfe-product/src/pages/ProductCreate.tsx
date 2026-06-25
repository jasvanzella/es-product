import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { ProductGrid } from "../components/ProductGrid";
import { ProductCard, type Product } from "../components/ProductCard";
import { AddProductCard } from "../components/AddProductCard";
import { CreateProductModal, type ProductCreateRequest } from "../components/CreateProductModal";

interface CategoryOption { id: string; nome: string }
interface SupplierOption { id: string; nome: string }

interface ProductListAdminPageProps {
  products:    Product[];
  loading?:    boolean;
  categories?: CategoryOption[];
  suppliers?:  SupplierOption[];
  onCreateProduct: (payload: ProductCreateRequest) => Promise<void> | void;
  onEditProduct?:  (id: string) => void;
}

/**
 * ProductListAdminPage - versão admin da listagem de produtos.
 * O primeiro item da grid é sempre o AddProductCard; ao clicar,
 * abre o CreateProductModal seguindo o schema ProductCreateRequest.
 */
export function ProductListAdminPage({
  products,
  loading = false,
  categories = [],
  suppliers = [],
  onCreateProduct,
  onEditProduct,
}: ProductListAdminPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: ProductCreateRequest) => {
    setSubmitting(true);
    try {
      await onCreateProduct(payload);
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f5fb", py: { xs: 3, md: 5 }, px: { xs: 2, md: 5 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#2c2a3a" }}>
            Catálogo de produtos
          </Typography>
          <Typography sx={{ fontSize: "0.8125rem", color: "#9290a8" }}>
            Gerencie os produtos cadastrados na loja
          </Typography>
        </Box>
      </Box>

      <ProductGrid columns={4} loading={loading}>
        <AddProductCard onClick={() => setModalOpen(true)} />

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onEditProduct}
          />
        ))}
      </ProductGrid>

      <CreateProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        suppliers={suppliers}
        submitting={submitting}
      />
    </Box>
  );
}

export default ProductListAdminPage;

/* Exemplo de uso:
<ProductListAdminPage
  products={products}
  categories={[{ id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", nome: "Calças" }]}
  suppliers={[{ id: "f1e2d3c4-b5a6-7890-abcd-ef1234567890", nome: "PlusWear" }]}
  onCreateProduct={async (payload) => {
    // POST /produtos com body = payload (ProductCreateRequest)
    await api.post("/produtos", payload);
  }}
  onEditProduct={(id) => router.push(`/admin/produtos/${id}`)}
/>
*/