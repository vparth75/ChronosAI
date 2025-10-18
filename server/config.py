# File: config.py
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# CRITICAL: Load the.env file to populate environment variables 
load_dotenv() 

DEFAULT_CONTEXT_MAX_TOKENS = 600 

class Settings(BaseSettings):
    """
    Configuration settings loaded securely from environment variables.
    """
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- External API Keys ---
    GEMINI_API_KEY: SecretStr = Field(..., description="API key for the Gemini LLM service.")
    GOOGLE_CSE_API_KEY: SecretStr = Field(..., description="API key for the Google Custom Search Engine.")
    GOOGLE_CSE_CX_ID: str = Field(..., description="Custom Search Engine ID (CX ID).")
    
    # --- Application Security Key ---
    API_KEY_SECRET: SecretStr = Field(..., description="The shared secret key for X-API-Key authentication.")
    
    # --- Performance/Cost Parameter ---
    CONTEXT_MAX_TOKENS: int = Field(
        DEFAULT_CONTEXT_MAX_TOKENS,
        description="Maximum allowed token size for the RAG context passed to the LLM."
    )

_settings = Settings()

def get_settings() -> Settings:
    """Returns the singleton configuration settings instance."""
    return _settings