from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.repositories.size_repository import SizeRepository
from app.dtos.size_dtos import SizeCreateRequest, SizeUpdateRequest, SizeResponse


class SizeService:
    def __init__(self, db: Session):
        self.repo = SizeRepository(db)
        self.db = db

    def create(self, data: SizeCreateRequest) -> SizeResponse:
        try:
            size = self.repo.create(nome=data.nome, descricao=data.descricao)
            self.db.commit()
            self.db.refresh(size)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Tamanho '{data.nome}' já existe.",
            )
        return SizeResponse.model_validate(size)

    def list_all(self, ativo: bool = True) -> List[SizeResponse]:
        sizes = self.repo.find_all(ativo=ativo)
        return [SizeResponse.model_validate(s) for s in sizes]

    def get_by_id(self, size_id: str) -> SizeResponse:
        size = self.repo.find_by_id(size_id)
        if not size:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tamanho não encontrado",
            )
        return SizeResponse.model_validate(size)

    def update(self, size_id: str, data: SizeUpdateRequest) -> SizeResponse:
        size = self.repo.find_by_id(size_id)
        if not size:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tamanho não encontrado",
            )
        try:
            self.repo.update(size, nome=data.nome, descricao=data.descricao)
            self.db.commit()
            self.db.refresh(size)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Tamanho '{data.nome}' já existe.",
            )
        return SizeResponse.model_validate(size)

    def disable(self, size_id: str) -> None:
        size = self.repo.find_by_id(size_id)
        if not size:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tamanho não encontrado",
            )
        self.repo.disable(size)
        self.db.commit()
