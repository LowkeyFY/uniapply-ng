import uuid
from pydantic import BaseModel

class StateOut(BaseModel):
    id: int
    name: str
    code: str

    class Config:
        from_attributes = True

class UniversityOut(BaseModel):
    id: uuid.UUID
    name: str
    abbreviation: str | None
    type: str | None
    state_id: int | None
    established_year: int | None
    is_active: bool

    class Config:
        from_attributes = True

class CourseWithCutoffOut(BaseModel):
    course_id: uuid.UUID
    course_name: str
    jamb_cutoff: int
    degree_type: str | None
    duration_years: int | None
    waec_requirements: dict | None

    class Config:
        from_attributes = True
