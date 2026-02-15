from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class SignUpRequest(BaseModel):
    """User signup request schema"""
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(..., min_length=2)
    role: str = Field(default="consumer", pattern="^(consumer|electrician|admin)$")
    phone: Optional[str] = None
    company: Optional[str] = None

class SignInRequest(BaseModel):
    """User signin request schema"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response schema (without password)"""
    id: str = Field(alias="_id")
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    company: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
    success: bool = True
