from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityResult, NoJambRequest, NoJambResult
from app.services.eligibility import check_eligibility, check_no_jamb

router = APIRouter(prefix="/api/v1/eligibility", tags=["eligibility"])

@router.post("/check", response_model=list[EligibilityResult])
async def eligibility_check(
    payload: EligibilityCheckRequest,
    db: AsyncSession = Depends(get_db),
):
    results = await check_eligibility(
        db,
        jamb_score=payload.jamb_score,
        waec_grades=payload.waec_grades,
        preferred_state=payload.preferred_state,
        preferred_course=payload.preferred_course,
    )
    return results

@router.post("/no-jamb", response_model=list[NoJambResult])
async def eligibility_no_jamb(
    payload: NoJambRequest,
    db: AsyncSession = Depends(get_db),
):
    results = await check_no_jamb(
        db,
        waec_grades=payload.waec_grades,
        preferred_course=payload.preferred_course,
    )
    return results
