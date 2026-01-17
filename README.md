# AI-Powered Local Sustainability Issue Analyzer

## Overview
A text-only AI web application designed to help communities identify, classify, and summarize local sustainability issues. Built for the **1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship**.

**Primary SDG:** SDG 11 – Sustainable Cities and Communities  
**Secondary SDGs:** SDG 6, SDG 12, SDG 13

## Features
- **Issue Analysis:** Classifies text inputs into relevant UN SDGs.
- **Explainable AI:** Provides clear reasons for classification and recommendations.
- **Privacy-First:** Stateless backend, no data persistence.
- **Responsible AI:** Includes ethical considerations and limitations.

## Tech Stack
- **Frontend:** Next.js (App Router) on Vercel
- **Backend:** FastAPI (Python) on Render
- **AI Model:** Gemini 2.5 Flash (via Google Gen AI SDK)

## Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Google Gemini API Key

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.
5. Run server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Deployment

### Render (Backend)
1. Link GitHub repo to Render.
2. Select "Web Service".
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add `GEMINI_API_KEY` to Environment Variables.

### Vercel (Frontend)
1. Link GitHub repo to Vercel.
2. Configure preset for Next.js.
3. Add environment variable `NEXT_PUBLIC_API_URL` pointing to your Render backend URL.

## Responsible AI Statement
This tool uses Large Language Models to analyze text. While it aims for accuracy, AI models can hallucinate or be biased. Results should be verified by human judgment before taking action. No user data is stored on our servers.
