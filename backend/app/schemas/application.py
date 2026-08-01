import uuid
from datetime import datetime
from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    university_id: uuid.UUID
    course_id: uuid.UUID
    jamb_result_id: uuid.UUID | None = None
    waec_result_id: uuid.UUID | None = None

class ApplicationOut(BaseModel):
    id: uuid.UUID
    university_id: uuid.UUID
    course_id: uuid.UUID
    status: str
    submitted_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationDetailOut(ApplicationOut):
    university_name: str
    course_name: str
