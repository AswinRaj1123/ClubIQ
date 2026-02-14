from datetime import datetime
from bson import ObjectId

class User:
    """User model for MongoDB"""
    
    def __init__(
        self,
        email: str,
        password_hash: str,
        full_name: str,
        role: str = "consumer",
        phone: str = None,
        company: str = None,
        is_active: bool = True,
        _id: ObjectId = None,
        created_at: datetime = None,
        updated_at: datetime = None
    ):
        self._id = _id or ObjectId()
        self.email = email
        self.password_hash = password_hash
        self.full_name = full_name
        self.role = role  # consumer, electrician, admin
        self.phone = phone
        self.company = company
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
    
    def to_dict(self):
        """Convert user to dictionary for MongoDB"""
        return {
            "_id": self._id,
            "email": self.email,
            "password_hash": self.password_hash,
            "full_name": self.full_name,
            "role": self.role,
            "phone": self.phone,
            "company": self.company,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @staticmethod
    def from_dict(data: dict):
        """Create user from dictionary (MongoDB document)"""
        return User(
            email=data.get("email"),
            password_hash=data.get("password_hash"),
            full_name=data.get("full_name"),
            role=data.get("role", "consumer"),
            phone=data.get("phone"),
            company=data.get("company"),
            is_active=data.get("is_active", True),
            _id=data.get("_id"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at")
        )
