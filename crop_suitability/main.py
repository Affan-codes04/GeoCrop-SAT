from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

# Make sure this file is in the same directory
from fuzzyCropSuitabilityNew import CropSuitabilitySystem

app = FastAPI(
    title="Crop Suitability API",
    description="An API to suggest suitable crops based on environmental parameters using fuzzy logic.",
    version="1.0.0",
)

# Initialize the system with your dataset path
# This is loaded once when the server starts
try:
    system = CropSuitabilitySystem("indian_crops_filtered.csv")
    print("Crop Suitability System initialized successfully.")
except Exception as e:
    print(f"FATAL: Could not initialize CropSuitabilitySystem. Error: {e}")
    # In a real application, you might want to prevent the server from starting
    # if the core system fails to load.
    system = None

# Pydantic model for request body, now with optional fields
class EnvironmentInput(BaseModel):
    temperature: Optional[float] = None
    rainfall: Optional[float] = None
    ph: Optional[float] = None
    altitude: Optional[float] = None
    fertility: Optional[str] = None
    salinity: Optional[str] = None
    drainage: Optional[str] = None
    depth: Optional[str] = None
    texture: Optional[str] = None

class CropCheckRequest(BaseModel):
    crop_name: str
    environment: EnvironmentInput

@app.on_event("startup")
async def startup_event():
    if system is None:
        # This is a simple way to handle the case where initialization failed.
        # The server will run but endpoints will return an error.
        print("WARNING: System is not available. API endpoints will fail.")

@app.post("/suggest_crops/", tags=["Crop Suggestions"])
def suggest_crops(env: EnvironmentInput):
    """
    Accepts environmental parameters and returns a list of top suitable crops.
    You can omit parameters you don't have data for.
    """
    if system is None:
        raise HTTPException(status_code=503, detail="System not initialized. Check server logs.")
    try:
        # Create a dictionary, excluding keys with None values
        env_params = {k: v for k, v in env.dict().items() if v is not None}
        if not env_params:
            raise HTTPException(status_code=400, detail="At least one environmental parameter must be provided.")
        
        result = system.find_suitable_crops(env_params)
        return {"recommended_crops": result}
    except Exception as e:
        # Log the full error for debugging
        print(f"Error in /suggest_crops: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {e}")

@app.post("/check_crop/", tags=["Crop Details"])
def check_crop(req: CropCheckRequest):
    """
    Provides a detailed suitability analysis for a specific crop in a given environment.
    """
    if system is None:
        raise HTTPException(status_code=503, detail="System not initialized. Check server logs.")
    try:
        env_params = {k: v for k, v in req.environment.dict().items() if v is not None}
        result = system.get_crop_details(req.crop_name, env_params=env_params)
        if 'error' in result:
             raise HTTPException(status_code=404, detail=result['error'])
        return result
    except Exception as e:
        print(f"Error in /check_crop: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {e}")

@app.get("/", tags=["Root"])
def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the Crop Suitability API. Go to /docs to see the endpoints."}