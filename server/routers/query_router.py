# File: routers/query_router.py
from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import APIKeyHeader
from models import FragmentInput, ReconstructionReport, GroundingFailure, LLMSynthesisFailure
from services.chronos_service import ChronosService
from config import get_settings
from typing import List, Optional

router = APIRouter()

_chronos_service: Optional[ChronosService] = None


def set_chronos_service(service: ChronosService) -> None:
    """Configure the singleton ChronosService injected into route handlers."""
    global _chronos_service
    _chronos_service = service


def get_chronos_service() -> ChronosService:
    """Dependency accessor for the ChronosService singleton."""
    if _chronos_service is None:
        raise RuntimeError("ChronosService dependency has not been configured.")
    return _chronos_service


# --- Authentication Dependency ---
# API Key must be sent in the header 'X-API-Key'
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)


def authenticate_api_key(key: str = Security(api_key_header)):
    """Validates the provided API key against the secret in config."""
    settings = get_settings()
    if key != settings.API_KEY_SECRET.get_secret_value():
        # Returns 401 Unauthorized if key is invalid or missing
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid API Key"
        )
    return key


@router.post(
    "/reconstruct",
    response_model=ReconstructionReport,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(authenticate_api_key)]  # ✅ FIX: Correct dependency injection list
)
async def submit_query(
    request: FragmentInput,
    service: ChronosService = Depends(get_chronos_service)
):
    """
    Handles the user query, executes the constrained RAG pipeline, and returns the full report.
    """
    try:
        return await service.process_query(request.fragment_text)

    except GroundingFailure as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="External Service Failure (Grounding)"
        ) from e

    except LLMSynthesisFailure as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Synthesis Failure (LLM)"
        ) from e

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected internal error occurred."
        ) from e
