from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from database import get_db
from models.fault_request import FaultRequest
from schemas.fault_request import (
    FaultRequestResponse,
    UpdateFaultRequestStatus,
    FaultRequestList
)
from utils.auth import get_current_user

router = APIRouter(prefix="/api/electrician", tags=["electrician"])


@router.get("/fault-requests", response_model=FaultRequestList)
async def get_all_fault_requests(
    status_filter: str = None,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get all fault requests (electrician view)
    Only electricians can access this
    """
    try:
        # Verify user is electrician
        if current_user.get("role") not in ["electrician", "lineman"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only electricians can view fault requests"
            )
        
        fault_requests_collection = db["fault_requests"]
        
        # Build query
        query = {}
        if status_filter:
            query["status"] = status_filter
        
        # Fetch requests sorted by priority and creation date
        requests = list(
            fault_requests_collection.find(query)
            .sort([("priority", -1), ("created_at", -1)])
        )
        
        # Convert to response format
        users_collection = db["users"]
        request_responses = []
        
        for req in requests:
            # Get electrician name if assigned_to exists
            assigned_to_name = None
            if req.get("assigned_to"):
                try:
                    from bson import ObjectId
                    electrician = users_collection.find_one({"_id": ObjectId(req.get("assigned_to"))})
                    if electrician:
                        assigned_to_name = electrician.get("full_name", "Unknown")
                except:
                    assigned_to_name = None
            
            request_responses.append(
                FaultRequestResponse(
                    id=str(req["_id"]),
                    consumer_id=req["consumer_id"],
                    title=req["title"],
                    description=req["description"],
                    location=req["location"],
                    latitude=req.get("latitude"),
                    longitude=req.get("longitude"),
                    photo_url=req.get("photo_url"),
                    status=req["status"],
                    priority=req["priority"],
                    assigned_to=req.get("assigned_to"),
                    assigned_to_name=assigned_to_name,
                    created_at=req["created_at"],
                    updated_at=req["updated_at"]
                )
            )
        
        return FaultRequestList(requests=request_responses, total=len(request_responses))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching fault requests: {str(e)}"
        )


@router.get("/fault-request/{request_id}", response_model=FaultRequestResponse)
async def get_fault_request(
    request_id: str,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get a specific fault request details
    """
    try:
        # Verify user is electrician
        if current_user.get("role") not in ["electrician", "lineman"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only electricians can view fault requests"
            )
        
        fault_requests_collection = db["fault_requests"]
        users_collection = db["users"]
        
        request_doc = fault_requests_collection.find_one({
            "_id": ObjectId(request_id)
        })
        
        if not request_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fault request not found"
            )
        
        # Get electrician name if assigned_to exists
        assigned_to_name = None
        if request_doc.get("assigned_to"):
            try:
                electrician = users_collection.find_one({"_id": ObjectId(request_doc.get("assigned_to"))})
                if electrician:
                    assigned_to_name = electrician.get("full_name", "Unknown")
            except:
                assigned_to_name = None
        
        return FaultRequestResponse(
            id=str(request_doc["_id"]),
            consumer_id=request_doc["consumer_id"],
            title=request_doc["title"],
            description=request_doc["description"],
            location=request_doc["location"],
            latitude=request_doc.get("latitude"),
            longitude=request_doc.get("longitude"),
            photo_url=request_doc.get("photo_url"),
            status=request_doc["status"],
            priority=request_doc["priority"],
            assigned_to=request_doc.get("assigned_to"),
            assigned_to_name=assigned_to_name,
            created_at=request_doc["created_at"],
            updated_at=request_doc["updated_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching fault request: {str(e)}"
        )


@router.put("/fault-request/{request_id}/assign")
async def assign_fault_request(
    request_id: str,
    status_update: UpdateFaultRequestStatus,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Assign a fault request to electrician and update status
    """
    try:
        # Verify user is electrician
        if current_user.get("role") not in ["electrician", "lineman"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only electricians can assign fault requests"
            )
        
        fault_requests_collection = db["fault_requests"]
        
        update_data = {
            "status": status_update.status,
            "updated_at": datetime.utcnow()
        }
        
        # If assigning to someone, add the electrician ID
        if status_update.assigned_to:
            update_data["assigned_to"] = status_update.assigned_to
        elif current_user.get("role") == "electrician":
            # Auto-assign to current electrician if not specified
            update_data["assigned_to"] = str(current_user.get("_id"))
        
        result = fault_requests_collection.update_one(
            {"_id": ObjectId(request_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fault request not found"
            )
        
        return {"message": "Fault request updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating fault request: {str(e)}"
        )


@router.get("/my-assignments", response_model=FaultRequestList)
async def get_my_assignments(
    status_filter: str = None,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get fault requests assigned to current electrician
    """
    try:
        # Verify user is electrician
        if current_user.get("role") not in ["electrician", "lineman"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only electricians can view assignments"
            )
        
        fault_requests_collection = db["fault_requests"]
        users_collection = db["users"]
        
        # Build query
        query = {"assigned_to": str(current_user.get("_id"))}
        if status_filter:
            query["status"] = status_filter
        
        # Fetch requests
        requests = list(
            fault_requests_collection.find(query)
            .sort("created_at", -1)
        )
        
        # Convert to response format
        request_responses = []
        
        for req in requests:
            # Get electrician name if assigned_to exists
            assigned_to_name = None
            if req.get("assigned_to"):
                try:
                    from bson import ObjectId
                    electrician = users_collection.find_one({"_id": ObjectId(req.get("assigned_to"))})
                    if electrician:
                        assigned_to_name = electrician.get("full_name", "Unknown")
                except:
                    assigned_to_name = None
            
            request_responses.append(
                FaultRequestResponse(
                    id=str(req["_id"]),
                    consumer_id=req["consumer_id"],
                    title=req["title"],
                    description=req["description"],
                    location=req["location"],
                    latitude=req.get("latitude"),
                    longitude=req.get("longitude"),
                    photo_url=req.get("photo_url"),
                    status=req["status"],
                    priority=req["priority"],
                    assigned_to=req.get("assigned_to"),
                    assigned_to_name=assigned_to_name,
                    created_at=req["created_at"],
                    updated_at=req["updated_at"]
                )
            )
        ]
        
        return FaultRequestList(requests=request_responses, total=len(request_responses))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching assignments: {str(e)}"
        )
