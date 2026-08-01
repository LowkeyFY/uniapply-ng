import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, func, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(300), nullable=False)
    jamb_subject_combo = Column(ARRAY(String))
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("faculties.id"))

class UniversityCourse(Base):
    __tablename__ = "university_courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"))
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"))
    jamb_cutoff = Column(Integer, nullable=False)
    waec_requirements = Column(JSONB)
    duration_years = Column(Integer)
    degree_type = Column(String(50))
    is_available = Column(Boolean, default=True)
    last_updated = Column(DateTime, server_default=func.now())
