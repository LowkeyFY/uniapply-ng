import asyncio
import json
from pathlib import Path

from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.university import State, University, Faculty
from app.models.course import Course, UniversityCourse

SEED_DIR = Path(__file__).parent.parent / "seed_data"

async def seed_states(db):
    with open(SEED_DIR / "states.json") as f:
        data = json.load(f)
    for item in data:
        existing = await db.execute(select(State).where(State.code == item["code"]))
        if existing.scalar_one_or_none():
            continue
        db.add(State(name=item["name"], code=item["code"]))
    await db.commit()
    print(f"States: {len(data)} processed.")

async def seed_universities(db):
    with open(SEED_DIR / "universities.json") as f:
        data = json.load(f)
    for item in data:
        existing = await db.execute(select(University).where(University.abbreviation == item["abbreviation"]))
        if existing.scalar_one_or_none():
            continue
        state_result = await db.execute(select(State).where(State.code == item["state_code"]))
        state = state_result.scalar_one_or_none()
        if not state:
            print(f"  Skipping {item['name']} — state code {item['state_code']} not found")
            continue
        db.add(University(
            name=item["name"],
            abbreviation=item["abbreviation"],
            type=item["type"],
            state_id=state.id,
            established_year=item["established_year"],
        ))
    await db.commit()
    print(f"Universities: {len(data)} processed.")

async def seed_courses(db):
    with open(SEED_DIR / "courses.json") as f:
        data = json.load(f)
    for item in data:
        existing = await db.execute(select(Course).where(Course.name == item["name"]))
        if existing.scalar_one_or_none():
            continue
        # faculties aren't tied to a specific university in this simplified model,
        # so we create one faculty record per unique name (first match wins)
        fac_result = await db.execute(select(Faculty).where(Faculty.name == item["faculty_name"]))
        faculty = fac_result.scalar_one_or_none()
        if not faculty:
            faculty = Faculty(name=item["faculty_name"], university_id=None)
            db.add(faculty)
            await db.flush()
        db.add(Course(
            name=item["name"],
            jamb_subject_combo=item["jamb_subject_combo"],
            faculty_id=faculty.id,
        ))
    await db.commit()
    print(f"Courses: {len(data)} processed.")

async def seed_cutoffs(db):
    with open(SEED_DIR / "cutoffs.json") as f:
        data = json.load(f)
    count = 0
    for item in data:
        uni_result = await db.execute(select(University).where(University.abbreviation == item["university_abbr"]))
        uni = uni_result.scalar_one_or_none()
        course_result = await db.execute(select(Course).where(Course.name == item["course_name"]))
        course = course_result.scalar_one_or_none()
        if not uni or not course:
            print(f"  Skipping cutoff for {item['university_abbr']} / {item['course_name']} — missing ref")
            continue
        existing = await db.execute(
            select(UniversityCourse).where(
                UniversityCourse.university_id == uni.id,
                UniversityCourse.course_id == course.id,
            )
        )
        if existing.scalar_one_or_none():
            continue
        db.add(UniversityCourse(
            university_id=uni.id,
            course_id=course.id,
            jamb_cutoff=item["jamb_cutoff"],
            waec_requirements={
                "minimum_credits": item["min_credits"],
                "required_subjects": item["required_subjects"],
            },
            duration_years=item["duration_years"],
            degree_type=item["degree_type"],
        ))
        count += 1
    await db.commit()
    print(f"Cutoffs: {count} new entries added.")

async def main():
    async with AsyncSessionLocal() as db:
        await seed_states(db)
        await seed_universities(db)
        await seed_courses(db)
        await seed_cutoffs(db)

if __name__ == "__main__":
    asyncio.run(main())
