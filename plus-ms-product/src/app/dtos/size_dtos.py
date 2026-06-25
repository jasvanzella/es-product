from pydantic import Field
from typing import Optional
from datetime import datetime
from app.dtos.product_dtos import BaseDTO


class SizeCreateRequest(BaseDTO):
    nome: str = Field(..., min_length=1, max_length=10)
    descricao: Optional[str] = Field(None, max_length=500)


class SizeUpdateRequest(BaseDTO):
    nome: Optional[str] = Field(None, min_length=1, max_length=10)
    descricao: Optional[str] = Field(None, max_length=500)


class SizeResponse(BaseDTO):
    id: str
    nome: str
    descricao: Optional[str] = None
    ativo: bool
