from typing import List
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.repositories.variant_repository import VariantRepository
from app.repositories.size_repository import SizeRepository
from app.repositories.product_repository import ProductRepository
from app.dtos.variant_dtos import (
    VariantCreateRequest,
    VariantUpdateRequest,
    VariantResponse,
)


class VariantService:
    def __init__(self, db: Session):
        self.variant_repo = VariantRepository(db)
        self.size_repo = SizeRepository(db)
        self.product_repo = ProductRepository(db)
        self.db = db

    def _validate_size(self, tamanho_id: str) -> None:
        size = self.size_repo.find_by_id(tamanho_id)
        if not size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"tamanhoId '{tamanho_id}' não corresponde a um tamanho existente",
            )

    def _validate_product(self, product_id: str) -> None:
        product = self.product_repo.find_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto não encontrado",
            )

    def create(self, product_id: str, data: VariantCreateRequest) -> VariantResponse:
        self._validate_product(product_id)
        self._validate_size(data.tamanhoId)

        try:
            variant = self.variant_repo.create(
                produto_id=product_id,
                tamanho_id=data.tamanhoId,
                cor=data.cor,
                sku=data.sku,
            )
            self.db.commit()
            self.db.refresh(variant)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{data.sku}' já existe.",
            )
        return VariantResponse.model_validate(variant)

    def list_by_product(self, product_id: str) -> List[VariantResponse]:
        self._validate_product(product_id)
        variants = self.variant_repo.find_by_product_id(product_id)
        return [VariantResponse.model_validate(v) for v in variants]

    def get_by_id(self, variant_id: str) -> VariantResponse:
        variant = self.variant_repo.find_by_id(variant_id)
        if not variant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Variante não encontrada",
            )
        return VariantResponse.model_validate(variant)

    def update(self, variant_id: str, data: VariantUpdateRequest) -> VariantResponse:
        variant = self.variant_repo.find_by_id(variant_id)
        if not variant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Variante não encontrada",
            )

        if data.tamanhoId is not None:
            self._validate_size(data.tamanhoId)

        update_fields = {}
        if data.tamanhoId is not None:
            update_fields["tamanho_id"] = data.tamanhoId
        if data.cor is not None:
            update_fields["cor"] = data.cor
        if data.sku is not None:
            update_fields["sku"] = data.sku

        try:
            self.variant_repo.update(variant, **update_fields)
            self.db.commit()
            self.db.refresh(variant)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"SKU '{data.sku}' já existe.",
            )
        return VariantResponse.model_validate(variant)

    def disable(self, variant_id: str) -> None:
        variant = self.variant_repo.find_by_id(variant_id)
        if not variant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Variante não encontrada",
            )
        self.variant_repo.disable(variant)
        self.db.commit()
