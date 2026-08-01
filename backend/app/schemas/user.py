import uuid
import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    state_of_origin: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdate(BaseModel):
    date_of_birth: datetime.date | None = None
    gender: str | None = None
    lga: str | None = None
    address: str | None = None


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    phone: str | None = None
    state_of_origin: str | None = None
    is_verified: bool
    date_of_birth: datetime.date | None = None
    gender: str | None = None
    lga: str | None = None
    address: str | None = None
    passport_url: str | None = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
