import { Box, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

type BadgeTone = "new" | "promo" | "success" | "neutral";

interface ProductBadge {
  label: string;
  tone?: BadgeTone;
}

export interface Product {
  id:          string;
  name:        string;
  image:       string;
  price:       number;
  oldPrice?:   number;
  badge?:      ProductBadge;
  isFavorite?: boolean;
}

interface ProductCardProps {
  product:          Product;
  onAddToCart?:     (id: string) => void;
  onToggleFavorite?:(id: string) => void;
  onClick?:         (id: string) => void;
}

const BADGE_COLORS: Record<BadgeTone, { bg: string; color: string }> = {
  neutral: { bg: "#ffffff",  color: "#9290a8" },
  new:     { bg: "#f1f0ff",  color: "#4f44c9" },
  promo:   { bg: "#fdeaee",  color: "#ef4f6e" },
  success: { bg: "#e3faf1",  color: "#34c38f" },
};

export function ProductCard({ product, onAddToCart, onToggleFavorite, onClick }: ProductCardProps) {
  const { id, name, image, price, oldPrice, badge, isFavorite } = product;
  const badgeColors = BADGE_COLORS[badge?.tone ?? "neutral"];

  return (
    <Box
      sx={{
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(80, 70, 180, 0.08)",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(124, 111, 240, 0.16)",
        },
      }}
    >
      <Box
        onClick={() => onClick?.(id)}
        sx={{ position: "relative", aspectRatio: "1 / 1", background: "#f6f5fb", cursor: "pointer" }}
      >
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {badge && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              fontSize: "0.625rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              px: 1.25,
              py: 0.5,
              borderRadius: "999px",
              background: badgeColors.bg,
              color: badgeColors.color,
            }}
          >
            {badge.label}
          </Box>
        )}

        <IconButton
          aria-label="Favoritar"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 4px 16px rgba(80, 70, 180, 0.08)",
            "&:hover": { background: "#ffffff" },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ fontSize: 16, color: "#ef4f6e" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 16, color: "#9290a8" }} />
          )}
        </IconButton>
      </Box>

      <Box sx={{ p: "14px 16px 16px" }}>
        <Typography
          onClick={() => onClick?.(id)}
          sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#2c2a3a", cursor: "pointer", mb: 1.5 }}
        >
          {name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", color: "#2c2a3a" }}>
              ${price.toFixed(2)}
            </Typography>
            {oldPrice && (
              <Typography sx={{ fontSize: "0.75rem", color: "#9290a8", textDecoration: "line-through" }}>
                ${oldPrice.toFixed(2)}
              </Typography>
            )}
          </Box>

          <IconButton
            aria-label="Adicionar ao carrinho"
            onClick={() => onAddToCart?.(id)}
            sx={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #9a8ff5, #4f44c9)",
              boxShadow: "0 8px 24px rgba(124, 111, 240, 0.35)",
              color: "#fff",
              "&:hover": { background: "linear-gradient(135deg, #9a8ff5, #4f44c9)" },
              "&:active": { transform: "scale(0.92)" },
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;