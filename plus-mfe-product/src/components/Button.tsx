import { type ReactNode, type MouseEvent } from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children?:  ReactNode;
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  fullWidth?: boolean;
  icon?:      ReactNode;
  onClick?:   (e: MouseEvent<HTMLButtonElement>) => void;
  type?:      "button" | "submit" | "reset";
  disabled?:  boolean;
  loading?:   boolean;
}

const SIZE_STYLES: Record<ButtonSize, { px: number; py: number; fontSize: string }> = {
  sm: { px: 2.25, py: 1.1,  fontSize: "0.8125rem" },
  md: { px: 3.5,  py: 1.5,  fontSize: "0.875rem" },
  lg: { px: 4,    py: 1.9,  fontSize: "0.9375rem" },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const sizeStyle = SIZE_STYLES[size];

  const isIconOnly = variant === "icon";

  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      disableElevation
      fullWidth={fullWidth}
      startIcon={!isIconOnly && icon ? icon : undefined}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "0.01em",
        borderRadius: "999px",
        minWidth: isIconOnly ? 0 : undefined,
        width: isIconOnly ? 44 : undefined,
        height: isIconOnly ? 44 : undefined,
        padding: isIconOnly ? 0 : `${sizeStyle.py * 8}px ${sizeStyle.px * 8}px`,
        fontSize: sizeStyle.fontSize,
        transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease",

        ...(variant === "primary" && {
          background: "linear-gradient(135deg, #9a8ff5, #4f44c9)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(124, 111, 240, 0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #9a8ff5, #4f44c9)",
            boxShadow: "0 12px 30px rgba(124, 111, 240, 0.45)",
          },
          "&.Mui-disabled": { color: "#fff", opacity: 0.45 },
        }),

        ...(variant === "secondary" && {
          background: "#ffffff",
          color: "#6457e8",
          boxShadow: "0 4px 16px rgba(80, 70, 180, 0.12)",
          "&:hover": { background: "#f1f0ff" },
        }),

        ...(variant === "outline" && {
          background: "transparent",
          color: "#2c2a3a",
          border: "1.5px solid #e7e5f2",
          "&:hover": { borderColor: "#b8b2ff", background: "transparent" },
        }),

        ...(variant === "ghost" && {
          background: "transparent",
          color: "#6457e8",
          px: 0.5,
          minWidth: 0,
          "&:hover": { background: "transparent", textDecoration: "underline" },
        }),

        ...(variant === "icon" && {
          background: "#ffffff",
          color: "#2c2a3a",
          border: "1px solid #e7e5f2",
          "&:hover": { background: "#f6f5fb" },
        }),

        "&:active": { transform: "scale(0.97)" },
      }}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : (isIconOnly ? icon : children)}
    </MuiButton>
  );
}

export default Button;