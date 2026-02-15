from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class LocationUpdate(BaseModel):
    """Schema for updating user location"""
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    accuracy: Optional[float] = Field(None, description="Accuracy of location in meters")
    altitude: Optional[float] = Field(None, description="Altitude in meters")
    is_sharing: Optional[bool] = Field(True, description="Whether location is being shared")


class LocationResponse(BaseModel):
    """Schema for location response"""
    user_id: str
    latitude: float
    longitude: float
    accuracy: Optional[float]
    altitude: Optional[float]
    is_sharing: bool
    created_at: datetime
    updated_at: datetime


class LocationHistoryResponse(BaseModel):
    """Schema for location history"""
    locations: list[LocationResponse]
    total: int
