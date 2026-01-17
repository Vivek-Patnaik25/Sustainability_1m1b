from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai_service import analyze_issues
import os

app = FastAPI(
    title="1M1B Sustainability Analyzer API",
    description="API for identifying and classifying local sustainability issues using Gemini AI.",
    version="1.0.0"
)

# CORS Setup
origins = [
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app", # Placeholder for actual deployment
    "*" # Allow all for simplicity in hackathon/demo context, limit in real prod
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    texts: list[str]

@app.get("/")
def read_root():
    return {"message": "Sustainability Analyzer API is running. Use POST /analyze to analyze text."}

@app.post("/analyze")
def analyze_text(request: AnalysisRequest):
    if not request.texts:
        raise HTTPException(status_code=400, detail="No text provided for analysis.")
    
    if len(request.texts) > 10:
        raise HTTPException(status_code=400, detail="Too many entries. Please submit 10 or fewer.")

    result = analyze_issues(request.texts)
    
    if "error" in result:
        # If API key is missing or other system error
        # In a real app, might want 500, but here let's return 200 with error info or 503
        if "API_KEY" in result["error"]:
             raise HTTPException(status_code=500, detail=result["error"])
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
