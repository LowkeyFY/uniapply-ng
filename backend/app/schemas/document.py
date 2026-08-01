import uuid
from pydantic import BaseModel

class DocumentOut(BaseModel):
    id: uuid.UUID
    document_type: str
    original_filename: str
    status: str

    class Config:
        from_attributes = True

