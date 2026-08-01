from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.results import JambResult, WaecResult
from app.schemas.results import JambManualEntry, JambResultOut, WaecManualEntry, WaecResultOut

from app.database import get_db
from app.models.document import UserDocument
from app.models.user import User
from app.schemas.document import DocumentOut
from app.dependencies import get_current_user
from app.services.storage import save_file
from app.tasks import parse_document_task

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])

ALLOWED_TYPES = {"waec", "jamb"}
ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    document_type: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if document_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"document_type must be one of {ALLOWED_TYPES}")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF, JPEG, or PNG files are allowed")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    storage_path = await save_file(file_bytes, file.filename)

    document = UserDocument(
        user_id=current_user.id,
        document_type=document_type,
        original_filename=file.filename,
        storage_path=storage_path,
        status="uploaded",
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    parse_document_task.delay(str(document.id), storage_path)

    return document

@router.post("/jamb/manual", response_model=JambResultOut, status_code=201)
async def submit_jamb_manual(
    payload: JambManualEntry,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = JambResult(
        user_id=current_user.id,
        registration_no=payload.registration_no,
        year=payload.year,
        total_score=payload.total_score,
        subject_scores=payload.subject_scores,
        first_choice_university=payload.first_choice_university,
        first_choice_course=payload.first_choice_course,
        parse_status="manual",
    )
    db.add(result)
    await db.commit()
    await db.refresh(result)
    return result

@router.post("/waec/manual", response_model=WaecResultOut, status_code=201)
async def submit_waec_manual(
    payload: WaecManualEntry,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = WaecResult(
        user_id=current_user.id,
        exam_number=payload.exam_number,
        exam_year=payload.exam_year,
        exam_type=payload.exam_type,
        grades=payload.grades,
        parse_status="manual",
    )
    db.add(result)
    await db.commit()
    await db.refresh(result)
    return result
