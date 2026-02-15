from datetime import datetime
from bson import ObjectId


class FaultRequest:
    """Fault Request model for MongoDB"""
    
    def __init__(
        self,
        consumer_id: str,
        title: str,
        description: str,
        location: str,
        latitude: float = None,
        longitude: float = None,
        photo_url: str = None,
        status: str = "open",  # open, assigned, in_progress, resolved, closed
        priority: str = "medium",  # low, medium, high, critical
        assigned_to: str = None,  # electrician_id
        _id: ObjectId = None,
        created_at: datetime = None,
        updated_at: datetime = None
    ):
        self._id = _id or ObjectId()
        self.consumer_id = consumer_id
        self.title = title
        self.description = description
        self.location = location
        self.latitude = latitude
        self.longitude = longitude
        self.photo_url = photo_url
        self.status = status
        self.priority = priority
        self.assigned_to = assigned_to
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary for MongoDB"""
        return {
            "_id": self._id,
            "consumer_id": self.consumer_id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photo_url": self.photo_url,
            "status": self.status,
            "priority": self.priority,
            "assigned_to": self.assigned_to,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @staticmethod
    def from_dict(data: dict):
        """Create from dictionary"""
        return FaultRequest(
            consumer_id=data.get("consumer_id"),
            title=data.get("title"),
            description=data.get("description"),
            location=data.get("location"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            photo_url=data.get("photo_url"),
            status=data.get("status", "open"),
            priority=data.get("priority", "medium"),
            assigned_to=data.get("assigned_to"),
            _id=data.get("_id"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
