import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.connection import Base


class VariantModel(Base):
    __tablename__ = "variants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    produto_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    tamanho_id = Column(String, ForeignKey("sizes.id"), nullable=False)
    cor = Column(String(50), nullable=False)
    sku = Column(String(50), nullable=False, unique=True)
    ativo = Column(Boolean, default=True)
    criado_em = Column(DateTime, server_default=func.now())
    atualizado_em = Column(DateTime, server_default=func.now(), onupdate=func.now())

    produto = relationship("ProductModel", back_populates="variantes")
    tamanho = relationship("SizeModel", lazy="joined")
