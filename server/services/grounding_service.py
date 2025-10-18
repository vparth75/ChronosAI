# File: services/grounding_service.py
import httpx
import asyncio
import time
from typing import List, Dict, Tuple
from models import SourceModel, GroundingFailure
from config import Settings

# Simple in-memory cache for repeated search queries
# Key: Query string, Value: Tuple of (List of SourceModel, context string)
_search_cache: Dict[str, Tuple[List[SourceModel], str]] = {}


class GroundingService:
    """
    Manages asynchronous interaction with the Custom Search Engine (CSE).
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        # Async HTTP client for external I/O
        self.http_client = httpx.AsyncClient(base_url="https://www.googleapis.com/customsearch/v1")

    async def get_grounding_context(self, keywords: List[str]) -> Tuple[List[SourceModel], str]:
        """
        Fetches context from CSE and prepares the prompt string.
        Returns: (List of SourceModel, formatted context string)
        """
        query_string = " ".join(keywords)

        # Check cache
        if query_string in _search_cache:
            return _search_cache[query_string]

        # Prepare request parameters
        params = {
            "key": self.settings.GOOGLE_CSE_API_KEY.get_secret_value(),
            "cx": self.settings.GOOGLE_CSE_CX_ID,
            "q": query_string,
            "num": 3,
        }

        raw_sources: List[SourceModel] = []

        # HTTP status codes indicating transient/retryable errors
        RETRYABLE_STATUSES = {408, 429, 500, 502, 503, 504}

        # Simple intelligent retry logic for transient errors
        for attempt in range(3):
            try:
                # Perform the asynchronous search API call
                response = await self.http_client.get(url="/", params=params, timeout=5.0)
                response.raise_for_status()
                data = response.json()

                if data.get("items"):
                    # Build list of SourceModel instances, filtering out items without link
                    raw_sources = [
                        SourceModel(
                            uri=item.get("link", ""),
                            title=item.get("title", ""),
                            snippet=item.get("snippet", ""),
                        )
                        for item in data["items"]
                        if item.get("link")
                    ]

                break  # Success, break retry loop

            except httpx.HTTPStatusError as e:
                if e.response.status_code in RETRYABLE_STATUSES and attempt < 2:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                    continue
                raise GroundingFailure(f"CSE API fatal error ({e.response.status_code}): {e}") from e

            except Exception as e:
                raise GroundingFailure(f"Failed to connect to CSE service: {str(e)}") from e

        # 2. Prepare Context String and Truncation (Cost Control)
        if not raw_sources:
            context_string = "CONTEXT: NO_CONTEXT_AVAILABLE"
            _search_cache[query_string] = (raw_sources, context_string)
            return raw_sources, context_string

        context_parts: List[str] = []
        for i, source in enumerate(raw_sources):
            context_parts.append(
                f"--- SOURCE {i+1} ---\n"
                f"URL: {source.uri}\n"
                f"Title: {source.title}\n"
                f"Snippet: {source.snippet}"
            )

        full_context = "\n\n".join(context_parts)

        # Apply cost control truncation
        max_chars = self.settings.CONTEXT_MAX_TOKENS * 4
        if len(full_context) > max_chars:
            truncated_context = full_context[:max_chars] + "\n\n... [Context truncated for cost control]"
        else:
            truncated_context = full_context

        final_context_string = f"CONTEXT:\n{truncated_context}"

        # Update cache
        _search_cache[query_string] = (raw_sources, final_context_string)
        return raw_sources, final_context_string
