from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.size_model import SizeModel


class SizeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, nome: str, descricao: Optional[str] = None) -> SizeModel:
        size = SizeModel(nome=nome, descricao=descricao, ativo=True)
        self.db.add(size)
        self.db.flush()
        return size

    def find_by_id(self, size_id: str) -> Optional[SizeModel]:
        return self.db.query(SizeModel).filter(SizeModel.id == size_id).first()

    def find_all(self, ativo: bool = True) -> List[SizeModel]:
        return self.db.query(SizeModel).filter(SizeModel.ativo == ativo).all()

    def update(self, size: SizeModel, **fields) -> SizeModel:
        for key, value in fields.items():
            if value is not None:
                setattr(size, key, value)
        self.db.flush()
        return size

    def disable(self, size: SizeModel) -> None:
        size.ativo = False
        self.db.flush()
