from pymongo import MongoClient
from config import settings

# MongoDB client
client = MongoClient(settings.MONGODB_URL)
database = client[settings.DATABASE_NAME]

def get_db():
    """Get database connection"""
    return database

def close_db():
    """Close database connection"""
    client.close()
