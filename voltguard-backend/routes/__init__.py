from .auth import router as auth_router
from .consumer import router as consumer_router
from .electrician import router as electrician_router
from .chat import router as chat_router

__all__ = ["auth_router", "consumer_router", "electrician_router", "chat_router"]
