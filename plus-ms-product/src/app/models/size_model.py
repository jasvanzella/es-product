import uuid
from sqlalchemy import Column, String, Boolean, DateTime, func
from app.database.connection import Base


class SizeModel(Base):
    __tablename__ = "sizes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    nome = Column(String(10), nullable=False, unique=True)
    descricao = Column(String(500), nullable=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now())
