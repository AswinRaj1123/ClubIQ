from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import auth_router, consumer_router, electrician_router, chat_router
from database import close_db, init_db

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app startup and shutdown"""
    # Startup
    await init_db()
    print("🚀 VoltGuard API started")
    yield
    # Shutdown
    await close_db()
    print("🛑 VoltGuard API stopped")

# Create FastAPI app with lifespan
app = FastAPI(
    title="VoltGuard API",
    description="Smart Power Grid Inspection with AI-Powered Drone Monitoring",
    version="1.0.0",
    lifespan=lifespan
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
