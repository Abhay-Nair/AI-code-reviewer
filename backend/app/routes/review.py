from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.review import Review
from app.models.user import User
from app.schemas.review import CodeReviewRequest, CodeReviewResponse
from app.services.review_service import review_code
from app.services.auth_service import get_current_user  # new helper

router = APIRouter(prefix="/review", tags=["Review"])

@router.post("/", response_model=CodeReviewResponse)
def review(request: CodeReviewRequest, 
           db: Session = Depends(get_db), 
           current_user: User = Depends(get_current_user)):
    result = review_code(request.code)

    new_review = Review(
        code=request.code,
        feedback=str(result),  # can save raw JSON as string
        user_id=current_user.id
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return result
