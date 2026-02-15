from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SendMessageRequest(BaseModel):
    request_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    request_id: str
    sender_id: str
    sender_type: str
    content: str
    created_at: datetime

class MessagesListResponse(BaseModel):
    messages: list[MessageResponse]
    total: int
