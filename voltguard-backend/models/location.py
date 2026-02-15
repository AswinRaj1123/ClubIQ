from datetime import datetime
from bson import ObjectId


class Location:
    """Location model for storing consumer GPS data"""
    
    def __init__(
        self,
        user_id: str,
        latitude: float,
        longitude: float,
        accuracy: float = None,
        altitude: float = None,
        is_sharing: bool = True,
        _id: ObjectId = None,
        created_at: datetime = None,
        updated_at: datetime = None
    ):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.latitude = latitude
        self.longitude = longitude
        self.accuracy = accuracy
        self.altitude = altitude
        self.is_sharing = is_sharing
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert location to dictionary for MongoDB (includes _id)"""
        return {
            "_id": self._id,
            "user_id": self.user_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "accuracy": self.accuracy,
            "altitude": self.altitude,
            "is_sharing": self.is_sharing,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    def to_update_dict(self):
        """Convert location to dictionary for MongoDB updates (excludes _id)"""
        return {
            "user_id": self.user_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "accuracy": self.accuracy,
            "altitude": self.altitude,
            "is_sharing": self.is_sharing,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @staticmethod
    def from_dict(data: dict):
        """Create location from dictionary (MongoDB document)"""
        return Location(
            user_id=data.get("user_id"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            accuracy=data.get("accuracy"),
            altitude=data.get("altitude"),
            is_sharing=data.get("is_sharing", True),
            _id=data.get("_id"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
