# Endpoint pour récupérer les expériences (placé juste avant l'inclusion du router)

# Endpoint pour récupérer les expériences (placé juste avant l'inclusion du router)

# Endpoint pour créer une réservation (placé à la fin pour éviter les erreurs de portée)


import os
import uuid
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Depends, Request, HTTPException, status, Header
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
import threading



ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')



app = FastAPI()


# Redirection explicite de /api vers /api/
@app.get("/api", include_in_schema=False)
async def redirect_api():
    return RedirectResponse(url="/api/")


# Log de démarrage pour vérifier les routes exposées (factorisé)
@app.on_event("startup")
async def log_routes():
    print("--- ROUTES REGISTERED ---")
    for route in app.routes:
        print(f"{route.path} -> {route.name}")
    print("------------------------")

api_router = APIRouter(prefix="/api")




# Thread-safe in-memory DBs
users_db = {}
experiences_db = {}
bookings_db = {}
db_lock = threading.Lock()


@api_router.get("/", tags=["root"])
async def root():
    return {
        "message": "Welcome to Rihla API",
        "endpoints": [
            "/auth/register", "/auth/login", "/auth/me", "/experiences", "/users/{id}", "/bookings"
        ]
    }



# Health check at root (not under /api)

@app.get("/health")
async def root_health_check():
    return {"status": "OK", "message": "Rihla Backend API is running"}


@api_router.get("/health", tags=["health"])
async def api_health_check():
    return {"status": "OK", "message": "Rihla Backend API is running"}


@api_router.post("/auth/register", status_code=201, tags=["auth"])
async def register(request: Request):
    user = await request.json()
    # Ajouter isHost à False immédiatement après récupération du JSON
    if "isHost" not in user:
        user["isHost"] = False
    required = ["firstName", "lastName", "email", "password"]
    for field in required:
        if field not in user or not user[field]:
            raise HTTPException(status_code=422, detail=f"Missing field: {field}")
    user_id = str(uuid.uuid4())
    user["id"] = user_id
    with db_lock:
        users_db[user["email"]] = user
    token = f"token-{user_id}"
    return {
        "success": True,
        "data": {
            "user": {
                "id": user_id,
                "firstName": user["firstName"],
                "lastName": user["lastName"],
                "email": user["email"],
            "isHost": user["isHost"]
            },
            "tokens": {
                "accessToken": token
            }
        }
    }


@api_router.post("/auth/login", tags=["auth"])
async def login(request: Request):
    data = await request.json()
    with db_lock:
        user_dict = users_db.get(data.get("email"))
    if not user_dict or user_dict.get("password") != data.get("password"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = f"token-{user_dict['id']}"
    return {
        "success": True,
        "data": {
            "user": {
                "id": user_dict["id"],
                "firstName": user_dict["firstName"],
                "lastName": user_dict["lastName"],
                "email": user_dict["email"],
                "isHost": user_dict["isHost"]
            },
            "tokens": {
                "accessToken": token
            }
        }
    }

# Simulate token-based authentication

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ", 1)[1]
    with db_lock:
        for user in users_db.values():
            if f"token-{user['id']}" == token:
                return user
    raise HTTPException(status_code=401, detail="Invalid token")


@api_router.get("/auth/me", tags=["auth"])
async def get_me(user=Depends(get_current_user)):
    user_data = None
    if user:
        user_data = {
            "id": user.get("id"),
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "email": user.get("email"),
            "isHost": user.get("isHost", False)
        }
    return {
        "success": True,
        "data": {"user": user_data}
    }


# Modèle pour la création (sans hostId)





@api_router.api_route("/experiences", methods=["POST"], status_code=201, tags=["experiences"], include_in_schema=True)
async def create_experience(request: Request, user=Depends(get_current_user)):
    if not user or not user.get("isHost"):
        raise HTTPException(status_code=403, detail="Only hosts can create experiences")
    try:
        exp = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    if not exp.get("hostId"):
        exp["hostId"] = user["id"]
    required_fields = ["title", "description", "category", "location", "price", "duration", "groupSize", "highlights", "images", "hostId"]
    for field in required_fields:
        if field not in exp or exp[field] in [None, ""]:
            raise HTTPException(status_code=422, detail=f"Missing field: {field}")
    exp_id = str(uuid.uuid4())
    exp_dict = exp.copy()
    exp_dict["id"] = exp_id
    exp_dict["hostId"] = exp["hostId"]
    with db_lock:
        experiences_db[exp_id] = exp_dict
    return {
        "success": True,
        "data": {
            "experience": exp_dict
        }
    }



@api_router.get("/experiences", tags=["experiences"])
async def get_experiences():
    with db_lock:
        experiences = list(experiences_db.values())
    return {
        "success": True,
        "data": {
            "experiences": experiences
        }
    }


@api_router.get("/users/{user_id}", tags=["users"])
async def get_user_profile(user_id: str):
    user_data = None
    with db_lock:
        for user in users_db.values():
            if user["id"] == user_id:
                user_data = {
                    "id": user.get("id"),
                    "firstName": user.get("firstName"),
                    "lastName": user.get("lastName"),
                    "email": user.get("email"),
                    "isHost": user.get("isHost", False)
                }
                break
    return {
        "success": True,
        "data": {"user": user_data}
    }




@api_router.get("/bookings/my-bookings", tags=["bookings"])
async def get_my_bookings(user=Depends(get_current_user)):
    if user is None or "id" not in user:
        raise HTTPException(status_code=401, detail="Missing user token")
    user_id = user["id"]
    with db_lock:
        user_bookings = [b for b in bookings_db.values() if b.get("userId") == user_id]
    return {
        "success": True,
        "data": {
            "bookings": user_bookings
        }
    }

# --- AUTRES ENDPOINTS ---

# Endpoint pour récupérer les réservations de l'utilisateur connecté (à la fin du fichier)



# Log de démarrage pour vérifier les routes
@app.on_event("startup")
async def log_routes():
    print("--- ROUTES REGISTERED ---")
    for route in app.routes:
        print(f"{route.path} -> {route.name}")
    print("------------------------")







# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["https://rihlama.com"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Désactiver le mode debug en production
import logging
logging.getLogger("uvicorn.error").setLevel(logging.INFO)
logging.getLogger("uvicorn.access").setLevel(logging.INFO)

# Headers de sécurité
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["rihlama.com", "www.rihlama.com"])

async def shutdown_db_client():
    pass  # Removed unnecessary client.close() reference



# Endpoint pour créer une réservation (placé à la fin pour éviter les erreurs de portée)

@api_router.post("/bookings", status_code=201, tags=["bookings"])
async def create_booking(request: Request, user=Depends(get_current_user)):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    if "experienceId" not in data or not data["experienceId"]:
        raise HTTPException(status_code=422, detail="Missing experienceId")
    if user is None or "id" not in user:
        raise HTTPException(status_code=401, detail="Missing user token")
    booking_id = str(uuid.uuid4())
    booking = {
        "id": booking_id,
        "userId": user["id"],
        "experienceId": data["experienceId"],
        "date": data.get("date", "2025-08-26"),
        "status": data.get("status", "confirmed")
    }
    with db_lock:
        bookings_db[booking_id] = booking
    return {
        "success": True,
        "data": {
            "booking": booking
        }
    }
