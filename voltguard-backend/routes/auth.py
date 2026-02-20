from fastapi import APIRouter, HTTPException, status, Request, Depends
from typing import Optional
from datetime import datetime
from database import get_db
from models import User
from schemas import SignUpRequest, SignInRequest, TokenResponse, MessageResponse, UserResponse
from utils import hash_password, verify_password, create_access_token, decode_access_token
from utils.auth import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(req: SignUpRequest):
    """
    User signup endpoint
    
    - **email**: User email (must be unique)
    - **password**: Password (minimum 6 characters)
    - **full_name**: Full name of the user
    - **role**: User role (consumer, electrician, lineman) - default: consumer
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
        id=str(user._id),
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
        id=str(user._id),
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


@router.put("/update-role", response_model=TokenResponse)
async def update_user_role(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Update current user's role to electrician
    This endpoint allows users to change their role (e.g., from consumer to electrician)
    """
    try:
        new_role = "electrician"
        
        users_collection = db["users"]
        
        # Update user's role
        result = users_collection.update_one(
            {"_id": ObjectId(current_user.get("_id"))},
            {"$set": {"role": new_role, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Fetch updated user
        updated_user = users_collection.find_one({"_id": ObjectId(current_user.get("_id"))})
        
        # Create new token with updated role
        access_token = create_access_token(str(updated_user["_id"]), updated_user["email"], updated_user["role"])
        
        user_response = UserResponse(
            id=str(updated_user["_id"]),
            email=updated_user["email"],
            full_name=updated_user["full_name"],
            role=updated_user["role"],
            phone=updated_user.get("phone"),
            company=updated_user.get("company"),
            is_active=updated_user.get("is_active", True),
            created_at=updated_user["created_at"]
        )
        
        return TokenResponse(access_token=access_token, user=user_response)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating role: {str(e)}"
        )


@router.put("/update-profile", response_model=UserResponse)
async def update_user_profile(
    full_name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    company: Optional[str] = None,
    street_address: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    postal_code: Optional[str] = None,
    country: Optional[str] = None,
    current_user = Depends(get_current_user),
):
    """
    Update current user's profile information
    
    - **email**: New email address (optional)
    - **full_name**: New full name (optional)
    - **phone**: New phone number (optional)
    - **company**: New company name (optional)
    - **street_address**: Street address (optional)
    - **city**: City (optional)
    - **state**: State (optional)
    - **postal_code**: Postal code (optional)
    - **country**: Country (optional)
    """
    try:
        # Debug: Log the type and content of current_user
        print(f"[DEBUG] current_user type: {type(current_user)}")
        print(f"[DEBUG] current_user value: {current_user}")
        
        # Extract user_id - current_user is a UserResponse object with 'id' field
        user_id_str = None
        user_email = None
        
        if isinstance(current_user, dict):
            user_id_str = current_user.get("_id") or current_user.get("id")
            user_email = current_user.get("email")
            print(f"[DEBUG] Extracted from dict - user_id: {user_id_str}, email: {user_email}")
        else:
            # It's a Pydantic model (UserResponse), access as attributes
            user_id_str = getattr(current_user, "id", None)
            user_email = getattr(current_user, "email", None)
            print(f"[DEBUG] Extracted from object - user_id: {user_id_str}, email: {user_email}")
        
        if not user_id_str:
            print(f"[ERROR] Could not extract user_id from current_user")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not extract user ID from token"
            )
        
        print(f"[DEBUG] Update profile called for user: {user_email}")
        print(f"[DEBUG] User ID from token: {user_id_str} (type: {type(user_id_str)})")
        print(f"[DEBUG] Data: full_name={full_name}, email={email}, phone={phone}, company={company}")
        print(f"[DEBUG] Address: street={street_address}, city={city}, state={state}, postal={postal_code}, country={country}")
        
        # Convert user_id string to ObjectId
        try:
            user_object_id = ObjectId(user_id_str)
            print(f"[DEBUG] Converted user_id to ObjectId: {user_object_id}")
        except Exception as e:
            print(f"[ERROR] Failed to convert user_id to ObjectId: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid user ID format: {str(e)}"
            )
        
        db = get_db()
        users_collection = db["users"]
        
        # Verify user exists
        existing_user = users_collection.find_one({"_id": user_object_id})
        if not existing_user:
            print(f"[ERROR] User not found with ID: {user_object_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found in database"
            )
        
        print(f"[DEBUG] Found user: {existing_user.get('email')}")
        
        # Prepare update data (only include provided fields)
        update_data = {"updated_at": datetime.utcnow()}
        
        if email is not None and email.strip():
            # Check if new email is already taken
            existing_email_user = users_collection.find_one({
                "email": email,
                "_id": {"$ne": user_object_id}
            })
            if existing_email_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            update_data["email"] = email
        
        if full_name is not None and full_name.strip():
            update_data["full_name"] = full_name
        
        if phone is not None and phone.strip():
            update_data["phone"] = phone
        
        if company is not None and company.strip():
            update_data["company"] = company
        
        if street_address is not None and street_address.strip():
            update_data["street_address"] = street_address
        
        if city is not None and city.strip():
            update_data["city"] = city
        
        if state is not None and state.strip():
            update_data["state"] = state
        
        if postal_code is not None and postal_code.strip():
            update_data["postal_code"] = postal_code
        
        if country is not None and country.strip():
            update_data["country"] = country
        
        print(f"[DEBUG] Update data: {update_data}")
        
        # Update user
        result = users_collection.update_one(
            {"_id": user_object_id},
            {"$set": update_data}
        )
        
        print(f"[DEBUG] Update result - Matched: {result.matched_count}, Modified: {result.modified_count}")
        
        # Fetch updated user
        updated_user = users_collection.find_one({"_id": user_object_id})
        
        if not updated_user:
            print(f"[ERROR] Failed to retrieve updated user after update")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve updated user"
            )
        
        print(f"[DEBUG] Updated user: {updated_user.get('email')}, Address: {updated_user.get('street_address', 'N/A')}")
        
        return UserResponse(
            id=str(updated_user["_id"]),
            email=updated_user["email"],
            full_name=updated_user["full_name"],
            role=updated_user["role"],
            phone=updated_user.get("phone"),
            company=updated_user.get("company"),
            street_address=updated_user.get("street_address"),
            city=updated_user.get("city"),
            state=updated_user.get("state"),
            postal_code=updated_user.get("postal_code"),
            country=updated_user.get("country"),
            is_active=updated_user.get("is_active", True),
            created_at=updated_user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error updating profile: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )
