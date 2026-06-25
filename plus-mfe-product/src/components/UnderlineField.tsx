import { type ChangeEvent, type FocusEvent, type ReactNode } from "react";
import { Box, Input, InputLabel } from "@mui/material";

interface UnderlineFieldProps {
  id:            string;
  label:         string;
  type?:         string;
  value:         string;
  onChange:      (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?:       (e: FocusEvent<HTMLInputElement>) => void;
  error?:        boolean;
  helperText?:   string;
  autoComplete?: string;
  autoFocus?:    boolean;
  multiline?:    boolean;
  rows?:         number;
  endAdornment?: ReactNode;
}

export function UnderlineField({
  id, label, type = "text", value, onChange, onBlur,
  error, helperText, autoComplete, autoFocus, multiline, rows,
  endAdornment,
}: UnderlineFieldProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <InputLabel
        htmlFor={id}
        sx={{
          fontSize: "0.72rem",
          fontWeight: 600,
          color: error ? "#ef4f6e" : "#9290a8",
          mb: 0.5,
          display: "block",
          transition: "color 0.15s",
        }}
      >
        {label}
      </InputLabel>
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          multiline={multiline}
          rows={rows}
          fullWidth
          sx={{
            fontSize: "0.9375rem",
            color: "#2c2a3a",
            pr: endAdornment ? "28px" : 0,
            "&::before":                          { borderBottomColor: error ? "#ef4f6e" : "#e7e5f2" },
            "&:hover:not(.Mui-disabled)::before": { borderBottomColor: error ? "#ef4f6e" : "#6457e8" },
            "&::after":                           { borderBottomColor: error ? "#ef4f6e" : "#6457e8" },
          }}
        />
        {endAdornment && (
          <Box
            aria-hidden
            sx={{ position: "absolute", right: 0, display: "flex", alignItems: "center" }}
          >
            {endAdornment}
          </Box>
        )}
      </Box>
      {error && helperText && (
        <Box
          component="span"
          sx={{ fontSize: "0.72rem", color: "#ef4f6e", mt: 0.5, display: "block" }}
        >
          {helperText}
        </Box>
      )}
    </Box>
  );
}

export default UnderlineField;