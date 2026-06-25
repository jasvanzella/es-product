import { useState } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  InputBase,
  Checkbox,
  FormControlLabel,
  Chip,
  Pagination,
  PaginationItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

import { Button } from "../components/Button";
import { ProductGrid } from "../components/ProductGrid";
import { ProductCard, type Product } from "../components/ProductCard";

export interface FilterGroupOption {
  id:      string;
  label:   string;
  swatch?: string;
}

export interface ProductListPageProps {
  title:           string;
  products:        Product[];
  loading?:        boolean;
  totalPages?:     number;
  page?:           number;
  onPageChange?:   (page: number) => void;
  activeFilters?:  string[];
  onRemoveFilter?: (id: string) => void;
  typeOptions?:    FilterGroupOption[];
  colorOptions?:   FilterGroupOption[];
  onAddToCart?:    (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenProduct?:  (id: string) => void;
}

const DEFAULT_TYPES: FilterGroupOption[] = [
  { id: "basic",    label: "Basic" },
  { id: "pattern",  label: "Pattern" },
  { id: "hoodie",   label: "Hoodie" },
  { id: "zipper",   label: "Zipper" },
  { id: "oversize", label: "Oversize" },
];

const DEFAULT_COLORS: FilterGroupOption[] = [
  { id: "black",      label: "Black",      swatch: "#1c1c1c" },
  { id: "red",        label: "Red",        swatch: "#e0463f" },
  { id: "brown",       label: "Brown",      swatch: "#7a4a2b" },
  { id: "multicolour", label: "Multicolour", swatch: "linear-gradient(135deg, #e0463f, #f5c84c, #4f9dde)" },
  { id: "grey",        label: "Grey",       swatch: "#b9b9c4" },
  { id: "blue",        label: "Blue",       swatch: "#3d5dd8" },
];

export function ProductListPage({
  title,
  products,
  loading = false,
  totalPages = 1,
  page = 1,
  onPageChange,
  activeFilters = [],
  onRemoveFilter,
  typeOptions = DEFAULT_TYPES,
  colorOptions = DEFAULT_COLORS,
  onAddToCart,
  onToggleFavorite,
  onOpenProduct,
}: ProductListPageProps) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(["oversize"]));
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set(["multicolour"]));

  const toggleInSet = (set: Set<string>, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f6f5fb" }}>
      {/* Topbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: { xs: 2, md: 5 },
          py: 2,
          background: "#ffffff",
          borderBottom: "1px solid #e7e5f2",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.05rem",
            color: "#2c2a3a",
            background: "linear-gradient(135deg, #9a8ff5, #4f44c9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          lapakbaju
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "#f6f5fb",
            borderRadius: "999px",
            px: 2,
            py: 0.75,
            maxWidth: 420,
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: "#9290a8" }} />
          <InputBase
            placeholder="Buscar entre os produtos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.8125rem", flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: "auto" }}>
          <Button
            variant="outline"
            size="sm"
            icon={<FavoriteBorderIcon sx={{ fontSize: 16 }} />}
          >
            Wishlist
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />}
          >
            Seu carrinho
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, px: { xs: 2, md: 5 }, py: 4, alignItems: "flex-start" }}>
        {/* Sidebar de filtros */}
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            display: { xs: "none", md: "block" },
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(80, 70, 180, 0.08)",
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TuneIcon sx={{ fontSize: 18, color: "#6457e8" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#2c2a3a" }}>
              Filtrar por
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#9290a8", mb: 1 }}>
            TIPO
          </Typography>
          {typeOptions.map((opt) => (
            <FormControlLabel
              key={opt.id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedTypes.has(opt.id)}
                  onChange={() => setSelectedTypes((prev) => toggleInSet(prev, opt.id))}
                  sx={{
                    color: "#d0d0e8",
                    "&.Mui-checked": { color: "#6457e8" },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: "0.8125rem", color: "#2c2a3a" }}>{opt.label}</Typography>}
              sx={{ display: "flex", ml: 0 }}
            />
          ))}

          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#9290a8", mt: 2, mb: 1 }}>
            COR
          </Typography>
          {colorOptions.map((opt) => (
            <FormControlLabel
              key={opt.id}
              control={
                <Checkbox
                  size="small"
                  checked={selectedColors.has(opt.id)}
                  onChange={() => setSelectedColors((prev) => toggleInSet(prev, opt.id))}
                  sx={{
                    color: "#d0d0e8",
                    "&.Mui-checked": { color: "#6457e8" },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: opt.swatch,
                      border: "1px solid #e7e5f2",
                    }}
                  />
                  <Typography sx={{ fontSize: "0.8125rem", color: "#2c2a3a" }}>{opt.label}</Typography>
                </Box>
              }
              sx={{ display: "flex", ml: 0 }}
            />
          ))}

          <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Button variant="primary" size="sm" fullWidth>
                Aplicar
              </Button>
            </Box>
            <Button variant="icon" icon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />} />
          </Box>
        </Box>

        {/* Conteúdo principal */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Breadcrumbs separator="›" sx={{ mb: 1, fontSize: "0.8125rem" }}>
            <Link underline="hover" sx={{ color: "#9290a8", cursor: "pointer" }}>
              Página inicial
            </Link>
            <Link underline="hover" sx={{ color: "#9290a8", cursor: "pointer" }}>
              Categoria
            </Link>
            <Typography sx={{ fontSize: "0.8125rem", color: "#2c2a3a", fontWeight: 600 }}>
              {title}
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 800, color: "#2c2a3a" }}>
              {title}
            </Typography>

            <Typography sx={{ fontSize: "0.8125rem", color: "#9290a8" }}>
              Ordenar por: <Box component="span" sx={{ color: "#2c2a3a", fontWeight: 700 }}>Mais populares</Box>
            </Typography>
          </Box>

          {activeFilters.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              {activeFilters.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onDelete={() => onRemoveFilter?.(filter)}
                  sx={{
                    background: "#f1f0ff",
                    color: "#4f44c9",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    "& .MuiChip-deleteIcon": { color: "#6457e8" },
                  }}
                />
              ))}
            </Box>
          )}

          <ProductGrid columns={3} loading={loading}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                onClick={onOpenProduct}
              />
            ))}
          </ProductGrid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => onPageChange?.(value)}
                renderItem={(item) => <PaginationItem {...item} />}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 600,
                    color: "#2c2a3a",
                    borderRadius: "8px",
                  },
                  "& .Mui-selected": {
                    background: "linear-gradient(135deg, #9a8ff5, #4f44c9) !important",
                    color: "#fff",
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductListPage;

/* Exemplo de uso:
<ProductListPage
  title="Sweatshirt"
  products={products}
  page={3}
  totalPages={20}
  activeFilters={["Oversize", "Multicolour", "XXL"]}
  onAddToCart={(id) => console.log("add", id)}
  onToggleFavorite={(id) => console.log("fav", id)}
  onOpenProduct={(id) => console.log("open", id)}
  onPageChange={(p) => console.log("page", p)}
/>
*/