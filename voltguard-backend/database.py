from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

# MongoDB async client
_client = None
_database = None

async def init_db():
    """Initialize database connection"""
    global _client, _database
    _client = AsyncIOMotorClient(settings.MONGODB_URL)
    _database = _client[settings.DATABASE_NAME]
    
    # Create indexes for better performance
    users_collection = _database["users"]
    await users_collection.create_index("email", unique=True)
    print("✅ Database initialized and indexes created")

def get_db():
    """Get database connection"""
    return _database

async def close_db():
    """Close database connection"""
    global _client
    if _client:
        _client.close()
