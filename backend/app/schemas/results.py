import uuid
from pydantic import BaseModel

class JambManualEntry(BaseModel):
    registration_no: str | None = None
    year: int
    total_score: int
    subject_scores: dict[str, int]  # {"English": 67, "Mathematics": 72, ...}
    first_choice_university: str | None = None
    first_choice_course: str | None = None

class JambResultOut(BaseModel):
    id: uuid.UUID
    year: int
    total_score: int
    subject_scores: dict
    parse_status: str

    class Config:
        from_attributes = True

class WaecManualEntry(BaseModel):
    exam_number: str | None = None
    exam_year: int
    exam_type: str = "WASSCE"
    grades: dict[str, str]  # {"Mathematics": "A1", "English Language": "B2", ...}

class WaecResultOut(BaseModel):
    id: uuid.UUID
    exam_year: int
    exam_type: str
    grades: dict
    parse_status: str

    class Config:
        from_attributes = True
