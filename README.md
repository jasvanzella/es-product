Trabalho 2 de ES2, Grupo 7

Integrantes: Jasmine Vanzella, Julia Fernandes, Luiza Rosito, Murilo Souza e Rafael Madeira

# Plus Gestão — Microsserviço e Microfrontend de Produto

Sistema de gestão de estoque para loja de roupas plus size, desenvolvido como projeto da disciplina de Engenharia de Software II (PUCRS, Turma 30, 2026/1).

Este repositório contém o **domínio de Produto** (Grupo 7): microsserviço, microfrontend e infraestrutura para desenvolvimento local.

## Estrutura do Repositório

```
es-product/
├── plus-ms-product/       Microsserviço de Produto (Python/FastAPI)
├── plus-mfe-product/      Microfrontend de Produto (React/TypeScript/MUI)
├── plus-ms-auth/          Microsserviço de Autenticação (Python/FastAPI)
├── plus-mfe-auth/         Microfrontend de Autenticação (React/TypeScript/MUI)
├── plus-ms-categorias/    Microsserviço de Categorias (Java/Spring Boot)
├── chave-ms-supplier/     Microsserviço de Fornecedores (Node.js/TypeScript)
├── plus-shell/            Shell App — orquestra os microfrontends
└── plus-infra/            Docker Compose + Terraform (Ministack)
```

## Domínio de Produto (Grupo 7)

Responsável pelo cadastro e gerenciamento do catálogo de produtos da loja, incluindo:

- CRUD de produtos com nome, descrição, marca, preço, categoria e fornecedor
- Cadastro de variações de cor e grade de tamanhos (variantes/itens de grade)
- Busca com filtros combinados (nome, cor, tamanho, preço, categoria, fornecedor)
- Consulta de produtos pelos demais serviços dependentes (Estoque, Pedidos, Consulta)

### Arquitetura

O microsserviço segue **Clean Architecture** (hexagonal):

```
Controllers (HTTP)  →  Services (regras de negócio)  →  Repositories (acesso a dados)
```

### Tecnologias

| Componente | Stack |
|---|---|
| Microsserviço | Python 3.12, FastAPI, SQLAlchemy, PostgreSQL |
| Microfrontend | React 18, TypeScript, MUI 9, Vite 5, Module Federation |
| Autenticação | JWT HS256 (stateless, segredo compartilhado com MS Auth) |
| Infraestrutura | Docker, Ministack, Terraform |
| CI/CD | GitHub Actions |

### Integrações Cross-Service

| Serviço | Relação | Padrão |
|---|---|---|
| MS Auth | JWT validado localmente | Stateless |
| MS Categorias (Grupo 5) | Valida `categoriaId` via HTTP | Fail-open |
| MS Fornecedores (It Girls) | Valida `fornecedorId` via HTTP | Fail-open |
| MS Estoque (Grupo 16) | Consome variantes do produto | — |
| MS Pedidos (Grupo 8) | Consome produtos e variantes | — |
| MS Consulta (Grupo 67) | Consome endpoints de busca | — |

## Como Executar

### Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Python | 3.10+ |
| Node.js | 20+ |
| Docker | 24+ |

### Opção A — Serviços isolados (desenvolvimento)

**Microsserviço:**
```bash
cd plus-ms-product
python -m venv venv
# Windows: .\venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
cd src
uvicorn main:app --reload --port 3002
```

**Microfrontend:**
```bash
cd plus-mfe-product
npm install
npm run dev
```

| Serviço | URL |
|---|---|
| MS Product API | http://localhost:3002 |
| Swagger | http://localhost:3002/docs |
| MFE Product | http://localhost:4002 |

### Opção B — Stack completa (Docker Compose + Ministack)

```bash
cd plus-infra
# Configurar .env (ver README do plus-infra)
docker compose up -d --build
```

| Serviço | URL |
|---|---|
| Shell App | http://localhost:3000 |
| MS Auth | http://localhost:3001 |
| MS Product | http://localhost:3002 |
| MS Categorias | http://localhost:3004 |
| MS Fornecedores | http://localhost:3003 |
| MFE Auth | http://localhost:4001 |
| MFE Product | http://localhost:4002 |
| Ministack | http://localhost:4566 |

## Testes

```bash
cd plus-ms-product
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest
```

46 testes unitários cobrindo:
- CRUD de produtos (18 testes)
- CRUD de variantes (21 testes)
- Autenticação JWT e RBAC (12 testes)
- Validação cross-service de categoriaId

## Documentação

| Documento | Localização |
|---|---|
| ADR (Decisões Arquiteturais) | [plus-ms-product/ADR.md](plus-ms-product/ADR.md) |
| OpenAPI/Swagger (spec) | [plus-ms-product/openapi.yaml](plus-ms-product/openapi.yaml) |
| Swagger (interativo) | http://localhost:3002/docs |
| Manual de UI | [plus-mfe-product/Manual_UI.md](plus-mfe-product/Manual_UI.md) |
| README do Microsserviço | [plus-ms-product/README.md](plus-ms-product/README.md) |
| README do Microfrontend | [plus-mfe-product/README.md](plus-mfe-product/README.md) |
