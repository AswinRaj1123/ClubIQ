from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from database import get_db
from models.location import Location
from models.fault_request import FaultRequest
from schemas.location import LocationUpdate, LocationResponse, LocationHistoryResponse
from schemas.fault_request import (
    CreateFaultRequest,
    FaultRequestResponse,
    UpdateFaultRequestStatus,
    FaultRequestList
)
from utils.auth import get_current_user

router = APIRouter(prefix="/api/consumer", tags=["consumer"])


@router.post("/location/update", response_model=LocationResponse)
async def update_location(
    location_data: LocationUpdate,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Update consumer's current location
    """
    try:
        # Create new location document
        location = Location(
            user_id=str(current_user.get("_id")),
            latitude=location_data.latitude,
            longitude=location_data.longitude,
            accuracy=location_data.accuracy,
            altitude=location_data.altitude,
            is_sharing=location_data.is_sharing
        )
        
        # Insert or update location in MongoDB
        locations_collection = db["consumer_locations"]
        
        # Find existing location for user and update it, or insert new one
        result = await locations_collection.update_one(
            {"user_id": str(current_user.get("_id"))},
            {"$set": location.to_update_dict()},
            upsert=True
        )
        
        # Fetch the updated location
        updated_location = await locations_collection.find_one(
            {"user_id": str(current_user.get("_id"))}
        )
        
        return LocationResponse(
            user_id=updated_location["user_id"],
            latitude=updated_location["latitude"],
            longitude=updated_location["longitude"],
            accuracy=updated_location.get("accuracy"),
            altitude=updated_location.get("altitude"),
            is_sharing=updated_location["is_sharing"],
            created_at=updated_location["created_at"],
            updated_at=updated_location["updated_at"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating location: {str(e)}"
        )


@router.get("/location/current", response_model=LocationResponse)
async def get_current_location(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get consumer's current location
    """
    try:
        locations_collection = db["consumer_locations"]
        location = await locations_collection.find_one(
            {"user_id": str(current_user.get("_id"))}
        )
        
        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found. Please share your location first."
            )
        
        return LocationResponse(
            user_id=location["user_id"],
            latitude=location["latitude"],
            longitude=location["longitude"],
            accuracy=location.get("accuracy"),
            altitude=location.get("altitude"),
            is_sharing=location["is_sharing"],
            created_at=location["created_at"],
            updated_at=location["updated_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching location: {str(e)}"
        )


@router.post("/location/stop-sharing")
async def stop_sharing_location(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Stop sharing location
    """
    try:
        locations_collection = db["consumer_locations"]
        result = locations_collection.update_one(
            {"user_id": str(current_user.get("_id"))},
            {"$set": {"is_sharing": False, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location sharing not found"
            )
        
        return {"message": "Location sharing stopped successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error stopping location sharing: {str(e)}"
        )


@router.post("/location/resume-sharing")
async def resume_sharing_location(
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Resume sharing location
    """
    try:
        locations_collection = db["consumer_locations"]
        result = await locations_collection.update_one(
            {"user_id": str(current_user.get("_id"))},
            {"$set": {"is_sharing": True, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location sharing not found"
            )
        
        return {"message": "Location sharing resumed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error resuming location sharing: {str(e)}"
        )


@router.get("/location/history", response_model=LocationHistoryResponse)
async def get_location_history(
    limit: int = 10,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get consumer's location history
    """
    try:
        locations_collection = db["consumer_locations"]
        
        # For now, this returns the current location
        # In a real app, you might store historical data
        location = locations_collection.find_one(
            {"user_id": str(current_user.get("_id"))}
        )
        
        if not location:
            return LocationHistoryResponse(locations=[], total=0)
        
        location_response = LocationResponse(
            user_id=location["user_id"],
            latitude=location["latitude"],
            longitude=location["longitude"],
            accuracy=location.get("accuracy"),
            altitude=location.get("altitude"),
            is_sharing=location["is_sharing"],
            created_at=location["created_at"],
            updated_at=location["updated_at"]
        )
        
        return LocationHistoryResponse(
            locations=[location_response],
            total=1
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching location history: {str(e)}"
        )


# ============= FAULT REQUEST ENDPOINTS =============

@router.post("/fault-request/create", response_model=FaultRequestResponse)
async def create_fault_request(
    fault_data: CreateFaultRequest,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Create a new fault request
    """
    try:
        # Create fault request document
        fault_request = FaultRequest(
            consumer_id=str(current_user.get("_id")),
            title=fault_data.title,
            description=fault_data.description,
            location=fault_data.location,
            latitude=fault_data.latitude,
            longitude=fault_data.longitude,
            photo_url=fault_data.photo_url,
            priority=fault_data.priority,
            status="open"
        )
        
        # Insert into database
        fault_requests_collection = db["fault_requests"]
        result = await fault_requests_collection.insert_one(fault_request.to_dict())
        
        # Fetch the created request
        created_request = await fault_requests_collection.find_one({"_id": result.inserted_id})
        
        return FaultRequestResponse(
            id=str(created_request["_id"]),
            consumer_id=created_request["consumer_id"],
            title=created_request["title"],
            description=created_request["description"],
            location=created_request["location"],
            latitude=created_request.get("latitude"),
            longitude=created_request.get("longitude"),
            photo_url=created_request.get("photo_url"),
            status=created_request["status"],
            priority=created_request["priority"],
            assigned_to=created_request.get("assigned_to"),
            created_at=created_request["created_at"],
            updated_at=created_request["updated_at"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating fault request: {str(e)}"
        )


@router.get("/fault-requests", response_model=FaultRequestList)
async def get_consumer_fault_requests(
    status_filter: str = None,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get all fault requests for the current consumer
    """
    try:
        fault_requests_collection = db["fault_requests"]
        
        # Build query
        query = {"consumer_id": str(current_user.get("_id"))}
        if status_filter:
            query["status"] = status_filter
        
        # Fetch requests sorted by creation date (newest first) (async)
        requests = []
        async for req in fault_requests_collection.find(query).sort("created_at", -1):
            requests.append(req)
        
        # Convert to response format
        users_collection = db["users"]
        request_responses = []
        
        for req in requests:
            # Get electrician name if assigned_to exists
            assigned_to_name = None
            if req.get("assigned_to"):
                try:
                    from bson import ObjectId
                    electrician = await users_collection.find_one({"_id": ObjectId(req.get("assigned_to"))})
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
    Get a specific fault request by ID
    """
    try:
        fault_requests_collection = db["fault_requests"]
        
        request_doc = await fault_requests_collection.find_one({
            "_id": ObjectId(request_id),
            "consumer_id": str(current_user.get("_id"))
        })
        
        if not request_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fault request not found"
            )
        
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


@router.put("/fault-request/{request_id}/cancel")
async def cancel_fault_request(
    request_id: str,
    current_user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Cancel a fault request (consumer only)
    """
    try:
        fault_requests_collection = db["fault_requests"]
        
        result = await fault_requests_collection.update_one(
            {
                "_id": ObjectId(request_id),
                "consumer_id": str(current_user.get("_id"))
            },
            {
                "$set": {
                    "status": "closed",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fault request not found or you don't have permission"
            )
        
        return {"message": "Fault request cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error cancelling fault request: {str(e)}"
        )

