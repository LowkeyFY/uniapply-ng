import uuid
from pathlib import Path

import boto3

from app.config import settings

# Create the S3 client for Backblaze B2
s3 = boto3.client(
    "s3",
    endpoint_url=settings.b2_endpoint_url,
    aws_access_key_id=settings.b2_access_key_id,
    aws_secret_access_key=settings.b2_secret_access_key,
)

BUCKET_NAME = settings.b2_bucket_name


async def save_file(file_bytes: bytes, original_filename: str) -> str:
    """
    Upload a file to Backblaze B2 and return the object key.
    """
    ext = Path(original_filename).suffix
    object_key = f"uploads/{uuid.uuid4()}{ext}"

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=object_key,
        Body=file_bytes,
        ContentType="application/octet-stream",
    )

    return object_key
