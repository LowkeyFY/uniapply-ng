from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, ProfileUpdate
from app.dependencies import get_current_user
from app.services.storage import save_file, get_presigned_url

router = APIRouter(prefix="/api/v1/users", tags=["users"])

ALLOWED_PHOTO_TYPES = {"image/jpeg", "image/png"}
MAX_PHOTO_SIZE = 5 * 1024 * 1024  # 5 MB


def _serialize_user(user: User) -> UserOut:
    data = UserOut.model_validate(user)
    data.passport_url = get_presigned_url(user.passport_url)
    return data


@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return _serialize_user(current_user)


@router.patch("/me", response_model=UserOut)
async def update_my_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return _serialize_user(current_user)


@router.post("/me/passport-photo", response_model=UserOut)
async def upload_passport_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_PHOTO_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG or PNG files are allowed")
    file_bytes = await file.read()
    if len(file_bytes) > MAX_PHOTO_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    storage_path = await save_file(file_bytes, file.filename)
    current_user.passport_url = storage_path
    await db.commit()
    await db.refresh(current_user)
    return _serialize_user(current_user)
