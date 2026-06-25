import { createTheme, type Components, type Theme } from "@mui/material/styles";

// ── Paleta de marca ──────────────────────────────────────────────────────────
export const COLORS = {
  primary:      "#6C63FF",
  primaryDark:  "#5A52E0",
  primaryLight: "#EAE9FF",
  primaryGhost: "rgba(108, 99, 255, 0.08)",

  bgPage:   "linear-gradient(135deg, #7B74F5 0%, #5E56E8 100%)",
  bgCard:   "rgba(248, 248, 255, 0.93)",
  bgPaper:  "#ffffff",
  bgSubtle: "#f8f8ff",

  textPrimary:   "#3d3d6b",
  textSecondary: "#9898b3",
  textMuted:     "#b8b8cc",
  textInverse:   "#ffffff",
  textHeading:   "#4a42c8",

  border:        "#e0e0f0",
  borderFocus:  "#6C63FF",
  borderSubtle: "#d0d0e8",

  success:      "#22c55e",
  successLight: "#f0fdf4",
  warning:      "#f59e0b",
  warningLight: "#fffbeb",
  error:        "#e05252",
  errorLight:   "#fef2f2",
  info:         "#3b82f6",
  infoLight:    "#eff6ff",

  // Status específicos de produto
  statusActive:   "#22c55e",
  statusInactive: "#9898b3",
  statusDraft:    "#f59e0b",
  statusNoStock:  "#e05252",
} as const;

// ── Tipografia ───────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  fontFamily: '"Nunito", "Inter", "Helvetica Neue", Arial, sans-serif',
  sizes: {
    xs:   "0.6875rem",
    sm:   "0.75rem",
    base: "0.875rem",
    md:   "0.9375rem",
    lg:   "1rem",
    xl:   "1.125rem",
    "2xl":"1.25rem",
    "3xl":"1.5rem",
    "4xl":"1.875rem",
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
} as const;

// ── Arredondamentos (Borders) ────────────────────────────────────────────────
export const RADIUS = {
  sm:   "6px",
  md:   "10px",
  lg:   "14px",
  xl:   "20px",
  "2xl":"24px",
  full: "9999px",
} as const;

// ── Sombras ──────────────────────────────────────────────────────────────────
export const SHADOWS = {
  card:        "0 1px 3px rgba(70,60,200,0.06), 0 8px 32px rgba(70,60,200,0.10)",
  cardHover:   "0 4px 16px rgba(70,60,200,0.14), 0 12px 40px rgba(70,60,200,0.12)",
  button:      "0 4px 20px rgba(108,99,255,0.40)",
  buttonHover: "0 6px 28px rgba(108,99,255,0.50)",
  focus:       "0 0 0 3px rgba(108,99,255,0.18)",
  modal:       "0 8px 48px rgba(70,60,200,0.22)",
} as const;

// ── Transições ───────────────────────────────────────────────────────────────
export const TRANSITIONS = {
  fast: "120ms ease",
  base: "180ms ease",
  slow: "280ms ease",
} as const;

const components: Components<Theme> = {
  // Inputs underline (sem caixa ao redor)
  MuiInput: {
    styleOverrides: {
      root: {
        fontSize: TYPOGRAPHY.sizes.md,
        color: COLORS.textPrimary,
        transition: `border-color ${TRANSITIONS.base}`,
        "&::before":                          { borderBottomColor: COLORS.borderSubtle },
        "&:hover:not(.Mui-disabled)::before": { borderBottomColor: COLORS.primary },
        "&::after":                           { borderBottomColor: COLORS.primary },
        "&.Mui-error::before":                { borderBottomColor: COLORS.error },
        "&.Mui-error::after":                 { borderBottomColor: COLORS.error },
      },
    },
  },

  // Inputs com borda (filtros e formulários internos)
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: RADIUS.lg,
        fontSize: TYPOGRAPHY.sizes.base,
        backgroundColor: COLORS.bgPaper,
        transition: `box-shadow ${TRANSITIONS.base}, border-color ${TRANSITIONS.base}`,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.border },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.textMuted },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: COLORS.primary,
          borderWidth: "1.5px",
        },
        "&.Mui-focused": { boxShadow: SHADOWS.focus },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.error },
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.semibold,
        color: COLORS.textSecondary,
        "&.Mui-focused": { color: COLORS.primary },
        "&.Mui-error":   { color: COLORS.error },
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: { fontSize: TYPOGRAPHY.sizes.xs, marginTop: "4px" },
    },
  },

  // Botões — pill shape para primary, rounded para os demais
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: TYPOGRAPHY.weights.bold,
        fontSize: TYPOGRAPHY.sizes.base,
        letterSpacing: "0.02em",
        boxShadow: "none",
        transition: `all ${TRANSITIONS.base}`,
        "&:hover":  { boxShadow: "none" },
        "&:active": { boxShadow: "none", transform: "scale(0.98)" },
        "&.Mui-disabled": { opacity: 0.6 },
      },
      contained: {
        borderRadius: RADIUS.full,
        padding: "11px 28px",
        background: `linear-gradient(90deg, ${COLORS.primary} 0%, #7B74F5 100%)`,
        boxShadow: SHADOWS.button,
        color: COLORS.textInverse,
        "&:hover": {
          background: `linear-gradient(90deg, ${COLORS.primaryDark} 0%, ${COLORS.primary} 100%)`,
          boxShadow: SHADOWS.buttonHover,
        },
      },
      outlined: {
        borderRadius: RADIUS.full,
        padding: "9px 24px",
        borderColor: COLORS.border,
        color: COLORS.primary,
        fontWeight: TYPOGRAPHY.weights.semibold,
        backgroundColor: COLORS.bgPaper,
        "&:hover": { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
      },
      text: {
        borderRadius: RADIUS.md,
        padding: "6px 12px",
        color: COLORS.primary,
        "&:hover": { backgroundColor: COLORS.primaryGhost },
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: RADIUS.md,
        transition: `background ${TRANSITIONS.fast}`,
        "&:hover": { backgroundColor: COLORS.primaryGhost },
      },
    },
  },

  // Cards
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: RADIUS.xl,
        boxShadow: SHADOWS.card,
        border: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.bgPaper,
        transition: `box-shadow ${TRANSITIONS.base}`,
        "&:hover": { boxShadow: SHADOWS.cardHover },
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: { padding: "20px", "&:last-child": { paddingBottom: "20px" } },
    },
  },

  // Chip
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: RADIUS.full,
        fontWeight: TYPOGRAPHY.weights.semibold,
        fontSize: TYPOGRAPHY.sizes.xs,
        height: "24px",
      },
    },
  },

  // Dialog / Modal
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: RADIUS["2xl"],
        boxShadow: SHADOWS.modal,
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold,
        color: COLORS.textHeading,
        padding: "24px 28px 16px",
      },
    },
  },

  MuiDialogContent: {
    styleOverrides: {
      root: { padding: "0 28px 16px" },
    },
  },

  MuiDialogActions: {
    styleOverrides: {
      root: { padding: "16px 28px 24px", gap: "8px" },
    },
  },

  // Tabelas
  MuiTableHead: {
    styleOverrides: {
      root: {
        "& .MuiTableCell-head": {
          backgroundColor: COLORS.bgSubtle,
          color: COLORS.textSecondary,
          fontWeight: TYPOGRAPHY.weights.bold,
          fontSize: TYPOGRAPHY.sizes.xs,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "10px 16px",
        },
      },
    },
  },

  MuiTableBody: {
    styleOverrides: {
      root: {
        "& .MuiTableRow-root": {
          transition: `background ${TRANSITIONS.fast}`,
          "&:hover": { backgroundColor: COLORS.bgSubtle },
          "&:last-child .MuiTableCell-body": { borderBottom: "none" },
        },
        "& .MuiTableCell-body": {
          color: COLORS.textPrimary,
          fontSize: TYPOGRAPHY.sizes.base,
          padding: "12px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
        },
      },
    },
  },

  MuiTablePagination: {
    styleOverrides: {
      root: { color: COLORS.textSecondary, fontSize: TYPOGRAPHY.sizes.sm },
      select: { fontWeight: TYPOGRAPHY.weights.semibold },
    },
  },

  // Tooltip
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: COLORS.textPrimary,
        fontSize: TYPOGRAPHY.sizes.xs,
        borderRadius: RADIUS.md,
        padding: "6px 10px",
      },
    },
  },

  // Alert / Banner
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: RADIUS.lg, fontSize: TYPOGRAPHY.sizes.base },
    },
  },

  // Divider
  MuiDivider: {
    styleOverrides: {
      root: { borderColor: COLORS.border },
    },
  },

  // Checkbox / Radio
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: COLORS.borderSubtle,
        "&.Mui-checked": { color: COLORS.primary },
        "&:hover": { backgroundColor: COLORS.primaryGhost },
      },
    },
  },

  // Select
  MuiSelect: {
    styleOverrides: {
      icon: { color: COLORS.textSecondary },
    },
  },

  // Pagination
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        borderRadius: RADIUS.md,
        color: COLORS.textSecondary,
        "&.Mui-selected": {
          backgroundColor: COLORS.primary,
          color: COLORS.textInverse,
          fontWeight: TYPOGRAPHY.weights.bold,
          "&:hover": { backgroundColor: COLORS.primaryDark },
        },
      },
    },
  },

  // Skeleton
  MuiSkeleton: {
    styleOverrides: {
      root: { borderRadius: RADIUS.md, backgroundColor: COLORS.border },
    },
  },

  // Tabs
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: TYPOGRAPHY.weights.semibold,
        fontSize: TYPOGRAPHY.sizes.base,
        color: COLORS.textSecondary,
        "&.Mui-selected": { color: COLORS.primary },
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: { backgroundColor: COLORS.primary, height: "2px", borderRadius: "2px" },
    },
  },
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main:         COLORS.primary,
      dark:         COLORS.primaryDark,
      light:        COLORS.primaryLight,
      contrastText: COLORS.textInverse,
    },
    background: {
      default: COLORS.bgSubtle,
      paper:   COLORS.bgPaper,
    },
    text: {
      primary:   COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
    divider: COLORS.border,
    error:   { main: COLORS.error,   light: COLORS.errorLight   },
    success: { main: COLORS.success, light: COLORS.successLight },
    warning: { main: COLORS.warning, light: COLORS.warningLight },
    info:    { main: COLORS.info,    light: COLORS.infoLight    },
  },

  typography: {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: 14,
    h1: { fontWeight: TYPOGRAPHY.weights.extrabold, color: COLORS.textHeading },
    h2: { fontWeight: TYPOGRAPHY.weights.bold,      color: COLORS.textHeading },
    h3: { fontWeight: TYPOGRAPHY.weights.bold,      color: COLORS.textHeading },
    h4: { fontWeight: TYPOGRAPHY.weights.bold,      color: COLORS.textHeading },
    h5: { fontWeight: TYPOGRAPHY.weights.semibold,  color: COLORS.textPrimary },
    h6: { fontWeight: TYPOGRAPHY.weights.semibold,  color: COLORS.textPrimary },
    subtitle1: { color: COLORS.textSecondary, fontWeight: TYPOGRAPHY.weights.medium },
    subtitle2: { color: COLORS.textSecondary, fontWeight: TYPOGRAPHY.weights.semibold, fontSize: TYPOGRAPHY.sizes.sm },
    body1: { color: COLORS.textPrimary,   fontSize: TYPOGRAPHY.sizes.base },
    body2: { color: COLORS.textSecondary, fontSize: TYPOGRAPHY.sizes.sm   },
    caption: { color: COLORS.textMuted, fontSize: TYPOGRAPHY.sizes.xs },
    overline: {
      color: COLORS.textSecondary,
      fontWeight: TYPOGRAPHY.weights.bold,
      fontSize: TYPOGRAPHY.sizes.xs,
      letterSpacing: "0.08em",
    },
  },

  shape: { borderRadius: 10 },

  components,
});