# Interview360 Flask API

Flask version of the notebook-based RAG interview assistant. It separates PDF ingestion and embeddings from OpenAI answer generation.

## Features

- Generate interview questions for a role.
- Evaluate submitted interview answers.
- Analyze an uploaded resume PDF.
- Ask direct questions against PDFs indexed from the `questions/` folder.
- Store vectors in a persistent local ChromaDB database.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and set `OPENAI_API_KEY`.

Add knowledge-base PDFs to `questions/`, then run ingestion. The app parses, chunks, embeds, and stores those PDFs in `chroma_db/`.

## Run

```powershell
python app.py
```

The API runs at `http://127.0.0.1:5000` by default.

## Endpoints

### Health

```http
GET /health
```

### Ingest PDFs

Parse PDFs from `questions/`, chunk them, vectorize them with OpenAI embeddings, and store them in persistent local ChromaDB.

```http
POST /ingest
```

`POST /reload` is kept as an alias for `POST /ingest`.

### Ask

```http
POST /ask
Content-Type: application/json

{
  "query": "What should I study for a Python backend interview?"
}
```

Response shape:

```json
{
  "answer": "string",
  "sources": ["source.pdf"],
  "confidence": "low | medium | high"
}
```

### Generate Questions

```http
POST /generate_questions
Content-Type: application/json

{
  "job_role": "Python Flask Developer",
  "num_questions": 5
}
```

### Evaluate Answers

```http
POST /evaluate_answers
Content-Type: application/json

{
  "1": {
    "question": "What is Flask?",
    "answer": "Flask is a lightweight Python web framework."
  }
}
```

### Analyze Resume

Send multipart form data with a PDF field named `resume`.

```powershell
curl.exe -X POST http://127.0.0.1:5000/analyze_resume -F "resume=@C:\path\to\resume.pdf"
```
