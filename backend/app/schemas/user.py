from pydantic import BaseModel, EmailStr

# Common fields for User
class UserBase(BaseModel):
    email: EmailStr

# Schema for user creation (signup)
class UserCreate(UserBase):
    email: EmailStr
    password: str
    username: str

# Schema for login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for response (sending data back to frontend)
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2
