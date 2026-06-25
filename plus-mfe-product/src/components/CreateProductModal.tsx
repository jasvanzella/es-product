import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export interface ProductCreateRequest {
  nome: string;
  descricao: string;
  marca: string;
  preco: number;
  categoriaId: string;
  fornecedorId: string;
}

interface CategoryOption {
  id: string;
  nome: string;
}
interface SupplierOption {
  id: string;
  nome: string;
}

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductCreateRequest) => void | Promise<void>;
  categories?: CategoryOption[];
  suppliers?: SupplierOption[];
  submitting?: boolean;
}

const EMPTY_FORM: ProductCreateRequest = {
  nome: "",
  descricao: "",
  marca: "",
  preco: 0,
  categoriaId: "",
  fornecedorId: "",
};

export function CreateProductModal({
  open,
  onClose,
  onSubmit,
  categories = [],
  suppliers = [],
  submitting = false,
}: CreateProductModalProps) {
  const [form, setForm] = useState<ProductCreateRequest>(EMPTY_FORM);
  const [precoInput, setPrecoInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProductCreateRequest, string>>>({});

  const handleChange =
    (field: keyof ProductCreateRequest) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handlePrecoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.,]/g, "");
    setPrecoInput(raw);
    setForm((prev) => ({ ...prev, preco: Number(raw.replace(",", ".")) || 0 }));
    setErrors((prev) => ({ ...prev, preco: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof ProductCreateRequest, string>> = {};
    if (!form.nome.trim()) next.nome = "Informe o nome do produto";
    if (!form.marca.trim()) next.marca = "Informe a marca";
    if (!form.preco || form.preco <= 0) next.preco = "Informe um preço válido";
    if (!form.categoriaId.trim()) next.categoriaId = "Selecione a categoria";
    if (!form.fornecedorId.trim()) next.fornecedorId = "Selecione o fornecedor";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setPrecoInput("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            boxShadow: "0 30px 60px rgba(80, 70, 180, 0.25)",
            overflow: "hidden",
            position: "relative",
          },
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 180,
          height: 180,
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
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "#f1f0ff",
          zIndex: 0,
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 4.5 } }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.375rem", color: "#2c2a3a" }}>
              Novo produto
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "#9290a8", mt: 0.5 }}>
              O produto nasce ativo por padrão no catálogo.
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "#9290a8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 3 }}>
          <TextField
            id="nome"
            label="Nome do produto"
            value={form.nome}
            onChange={handleChange("nome")}
            error={!!errors.nome}
            helperText={errors.nome}
            autoFocus
            fullWidth
            variant="standard"
          />

          <TextField
            id="descricao"
            label="Descrição"
            value={form.descricao}
            onChange={handleChange("descricao")}
            multiline
            rows={3}
            fullWidth
            variant="standard"
          />

          <Box sx={{ display: "flex", gap: 2.5 }}>
            <TextField
              id="marca"
              label="Marca"
              value={form.marca}
              onChange={handleChange("marca")}
              error={!!errors.marca}
              helperText={errors.marca}
              fullWidth
              variant="standard"
            />
            <TextField
              id="preco"
              label="Preço"
              value={precoInput}
              onChange={handlePrecoChange}
              error={!!errors.preco}
              helperText={errors.preco}
              fullWidth
              variant="standard"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <AttachMoneyIcon sx={{ fontSize: 16, color: "#9290a8" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <FormControl fullWidth error={!!errors.categoriaId} variant="standard">
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: errors.categoriaId ? "#ef4f6e" : "#9290a8", mb: 0.75 }}>
              Categoria
            </Typography>
            <Select
              value={form.categoriaId}
              displayEmpty
              onChange={(e) => {
                setForm((prev) => ({ ...prev, categoriaId: e.target.value as string }));
                setErrors((prev) => ({ ...prev, categoriaId: undefined }));
              }}
            >
              <MenuItem value="" disabled>
                Selecione a categoria
              </MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.categoriaId && <FormHelperText>{errors.categoriaId}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.fornecedorId} variant="standard">
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: errors.fornecedorId ? "#ef4f6e" : "#9290a8", mb: 0.75 }}>
              Fornecedor
            </Typography>
            <Select
              value={form.fornecedorId}
              displayEmpty
              onChange={(e) => {
                setForm((prev) => ({ ...prev, fornecedorId: e.target.value as string }));
                setErrors((prev) => ({ ...prev, fornecedorId: undefined }));
              }}
            >
              <MenuItem value="" disabled>
                Selecione o fornecedor
              </MenuItem>
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.fornecedorId && <FormHelperText>{errors.fornecedorId}</FormHelperText>}
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleClose}
            type="button"
            disabled={submitting}
            sx={{ borderRadius: "12px" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={submitting}
            sx={{ borderRadius: "12px" }}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? "Criando..." : "Criar produto"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default CreateProductModal;