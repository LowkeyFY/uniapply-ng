from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, universities, documents, eligibility, applications

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(universities.router)
app.include_router(documents.router)
app.include_router(eligibility.router)
app.include_router(applications.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.app_name}
