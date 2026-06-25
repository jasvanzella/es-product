import type { ProductUpdateRequest, ColorVariant, SizeVariant } from "../../components/EditProductModal";
import type { ProductCreateRequest } from "../../components/CreateProductModal";

const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:3002";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const MOCK_CATEGORIES = [
  { id: "1", nome: "Camisetas" },
  { id: "2", nome: "Calças" },
  { id: "3", nome: "Vestidos" },
  { id: "4", nome: "Acessórios" },
  { id: "5", nome: "Blusas" },
  { id: "6", nome: "Saias" },
  { id: "7", nome: "Jaquetas" },
];

export const MOCK_SUPPLIERS = [
  { id: "f1e2d3c4-b5a6-7890-abcd-ef1234567890", nome: "PlusWear Confecções" },
  { id: "a9b8c7d6-e5f4-3210-fedc-ba0987654321", nome: "Bella Moda Plus" },
  { id: "11112222-3333-4444-5555-666677778888", nome: "Atelier Grandeza" },
];

export function useProductForm() {
  async function createProduct(payload: ProductCreateRequest) {
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

  async function loadProduct(id: string): Promise<ProductUpdateRequest> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Erro ao buscar produto");
    const p = await response.json();

    const coresMap = new Map<string, ColorVariant>();
    const gradesMap = new Map<string, SizeVariant>();

    if (Array.isArray(p.variantes)) {
      for (const v of p.variantes) {
        if (v.cor && !coresMap.has(v.cor)) {
          coresMap.set(v.cor, {
            id: crypto.randomUUID(),
            nome: v.cor,
            hex: "#000000",
          });
        }
        if (v.tamanho && !gradesMap.has(v.tamanho.nome)) {
          gradesMap.set(v.tamanho.nome, {
            id: v.tamanho.id,
            nome: v.tamanho.nome,
            estoque: 0,
          });
        }
      }
    }

    return {
      id: p.id,
      nome: p.nome,
      descricao: p.descricao ?? "",
      marca: p.marca ?? "",
      preco: p.preco,
      categoriaId: p.categoriaId ?? "",
      fornecedorId: p.fornecedorId ?? "",
      ativo: p.ativo ?? true,
      cores: Array.from(coresMap.values()),
      grades: Array.from(gradesMap.values()),
    };
  }

  async function updateProduct(payload: ProductUpdateRequest) {
    const { id, cores, grades, ...body } = payload;
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
