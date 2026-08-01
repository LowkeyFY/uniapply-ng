import uuid
from pydantic import BaseModel

class EligibilityCheckRequest(BaseModel):
    jamb_score: int
    waec_grades: dict[str, str]  # {"Mathematics": "A1", "English Language": "B2", ...}
    preferred_state: int | None = None  # state_id, optional
    preferred_course: str | None = None  # course name, optional

class EligibilityResult(BaseModel):
    university_id: uuid.UUID
    university_name: str
    course_id: uuid.UUID
    course_name: str
    jamb_cutoff: int
    margin: int
    waec_match: int
    eligible: bool

class NoJambRequest(BaseModel):
    waec_grades: dict[str, str]
    preferred_course: str

class NoJambResult(BaseModel):
    university_id: uuid.UUID
    university_name: str
    course_id: uuid.UUID
    course_name: str
    jamb_cutoff: int
    waec_match: int
