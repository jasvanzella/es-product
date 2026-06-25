from pydantic import Field
from typing import Optional
from datetime import datetime
from app.dtos.product_dtos import BaseDTO
from app.dtos.size_dtos import SizeResponse


class VariantCreateRequest(BaseDTO):
    tamanhoId: str = Field(..., alias="tamanhoId")
    cor: str = Field(..., max_length=50)
    sku: str = Field(..., max_length=50)


class NestedVariantCreate(BaseDTO):
    tamanhoId: str = Field(..., alias="tamanhoId")
    cor: str = Field(..., max_length=50)
    sku: str = Field(..., max_length=50)


class VariantUpdateRequest(BaseDTO):
    tamanhoId: Optional[str] = Field(None, alias="tamanhoId")
    cor: Optional[str] = Field(None, max_length=50)
    sku: Optional[str] = Field(None, max_length=50)


class VariantResponse(BaseDTO):
    id: str
    produtoId: str = Field(..., validation_alias="produto_id")
    tamanhoId: str = Field(..., validation_alias="tamanho_id")
    cor: str
    sku: str
    ativo: bool
    tamanho: Optional[SizeResponse] = None
