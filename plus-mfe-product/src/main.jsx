import React from "react";
import ReactDOM from "react-dom/client";
import { ProductEditAdminPage } from "./pages/ProdutEdit";

const MOCK_CATEGORIES = [
  { id: "1", nome: "Calças" },
  { id: "2", nome: "Vestidos" },
  { id: "3", nome: "Blusas" },
  { id: "4", nome: "Saias" },
  { id: "5", nome: "Jaquetas" },
];

const MOCK_SUPPLIERS = [
  { id: "f1e2d3c4-b5a6-7890-abcd-ef1234567890", nome: "PlusWear Confecções" },
  { id: "a9b8c7d6-e5f4-3210-fedc-ba0987654321", nome: "Bella Moda Plus" },
  { id: "11112222-3333-4444-5555-666677778888", nome: "Atelier Grandeza" },
];

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x400.png?text=Produto";
const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:3002";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar produtos");
  const data = await response.json();
  return data.items.map((p) => ({
    id: p.id,
    name: p.nome,
    image: PLACEHOLDER_IMAGE,
    price: p.preco,
  }));
}

async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar produto");
  const p = await response.json();
  return {
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    marca: p.marca,
    preco: p.preco,
    categoriaId: p.categoriaId,
    fornecedorId: p.fornecedorId,
  };
}

async function createProduct(payload) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erro ao criar produto");
  }
}

async function updateProduct(payload) {
  const { id, ...body } = payload;
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Erro ao atualizar produto");
  }
}

async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/disable`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao desativar produto");
}

function App() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const loadProducts = React.useCallback(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <ProductEditAdminPage
      products={products}
      loading={loading}
      categories={MOCK_CATEGORIES}
      suppliers={MOCK_SUPPLIERS}
      onCreateProduct={async (payload) => { await createProduct(payload); loadProducts(); }}
      onLoadProduct={fetchProductById}
      onUpdateProduct={async (payload) => { await updateProduct(payload); loadProducts(); }}
      onDeleteProduct={async (id) => { await deleteProduct(id); loadProducts(); }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);