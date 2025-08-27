from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# Import your system
from fuzzyCropSuitabilityNew import CropSuitabilitySystem, REMEDIAL_MEASURES, classify_suitability

app = FastAPI(
    title="Crop Suitability API",
    description="An API to suggest suitable crops based on environmental parameters using fuzzy logic.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize system at startup
try:
    system = CropSuitabilitySystem("indian_crops_filtered.csv")
    print("Crop Suitability System initialized successfully.")
except Exception as e:
    print(f"FATAL: Could not initialize CropSuitabilitySystem. Error: {e}")
    system = None

# Models
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
        print("WARNING: System is not available. API endpoints will fail.")

@app.get("/crops")
@app.get("/crops/")
def get_crops():
    try:
        df = pd.read_csv("indian_crops_filtered.csv")
        crop_names = []

        for entry in df["COMNAME"].dropna().tolist():
            # take only the first name before the comma
            first_name = entry.split(",")[0].strip()
            crop_names.append(first_name)

        return {"crops": crop_names}
    except Exception as e:
        import traceback
        print("ERROR loading crops:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error loading crops.csv: {e}")



@app.post("/suggest_crops/", tags=["Crop Suggestions"])
def suggest_crops(env: EnvironmentInput):
    if system is None:
        raise HTTPException(status_code=503, detail="System not initialized. Check server logs.")
    try:
        env_params = {k: v for k, v in env.dict().items() if v is not None}
        if not env_params:
            raise HTTPException(status_code=400, detail="At least one environmental parameter must be provided.")

        result = system.find_suitable_crops(env_params)
        return {"recommended_crops": result}
    except Exception as e:
        print(f"Error in /suggest_crops: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {e}")

@app.post("/check_crop/", tags=["Crop Details"])
def check_crop(req: CropCheckRequest):
    if system is None:
        raise HTTPException(status_code=503, detail="System not initialized. Check server logs.")
    try:
        env_params = {k: v for k, v in req.environment.dict().items() if v is not None}
        result = system.get_crop_details(req.crop_name, env_params=env_params)
        if 'error' in result:
            raise HTTPException(status_code=404, detail=result['error'])

        # Extract score and limiting factor
        score = result.get('score', 0)
        limiting = result.get('limiting_factor', '')

        # Add suitability class and remedial measure
        suitability_class = classify_suitability(score)
        remedial = REMEDIAL_MEASURES.get(limiting, "No specific suggestion available.")

        # Add them to the result
        result['class'] = suitability_class
        result['suggested_remedial_action'] = remedial

        return {
            "crop_name": req.crop_name,
            "score": score,
            "class": suitability_class,
            "limiting_factor": limiting,
            "suggested_remedial_action": remedial,
            "missing_params": result.get("missing_params_info", {})
        }

    except Exception as e:
        print(f"Error in /check_crop: {e}")
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {e}")

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Crop Suitability API. Go to /docs to see the endpoints."}
