import logging
from typing import Optional

logger = logging.getLogger(__name__)

MOCK_CATEGORIAS = {
    "1": {"id": 1, "nome": "Camisetas", "ativo": True},
    "2": {"id": 2, "nome": "Calças", "ativo": True},
    "3": {"id": 3, "nome": "Vestidos", "ativo": True},
    "4": {"id": 4, "nome": "Acessórios", "ativo": True},
    "5": {"id": 5, "nome": "Blusas", "ativo": True},
    "6": {"id": 6, "nome": "Saias", "ativo": True},
    "7": {"id": 7, "nome": "Jaquetas", "ativo": True},
}


def categoria_exists(categoria_id: str, bearer_token: Optional[str] = None) -> Optional[bool]:
    if not categoria_id:
        return None
    return categoria_id in MOCK_CATEGORIAS
