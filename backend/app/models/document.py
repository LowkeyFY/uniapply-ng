import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class UserDocument(Base):
    __tablename__ = "user_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(50), nullable=False)  # "waec" or "jamb"
    original_filename = Column(String(500), nullable=False)
    storage_path = Column(String(1000), nullable=False)  # local path today, R2 key later
    status = Column(String(50), default="uploaded")  # uploaded, processing, parsed, failed
    created_at = Column(DateTime, server_default=func.now())
