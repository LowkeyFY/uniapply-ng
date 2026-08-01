from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "UniApply NG"

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    database_url: str

    # Backblaze B2 Settings
    b2_bucket_name: str
    b2_endpoint_url: str
    b2_access_key_id: str
    b2_secret_access_key: str

    class Config:
        env_file = ".env"


settings = Settings()
