from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class CreateFaultRequest(BaseModel):
    """Schema for creating a fault request"""
    title: str = Field(..., min_length=3, description="Fault title")
    description: str = Field(..., min_length=10, description="Detailed description")
    location: str = Field(..., description="Location of the fault")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    priority: Optional[str] = Field("medium", description="Priority: low, medium, high, critical")
    photo_url: Optional[str] = Field(None, description="URL of uploaded photo")


class FaultRequestResponse(BaseModel):
    """Schema for fault request response"""
    id: str = Field(description="Request ID")
    consumer_id: str
    title: str
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photo_url: Optional[str] = None
    status: str
    priority: str
    assigned_to: Optional[str] = None
    assigned_to_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(
        json_encoders={
            datetime: lambda v: v.isoformat() if v else None
        }
    )


class UpdateFaultRequestStatus(BaseModel):
    """Schema for updating fault request status"""
    status: str = Field(..., description="New status: open, assigned, in_progress, resolved, closed")
    assigned_to: Optional[str] = Field(None, description="Electrician ID to assign")


class FaultRequestList(BaseModel):
    """Schema for fault request list"""
    requests: List[FaultRequestResponse]
    total: int
