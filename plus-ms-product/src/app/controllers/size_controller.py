from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.config.security import get_current_user, require_admin
from app.database.connection import get_db
from app.services.size_service import SizeService
from app.dtos.size_dtos import SizeCreateRequest, SizeUpdateRequest, SizeResponse
from app.dtos.product_dtos import MessageResponse

router = APIRouter(prefix="/sizes", tags=["Tamanhos"])


def _get_service(db: Session = Depends(get_db)) -> SizeService:
    return SizeService(db)


@router.post("", response_model=SizeResponse, status_code=201)
def create_size(
    data: SizeCreateRequest,
    service: SizeService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    return service.create(data)


@router.get("", response_model=List[SizeResponse])
def list_sizes(
    ativo: bool = Query(True),
    service: SizeService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.list_all(ativo)


@router.get("/{id}", response_model=SizeResponse)
def get_size_by_id(
    id: str,
    service: SizeService = Depends(_get_service),
    current_user: dict = Depends(get_current_user),
):
    return service.get_by_id(id)


@router.put("/{id}", response_model=SizeResponse)
def update_size(
    id: str,
    data: SizeUpdateRequest,
    service: SizeService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    return service.update(id, data)


@router.patch("/{id}/disable", response_model=MessageResponse)
def disable_size(
    id: str,
    service: SizeService = Depends(_get_service),
    current_user: dict = Depends(require_admin),
):
    service.disable(id)
    return MessageResponse(message="Tamanho desativado com sucesso")
