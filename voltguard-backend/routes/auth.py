from fastapi import APIRouter, HTTPException, status, Request
from typing import Optional
from datetime import datetime
from database import get_db
from models import User
from schemas import SignUpRequest, SignInRequest, TokenResponse, MessageResponse, UserResponse
from utils import hash_password, verify_password, create_access_token, decode_access_token
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(req: SignUpRequest):
    """
    User signup endpoint
    
    - **email**: User email (must be unique)
    - **password**: Password (minimum 6 characters)
    - **full_name**: Full name of the user
    - **role**: User role (consumer, electrician, admin) - default: consumer
    - **phone**: Optional phone number
    - **company**: Optional company name
    """
    db = get_db()
    users_collection = db["users"]
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": req.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(req.password)
    
    # Create new user
    user = User(
        email=req.email,
        password_hash=password_hash,
        full_name=req.full_name,
        role=req.role,
        phone=req.phone,
        company=req.company
    )
    
    # Insert user into database
    result = users_collection.insert_one(user.to_dict())
    user._id = result.inserted_id
    
    # Create JWT token
    access_token = create_access_token(str(user._id), user.email, user.role)
    
    # Prepare response
    user_response = UserResponse(
        _id=str(user._id),
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        company=user.company,
        is_active=user.is_active,
        created_at=user.created_at
    )
    
    return TokenResponse(access_token=access_token, user=user_response)

@router.post("/signin", response_model=TokenResponse)
async def signin(req: SignInRequest):
    """
    User signin endpoint
    
    - **email**: User email
    - **password**: User password
    """
    db = get_db()
    users_collection = db["users"]
    
    # Find user by email
    user_doc = users_collection.find_one({"email": req.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(req.password, user_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create user object
    user = User.from_dict(user_doc)
    
    # Create JWT token
    access_token = create_access_token(str(user._id), user.email, user.role)
    
    # Update last login
    users_collection.update_one(
        {"_id": user._id},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Prepare response
    user_response = UserResponse(
        _id=str(user._id),
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        company=user.company,
        is_active=user.is_active,
        created_at=user.created_at
    )
    
    return TokenResponse(access_token=access_token, user=user_response)

@router.get("/me", response_model=UserResponse)
async def get_current_user(request: Request):
    """
    Get current user profile
    
    - **authorization**: Bearer token in Authorization header
    """
    try:
        # Get authorization header from request
        authorization = request.headers.get("authorization")
        print(f"Authorization header received: {authorization}")
        
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing authorization header"
            )
        
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format. Expected 'Bearer <token>'"
            )
        
        token = authorization.replace("Bearer ", "")
        print(f"Token extracted: {token[:20]}...")
        
        payload = decode_access_token(token)
        print(f"Decoded payload: {payload}")
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        db = get_db()
        users_collection = db["users"]
        
        user_doc = users_collection.find_one({"_id": ObjectId(payload["user_id"])})
        
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = User.from_dict(user_doc)
        print(f"User found: {user.email}")
        
        return UserResponse(
            _id=str(user._id),
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            phone=user.phone,
            company=user.company,
            is_active=user.is_active,
            created_at=user.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_current_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
