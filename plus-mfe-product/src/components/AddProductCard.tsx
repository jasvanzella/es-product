import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddProductCardProps {
  onClick: () => void;
}

/**
 * AddProductCard - card de mesmo formato do ProductCard, sempre fixo
 * como primeiro item da grid de listagem (visão admin). Ao clicar,
 * abre o CreateProductModal.
 */
export function AddProductCard({ onClick }: AddProductCardProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        width: "100%",
        aspectRatio: "1 / 1.32",
        border: "2px dashed #d0d0e8",
        borderRadius: "16px",
        background: "#f6f5fb",
        cursor: "pointer",
        transition: "border-color 0.15s ease, background 0.15s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: "#6457e8",
          background: "#f1f0ff",
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #9a8ff5, #4f44c9)",
          boxShadow: "0 8px 24px rgba(124, 111, 240, 0.35)",
        }}
      >
        <AddIcon sx={{ color: "#fff", fontSize: 26 }} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", color: "#4f44c9" }}>
        Novo produto
      </Typography>
    </Box>
  );
}

export default AddProductCard;