# from fastapi import FastAPI
# from pydantic import BaseModel
# import ee
# import requests

# ee.Initialize(project='geocrop-sat')

# app = FastAPI()

# class Location(BaseModel):
#     lat: float
#     lon: float

# @app.post("/get-data")
# def get_data(location: Location):
#     lat, lon = location.lat, location.lon
#     point = ee.Geometry.Point([lon, lat])

#     #rainfall
#     rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY') \
#         .filterBounds(point) \
#         .filterDate('2022-01-01', '2023-01-01') \
#         .mean().reduceRegion(
#             reducer=ee.Reducer.mean(),
#             geometry=point,
#             scale=5000
#         ).getInfo()
    
#      # --- Temperature ---
#     temperature = ee.ImageCollection('ECMWF/ERA5/DAILY') \
#         .select('mean_2m_air_temperature') \
#         .filterBounds(point) \
#         .filterDate('2022-01-01', '2023-01-01') \
#         .mean().reduceRegion(
#             reducer=ee.Reducer.mean(),
#             geometry=point,
#             scale=10000
#         ).getInfo()
    
#      # --- Elevation ---
#     elevation = ee.Image('USGS/SRTMGL1_003').reduceRegion(
#         reducer=ee.Reducer.mean(),
#         geometry=point,
#         scale=30
#     ).getInfo()

#      # --- Soil Data (SoilGrids) ---
#     soil_url = f"https://rest.soilgrids.org/query?lon={lon}&lat={lat}"
#     soil_data = requests.get(soil_url).json()

#     pH = soil_data['properties']['phh2o']['values']['sl1']['mean']
#     sand = soil_data['properties']['sand']['values']['sl1']['mean']
#     clay = soil_data['properties']['clay']['values']['sl1']['mean']

#     return {
#         "rainfall_mm": rainfall,
#         "temperature_K": temperature,
#         "elevation_m": elevation,
#         "soil": {
#             "pH": pH,
#             "sand": sand,
#             "clay": clay
#         }
#     }

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# import ee
# import requests

# # Initialize Earth Engine
# ee.Initialize(project='geocrop-sat')

# # FastAPI app
# app = FastAPI()

# # Allow all CORS origins (adjust for production)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace with frontend domain in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class Location(BaseModel):
#     lat: float
#     lon: float

# @app.post("/get-data")
# def get_data(location: Location):
#     try:
#         lat, lon = location.lat, location.lon
#         point = ee.Geometry.Point([lon, lat])  # Correct order: [lon, lat]

#         # --- Rainfall ---
#         rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY') \
#             .filterBounds(point) \
#             .filterDate('2022-01-01', '2023-01-01') \
#             .mean() \
#             .reduceRegion(reducer=ee.Reducer.mean(), geometry=point, scale=5000) \
#             .getInfo()

#         # --- Temperature ---
#         temperature = ee.ImageCollection('ECMWF/ERA5/DAILY') \
#             .select('mean_2m_air_temperature') \
#             .filterBounds(point) \
#             .filterDate('2022-01-01', '2023-01-01') \
#             .mean() \
#             .reduceRegion(reducer=ee.Reducer.mean(), geometry=point, scale=10000) \
#             .getInfo()

#         # --- Elevation ---
#         elevation = ee.Image('USGS/SRTMGL1_003') \
#             .reduceRegion(reducer=ee.Reducer.mean(), geometry=point, scale=30) \
#             .getInfo()

#         # --- SoilGrids Data ---
#         soil_url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}&depth=0-5cm&property=phh2o&property=sand&property=clay"
#         response = requests.get(soil_url)
#         if response.status_code != 200:
#             raise HTTPException(status_code=500, detail="Failed to fetch soil data.")
#         soil_data = response.json()

#         # Soil values extraction
#         pH = soil_data['properties']['phh2o']['layers'][0]['depths'][0]['values']['mean']
#         sand = soil_data['properties']['sand']['layers'][0]['depths'][0]['values']['mean']
#         clay = soil_data['properties']['clay']['layers'][0]['depths'][0]['values']['mean']

#         return {
#             "rainfall_mm": rainfall,
#             "temperature_K": temperature,
#             "elevation_m": elevation,
#             "soil": {
#                 "pH": pH,
#                 "sand": sand,
#                 "clay": clay
#             }
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import ee
# import requests

# # Initialize Earth Engine
# ee.Initialize(project='geocrop-sat')

# app = FastAPI()

# # Allow frontend requests (for local dev)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class Location(BaseModel):
#     lat: float
#     lon: float

# @app.post("/get-data")
# def get_data(location: Location):
#     lat, lon = location.lat, location.lon
#     point = ee.Geometry.Point([lon, lat])

#     try:
#         # Rainfall
#         rainfall = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY') \
#             .filterBounds(point) \
#             .filterDate('2022-01-01', '2023-01-01') \
#             .mean().reduceRegion(
#                 reducer=ee.Reducer.mean(),
#                 geometry=point,
#                 scale=5000
#             ).getInfo()

#         # Temperature
#         temperature = ee.ImageCollection('ECMWF/ERA5/DAILY') \
#             .select('mean_2m_air_temperature') \
#             .filterBounds(point) \
#             .filterDate('2022-01-01', '2023-01-01') \
#             .mean().reduceRegion(
#                 reducer=ee.Reducer.mean(),
#                 geometry=point,
#                 scale=10000
#             ).getInfo()

#         # Elevation
#         elevation = ee.Image('USGS/SRTMGL1_003').reduceRegion(
#             reducer=ee.Reducer.mean(),
#             geometry=point,
#             scale=30
#         ).getInfo()

#         # Soil Data
# # Soil Data (from ISRIC SoilGrids v2)
#         soil_url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}&property=phh2o&property=sand&property=clay&depth=0-5cm&value=mean"
#         soil_response = requests.get(soil_url)

#         if not soil_response.ok:
#             raise HTTPException(status_code=502, detail="Failed to fetch soil data")

#         soil_data = soil_response.json()
#         print(soil_data)
#         # pH = soil_data['properties']['phh2o']['layers'][0]['depths'][0]['values']['mean']
#         # sand = soil_data['properties']['sand']['layers'][0]['depths'][0]['values']['mean']
#         # clay = soil_data['properties']['clay']['layers'][0]['depths'][0]['values']['mean']


#         return {
#             "soil_data-debug": soil_data,
#             "rainfall_mm": rainfall,
#             "temperature_K": temperature,
#             "elevation_m": elevation,
#             # "soil": {
#             #     "pH": pH,
#             #     "sand": sand,
#             #     "clay": clay
#             # }
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ee
import requests

# Initialize Earth Engine
ee.Initialize(project='geocrop-sat')

app = FastAPI()

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Location(BaseModel):
    lat: float
    lon: float

@app.post("/get-data")
def get_data(location: Location):
    lat, lon = location.lat, location.lon
    point = ee.Geometry.Point([lon, lat])

    try:
        # Rainfall
        rainfall_data = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY') \
            .filterBounds(point) \
            .filterDate('2022-01-01', '2023-01-01') \
            .mean().reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=point,
                scale=5000
            ).getInfo()

        # Temperature
        temperature_data = ee.ImageCollection('ECMWF/ERA5/DAILY') \
            .select('mean_2m_air_temperature') \
            .filterBounds(point) \
            .filterDate('2022-01-01', '2023-01-01') \
            .mean().reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=point,
                scale=10000
            ).getInfo()

        # Elevation
        elevation_data = ee.Image('USGS/SRTMGL1_003') \
            .reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=point,
                scale=30
            ).getInfo()

        # Soil Data (from ISRIC SoilGrids)
        soil_url = (
            f"https://rest.isric.org/soilgrids/v2.0/properties/query"
            f"?lon={lon}&lat={lat}&property=phh2o&property=sand&property=clay"
            f"&depth=0-5cm&value=mean"
        )
        soil_response = requests.get(soil_url)
        if not soil_response.ok:
            raise HTTPException(status_code=502, detail="Failed to fetch soil data")

        soil_json = soil_response.json()

        # Parse Soil Data
        ph_value = None
        sand_value = None
        clay_value = None

        layers = soil_json.get("properties", {}).get("layers", [])
        for layer in layers:
            name = layer.get("name")
            mean_val = layer.get("depths", [{}])[0].get("values", {}).get("mean")
            if mean_val is not None:
                mean_val = mean_val / 10  # Convert scale

            if name == "phh2o":
                ph_value = mean_val
            elif name == "sand":
                sand_value = mean_val
            elif name == "clay":
                clay_value = mean_val

        # Parse Temperature & Rainfall & Elevation safely
        temp_value = temperature_data.get("mean_2m_air_temperature", None)
        rainfall_value = rainfall_data.get("precipitation", None)
        elevation_value = elevation_data.get("elevation", None)

        return {
            "temperature_K": temp_value,
            "rainfall_mm": rainfall_value,
            "elevation_m": elevation_value,
            "soil": {
                "pH": ph_value,
                "sand_%": sand_value,
                "clay_%": clay_value
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")
