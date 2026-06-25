from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from app.database.connection import engine, Base
from app.controllers.product_controller import router as product_router
from app.controllers.size_controller import router as size_router
from app.controllers.variant_controller import (
    product_variant_router,
    variant_router,
)
from app.models.product_model import *
from app.models.size_model import *
from app.models.variant_model import *

app = FastAPI(
    title="Plus Gestão — Microsserviço de Produto",
    description="API do microsserviço de Produto do sistema Plus Gestão (vestuário plus size).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(IntegrityError)
def handle_integrity_error(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": "Conflito de integridade de dados (registro duplicado ou referência inválida)."},
    )


@app.get("/")
def root():
    return {"message": "Product Microservice is running !!!"}


Base.metadata.create_all(bind=engine)

app.include_router(product_router)
app.include_router(size_router)
app.include_router(product_variant_router)
app.include_router(variant_router)
