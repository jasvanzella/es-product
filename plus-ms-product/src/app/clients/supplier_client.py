import logging
from typing import Optional

logger = logging.getLogger(__name__)

MOCK_SUPPLIERS = {
    "f1e2d3c4-b5a6-7890-abcd-ef1234567890": {"id": "f1e2d3c4-b5a6-7890-abcd-ef1234567890", "legalName": "PlusWear Confecções", "status": "active"},
    "a9b8c7d6-e5f4-3210-fedc-ba0987654321": {"id": "a9b8c7d6-e5f4-3210-fedc-ba0987654321", "legalName": "Bella Moda Plus", "status": "active"},
    "11112222-3333-4444-5555-666677778888": {"id": "11112222-3333-4444-5555-666677778888", "legalName": "Atelier Grandeza", "status": "active"},
}


def supplier_exists(supplier_id: str, bearer_token: Optional[str] = None) -> Optional[bool]:
    if not supplier_id:
        return None
    return supplier_id in MOCK_SUPPLIERS
