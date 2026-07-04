# Interview360 Flask API

Flask version of the notebook-based RAG interview assistant.

## Features

- Generate interview questions for a role.
- Evaluate submitted interview answers.
- Analyze an uploaded resume PDF.
- Ask direct questions against documents in the `questions/` folder.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` and set `OPENAI_API_KEY`.

Add knowledge-base files to `questions/`. Supported formats are `.txt`, `.md`, `.csv`, and `.pdf`.

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

### Reload Documents

Reload files from `questions/` after adding or editing documents.

```http
POST /reload
```

### Ask

```http
POST /ask
Content-Type: application/json

{
  "query": "What should I study for a Python backend interview?"
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
