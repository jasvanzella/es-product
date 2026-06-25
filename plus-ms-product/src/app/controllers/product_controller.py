from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.config.security import get_bearer_token, get_current_user, require_admin
from app.database.connection import get_db
from app.services.product_service import ProductService
from app.dtos.product_dtos import (
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductResponse,
    ProductDetailResponse,
    PaginatedProductResponse,
    MessageResponse,
)

router = APIRouter(prefix="/products", tags=["Produtos"])


def _get_service(db: Session = Depends(get_db)) -> ProductService:
    return ProductService(db)


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    data: ProductCreateRequest,
    service: ProductService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
    bearer_token: str = Depends(get_bearer_token),
):
    return service.create(data, bearer_token)


@router.get("", response_model=PaginatedProductResponse)
def list_products(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    ativo: bool = Query(True),
    service: ProductService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.list_products(page, pageSize, ativo)


@router.get("/search", response_model=PaginatedProductResponse)
def search_products(
    nome: str = Query(None),
    categoriaId: str = Query(None),
    fornecedorId: str = Query(None),
    marca: str = Query(None),
    cor: str = Query(None),
    tamanho: str = Query(None),
    precoMin: float = Query(None),
    precoMax: float = Query(None),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    service: ProductService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.search(
        page=page,
        page_size=pageSize,
        nome=nome,
        marca=marca,
        categoria_id=categoriaId,
        fornecedor_id=fornecedorId,
        preco_min=precoMin,
        preco_max=precoMax,
        cor=cor,
        tamanho=tamanho,
    )


@router.get("/{id}", response_model=ProductDetailResponse)
def get_product_by_id(
    id: str,
    service: ProductService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.get_by_id(id)


@router.put("/{id}", response_model=ProductResponse)
def update_product(
    id: str,
    data: ProductUpdateRequest,
    service: ProductService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
    bearer_token: str = Depends(get_bearer_token),
):
    return service.update(id, data, bearer_token)


@router.patch("/{id}/disable", response_model=MessageResponse)
def disable_product(
    id: str,
    service: ProductService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    service.disable(id)
    return MessageResponse(message="Produto desativado com sucesso")
