from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn

app = FastAPI()

# Enhanced CORS to ensure your Vite frontend (port 5173) can always connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

WAQI_TOKEN = "597b96da7525cbc6e5188de3ca3d863194635199"

@app.get("/api/aqi/data")
def get_aqi_data(lat: float = None, lng: float = None):
    """
    Fetches AQI data for specific coordinates. 
    Required fields: lat, lng
    """
    # 1. Validation check to prevent the 'Field Required' error
    if lat is None or lng is None:
        return {"status": "error", "message": "Missing latitude or longitude parameters."}

    url = f"https://api.waqi.info/feed/geo:{lat};{lng}/?token={WAQI_TOKEN}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0'
    }

    try:
        print(f"DEBUG: Grid Syncing for Coordinates: {lat}, {lng}")
        response = requests.get(url, headers=headers, timeout=10).json()

        if response.get('status') == 'ok':
            data = response['data']
            aqi_val = data.get('aqi')
            # Fallback for station names if they are missing from the data
            station_name = data.get('city', {}).get('name', 'Local Bagmati Sensor')
            
            return {
                "status": "ok",
                "aqi": aqi_val,
                "station": station_name,
                "advice": get_health_advice(aqi_val)
            }
        else:
            return {"status": "error", "message": "Sensor offline or busy"}

    except Exception as e:
        print(f"DEBUG: Connection Error: {e}")
        return {"status": "error", "message": "Backend Connection Failed"}

@app.get("/api/aqi")
def get_default_kathmandu():
    """
    Legacy endpoint for your main dashboard (Fixed on Ratnapark, Kathmandu)
    """
    url = f"https://api.waqi.info/feed/A517780/?token={WAQI_TOKEN}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        res = requests.get(url, headers=headers, timeout=10).json()
        if res.get('status') == 'ok':
            data = res['data']
            return {
                "city": "Kathmandu",
                "aqi": data.get('aqi'),
                "station": data.get('city', {}).get('name'),
                "status": "Live",
                "advice": get_health_advice(data.get('aqi'))
            }
    except:
        pass
    
    return {"error": "Offline", "aqi": 0, "advice": "Please check your internet connection."}

def get_health_advice(aqi):
    """Health logic applied to all cities in the province"""
    if aqi <= 50: return "Air quality is good. Enjoy your outdoor activities!"
    if aqi <= 100: return "Air quality is moderate. Sensitive groups should limit exertion."
    if aqi <= 150: return "Unhealthy for sensitive groups. Consider wearing a mask."
    if aqi <= 200: return "Unhealthy! Wear an N95 mask and avoid the outdoors."
    return "Hazardous! Stay indoors with air purifiers on."

if __name__ == "__main__":
    # Ensure you are running on 127.0.0.1:8000 for the frontend to find you
    uvicorn.run(app, host="127.0.0.1", port=8000)