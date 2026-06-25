import { type ReactNode } from "react";
import { Box } from "@mui/material";

interface ProductGridProps {
  children:       ReactNode;
  columns?:       number;
  loading?:       boolean;
  skeletonCount?: number;
}

const SHIMMER_BG = "linear-gradient(90deg, #ececf6 25%, #f5f4fb 37%, #ececf6 63%)";

function GridSkeletonCard() {
  return (
    <Box sx={{ background: "#f6f5fb", borderRadius: "16px", p: 1.75 }}>
      <Box
        sx={{
          aspectRatio: "1 / 1",
          borderRadius: "8px",
          background: SHIMMER_BG,
          backgroundSize: "400% 100%",
          animation: "pf-shimmer 1.4s ease infinite",
          mb: 1.5,
          "@keyframes pf-shimmer": {
            "0%":   { backgroundPosition: "100% 0" },
            "100%": { backgroundPosition: "0 0" },
          },
        }}
      />
      <Box sx={{ height: 10, borderRadius: "6px", width: "70%", mb: 1, background: SHIMMER_BG, backgroundSize: "400% 100%", animation: "pf-shimmer 1.4s ease infinite" }} />
      <Box sx={{ height: 10, borderRadius: "6px", width: "40%", background: SHIMMER_BG, backgroundSize: "400% 100%", animation: "pf-shimmer 1.4s ease infinite" }} />
    </Box>
  );
}

export function ProductGrid({ children, columns = 4, loading = false, skeletonCount = 8 }: ProductGridProps) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 30px 60px rgba(80, 70, 180, 0.25)",
        p: 4,
      }}
    >
      {/* círculos decorativos translúcidos, igual à referência */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "#f1f0ff",
          zIndex: 0,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "#f1f0ff",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: `repeat(${columns}, minmax(0, 1fr))`,
          },
          gap: 3,
        }}
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => <GridSkeletonCard key={i} />)
          : children}
      </Box>
    </Box>
  );
}

export default ProductGrid;