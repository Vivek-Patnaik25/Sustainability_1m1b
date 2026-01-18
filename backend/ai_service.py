import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import glob

# Load env variables (try current dir and parent dir)
load_dotenv()
load_dotenv(dotenv_path="../.env")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=API_KEY)

MODEL_NAME = "gemini-2.5-flash"

def load_rag_knowledge_base():
    """
    Loads markdown files from the data/rag_docs directory.
    Returns a string containing the combined knowledge base.
    """
    kb_content = ""
    try:
        # Define path - support running from root or backend/
        base_path = "data/rag_docs"
        if not os.path.exists(base_path):
            base_path = "backend/data/rag_docs"
        
        if not os.path.exists(base_path):
            print(f"Warning: RAG docs path not found at {base_path}")
            return "Knowledge Base not found."

        # Read all .md files
        md_files = glob.glob(os.path.join(base_path, "*.md"))
        
        for file_path in md_files:
            filename = os.path.basename(file_path)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                kb_content += f"\n--- DOCUMENT: {filename} ---\n{content}\n"
        
        return kb_content
    except Exception as e:
        print(f"Error loading RAG Knowledge Base: {e}")
        return "Error loading Knowledge Base."

RAG_CONTEXT = load_rag_knowledge_base()

def analyze_issues(texts: list[str]):
    """
    Analyzes a list of text entries to identify sustainability issues,
    map them to SDGs using a lightweight RAG approach.
    """
    if not API_KEY:
        return {"error": "GEMINI_API_KEY is missing."}

    results = []
    
    # RAG: We inject the specific UN SDG definitions and targets into the prompt
    # ensuring the model 'retrieves' or adheres to this specific knowledge.
    
    model = genai.GenerativeModel(MODEL_NAME)

    for text in texts:
        prompt = f"""
        You are an AI assistant for the "1M1B AI for Sustainability" internship project.
        Your task is to analyze local issue reports using the provided Knowledge Base.

        STRICT INSTRUCTIONS:
        1. Context-Grounded Generation (RAG): You must base your SDG classification and "Why" explanation on the provided Knowledge Base documents.
        2. Transparency: Explicitly cite which SDG Target or concept from the documents matches the issue.
        3. Responsible AI: Your recommendations should be helpful and safe, but clearly state they are AI-generated suggestions, not legal advice.

        KNOWLEDGE BASE (Trusted Sources):
        {RAG_CONTEXT}

        USER REPORT:
        "{text}"

        TASK:
        1. Identify the Core Issue.
        2. Classify SDG: Choose the MOST relevant SDG (11, 6, 12, or 13) from the Knowledge Base.
        3. Estimate Severity (Low, Medium, High).
        4. Recommend Action: Suggest a practical step based on the "General Sustainability Best Practices" or specific SDG targets.
        5. Explain Logic (RAG): Explain *why* you chose this SDG by quoting or referencing a specific target (e.g., "Aligns with Target 11.6 regarding waste management").
        6. Cite Sources: List the specific document names used (e.g., "sdg_11.md").

        OUTPUT JSON format ONLY:
        {{
            "issue": "Brief description of the issue",
            "sdg": "SDG ##",
            "severity": "Low/Medium/High",
            "summary": "One sentence summary",
            "recommendation": "Actionable advice",
            "explanation": "Explanation citing specific targets/documents",
            "rag_sources": ["List of document names used"]
        }}
        """

        try:
            response = model.generate_content(prompt)
            # Basic cleanup
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
