import { Box, Typography } from "@mui/material";

export interface ColorOption {
  id:         string;
  label:      string;
  thumbnail:  string;
}

interface ColorSwitcherProps {
  colors:    ColorOption[];
  value:     string | null;
  onChange:  (id: string) => void;
  label?:    string;
}

export function ColorSwitcher({ colors, value, onChange, label = "Cor" }: ColorSwitcherProps) {
  const selected = colors.find((c) => c.id === value);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{ fontSize: "0.8125rem", color: "#9290a8", mb: 1.25 }}
      >
        {label}
        {selected && (
          <Box component="span" sx={{ color: "#2c2a3a", fontWeight: 700 }}>
            {" "}· {selected.label}
          </Box>
        )}
      </Typography>

      <Box sx={{ display: "flex", gap: 1.25 }}>
        {colors.map((color) => {
          const isSelected = value === color.id;
          return (
            <Box
              key={color.id}
              component="button"
              type="button"
              onClick={() => onChange(color.id)}
              title={color.label}
              aria-label={color.label}
              sx={{
                position: "relative",
                width: 46,
                height: 46,
                p: 0,
                border: "2px solid",
                borderColor: isSelected ? "#6457e8" : "transparent",
                borderRadius: "16px",
                backgroundImage: `url(${color.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#f6f5fb",
                cursor: "pointer",
                transition: "border-color 0.15s ease, transform 0.15s ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              {isSelected && (
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #9a8ff5, #4f44c9)",
                    color: "#fff",
                    fontSize: "0.625rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(80, 70, 180, 0.12)",
                  }}
                >
                  ✓
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default ColorSwitcher;