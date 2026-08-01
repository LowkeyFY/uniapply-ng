import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.university import State, University
from app.models.course import Course, UniversityCourse
from app.schemas.university import StateOut, UniversityOut, CourseWithCutoffOut

router = APIRouter(prefix="/api/v1", tags=["universities"])

@router.get("/states", response_model=list[StateOut])
async def list_states(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(State).order_by(State.name))
    return result.scalars().all()

@router.get("/universities", response_model=list[UniversityOut])
async def list_universities(
    state_id: int | None = Query(None),
    type: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(University).where(University.is_active == True)
    if state_id is not None:
        stmt = stmt.where(University.state_id == state_id)
    if type is not None:
        stmt = stmt.where(University.type == type)
    result = await db.execute(stmt.order_by(University.name))
    return result.scalars().all()

@router.get("/universities/{university_id}", response_model=UniversityOut)
async def get_university(university_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(University).where(University.id == university_id))
    uni = result.scalar_one_or_none()
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")
    return uni

@router.get("/universities/{university_id}/courses", response_model=list[CourseWithCutoffOut])
async def get_university_courses(university_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(
            UniversityCourse.course_id,
            Course.name.label("course_name"),
            UniversityCourse.jamb_cutoff,
            UniversityCourse.degree_type,
            UniversityCourse.duration_years,
            UniversityCourse.waec_requirements,
        )
        .join(Course, Course.id == UniversityCourse.course_id)
        .where(UniversityCourse.university_id == university_id, UniversityCourse.is_available == True)
    )
    result = await db.execute(stmt)
    return result.mappings().all()

@router.get("/courses", response_model=list[dict])
async def list_courses(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Course).order_by(Course.name))
    courses = result.scalars().all()
    return [{"id": str(c.id), "name": c.name, "jamb_subject_combo": c.jamb_subject_combo} for c in courses]
