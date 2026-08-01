# UniApply NG

A web application that helps Nigerian secondary school leavers find and apply to universities based on their JAMB and/or WAEC results.

## What it does

- **Explore** — browse universities by state and course, see cutoff scores, no account needed
- **Upload results** — upload JAMB/WAEC result PDFs or images; text is extracted automatically (with OCR fallback for scanned images), or entered manually if parsing fails
- **Check eligibility** — get a ranked list of universities you qualify for based on your JAMB score and WAEC grades, including a path for students who haven't sat JAMB yet
- **Apply** — submit and track applications through a dashboard

## Tech Stack

**Backend:** FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL, Celery + Redis, Tesseract/pytesseract (OCR), pdfplumber (PDF parsing)

**Frontend:** React, Vite, Tailwind CSS

**Storage:** Backblaze B2 (document uploads)

## Project Structure

### Data coverage note

University and course listings cover 59 NUC-accredited institutions. JAMB cutoff data is complete for Computer Science and Accounting across all 59; Medicine, Law, and Engineering cutoffs are currently only populated for the original 10 universities, since departmental cutoffs for competitive courses require per-institution verification beyond the general institutional minimums used here. Expanding this is real future work
, not an oversight.
