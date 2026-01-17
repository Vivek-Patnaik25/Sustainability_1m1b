import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables (try current dir and parent dir)
load_dotenv()
load_dotenv(dotenv_path="../.env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=API_KEY)

MODEL_NAME = "gemini-2.5-flash"

def load_knowledge_base():
    try:
        # Assuming the code is run from backend/ directory
        path = os.path.join("data", "knowledge_base.json")
        if not os.path.exists(path):
            # Fallback if run from root
            path = os.path.join("backend", "data", "knowledge_base.json")
        
        with open(path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading knowledge base: {e}")
        return {"sdgs": {}, "best_practices": []}

KB = load_knowledge_base()

def analyze_issues(texts: list[str]):
    """
    Analyzes a list of text entries to identify sustainability issues,
    map them to SDGs, and provide recommendations.
    """
    if not API_KEY:
        return {"error": "GEMINI_API_KEY is missing."}

    results = []
    
    # Simple "RAG": Inject KB info into prompt
    sdg_info = json.dumps(KB["sdgs"], indent=2)
    best_practices = "\n".join(KB["best_practices"])

    model = genai.GenerativeModel(MODEL_NAME)

    for text in texts:
        prompt = f"""
        You are an AI assistant for the "AI-Powered Local Sustainability Issue Analyzer".
        Your goal is to analyze the following user-reported issue text and map it to one of the following UN SDGs:
        - SDG 11 (Sustainable Cities & Communities) - Primary
        - SDG 6 (Clean Water & Sanitation)
        - SDG 12 (Responsible Consumption & Production)
        - SDG 13 (Climate Action)
        
        Use the provided Knowledge Base context to help your decision and recommendations.

        Knowledge Base:
        SDGs: {sdg_info}
        Best Practices: {best_practices}

        User Input: "{text}"

        Task:
        1. Identify the core issue (e.g., "overflowing trash", "water leak").
        2. Classify the SDG (Choose the MOST relevant one from 6, 11, 12, 13. Default to 11 if unsure but relevant to city).
        3. Estimate Severity (Low, Medium, High) based on urgency and sentiment.
        4. Provide a Summary (1 sentence).
        5. Suggest an Action (based on best practices or general sustainability logic).
        6. Explain WHY you chose this SDG (Explainable AI).

        Output JSON structure ONLY:
        {{
            "issue": "string",
            "sdg": "string (e.g., 'SDG 11')",
            "severity": "string",
            "summary": "string",
            "recommendation": "string",
            "explanation": "string"
        }}
        """

        try:
            response = model.generate_content(prompt)
            # Basic cleanup to ensure JSON parsing if model adds backticks
            content = response.text.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            
            parsed = json.loads(content)
            results.append({
                "original_text": text,
                "analysis": parsed
            })
        except Exception as e:
            results.append({
                "original_text": text,
                "error": str(e)
            })

    return {"results": results}
