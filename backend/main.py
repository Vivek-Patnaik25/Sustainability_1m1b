from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai_service import analyze_issues
from ai_service_multimodal import describe_image
import os
import json

app = FastAPI(
    title="1M1B Sustainability Analyzer API",
    description="API for identifying and classifying local sustainability issues using Gemini AI (Multimodal).",
    version="1.1.0"
)

# CORS Setup
origins = [
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app", # Placeholder for actual deployment
    "*" 
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
    return {"message": "Sustainability Analyzer API is running. Use POST /analyze to analyze text, images, or voice."}

@app.post("/analyze")
async def analyze_multimodal(
    text: str = Form(None),
    image: UploadFile = File(None),
    audio: UploadFile = File(None)
):
    """
    Handles multimodal input:
    - Text (direct input or from frontend STT)
    - Image (uploaded file -> described by Vision AI)
    - Audio (feature placeholder, frontend STT preferred)
    """
    combined_texts = []

    # 1. Handle Text Input
    if text:
        # Frontend might send a JSON string of a list, or just a string
        try:
            # Try to parse if it's a JSON list string
            parsed = json.loads(text)
            if isinstance(parsed, list):
                combined_texts.extend(parsed)
            else:
                combined_texts.append(text)
        except:
            # Treated as raw string
            combined_texts.append(text)

    # 2. Handle Image Input
    if image:
        description = describe_image(image)
        combined_texts.append(f"[Image Analysis]: {description}")

    # 3. Handle Audio Input (Placeholder for now, assuming frontend handles STT)
    if audio:
        combined_texts.append("[Audio File Received]: (Voice processing is localized to Frontend Web Speech API for this demo)")

    if not combined_texts:
        raise HTTPException(status_code=400, detail="No input provided. Please provide text, image, or audio.")

    if len(combined_texts) > 10:
        raise HTTPException(status_code=400, detail="Too many entries. Please submit 10 or fewer.")

    # 4. Run existing RAG Analysis Pipeline
    result = analyze_issues(combined_texts)
    
    if "error" in result:
        if "API_KEY" in result["error"]:
             raise HTTPException(status_code=500, detail=result["error"])
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
