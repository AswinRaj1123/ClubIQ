from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from database import get_db
from models.message import Message
from schemas.message import SendMessageRequest, MessageResponse, MessagesListResponse
from utils.auth import get_current_user

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/send", response_model=MessageResponse)
async def send_message(
    message_data: SendMessageRequest,
    current_user = Depends(get_current_user),
    db = Depends(get_db),
):
    """
    Send a message in a fault request chat
    """
    try:
        print(f"DEBUG: Sending message for request_id: {message_data.request_id}")
        print(f"DEBUG: Current user: {current_user.get('_id')}, role: {current_user.get('role')}")
        
        # Verify that the request exists and user is part of it
        fault_requests_collection = db["fault_requests"]
        
        try:
            request_doc = fault_requests_collection.find_one(
                {"_id": ObjectId(message_data.request_id)}
            )
            print(f"DEBUG: Found request by ObjectId: {request_doc is not None}")
        except Exception as e:
            print(f"DEBUG: Error converting to ObjectId: {e}")
            request_doc = None

        if not request_doc:
            print(f"DEBUG: Request not found with ID {message_data.request_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fault request not found",
            )

        # Determine sender type based on user role
        user_role = current_user.get("role")
        if user_role not in ["consumer", "electrician"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid user role for messaging",
            )

        # Verify user is authorized (consumer or assigned electrician)
        user_id = str(current_user.get("_id"))
        is_consumer = request_doc.get("consumer_id") == user_id
        is_electrician = (
            user_role == "electrician" and request_doc.get("assigned_to") == user_id
        )

        print(f"DEBUG: user_id: {user_id}, is_consumer: {is_consumer}, is_electrician: {is_electrician}")

        if not (is_consumer or is_electrician):
            print(f"DEBUG: User not authorized to message in this request")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to message in this request",
            )

        # Create message
        message = Message(
            request_id=message_data.request_id,
            sender_id=user_id,
            sender_type=user_role,
            content=message_data.content,
        )

        # Save to database
        messages_collection = db["messages"]
        result = messages_collection.insert_one(message.to_dict())

        # Fetch created message
        created_msg = messages_collection.find_one({"_id": result.inserted_id})

        print(f"DEBUG: Message saved with ID: {result.inserted_id}")

        return MessageResponse(
            id=str(created_msg["_id"]),
            request_id=created_msg["request_id"],
            sender_id=created_msg["sender_id"],
            sender_type=created_msg["sender_type"],
            content=created_msg["content"],
            created_at=created_msg["created_at"],
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Unexpected error in send_message: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error sending message: {str(e)}",
        )


@router.get("/request/{request_id}", response_model=MessagesListResponse)
async def get_request_messages(
    request_id: str,
    current_user = Depends(get_current_user),
    db = Depends(get_db),
):
    """
    Get all messages for a fault request
    """
    try:
        print(f"DEBUG: Fetching messages for request_id: {request_id}")
        print(f"DEBUG: Current user: {current_user.get('_id')}, role: {current_user.get('role')}")
        
        # Verify that the request exists
        fault_requests_collection = db["fault_requests"]
        
        # Try to find by ObjectId first
        try:
            request_doc = fault_requests_collection.find_one(
                {"_id": ObjectId(request_id)}
            )
            print(f"DEBUG: Found request by ObjectId: {request_doc is not None}")
        except Exception as e:
            print(f"DEBUG: Error converting to ObjectId: {e}")
            request_doc = None

        if not request_doc:
            print(f"DEBUG: Request not found with ID {request_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fault request not found",
            )

        # Verify user is authorized
        user_id = str(current_user.get("_id"))
        user_role = current_user.get("role")
        is_consumer = request_doc.get("consumer_id") == user_id
        is_electrician = (
            user_role == "electrician" and request_doc.get("assigned_to") == user_id
        )

        print(f"DEBUG: user_id: {user_id}, is_consumer: {is_consumer}, is_electrician: {is_electrician}")
        print(f"DEBUG: request consumer_id: {request_doc.get('consumer_id')}, assigned_to: {request_doc.get('assigned_to')}")

        if not (is_consumer or is_electrician):
            print(f"DEBUG: User not authorized for this request")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view messages in this request",
            )

        # Fetch messages
        messages_collection = db["messages"]
        messages = list(
            messages_collection.find({
                "request_id": request_id
            }).sort("created_at", 1)
        )

        print(f"DEBUG: Found {len(messages)} messages for request {request_id}")

        message_responses = [
            MessageResponse(
                id=str(msg["_id"]),
                request_id=msg["request_id"],
                sender_id=msg["sender_id"],
                sender_type=msg["sender_type"],
                content=msg["content"],
                created_at=msg["created_at"],
            )
            for msg in messages
        ]

        return MessagesListResponse(
            messages=message_responses, total=len(message_responses)
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"DEBUG: Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching messages: {str(e)}",
        )
