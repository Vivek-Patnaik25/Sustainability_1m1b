# RAG Architecture Explanation

## Overview
This application uses a **lightweight, text-only Retrieval-Augmented Generation (RAG)** pipeline to ground its AI analysis in verified UN Sustainable Development Goal (SDG) targets. This ensures that recommendations are responsible, consistent, and explainable.

## Components

### 1. Knowledge Base (Curated Context)
Instead of a complex vector database, we use a curated set of **Markdown files** stored in `backend/data/rag_docs/`.
- **Content:** These files contain specific Targets (e.g., 11.6, 6.1) and established best practices for Sustainability.
- **Why:** This "Small Data" approach eliminates the need for external text embeddings or vector stores, making the solution efficient and suitable for student-level projects while maintaining high accuracy.

### 2. Retrieval & Context Injection
When an analysis request is received:
1.  **Loader:** The system reads all `.md` files from the knowledge base directory.
2.  **Injection:** The content of these files is dynamically injected into the System Prompt of the LLM (Google Gemini).
3.  **Instruction:** The LLM is strictly instructed to *only* use information found in these documents to justify its classification.

### 3. Generation & Explainability
The model generates a response that includes:
- **Classification:** Mapping the issue to an SDG.
- **Grounding:** It must cite the specific document or target used (e.g., "Based on Target 11.6 in sdg_11.md").
- **Transparency:** The Frontend (`IssueCard.tsx`) explicitly displays these sources to the user, fulfilling the "Responsible AI" requirement for explainability.
