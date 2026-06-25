from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.repositories.variant_repository import VariantRepository
from app.repositories.size_repository import SizeRepository
from app.clients import categoria_client, supplier_client
from app.dtos.product_dtos import (
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductResponse,
    ProductDetailResponse,
    PaginatedProductResponse,
)
from app.dtos.variant_dtos import VariantResponse


class ProductService:
    def __init__(self, db: Session):
        self.product_repo = ProductRepository(db)
        self.variant_repo = VariantRepository(db)
        self.size_repo = SizeRepository(db)
        self.db = db

    def _validate_categoria(self, categoria_id: Optional[str], bearer_token: Optional[str]) -> None:
        if not categoria_id:
            return
        exists = categoria_client.categoria_exists(categoria_id, bearer_token=bearer_token)
        if exists is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="categoriaId não corresponde a uma categoria existente",
            )

    def _validate_fornecedor(self, fornecedor_id: Optional[str], bearer_token: Optional[str]) -> None:
        if not fornecedor_id:
            return
        exists = supplier_client.supplier_exists(fornecedor_id, bearer_token=bearer_token)
        if exists is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="fornecedorId não corresponde a um fornecedor existente",
            )

    def create(self, data: ProductCreateRequest, bearer_token: Optional[str] = None) -> ProductResponse:
        self._validate_categoria(data.categoriaId, bearer_token)
        self._validate_fornecedor(data.fornecedorId, bearer_token)

        nested_variantes = data.variantes or []

        if nested_variantes:
            skus = [v.get("sku") if isinstance(v, dict) else v.sku for v in nested_variantes]
            if len(skus) != len(set(skus)):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="SKUs duplicados no payload.",
                )
            for v in nested_variantes:
                tamanho_id = v.get("tamanhoId") if isinstance(v, dict) else v.tamanhoId
                size = self.size_repo.find_by_id(tamanho_id)
                if not size:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"tamanhoId '{tamanho_id}' não corresponde a um tamanho existente",
                    )

        try:
            product = self.product_repo.create(
                nome=data.nome,
                descricao=data.descricao,
                marca=data.marca,
                preco=data.preco,
                categoria_id=data.categoriaId,
                fornecedor_id=data.fornecedorId,
            )

            for v in nested_variantes:
                if isinstance(v, dict):
                    tamanho_id, cor, sku = v["tamanhoId"], v["cor"], v["sku"]
                else:
                    tamanho_id, cor, sku = v.tamanhoId, v.cor, v.sku
                self.variant_repo.create(
                    produto_id=product.id,
                    tamanho_id=tamanho_id,
                    cor=cor,
                    sku=sku,
                )

            self.db.commit()
            self.db.refresh(product)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Conflito de integridade ao salvar o produto (ex.: SKU duplicado).",
            )

        return ProductResponse.model_validate(product)

    def list_products(self, page: int, page_size: int, ativo: bool = True) -> PaginatedProductResponse:
        products, total_items, total_pages = self.product_repo.list_paginated(page, page_size, ativo)
        return PaginatedProductResponse(
            items=[ProductResponse.model_validate(p) for p in products],
            page=page,
            pageSize=page_size,
            totalItems=total_items,
            totalPages=total_pages,
        )

    def search(
        self,
        page: int,
        page_size: int,
        nome: Optional[str] = None,
        marca: Optional[str] = None,
        categoria_id: Optional[str] = None,
        fornecedor_id: Optional[str] = None,
        preco_min: Optional[float] = None,
        preco_max: Optional[float] = None,
        cor: Optional[str] = None,
        tamanho: Optional[str] = None,
    ) -> PaginatedProductResponse:
        products, total_items, total_pages = self.product_repo.search(
            page=page,
            page_size=page_size,
            nome=nome,
            marca=marca,
            categoria_id=categoria_id,
            fornecedor_id=fornecedor_id,
            preco_min=preco_min,
            preco_max=preco_max,
            cor=cor,
            tamanho=tamanho,
        )
        return PaginatedProductResponse(
            items=[ProductResponse.model_validate(p) for p in products],
            page=page,
            pageSize=page_size,
            totalItems=total_items,
            totalPages=total_pages,
        )

    def get_by_id(self, product_id: str) -> ProductDetailResponse:
        product = self.product_repo.find_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto não encontrado",
            )
        variantes = [VariantResponse.model_validate(v) for v in product.variantes]
        resp = ProductDetailResponse.model_validate(product)
        resp.variantes = variantes
        return resp

    def update(
        self, product_id: str, data: ProductUpdateRequest, bearer_token: Optional[str] = None
    ) -> ProductResponse:
        product = self.product_repo.find_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto não encontrado",
            )

        if data.categoriaId is not None:
            self._validate_categoria(data.categoriaId, bearer_token)
        if data.fornecedorId is not None:
            self._validate_fornecedor(data.fornecedorId, bearer_token)

        update_fields = {}
        if data.nome is not None:
            update_fields["nome"] = data.nome
        if data.descricao is not None:
            update_fields["descricao"] = data.descricao
        if data.marca is not None:
            update_fields["marca"] = data.marca
        if data.preco is not None:
            update_fields["preco"] = data.preco
        if data.categoriaId is not None:
            update_fields["categoria_id"] = data.categoriaId
        if data.fornecedorId is not None:
            update_fields["fornecedor_id"] = data.fornecedorId

        try:
            self.product_repo.update(product, **update_fields)
            self.db.commit()
            self.db.refresh(product)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Conflito de integridade ao atualizar o produto.",
            )

        return ProductResponse.model_validate(product)

    def disable(self, product_id: str) -> None:
        product = self.product_repo.find_by_id(product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Produto não encontrado",
            )
        self.product_repo.disable(product)
        self.variant_repo.disable_by_product_id(product_id)
        self.db.commit()
