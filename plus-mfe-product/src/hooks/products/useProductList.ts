import { useState, useEffect, useCallback } from "react";
import type { Product } from "../../components/ProductCard";

const API_BASE_URL = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:3002";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x400.png?text=Produto";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products`, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        return res.json();
      })
      .then((data) =>
        setProducts(
          data.items.map((p: any) => ({
            id: p.id,
            name: p.nome,
            image: PLACEHOLDER_IMAGE,
            price: p.preco,
          }))
        )
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { products, loading, reload };
}