import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.tasks import send_application_confirmation_task

from app.database import get_db
from app.models.application import Application
from app.models.university import University
from app.models.course import Course
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationDetailOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/applications", tags=["applications"])

@router.post("", response_model=ApplicationOut, status_code=201)
async def create_application(
    payload: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    uni = await db.execute(select(University).where(University.id == payload.university_id))
    if not uni.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="University not found")

    course = await db.execute(select(Course).where(Course.id == payload.course_id))
    if not course.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Course not found")

    application = Application(
        user_id=current_user.id,
        university_id=payload.university_id,
        course_id=payload.course_id,
        jamb_result_id=payload.jamb_result_id,
        waec_result_id=payload.waec_result_id,
        status="draft",
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application

@router.post("/{application_id}/submit", response_model=ApplicationOut)
async def submit_application(
    application_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Application).where(
            Application.id == application_id,
            Application.user_id == current_user.id,
        )
    )
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.status != "draft":
        raise HTTPException(status_code=400, detail="Application already submitted")

    application.status = "submitted"
    application.submitted_at = datetime.now(timezone.utc).replace(tzinfo=None)
    await db.commit()
    await db.refresh(application)

    uni_result = await db.execute(select(University).where(University.id == application.university_id))
    university = uni_result.scalar_one_or_none()
    course_result = await db.execute(select(Course).where(Course.id == application.course_id))
    course = course_result.scalar_one_or_none()

    send_application_confirmation_task.delay(
        current_user.email,
        university.name if university else "your university",
        course.name if course else "your course",
    )

    return application

@router.get("", response_model=list[ApplicationDetailOut])
async def list_my_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Application, University.name.label("university_name"), Course.name.label("course_name"))
        .join(University, University.id == Application.university_id)
        .join(Course, Course.id == Application.course_id)
        .where(Application.user_id == current_user.id)
        .order_by(Application.created_at.desc())
    )
    rows = (await db.execute(stmt)).all()

    return [
        ApplicationDetailOut(
            id=app.id,
            university_id=app.university_id,
            course_id=app.course_id,
            status=app.status,
            submitted_at=app.submitted_at,
            created_at=app.created_at,
            university_name=uni_name,
            course_name=course_name,
        )
        for app, uni_name, course_name in rows
    ]
