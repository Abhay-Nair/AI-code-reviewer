from fastapi import FastAPI
from app.core.database import Base, engine
from app.routes import auth, review
from fastapi.middleware.cors import CORSMiddleware

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Code Reviewer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth.router)
app.include_router(review.router)

@app.get("/")
def root():
    return {"message": "AI Code Reviewer Backend is running 🚀"}
