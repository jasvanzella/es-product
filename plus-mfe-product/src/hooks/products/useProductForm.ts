const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:3002";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Dados mockados (formato autorizado pelo professor). Os IDs aqui devem
// ser os MESMOS usados em app/clients/mock_data.py no back, senão a
// validação cross-service recusa.
export const MOCK_CATEGORIES = [
  { id: "1", nome: "Calças" },
  { id: "2", nome: "Vestidos" },
  { id: "3", nome: "Blusas" },
  { id: "4", nome: "Saias" },
  { id: "5", nome: "Jaquetas" },
];

export const MOCK_SUPPLIERS = [
  { id: "f1e2d3c4-b5a6-7890-abcd-ef1234567890", nome: "PlusWear Confecções" },
  { id: "a9b8c7d6-e5f4-3210-fedc-ba0987654321", nome: "Bella Moda Plus" },
  { id: "11112222-3333-4444-5555-666677778888", nome: "Atelier Grandeza" },
];

export function useProductForm() {
  async function createProduct(payload: any) {
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

  async function loadProduct(id: string) {
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

  async function updateProduct(payload: any) {
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

  async function disableProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}/disable`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao desativar produto");
  }

  return { createProduct, loadProduct, updateProduct, disableProduct };
}