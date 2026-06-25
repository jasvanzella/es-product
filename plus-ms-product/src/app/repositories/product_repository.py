import math
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from app.models.product_model import ProductModel
from app.models.variant_model import VariantModel
from app.models.size_model import SizeModel


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **fields) -> ProductModel:
        product = ProductModel(**fields, ativo=True)
        self.db.add(product)
        self.db.flush()
        return product

    def find_by_id(self, product_id: str) -> Optional[ProductModel]:
        return self.db.query(ProductModel).filter(ProductModel.id == product_id).first()

    def list_paginated(
        self, page: int, page_size: int, ativo: bool = True
    ) -> Tuple[List[ProductModel], int, int]:
        offset = (page - 1) * page_size
        query = self.db.query(ProductModel).filter(ProductModel.ativo == ativo)
        total_items = query.count()
        products = query.offset(offset).limit(page_size).all()
        total_pages = math.ceil(total_items / page_size) if total_items > 0 else 0
        return products, total_items, total_pages

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
    ) -> Tuple[List[ProductModel], int, int]:
        offset = (page - 1) * page_size
        query = self.db.query(ProductModel)

        if nome:
            query = query.filter(
                (ProductModel.nome.ilike(f"%{nome}%"))
                | (ProductModel.descricao.ilike(f"%{nome}%"))
            )
        if marca:
            query = query.filter(ProductModel.marca.ilike(f"%{marca}%"))
        if categoria_id:
            query = query.filter(ProductModel.categoria_id == categoria_id)
        if fornecedor_id:
            query = query.filter(ProductModel.fornecedor_id == fornecedor_id)
        if preco_min is not None:
            query = query.filter(ProductModel.preco >= preco_min)
        if preco_max is not None:
            query = query.filter(ProductModel.preco <= preco_max)

        if cor or tamanho:
            query = query.join(VariantModel, VariantModel.produto_id == ProductModel.id)
            if cor:
                query = query.filter(VariantModel.cor.ilike(f"%{cor}%"))
            if tamanho:
                query = query.join(SizeModel, SizeModel.id == VariantModel.tamanho_id)
                query = query.filter(SizeModel.nome.ilike(f"%{tamanho}%"))

        query = query.distinct()
        total_items = query.count()
        products = query.offset(offset).limit(page_size).all()
        total_pages = math.ceil(total_items / page_size) if total_items > 0 else 0
        return products, total_items, total_pages

    def update(self, product: ProductModel, **fields) -> ProductModel:
        for key, value in fields.items():
            if value is not None:
                setattr(product, key, value)
        self.db.flush()
        return product

    def disable(self, product: ProductModel) -> None:
        product.ativo = False
        self.db.flush()
