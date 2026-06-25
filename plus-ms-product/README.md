Trabalho 2 de ES2, Grupo 7

Integrantes: Jasmine Vanzella, Julia Fernandes, Luiza Rosito, Murilo Souza e Rafael Madeira

# plus-ms-product

Microsserviço de domínio **Produto** do sistema Plus Gestão — gestão de estoque para loja de roupas plus size.

Responsável pelo cadastro de produtos, grade de tamanhos, variações de cor/SKU e integração com os serviços de Categorias e Fornecedores.

## Arquitetura

O serviço segue **Clean Architecture** (inspirada no padrão hexagonal), com separação em camadas:

```
Controllers (HTTP/FastAPI)  →  Services (regras de negócio)  →  Repositories (acesso a dados)
```

Estrutura de diretórios:
```
src/app/
├── config/           Settings e segurança JWT/RBAC
├── database/         Engine e sessão SQLAlchemy
├── models/           ProductModel, VariantModel, SizeModel
├── dtos/             Request/Response (Pydantic)
├── repositories/     ProductRepository, VariantRepository, SizeRepository
├── services/         ProductService, VariantService, SizeService
├── clients/          CategoriaClient, SupplierClient (HTTP cross-service)
└── controllers/      ProductController, VariantController, SizeController
```

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Python 3.12 | Linguagem |
| FastAPI | Framework web |
| SQLAlchemy | ORM |
| PostgreSQL 15 | Banco de dados (produção) |
| SQLite | Banco de dados (dev/testes) |
| python-jose | Validação JWT (HS256) |
| httpx | Cliente HTTP cross-service |
| Pydantic v2 | Validação de dados |
| Pytest | Testes (46 testes unitários) |
| Docker | Containerização |
| GitHub Actions | CI/CD |

## Integrações Cross-Service

| Serviço | Endpoint consumido | Padrão |
|---|---|---|
| MS Auth | — (JWT validado localmente) | Stateless, segredo compartilhado |
| MS Categorias (Grupo 5) | `GET /categorias/{id}` | Fail-open, IDs numéricos |
| MS Fornecedores (It Girls) | `GET /suppliers/{id}` | Fail-open, IDs UUID |

## Endpoints

### Produtos (`/products`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/products` | admin | Criar produto (com variantes opcionais) |
| GET | `/products` | auth | Listar produtos (paginado) |
| GET | `/products/search` | auth | Buscar com filtros (nome, cor, tamanho, preço, categoria, fornecedor, marca) |
| GET | `/products/{id}` | auth | Detalhe do produto com variantes aninhadas |
| PUT | `/products/{id}` | admin | Atualizar produto |
| PATCH | `/products/{id}/disable` | admin | Desativar produto (cascade para variantes) |

### Variantes (`/variants`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/products/{id}/variants` | admin | Criar variante (cor + tamanho + SKU) |
| GET | `/products/{id}/variants` | auth | Listar variantes de um produto |
| GET | `/variants/{id}` | auth | Buscar variante por ID |
| PUT | `/variants/{id}` | admin | Atualizar variante |
| PATCH | `/variants/{id}/disable` | admin | Desativar variante |

### Tamanhos (`/sizes`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/sizes` | admin | Criar tamanho |
| GET | `/sizes` | auth | Listar tamanhos |
| GET | `/sizes/{id}` | auth | Buscar tamanho por ID |
| PUT | `/sizes/{id}` | admin | Atualizar tamanho |
| PATCH | `/sizes/{id}/disable` | admin | Desativar tamanho |

A documentação completa (parâmetros, exemplos, respostas) está no Swagger (`/docs`) e no arquivo `openapi.yaml`.

## Execução

### Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Python | 3.10+ |
| Docker | 24+ |
| Git | — |

### Opção A — Isolado (desenvolvimento)

Usa SQLite local, sem Docker.

```bash
git clone <url-deste-repositorio>
cd plus-ms-product
python -m venv venv
```

Ativar o venv:
```powershell
# Windows
.\venv\Scripts\activate
```
```bash
# Linux/Mac
source venv/bin/activate
```

Instalar e rodar:
```bash
pip install -r requirements.txt
cd src
uvicorn main:app --reload --port 3002
```

| Recurso | URL |
|---|---|
| API (raiz) | http://localhost:3002/ |
| Swagger | http://localhost:3002/docs |
| Redoc | http://localhost:3002/redoc |

> **Auth:** todas as rotas exigem JWT com `JWT_SECRET=dev-secret`. Sem o MS Auth, gere um token manualmente com `python-jose` (algoritmo HS256, claims: `sub`, `user_id`, `role`).

### Opção B — Integrado (Ministack)

Sobe o ecossistema via Docker Compose a partir do `plus-infra`.

1. Clone `plus-infra`, `plus-ms-auth`, `plus-mfe-auth` e `plus-shell` no mesmo nível.
2. Configure o `.env` no `plus-infra`:
```
DB_HOST=ministack-rds-plus-auth-db
DB_PORT=5432
DB_USER=plus
DB_PASSWORD=plus_secret
DB_NAME=plus_product
JWT_SECRET=dev-secret
MS_AUTH_PORT=3001
MS_PRODUCT_PORT=3002
SHELL_PORT=3000
MFE_AUTH_PORT=4001
```

3. Subir:
```bash
cd plus-infra
docker compose up -d --build
```

4. Acessar:

| Serviço | URL |
|---|---|
| plus-shell | http://localhost:3000 |
| plus-ms-auth | http://localhost:3001 |
| **plus-ms-product** | **http://localhost:3002** |
| **Swagger** | **http://localhost:3002/docs** |
| plus-mfe-auth | http://localhost:4001 |
| plus-mfe-product | http://localhost:4002 |

## Testes

### Unitários (sem Docker)
```bash
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest
```

### Funcionais (com Docker)
```bash
python -m pytest -c pytest-functional.ini
```

## CI/CD

Pipeline GitHub Actions (`.github/workflows/ci.yml`):
- **test**: roda testes unitários a cada push/PR na `main`
- **build-and-push**: builda imagem Docker e publica no Docker Hub (somente na `main`)
