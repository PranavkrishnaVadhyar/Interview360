# Interview360 API Endpoints

Base URL:

```text
http://127.0.0.1:5000
```

## Health Check

```http
GET /health
```

Returns API status, ChromaDB path, OpenAI configuration status, and the number of indexed chunks.

Example response:

```json
{
  "status": "ok",
  "chunks_loaded": 24,
  "openai_configured": true,
  "chroma_db_dir": "C:\\...\\Interview360\\chroma_db"
}
```

## Ingest PDFs

```http
POST /ingest
```

Parses all PDF files inside the `questions/` folder, chunks them, creates embeddings, and stores them in local persistent ChromaDB.

Example response:

```json
{
  "status": "ingested",
  "pdf_count": 3,
  "chunk_count": 42,
  "collection_name": "interview360_questions",
  "db_path": "C:\\...\\Interview360\\chroma_db"
}
```

Alias:

```http
POST /reload
```

Same behavior as `/ingest`.

## Ask Question

```http
POST /ask
Content-Type: application/json
```

Request body:

```json
{
  "query": "What are common Flask interview questions?"
}
```

Example response:

```json
{
  "answer": "Common Flask interview questions include...",
  "sources": ["flask_interview.pdf"],
  "confidence": "high"
}
```

## Generate Interview Questions

```http
POST /generate_questions
Content-Type: application/json
```

Request body:

```json
{
  "job_role": "Python Flask Developer",
  "num_questions": 5
}
```

Example response:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "How does Flask handle routing?",
      "skill_area": "Flask fundamentals"
    }
  ]
}
```

## Evaluate Answers

```http
POST /evaluate_answers
Content-Type: application/json
```

Request body:

```json
{
  "1": {
    "question": "What is Flask?",
    "answer": "Flask is a lightweight Python web framework."
  }
}
```

Example response:

```json
{
  "evaluations": [
    {
      "id": "1",
      "question": "What is Flask?",
      "evaluation": "The answer is correct but brief.",
      "positive_remarks": ["Correctly identifies Flask as lightweight."],
      "negative_remarks": ["Could mention routing, extensions, and WSGI."],
      "score": 7
    }
  ]
}
```

## Analyze Resume

```http
POST /analyze_resume
Content-Type: multipart/form-data
```

Form field:

```text
resume: PDF file
```

Curl example:

```powershell
curl.exe -X POST http://127.0.0.1:5000/analyze_resume -F "resume=@C:\path\to\resume.pdf"
```

Example response:

```json
{
  "summary": "The resume shows backend development experience...",
  "strengths": ["Clear Python experience", "Relevant project work"],
  "improvements": ["Add measurable impact", "Clarify deployment experience"],
  "missing_skills": ["Docker", "Cloud deployment"],
  "interview_preparation_tips": ["Prepare examples around API design"]
}
```
