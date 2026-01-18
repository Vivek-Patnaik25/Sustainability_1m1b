# Responsible AI & Multimodal Implementation

## Overview
This application has been upgraded to support **Multimodal Inputs** (Voice and Image) to enhance accessibility and user engagement, while strictly strictly adhering to Responsible AI principles.

## Multimodal Features
1.  **Voice Input (Speech-to-Text):**
    -   **Goal:** Accessibility for users who cannot type.
    -   **Technology:** Uses the browser's built-in **Web Speech API** for privacy-preserving, on-device transcription (where supported).
    -   **Processing:** The voice is transcribed into text *before* being sent to the AI, ensuring the user can verify the input.

2.  **Image Input (Vision-to-Text):**
    -   **Goal:** Allow users to capture evidence of issues (e.g., overflowing trash).
    -   **Technology:** Uses **Google Gemini 2.5 Flash** (Vision) to generate a neutral, factual description of the image.
    -   **Privacy:** Images are processed in-memory and NOT stored permanently. Faces or PII are ignored in the system instructions.

## Architecture
```
[User Input] 
    |
    +--- Text (Typed) ---------+
    |                          |
    +--- Voice (Microphone) --> [Browser STT] --> [Transcribed Text]
    |                          |
    +--- Image (Upload) ------> [Gemini Vision] --> [Image Description]
                               |
                               v
                       [Unified Text Pipeline]
                               |
                       [RAG Knowledge Base]
                               |
                       [Gemini 2.5 Flash]
                               |
                               v
                    [SDG Classification & Reform]
```

## Responsible AI Commitments
-   **Transparency:** Users always see the text that the AI is analyzing (whether transcribed from voice or described from an image).
-   **Data Minimization:** No images or audio recordings are saved to a database.
-   **No Surveillance:** The Vision AI is instructed to focus *only* on sustainability issues (waste, water, nature), not people.

## Deployment
-   **Frontend:** Next.js (Vercel) handles the UI for recording and uploading.
-   **Backend:** FastAPI (Render) handles the Vision processing and RAG pipeline.
