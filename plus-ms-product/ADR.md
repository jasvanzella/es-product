Trabalho 2 de ES2, Grupo 7

Integrantes: Jasmine Vanzella, Julia Fernandes, Luiza Rosito, Murilo Souza e Rafael Madeira

# Documento de Decisão de Arquitetura — Microsserviço de Produto (Plus Gestão)

## 1. STATUS: Aceito

## 2. CONTEXTO

O `plus-ms-product` é o microsserviço de domínio responsável pelo cadastro de
produtos, grade de tamanhos e variações de cor/SKU do sistema Plus Gestão —
sistema de gestão de estoque para vestuário plus size.

Ele faz parte de uma arquitetura distribuída (Microsserviços + Microfrontends)
e integra-se com os seguintes serviços do ecossistema:

- **MS Auth** (eleito na T1): emite os JWTs; o MS Produto apenas valida localmente.
- **MS Categorias** (Grupo 5): fornece `categoriaId` para classificação de produtos.
- **MS Fornecedores** (Grupo It Girls): fornece `fornecedorId` para rastreabilidade.
- **MS Estoque** (Grupo 16): consome `itemDeGradeId` (variante) para controle de quantidades.
- **MS Pedidos** (Grupo 8): consome endpoints de produto para criação de pedidos.
- **MS Consulta** (Grupo 67): consome endpoints de busca para exibir o catálogo.
- **MS Mídia** (Grupo 9): armazenamento de imagens de produtos (integração futura).

## 3. DECISÃO ARQUITETURAL

### 3.1. Estilo arquitetural — Clean Architecture (Hexagonal)

O microsserviço adota uma **arquitetura em camadas** inspirada no padrão
hexagonal, com separação clara de responsabilidades:

```
Controllers (adapters de entrada — HTTP/FastAPI)
    ↓ delega para
Services (camada de aplicação — use cases e regras de negócio)
    ↓ delega para
Repositories (adapters de saída — acesso a dados via SQLAlchemy)
    ↓ opera sobre
Models (entidades de infraestrutura — mapeamento ORM)
```

**Estrutura de diretórios:**
```
src/app/
├── config/           Settings e segurança JWT
├── database/         Engine e sessão SQLAlchemy
├── models/           ProductModel, VariantModel, SizeModel
├── dtos/             Request/Response Pydantic (product, variant, size)
├── repositories/     ProductRepository, VariantRepository, SizeRepository
├── services/         ProductService, VariantService, SizeService
├── clients/          CategoriaClient, SupplierClient (HTTP cross-service)
└── controllers/      ProductController, VariantController, SizeController
```

Cada camada possui uma responsabilidade única:
- **Controllers**: recebem requisições HTTP, validam auth/RBAC, delegam ao service.
- **Services**: orquestram regras de negócio (validação de SKU, cascade disable,
  criação atômica de produto+variantes, validação cross-service).
- **Repositories**: encapsulam queries SQL/ORM, abstraindo o acesso ao banco.
- **Models**: mapeamento ORM puro, sem lógica de negócio.
- **DTOs**: contratos de entrada/saída (Pydantic), separados dos models.
- **Clients**: adaptadores HTTP para comunicação com outros microsserviços.

### 3.2. Autenticação e Autorização (JWT/RBAC)

O MS de Produto **não emite tokens** — essa responsabilidade é exclusiva do
MS Auth. Para validar os tokens recebidos, o MS de Produto **replica
localmente** a lógica de verificação de JWT (`app/config/security.py`):
decodifica o token com o mesmo algoritmo (HS256) e o mesmo segredo
compartilhado (`JWT_SECRET`) configurados no MS Auth.

Essa é a mesma estratégia adotada pelo MS Categorias (Grupo 5, Java/Spring,
`HmacSha256JwtDecoder`): cada microsserviço valida o JWT de forma
**stateless**, sem chamada de rede ao MS Auth.

**RBAC:**
- Leitura (`GET`): qualquer usuário autenticado (`admin` ou `vendedor`).
- Mutações (`POST`, `PUT`, `PATCH`): restrito ao papel `admin`.

### 3.3. Integração com MS Categorias (Grupo 5)

O MS Categorias usa **IDs numéricos** (Long, auto-incremento). Um produto
referencia uma única categoria via `categoriaId`.

A validação cross-service é feita via HTTP (`app/clients/categoria_client.py`),
chamando `GET /categorias/{id}` no MS Categorias, repassando o JWT do usuário
(token relay). A validação é **fail-open**: se o serviço estiver indisponível,
o produto é criado normalmente. A validação só bloqueia quando o MS Categorias
confirma (HTTP 404) que a categoria não existe.

Formato do ID é validado localmente (`int(categoriaId)`) antes da chamada HTTP —
IDs não-numéricos são rejeitados imediatamente com 400.

### 3.4. Integração com MS Fornecedores (Grupo It Girls)

O MS Fornecedores usa **UUIDs**. A validação cross-service segue o mesmo
padrão fail-open do MS Categorias (`app/clients/supplier_client.py`),
chamando `GET /suppliers/{id}`.

### 3.5. Modelo de domínio — Produtos, Variantes e Tamanhos

O domínio é composto por três entidades:

- **Product**: dados do produto (nome, descrição, marca, preço, categoriaId,
  fornecedorId, ativo).
- **Size**: cadastro de tamanhos disponíveis (P, M, G, GG, XGG, etc.).
- **Variant** (Item de Grade): combinação de produto + tamanho + cor + SKU único.
  Cada variante representa um item específico do estoque.

Relacionamentos:
- Product 1:N Variant (um produto pode ter múltiplas variantes).
- Size 1:N Variant (um tamanho pode ser usado em múltiplas variantes).
- Variant tem SKU unique (identificador único global).

### 3.6. Criação atômica de produto com variantes

`POST /products` aceita um campo opcional `variantes` que cria as variantes
na mesma transação. As validações são idênticas à rota dedicada
(`POST /products/{id}/variants`): tamanhoId existente, SKU único (inclusive
dentro do mesmo payload). Se qualquer validação falhar, a transação inteira
é revertida — nenhum produto nem variante é persistido.

### 3.7. Cascade disable (soft delete)

Ao desativar um produto (`PATCH /products/{id}/disable`), todas as suas
variantes são desativadas automaticamente na mesma transação. Isso garante
consistência: um produto inativo não pode ter variantes ativas.

### 3.8. Tratamento de erros de integridade

Toda escrita no banco é protegida contra `IntegrityError` (ex.: SKU duplicado
por corrida entre requisições concorrentes). Os services tratam o erro
localmente, convertendo para `409 Conflict`. Como rede de segurança,
`main.py` registra um `exception_handler` global para `IntegrityError`.

## 4. FLUXO GERAL

```
MFE Product (porta 4002)
    → [JWT no header Authorization]
    → MS Product (porta 3002)
        → valida JWT localmente (HS256 + JWT_SECRET compartilhado)
        → checa RBAC (admin para escrita)
        → [se categoriaId presente] → GET /categorias/{id} no MS Categorias (porta 3004)
        → [se fornecedorId presente] → GET /suppliers/{id} no MS Fornecedores (porta 3003)
        → persiste no PostgreSQL (banco plus_product)
        → retorna resposta ao MFE
```

## 5. TECNOLOGIAS ADOTADAS

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | Python 3.12 |
| Framework web | FastAPI |
| ORM | SQLAlchemy |
| Banco (prod) | PostgreSQL 15 (via Ministack/RDS) |
| Banco (dev/test) | SQLite em memória |
| JWT | python-jose (HS256) |
| HTTP client | httpx (validação cross-service) |
| Validação | Pydantic v2 |
| Testes | Pytest (46 testes unitários) |
| Container | Docker |
| CI/CD | GitHub Actions |
| MFE | React 18 + TypeScript + MUI 9 + Vite 5 + Module Federation |

## 6. ENDPOINTS (RESUMO)

### Produtos (`/products`)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/products` | admin | Criar produto (com variantes opcionais) |
| GET | `/products` | auth | Listar produtos paginado |
| GET | `/products/search` | auth | Buscar com filtros (nome, cor, tamanho, preço, categoria, fornecedor) |
| GET | `/products/{id}` | auth | Detalhe com variantes aninhadas |
| PUT | `/products/{id}` | admin | Atualizar produto |
| PATCH | `/products/{id}/disable` | admin | Desativar (cascade para variantes) |

### Variantes (`/variants`)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/products/{id}/variants` | admin | Criar variante |
| GET | `/products/{id}/variants` | auth | Listar variantes do produto |
| GET | `/variants/{id}` | auth | Buscar variante por ID |
| PUT | `/variants/{id}` | admin | Atualizar variante |
| PATCH | `/variants/{id}/disable` | admin | Desativar variante |

### Tamanhos (`/sizes`)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/sizes` | admin | Criar tamanho |
| GET | `/sizes` | auth | Listar tamanhos |
| GET | `/sizes/{id}` | auth | Buscar tamanho |
| PUT | `/sizes/{id}` | admin | Atualizar tamanho |
| PATCH | `/sizes/{id}/disable` | admin | Desativar tamanho |

## 7. TRADE-OFFS

### 7.1. VANTAGENS

- **Clean Architecture**: separação clara entre regras de negócio (services),
  acesso a dados (repositories) e interface HTTP (controllers). Facilita
  testes unitários e manutenção.

- **Validação de JWT stateless**: nenhuma chamada de rede ao MS Auth por
  requisição, reduzindo latência e evitando acoplamento de disponibilidade.

- **RBAC consistente**: mesma regra (`admin` escreve, qualquer autenticado lê)
  aplicada no MS Produto, MS Categorias e MS Fornecedores.

- **Acoplamento fraco com outros serviços**: sem foreign keys físicas entre
  bancos. A validação cross-service é fail-open, preservando a
  independência de deploy de cada serviço.

- **Criação atômica de produto+variantes**: transação única garante que o
  produto e suas variantes sejam criados ou revertidos juntos.

### 7.2. DESVANTAGENS/RISCOS

- **Duplicação de segredo JWT**: o `JWT_SECRET` existe em todos os
  microsserviços. Rotação do segredo exige atualização coordenada.

- **Validação cross-service fail-open**: se o MS Categorias estiver fora do
  ar, é possível criar produtos com `categoriaId` inválido. A consistência
  entre serviços é eventual, não imediata.

- **Sem invalidação centralizada de tokens**: tokens comprometidos continuam
  válidos até expirar — não há blacklist compartilhada.

## 8. MAPEAMENTO DE SERVIÇOS

| Microsserviço | Responsabilidade | Relação com Produto |
|--------------|-----------------|---------------------|
| MS Auth | Emite JWT, gerencia usuários | Produto valida JWT localmente |
| MS Categorias (Grupo 5) | CRUD de categorias hierárquicas | Produto valida categoriaId via HTTP |
| MS Fornecedores (It Girls) | CRUD de fornecedores | Produto valida fornecedorId via HTTP |
| MS Estoque (Grupo 16) | Controle de entradas/saídas | Consome variantes (itemDeGradeId) |
| MS Pedidos (Grupo 8) | Pedidos de venda | Consome produtos e variantes |
| MS Consulta (Grupo 67) | Busca rápida para vendedores | Consome endpoints de busca |
| MS Mídia (Grupo 9) | Imagens de produtos | Integração futura |
| MS Alertas (Grupo 12) | Alertas de estoque baixo | Consome dados via MS Estoque |
| MS Relatórios (Grupo 23) | Analytics de vendas | Consome dados de múltiplos serviços |

## 9. HISTÓRICO DE REVISÕES

| Data | Autor | Descrição |
|------|-------|-----------|
| 2026-05-13 | Grupo 7 | Versão inicial (T1) — CRUD básico de produtos |
| 2026-06-24 | Grupo 7 | T2 — Clean Architecture, variantes, tamanhos, integrações cross-service |
