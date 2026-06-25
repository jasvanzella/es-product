Trabalho 2 de ES2, Grupo 7

Integrantes: Jasmine Vanzella, Julia Fernandes, Luiza Rosito, Murilo Souza e Rafael Madeira

# plus-mfe-product

Microfrontend de **Produto** do sistema Plus Gestão — gestão de estoque para loja de roupas plus size.

Interface administrativa para cadastro, edição e visualização de produtos, variantes de cor e grade de tamanhos.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | UI |
| TypeScript | Tipagem |
| MUI 9 (Material UI) | Design system |
| Vite 5 | Build tool |
| Module Federation | Microfrontend |

## Module Federation

Este microfrontend atua como **remote**, consumido pelo `plus-shell`:

| Propriedade | Valor |
|---|---|
| Nome | `mfe_product` |
| Entry point | `http://localhost:4002/assets/remoteEntry.js` |
| Porta | 4002 |

### Páginas expostas

| Export | Componente | Descrição |
|---|---|---|
| `./ProductListPage` | ProductList | Catálogo público com filtros e busca |
| `./ProductDetailPage` | ProductDetail | Página de detalhe do produto (PDP) |
| `./ProductListAdminPage` | ProductCreate | Listagem admin com criação |
| `./ProductEditAdminPage` | ProdutEdit | Listagem admin com CRUD completo |

### Dependências compartilhadas

`react`, `react-dom`, `@mui/material`, `@emotion/react`, `@emotion/styled`

## Variáveis de ambiente

| Variável | Descrição | Default |
|---|---|---|
| `VITE_PRODUCT_API_URL` | URL do MS Product | `http://localhost:3002` |

## Componentes

| Componente | Descrição |
|---|---|
| `Button` | Botão customizado (primary, secondary, outline, ghost, icon) |
| `UnderlineField` | Campo de input com estilo underline |
| `ProductCard` | Card de exibição de produto |
| `ProductGrid` | Grid responsivo com skeleton loading |
| `AddProductCard` | Card para adicionar novo produto |
| `ColorSwitcher` | Seletor de variação de cor |
| `SizeSwitcher` | Seletor de grade de tamanho |
| `CreateProductModal` | Modal de criação de produto |
| `EditProductModal` | Modal de edição com variantes de cor e grade |

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento (porta 4002) |
| `npm run build` | Gera o bundle em `dist/` |
| `npm run preview` | Serve o build (porta 4002) |

## Execução local (sem Docker)

```bash
npm install
npm run dev
```

Acesse: http://localhost:4002

## Execução integrada (Docker)

Este serviço é orquestrado pelo `plus-infra`. Consulte o README do `plus-infra`.

## CI/CD

Pipeline GitHub Actions (`.github/workflows/ci.yml`):
- **build**: instala dependências e builda a cada push/PR na `main`
- **publish**: publica no NPM (somente na `main`)

## Design System

Consulte o [Manual de UI](Manual_UI.md) para diretrizes visuais, paleta de cores, tipografia e padrões de componentes MUI.
