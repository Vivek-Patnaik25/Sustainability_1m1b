# AI-Powered Local Sustainability Issue Analyzer
**Live Demo:** [https://sustainability-1m1b.vercel.app/](https://sustainability-1m1b.vercel.app/)

## Overview
A **Multimodal AI web application** designed to help communities identify, classify, and summarize local sustainability issues. Users can report issues via **Text, Voice, or Image**, and the AI analyzes them against UN Sustainable Development Goals (SDGs).

**Primary SDG:** SDG 11 – Sustainable Cities and Communities  
**Secondary SDGs:** SDG 6 (Water), SDG 12 (Consumption), SDG 13 (Climate Action)

## Key Features
- **Multimodal Inputs:**
  - **Voice:** Real-time speech-to-text using Web Speech API.
  - **Image:** Analyze photos of sustainability issues using **Gemini 2.5 Flash Vision**.
  - **Text:** Direct reporting of issues.
- **RAG-Powered Analysis:** Answers are grounded in a trusted Knowledge Base of UN SDG targets (Goals 6, 11, 12, 13) for verifiable explanations.
- **Premium UI/UX:**
  - **Glassmorphism Design:** Modern, translucent aesthetic with mesh gradients.
  - **Interactive Elements:** Framer Motion animations, hovering 3D cards, and "EcoBot" avatar.
- **Responsible AI:**
  - **Transparency:** Cites specific "Knowledge Sources" (e.g., Target 11.6).
  - **Privacy:** State-of-the-art privacy; no audio/images are permanently stored.

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Framer Motion (deployed on Vercel)
- **Backend:** FastAPI, Python (deployed on Render)
- **AI Model:** Google Gemini 2.5 Flash (Text & Vision)
- **RAG:** Local Markdown Knowledge Base

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
This tool uses Large Language Models to analyze inputs. While it aims for accuracy by grounding answers in UN documents, AI models can hallucinate. Results should be verified by human judgment. We are committed to data minimization: user images and audio are processed for analysis only and are not retained.
