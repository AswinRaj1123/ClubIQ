from datetime import datetime
from typing import Optional
from bson import ObjectId

class Message:
    def __init__(
        self,
        request_id: str,
        sender_id: str,
        sender_type: str,  # "consumer" or "electrician"
        content: str,
        _id: Optional[ObjectId] = None,
        created_at: Optional[datetime] = None,
    ):
        self._id = _id or ObjectId()
        self.request_id = request_id
        self.sender_id = sender_id
        self.sender_type = sender_type
        self.content = content
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "_id": self._id,
            "request_id": self.request_id,
            "sender_id": self.sender_id,
            "sender_type": self.sender_type,
            "content": self.content,
            "created_at": self.created_at,
        }

    def to_update_dict(self):
        """Returns dict for MongoDB update operations (excludes _id)"""
        return {
            "request_id": self.request_id,
            "sender_id": self.sender_id,
            "sender_type": self.sender_type,
            "content": self.content,
            "created_at": self.created_at,
        }
