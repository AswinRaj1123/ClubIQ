# VoltGuard Backend API

FastAPI-based backend for VoltGuard - Smart Power Grid Inspection System with AI-Powered Drone Monitoring.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- MongoDB (running locally or remote)
- pip (Python package manager)

### Installation

1. **Clone and navigate to backend directory**
```bash
cd voltguard-backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your MongoDB URL and settings
```

5. **Start the server**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Authentication Endpoints

### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "consumer",
  "phone": "+1234567890",
  "company": "Power Co"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "consumer",
    "phone": "+1234567890",
    "company": "Power Co",
    "is_active": true,
    "created_at": "2024-02-14T10:30:00"
  }
}
```

### Sign In
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** (Same as Sign Up)

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <access_token>
```

## 📁 Project Structure

```
voltguard-backend/
├── main.py              # FastAPI app entry point
├── config.py            # Configuration and settings
├── database.py          # MongoDB connection
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (local)
├── .env.example         # Environment template
│
├── models/              # Database models
│   ├── __init__.py
│   └── user.py
│
├── schemas/             # Pydantic request/response schemas
│   ├── __init__.py
│   └── auth.py
│
├── routes/              # API endpoints
│   ├── __init__.py
│   └── auth.py
│
└── utils/               # Helper functions
    ├── __init__.py
    └── auth.py          # Password hashing, JWT tokens
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `voltguard` |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | `secret-key-change-in-production` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `JWT_EXPIRATION_HOURS` | Token expiration in hours | `24` |

## 🔑 Features

- ✅ User Sign Up with email validation
- ✅ User Sign In with password verification
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based user types (consumer, electrician, admin)
- ✅ MongoDB integration
- ✅ CORS enabled for frontend integration
- ✅ Interactive API documentation

## 🧪 Testing

You can test the API using:
- **Swagger UI** (http://localhost:8000/docs) - Interactive documentation
- **curl** - Command line
- **Postman** - API client
- **Python requests** - Python client

Example with curl:
```bash
# Sign up
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "role": "consumer"
  }'

# Sign in
curl -X POST "http://localhost:8000/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📝 Notes

- MongoDB must be running for the API to work
- Change `JWT_SECRET_KEY` in production
- Email must be unique for each user
- Password must be at least 6 characters
- All timestamps are in UTC

## 🚀 Next Steps

- [ ] Add drone tracking endpoints
- [ ] Add fault detection API
- [ ] Add analytics endpoints
- [ ] Add WebSocket support for real-time updates
- [ ] Add database indexing for performance
- [ ] Add API rate limiting
- [ ] Add comprehensive error logging

## 📧 Support

For issues or questions, contact the development team.
