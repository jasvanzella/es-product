from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.security import get_current_user, require_admin
from app.database.connection import get_db
from app.services.variant_service import VariantService
from app.dtos.variant_dtos import VariantCreateRequest, VariantUpdateRequest, VariantResponse
from app.dtos.product_dtos import MessageResponse

product_variant_router = APIRouter(prefix="/products", tags=["Variantes"])
variant_router = APIRouter(prefix="/variants", tags=["Variantes"])


def _get_service(db: Session = Depends(get_db)) -> VariantService:
    return VariantService(db)


@product_variant_router.post(
    "/{productId}/variants", response_model=VariantResponse, status_code=201
)
def create_variant(
    productId: str,
    data: VariantCreateRequest,
    service: VariantService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    return service.create(productId, data)


@product_variant_router.get(
    "/{productId}/variants", response_model=List[VariantResponse]
)
def list_variants_by_product(
    productId: str,
    service: VariantService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.list_by_product(productId)


@variant_router.get("/{id}", response_model=VariantResponse)
def get_variant_by_id(
    id: str,
    service: VariantService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.get_by_id(id)


@variant_router.put("/{id}", response_model=VariantResponse)
def update_variant(
    id: str,
    data: VariantUpdateRequest,
    service: VariantService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    return service.update(id, data)


@variant_router.patch("/{id}/disable", response_model=MessageResponse)
def disable_variant(
    id: str,
    service: VariantService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    service.disable(id)
    return MessageResponse(message="Variante desativada com sucesso")
