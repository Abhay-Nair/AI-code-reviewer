from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)

# 🔑 Forgot Password imports
import random, string, datetime
from app.models.password_reset import PasswordReset
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest
)
from app.services.email_service import send_email


router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ Register
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Registration failed. Try again.")

    return new_user


# ✅ Login
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}


# ✅ Step 1: Forgot Password → Send OTP
@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = ''.join(random.choices(string.digits, k=6))  # 6-digit OTP
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

    # Delete old OTP entries for this user
    db.query(PasswordReset).filter(PasswordReset.email == request.email).delete()

    # Save new OTP
    db_reset = PasswordReset(email=request.email, otp=otp, expires_at=expiry)
    db.add(db_reset)
    db.commit()

    # Send OTP via email
    send_email(request.email, "Password Reset OTP", f"Your OTP is {otp}. It expires in 10 minutes.")

    return {"message": "OTP sent to email"}


# ✅ Step 2: Verify OTP
@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    record = db.query(PasswordReset).filter(PasswordReset.email == request.email).first()

    if not record:
        raise HTTPException(status_code=400, detail="No OTP request found for this email")
    if record.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if record.expires_at < datetime.datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    return {"message": "OTP verified. You can now reset password."}


# ✅ Step 3: Reset Password
@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update password
    user.password_hash = hash_password(request.new_password)
    db.commit()

    # Delete OTP entry once used
    db.query(PasswordReset).filter(PasswordReset.email == request.email).delete()
    db.commit()

    return {"message": "Password reset successful"}
