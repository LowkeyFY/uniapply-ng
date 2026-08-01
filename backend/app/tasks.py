import asyncio

import boto3
from sqlalchemy import select

from app.celery_app import celery_app
from app.config import settings
from app.database import AsyncSessionLocal
from app.models.document import UserDocument
from app.services.email import send_email
from app.services.pdf_parser import extract_text

# Backblaze B2 client
s3 = boto3.client(
    "s3",
    endpoint_url=settings.b2_endpoint_url,
    aws_access_key_id=settings.b2_access_key_id,
    aws_secret_access_key=settings.b2_secret_access_key,
)


@celery_app.task(name="parse_document")
def parse_document_task(document_id: str, object_key: str):
    """
    Downloads the uploaded file from Backblaze B2,
    extracts text (OCR fallback if needed),
    and updates the document status.
    """

    response = s3.get_object(
        Bucket=settings.b2_bucket_name,
        Key=object_key,
    )

    file_bytes = response["Body"].read()

    text, method = extract_text(file_bytes)

    asyncio.run(_update_document_status(document_id, text, method))


async def _update_document_status(document_id: str, text: str, method: str):
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(UserDocument).where(UserDocument.id == document_id)
        )

        document = result.scalar_one_or_none()

        if document:
            document.status = "parsed" if text else "failed"
            await db.commit()


@celery_app.task(name="send_application_confirmation")
def send_application_confirmation_task(
    user_email: str,
    university_name: str,
    course_name: str,
):
    subject = f"Application Received: {course_name} at {university_name}"

    body = (
        f"Hi,\n\n"
        f"Your application to study {course_name} at "
        f"{university_name} has been submitted successfully.\n\n"
        f"We'll notify you of any status updates.\n\n"
        f"— UniApply NG"
    )

    send_email(user_email, subject, body)
