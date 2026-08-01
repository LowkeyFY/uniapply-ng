from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.university import University
from app.models.course import Course, UniversityCourse

PASSING_GRADES = {"A1", "B2", "B3", "C4", "C5", "C6"}

def count_credits(waec_grades: dict, required_subjects: list) -> int:
    return sum(
        1 for subj in required_subjects
        if waec_grades.get(subj, "F9") in PASSING_GRADES
    )

async def check_eligibility(
    db: AsyncSession,
    jamb_score: int,
    waec_grades: dict,
    preferred_state: int | None = None,
    preferred_course: str | None = None,
) -> list[dict]:
    stmt = (
        select(UniversityCourse, University, Course)
        .join(University, University.id == UniversityCourse.university_id)
        .join(Course, Course.id == UniversityCourse.course_id)
        .where(UniversityCourse.is_available == True)
    )
    if preferred_state is not None:
        stmt = stmt.where(University.state_id == preferred_state)
    if preferred_course is not None:
        stmt = stmt.where(Course.name.ilike(f"%{preferred_course}%"))

    rows = (await db.execute(stmt)).all()

    results = []
    for uc, uni, course in rows:
        jamb_pass = jamb_score >= uc.jamb_cutoff
        required_subjects = (uc.waec_requirements or {}).get("required_subjects", [])
        min_credits = (uc.waec_requirements or {}).get("minimum_credits", 5)
        credit_count = count_credits(waec_grades, required_subjects)
        waec_pass = credit_count >= min_credits

        if jamb_pass and waec_pass:
            results.append({
                "university_id": uni.id,
                "university_name": uni.name,
                "course_id": course.id,
                "course_name": course.name,
                "jamb_cutoff": uc.jamb_cutoff,
                "margin": jamb_score - uc.jamb_cutoff,
                "waec_match": credit_count,
                "eligible": True,
            })

    return sorted(results, key=lambda x: (-x["waec_match"], -x["margin"]))
async def check_no_jamb(
    db: AsyncSession,
    waec_grades: dict,
    preferred_course: str,
) -> list[dict]:
    stmt = (
        select(UniversityCourse, University, Course)
        .join(University, University.id == UniversityCourse.university_id)
        .join(Course, Course.id == UniversityCourse.course_id)
        .where(UniversityCourse.is_available == True)
        .where(Course.name.ilike(f"%{preferred_course}%"))
    )
    rows = (await db.execute(stmt)).all()

    results = []
    for uc, uni, course in rows:
        required_subjects = (uc.waec_requirements or {}).get("required_subjects", [])
        min_credits = (uc.waec_requirements or {}).get("minimum_credits", 5)
        credit_count = count_credits(waec_grades, required_subjects)
        waec_pass = credit_count >= min_credits

        if waec_pass:
            results.append({
                "university_id": uni.id,
                "university_name": uni.name,
                "course_id": course.id,
                "course_name": course.name,
                "jamb_cutoff": uc.jamb_cutoff,  # the JAMB score they'd need
                "waec_match": credit_count,
            })

    # Sort by lowest required cutoff first — easiest to hit
    return sorted(results, key=lambda x: x["jamb_cutoff"])
