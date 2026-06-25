import { Box, Typography } from "@mui/material";

export interface SizeOption {
  id:        string;
  label:     string;
  disabled?: boolean;
}

interface SizeSwitcherProps {
  options:   SizeOption[];
  value:     string | null;
  onChange:  (id: string) => void;
  label?:    string;
  columns?:  number;
}

export function SizeSwitcher({ options, value, onChange, label = "Tamanho", columns = 6 }: SizeSwitcherProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontSize: "0.8125rem", color: "#9290a8", mb: 1.25 }}>
        {label}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 1,
        }}
      >
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <Box
              key={opt.id}
              component="button"
              type="button"
              disabled={opt.disabled}
              onClick={() => onChange(opt.id)}
              sx={{
                border: "1.5px solid",
                borderColor: isSelected ? "transparent" : "#e7e5f2",
                background: isSelected
                  ? "linear-gradient(135deg, #9a8ff5, #4f44c9)"
                  : "#ffffff",
                borderRadius: "999px",
                py: 1.1,
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: opt.disabled ? "#9290a8" : isSelected ? "#fff" : "#2c2a3a",
                textDecoration: opt.disabled ? "line-through" : "none",
                cursor: opt.disabled ? "not-allowed" : "pointer",
                boxShadow: isSelected ? "0 8px 24px rgba(124, 111, 240, 0.35)" : "none",
                opacity: opt.disabled ? 0.6 : 1,
                transition: "all 0.15s ease",
                "&:hover": {
                  borderColor: opt.disabled || isSelected ? undefined : "#b8b2ff",
                },
              }}
            >
              {opt.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default SizeSwitcher;