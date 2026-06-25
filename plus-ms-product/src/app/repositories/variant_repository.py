from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.variant_model import VariantModel


class VariantRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, produto_id: str, tamanho_id: str, cor: str, sku: str) -> VariantModel:
        variant = VariantModel(
            produto_id=produto_id,
            tamanho_id=tamanho_id,
            cor=cor,
            sku=sku,
            ativo=True,
        )
        self.db.add(variant)
        self.db.flush()
        return variant

    def find_by_id(self, variant_id: str) -> Optional[VariantModel]:
        return self.db.query(VariantModel).filter(VariantModel.id == variant_id).first()

    def find_by_product_id(self, product_id: str) -> List[VariantModel]:
        return (
            self.db.query(VariantModel)
            .filter(VariantModel.produto_id == product_id)
            .all()
        )

    def find_by_sku(self, sku: str) -> Optional[VariantModel]:
        return self.db.query(VariantModel).filter(VariantModel.sku == sku).first()

    def update(self, variant: VariantModel, **fields) -> VariantModel:
        for key, value in fields.items():
            if value is not None:
                setattr(variant, key, value)
        self.db.flush()
        return variant

    def disable(self, variant: VariantModel) -> None:
        variant.ativo = False
        self.db.flush()

    def disable_by_product_id(self, product_id: str) -> None:
        self.db.query(VariantModel).filter(
            VariantModel.produto_id == product_id
        ).update({"ativo": False})
        self.db.flush()
