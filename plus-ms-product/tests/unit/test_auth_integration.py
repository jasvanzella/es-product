"""
Testes unitários focados na integração com o MS Auth (JWT) e RBAC, além da
validação de categoriaId contra dados mockados.
"""
import os

import pytest
from fastapi.testclient import TestClient
from jose import jwt

from app.config.security import ALGORITHM, get_bearer_token, get_current_user
from app.config.settings import settings
from app.database.connection import Base, get_db
from main import app
from tests.unit.conftest import (
    FAKE_ADMIN_PAYLOAD,
    TestingSessionLocal,
    engine,
)


def _make_token(role: str = "admin", **extra_claims) -> str:
    payload = {"sub": "user@plus.com", "user_id": "user-1", "role": role, **extra_claims}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)


@pytest.fixture()
def raw_client():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()

    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    session.close()
    Base.metadata.drop_all(bind=engine)


# ----------------------------------------------------------------------
# 1. Nenhuma rota deve responder sem autenticação
# ----------------------------------------------------------------------
def test_list_products_without_token_returns_401(raw_client):
    response = raw_client.get("/products")
    assert response.status_code == 401


def test_create_product_without_token_returns_401(raw_client):
    response = raw_client.post("/products", json={"nome": "X", "preco": 10.0})
    assert response.status_code == 401


def test_request_with_invalid_token_returns_401(raw_client):
    response = raw_client.get(
        "/products", headers={"Authorization": "Bearer token-invalido-e-mal-formado"}
    )
    assert response.status_code == 401


# ----------------------------------------------------------------------
# 2. RBAC
# ----------------------------------------------------------------------
def test_vendedor_can_read_products(raw_client):
    token = _make_token(role="vendedor")
    response = raw_client.get("/products", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


def test_vendedor_cannot_create_product_returns_403(raw_client):
    token = _make_token(role="vendedor")
    response = raw_client.post(
        "/products",
        json={"nome": "Produto Vendedor", "preco": 10.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_admin_can_create_product(raw_client):
    token = _make_token(role="admin")
    response = raw_client.post(
        "/products",
        json={"nome": "Produto Admin", "preco": 10.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201


def test_user_without_role_claim_cannot_create_product(raw_client):
    payload_without_role = {"sub": "user@plus.com", "user_id": "user-1"}
    token = jwt.encode(payload_without_role, settings.JWT_SECRET, algorithm=ALGORITHM)

    response = raw_client.post(
        "/products",
        json={"nome": "Sem Role", "preco": 10.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


# ----------------------------------------------------------------------
# 3. Validação de categoriaId contra dados mockados
# ----------------------------------------------------------------------
def test_create_product_with_valid_categoria_id(client):
    response = client.post(
        "/products", json={"nome": "Vestido", "preco": 10.0, "categoriaId": "1"}
    )
    assert response.status_code == 201


def test_create_product_with_invalid_categoria_id_returns_400(client):
    response = client.post(
        "/products", json={"nome": "Vestido", "preco": 10.0, "categoriaId": "999"}
    )
    assert response.status_code == 400


def test_create_product_without_categoria_id_succeeds(client):
    response = client.post(
        "/products", json={"nome": "Vestido", "preco": 10.0}
    )
    assert response.status_code == 201


def test_create_product_with_valid_fornecedor_id(client):
    response = client.post(
        "/products",
        json={
            "nome": "Vestido",
            "preco": 10.0,
            "fornecedorId": "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
        },
    )
    assert response.status_code == 201


def test_create_product_with_invalid_fornecedor_id_returns_400(client):
    response = client.post(
        "/products",
        json={
            "nome": "Vestido",
            "preco": 10.0,
            "fornecedorId": "id-que-nao-existe",
        },
    )
    assert response.status_code == 400
