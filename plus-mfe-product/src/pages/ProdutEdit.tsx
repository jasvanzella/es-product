import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { ProductGrid } from "../components/ProductGrid";
import { ProductCard } from "../components/ProductCard";
import { AddProductCard } from "../components/AddProductCard";
import { CreateProductModal, type ProductCreateRequest } from "../components/CreateProductModal";
import { EditProductModal, type ProductUpdateRequest } from "../components/EditProductModal";
import { useProductList } from "../hooks/products/useProductList";
import { useProductForm, MOCK_CATEGORIES, MOCK_SUPPLIERS } from "../hooks/products/useProductForm";

/**
 * ProductEditAdminPage - listagem admin completa, autocontida:
 * busca e persiste os dados sozinha (mesmo padrão do mfe-auth), sem
 * depender do Shell para fornecer os dados por fora.
 */
export function ProductEditAdminPage() {
  const { products, loading, reload } = useProductList();
  const { createProduct, loadProduct, updateProduct, disableProduct } = useProductForm();
  const categories = MOCK_CATEGORIES;
  const suppliers = MOCK_SUPPLIERS;

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [editingProduct, setEditingProduct] = useState<ProductUpdateRequest | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

const handleCreate = async (payload: ProductCreateRequest) => {
    setCreating(true);
    try {
      await createProduct(payload);
      reload();
      setCreateOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = async (id: string) => {
    setLoadingEdit(true);
    setEditOpen(true);
    try {
      const product = await loadProduct(id);
      setEditingProduct(product);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleUpdate = async (payload: ProductUpdateRequest) => {
    setSavingEdit(true);
    try {
      await updateProduct(payload);
      reload();
      setEditOpen(false);
      setEditingProduct(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    await disableProduct(id);
    reload();
    setEditOpen(false);
    setEditingProduct(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f5fb", py: { xs: 3, md: 5 }, px: { xs: 2, md: 5 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#2c2a3a" }}>
          Catálogo de produtos
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "#9290a8" }}>
          Clique em um produto para editar, ou use o card de "Novo produto" para cadastrar
        </Typography>
      </Box>

      <ProductGrid columns={4} loading={loading}>
        <AddProductCard onClick={() => setCreateOpen(true)} />

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleOpenEdit}
          />
        ))}
      </ProductGrid>

      <CreateProductModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        categories={categories}
        suppliers={suppliers}
        submitting={creating}
      />

      <EditProductModal
        open={editOpen}
        product={loadingEdit ? null : editingProduct}
        onClose={() => {
          setEditOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        categories={categories}
        suppliers={suppliers}
        submitting={savingEdit}
      />
    </Box>
  );
}

export default ProductEditAdminPage;

/* Exemplo de uso:
<ProductEditAdminPage
  products={products}
  categories={[{ id: "a1b2c3d4-...", nome: "Calças" }]}
  suppliers={[{ id: "f1e2d3c4-...", nome: "PlusWear" }]}
  onCreateProduct={(payload) => api.post("/produtos", payload)}
  onLoadProduct={(id) => api.get(`/produtos/${id}`).then((r) => r.data)}
  onUpdateProduct={(payload) => api.put(`/produtos/${payload.id}`, payload)}
  onDeleteProduct={(id) => api.delete(`/produtos/${id}`)}
/>
*/