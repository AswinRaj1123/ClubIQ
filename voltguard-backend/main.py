from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_router, consumer_router, electrician_router, chat_router
from database import close_db

# Create FastAPI app
app = FastAPI(
    title="VoltGuard API",
    description="Smart Power Grid Inspection with AI-Powered Drone Monitoring",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include auth routes
app.include_router(auth_router)

# Include consumer routes
app.include_router(consumer_router)

# Include electrician routes
app.include_router(electrician_router)

# Include chat routes
app.include_router(chat_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "VoltGuard API is running"}

# Startup event
@app.on_event("startup")
async def startup():
    """Initialize on startup"""
    print("🚀 VoltGuard API started")

# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    close_db()
    print("🛑 VoltGuard API stopped")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
