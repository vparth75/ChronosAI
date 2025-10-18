# File: config.py
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# CRITICAL: Load the.env file to populate environment variables 
load_dotenv() 

class Settings(BaseSettings):
    """
    Configuration settings loaded securely from environment variables.
    """
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # --- External API Keys ---
    GEMINI_API_KEY: SecretStr = Field(..., description="API key for the Gemini LLM service.")
    
    # --- Application Security Key ---
    API_KEY_SECRET: SecretStr = Field(..., description="The shared secret key for X-API-Key authentication.")

_settings = Settings()

def get_settings() -> Settings:
    """Returns the singleton configuration settings instance."""
    return _settings