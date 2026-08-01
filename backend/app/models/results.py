import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base

class JambResult(Base):
    __tablename__ = "jamb_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    registration_no = Column(String(50), unique=True)
    year = Column(Integer, nullable=False)
    total_score = Column(Integer, nullable=False)
    subject_scores = Column(JSONB, nullable=False)  # {"English": 67, "Mathematics": 72, ...}
    first_choice_university = Column(String(300))
    first_choice_course = Column(String(300))
    document_url = Column(String(500))
    parse_status = Column(String(20), default="manual")  # pending|success|failed|manual
    created_at = Column(DateTime, server_default=func.now())

class WaecResult(Base):
    __tablename__ = "waec_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    exam_number = Column(String(50))
    exam_year = Column(Integer, nullable=False)
    exam_type = Column(String(10), default="WASSCE")  # WASSCE | NECO | GCE
    grades = Column(JSONB, nullable=False)  # {"Mathematics": "A1", "English Language": "B2", ...}
    document_url = Column(String(500))
    parse_status = Column(String(20), default="manual")
    created_at = Column(DateTime, server_default=func.now())
