import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

import { Button } from "./Button";
import { UnderlineField } from "./UnderlineField";

/** Schema alinhado ao ProductUpdateRequest da API */
export interface ProductUpdateRequest {
  id:           string;
  nome:         string;
  descricao:    string;
  marca:        string;
  preco:        number;
  categoriaId:  string;
  fornecedorId: string;
  ativo:        boolean;
  cores:        ColorVariant[];
  grades:       SizeVariant[];
}

export interface ColorVariant {
  id:        string;
  nome:      string;
  hex:       string;
}

export interface SizeVariant {
  id:        string;
  nome:      string;
  estoque:   number;
}

interface CategoryOption { id: string; nome: string }
interface SupplierOption { id: string; nome: string }

interface EditProductModalProps {
  open:        boolean;
  product:     ProductUpdateRequest | null;
  onClose:     () => void;
  onSubmit:    (payload: ProductUpdateRequest) => void | Promise<void>;
  onDelete?:   (id: string) => void | Promise<void>;
  categories?: CategoryOption[];
  suppliers?:  SupplierOption[];
  submitting?: boolean;
}

const emptyColor = (): ColorVariant => ({ id: crypto.randomUUID(), nome: "", hex: "#000000" });
const emptySize  = (): SizeVariant  => ({ id: crypto.randomUUID(), nome: "", estoque: 0 });

export function EditProductModal({
  open,
  product,
  onClose,
  onSubmit,
  onDelete,
  categories = [],
  suppliers = [],
  submitting = false,
}: EditProductModalProps) {
  const [form, setForm] = useState<ProductUpdateRequest | null>(product);
  const [precoInput, setPrecoInput] = useState(product ? String(product.preco) : "");
  const [errors, setErrors] = useState<Partial<Record<keyof ProductUpdateRequest, string>>>({});

  // sincroniza quando um novo produto é passado para edição
  if (product && form?.id !== product.id) {
    setForm(product);
    setPrecoInput(String(product.preco));
    setErrors({});
  }

  if (!form) return null;

  const handleChange = (field: keyof ProductUpdateRequest) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => prev && { ...prev, [field]: e.target.value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handlePrecoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.,]/g, "");
    setPrecoInput(raw);
    setForm((prev) => prev && { ...prev, preco: Number(raw.replace(",", ".")) || 0 });
    setErrors((prev) => ({ ...prev, preco: undefined }));
  };

  const updateColor = (id: string, patch: Partial<ColorVariant>) => {
    setForm((prev) => prev && {
      ...prev,
      cores: prev.cores.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const updateSize = (id: string, patch: Partial<SizeVariant>) => {
    setForm((prev) => prev && {
      ...prev,
      grades: prev.grades.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const removeColor = (id: string) =>
    setForm((prev) => prev && { ...prev, cores: prev.cores.filter((c) => c.id !== id) });

  const removeSize = (id: string) =>
    setForm((prev) => prev && { ...prev, grades: prev.grades.filter((s) => s.id !== id) });

  const addColor = () =>
    setForm((prev) => prev && { ...prev, cores: [...prev.cores, emptyColor()] });

  const addSize = () =>
    setForm((prev) => prev && { ...prev, grades: [...prev.grades, emptySize()] });

  const validate = () => {
    const next: Partial<Record<keyof ProductUpdateRequest, string>> = {};
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      {/* círculos decorativos translúcidos, padrão do tema */}
      <Box
        aria-hidden
        sx={{
          position: "absolute", top: -70, right: -70, width: 180, height: 180,
          borderRadius: "50%", background: "#f1f0ff", zIndex: 0,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute", bottom: -60, left: -60, width: 140, height: 140,
          borderRadius: "50%", background: "#f1f0ff", zIndex: 0,
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "relative",
          zIndex: 1,
          p: { xs: 3, md: 4.5 },
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 0.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.375rem", color: "#2c2a3a" }}>
              Editar produto
            </Typography>
            <Typography sx={{ fontSize: "0.8125rem", color: "#9290a8", mt: 0.5 }}>
              Atualize os dados e variações do produto
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#9290a8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Status ativo */}
        <Box
          sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#f6f5fb", borderRadius: "12px", px: 2, py: 1.25, mt: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.8125rem", fontWeight: 700, color: "#2c2a3a" }}>
              Produto ativo
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: "#9290a8" }}>
              Produtos inativos não aparecem na loja
            </Typography>
          </Box>
          <Switch
            checked={form.ativo}
            onChange={(e) => setForm((prev) => prev && { ...prev, ativo: e.target.checked })}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#6457e8" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#9a8ff5" },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 3 }}>
          <UnderlineField
            id="nome"
            label="Nome do produto"
            value={form.nome}
            onChange={handleChange("nome")}
            error={!!errors.nome}
            helperText={errors.nome}
          />

          <UnderlineField
            id="descricao"
            label="Descrição"
            value={form.descricao}
            onChange={handleChange("descricao")}
            multiline
            rows={3}
          />

          <Box sx={{ display: "flex", gap: 2.5 }}>
            <UnderlineField
              id="marca"
              label="Marca"
              value={form.marca}
              onChange={handleChange("marca")}
              error={!!errors.marca}
              helperText={errors.marca}
            />

            <UnderlineField
              id="preco"
              label="Preço"
              value={precoInput}
              onChange={handlePrecoChange}
              error={!!errors.preco}
              helperText={errors.preco}
              endAdornment={
                <InputAdornment position="end" sx={{ pr: 0 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16, color: "#9290a8" }} />
                </InputAdornment>
              }
            />
          </Box>

          {/* Categoria */}
          <Box>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: errors.categoriaId ? "#ef4f6e" : "#9290a8", mb: 0.75 }}>
              Categoria
            </Typography>
            <Box
              component="select"
              value={form.categoriaId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setForm((prev) => prev && { ...prev, categoriaId: e.target.value });
                setErrors((prev) => ({ ...prev, categoriaId: undefined }));
              }}
              sx={{
                width: "100%", fontSize: "0.9375rem", color: "#2c2a3a",
                border: "none", borderBottom: "1.5px solid",
                borderColor: errors.categoriaId ? "#ef4f6e" : "#e7e5f2",
                py: 1, background: "transparent", outline: "none",
                "&:hover": { borderColor: errors.categoriaId ? "#ef4f6e" : "#6457e8" },
              }}
            >
              <option value="" disabled>Selecione a categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Box>
            {errors.categoriaId && (
              <Typography sx={{ fontSize: "0.72rem", color: "#ef4f6e", mt: 0.5 }}>{errors.categoriaId}</Typography>
            )}
          </Box>

          {/* Fornecedor */}
          <Box>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: errors.fornecedorId ? "#ef4f6e" : "#9290a8", mb: 0.75 }}>
              Fornecedor
            </Typography>
            <Box
              component="select"
              value={form.fornecedorId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setForm((prev) => prev && { ...prev, fornecedorId: e.target.value });
                setErrors((prev) => ({ ...prev, fornecedorId: undefined }));
              }}
              sx={{
                width: "100%", fontSize: "0.9375rem", color: "#2c2a3a",
                border: "none", borderBottom: "1.5px solid",
                borderColor: errors.fornecedorId ? "#ef4f6e" : "#e7e5f2",
                py: 1, background: "transparent", outline: "none",
                "&:hover": { borderColor: errors.fornecedorId ? "#ef4f6e" : "#6457e8" },
              }}
            >
              <option value="" disabled>Selecione o fornecedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </Box>
            {errors.fornecedorId && (
              <Typography sx={{ fontSize: "0.72rem", color: "#ef4f6e", mt: 0.5 }}>{errors.fornecedorId}</Typography>
            )}
          </Box>

          {/* Variações de cor */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#9290a8" }}>
                Variações de cor
              </Typography>
              <Button variant="ghost" size="sm" icon={<AddIcon sx={{ fontSize: 14 }} />} onClick={addColor}>
                Adicionar cor
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {form.cores.map((color) => (
                <Box key={color.id} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    component="input"
                    type="color"
                    value={color.hex}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateColor(color.id, { hex: e.target.value })}
                    sx={{
                      width: 32, height: 32, borderRadius: "8px", border: "1px solid #e7e5f2",
                      p: 0, cursor: "pointer", flexShrink: 0,
                    }}
                  />
                  <Box
                    component="input"
                    placeholder="Nome da cor (ex: Azul Marinho)"
                    value={color.nome}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateColor(color.id, { nome: e.target.value })}
                    sx={{
                      flex: 1, fontSize: "0.8125rem", color: "#2c2a3a", border: "none",
                      borderBottom: "1.5px solid #e7e5f2", py: 0.75, outline: "none", background: "transparent",
                      "&:focus": { borderColor: "#6457e8" },
                    }}
                  />
                  <IconButton size="small" onClick={() => removeColor(color.id)} sx={{ color: "#9290a8" }}>
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              ))}
              {form.cores.length === 0 && (
                <Typography sx={{ fontSize: "0.75rem", color: "#9290a8" }}>
                  Nenhuma variação de cor cadastrada.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Variações de grade/tamanho */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#9290a8" }}>
                Variações de grade
              </Typography>
              <Button variant="ghost" size="sm" icon={<AddIcon sx={{ fontSize: 14 }} />} onClick={addSize}>
                Adicionar tamanho
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {form.grades.map((size) => (
                <Box key={size.id} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    component="input"
                    placeholder="Tamanho (ex: 42)"
                    value={size.nome}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateSize(size.id, { nome: e.target.value })}
                    sx={{
                      flex: 1, fontSize: "0.8125rem", color: "#2c2a3a", border: "none",
                      borderBottom: "1.5px solid #e7e5f2", py: 0.75, outline: "none", background: "transparent",
                      "&:focus": { borderColor: "#6457e8" },
                    }}
                  />
                  <Box
                    component="input"
                    type="number"
                    placeholder="Estoque"
                    value={size.estoque}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateSize(size.id, { estoque: Number(e.target.value) })}
                    sx={{
                      width: 90, fontSize: "0.8125rem", color: "#2c2a3a", border: "none",
                      borderBottom: "1.5px solid #e7e5f2", py: 0.75, outline: "none", background: "transparent",
                      "&:focus": { borderColor: "#6457e8" },
                    }}
                  />
                  <IconButton size="small" onClick={() => removeSize(size.id)} sx={{ color: "#9290a8" }}>
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              ))}
              {form.grades.length === 0 && (
                <Typography sx={{ fontSize: "0.75rem", color: "#9290a8" }}>
                  Nenhuma variação de grade cadastrada.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
          {onDelete && (
            <Button
              variant="outline"
              size="md"
              icon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
              onClick={() => onDelete(form.id)}
              type="button"
            >
              Excluir
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" size="md" type="submit" loading={submitting}>
            Salvar alterações
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default EditProductModal;