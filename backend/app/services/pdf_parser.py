import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
from io import BytesIO

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts embedded text from a PDF's pages. Returns an empty string
    if no text layer exists (e.g. a scanned image-only PDF).
    """
    text_chunks = []
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_chunks.append(page_text)
    return "\n".join(text_chunks).strip()

def extract_text_with_ocr(file_bytes: bytes) -> str:
    """
    Fallback for scanned/image-only PDFs: renders each page as an image
    and runs Tesseract OCR on it.
    """
    images = convert_from_bytes(file_bytes)
    text_chunks = []
    for image in images:
        page_text = pytesseract.image_to_string(image)
        if page_text:
            text_chunks.append(page_text)
    return "\n".join(text_chunks).strip()

def extract_text(file_bytes: bytes) -> tuple[str, str]:
    """
    Tries direct text extraction first (fast, accurate for digital PDFs).
    Falls back to OCR if no text was found (scanned documents).
    Returns (text, method) where method is "text" or "ocr".
    """
    text = extract_text_from_pdf(file_bytes)
    if text:
        return text, "text"

    text = extract_text_with_ocr(file_bytes)
    return text, "ocr"
