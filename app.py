import json
import os
from collections import OrderedDict
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

from rag_service import RAGService, extract_json_object, read_pdf_text


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
QUESTIONS_DIR = BASE_DIR / "questions"
UPLOAD_DIR = BASE_DIR / "uploads"
ALLOWED_EXTENSIONS = {"pdf"}


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024
    app.config["UPLOAD_FOLDER"] = UPLOAD_DIR

    QUESTIONS_DIR.mkdir(exist_ok=True)
    UPLOAD_DIR.mkdir(exist_ok=True)

    rag = RAGService(
        documents_dir=QUESTIONS_DIR,
        model=os.getenv("OPENAI_MODEL", "gpt-5.5"),
        embedding_model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
    )

    @app.get("/health")
    def health():
        return jsonify({
            "status": "ok",
            "chunks_loaded": rag.chunk_count,
            "openai_configured": rag.is_configured,
        })

    @app.post("/reload")
    def reload_documents():
        rag.reload()
        return jsonify({"status": "reloaded", "chunks_loaded": rag.chunk_count})

    @app.post("/ask")
    def ask():
        data = request.get_json(silent=True) or {}
        query = data.get("query")
        if not query:
            return jsonify({"error": "query is required"}), 400

        answer = safe_answer(rag, query)
        if isinstance(answer, tuple):
            return answer
        return jsonify({"answer": answer})

    @app.post("/generate_questions")
    def generate_questions():
        data = request.get_json(silent=True) or {}
        job_role = data.get("job_role")
        num_questions = data.get("num_questions", 5)

        if not job_role:
            return jsonify({"error": "job_role is required"}), 400

        try:
            num_questions = int(num_questions)
        except (TypeError, ValueError):
            return jsonify({"error": "num_questions must be an integer"}), 400

        prompt = (
            f"Generate {num_questions} interview questions for a {job_role}. "
            "Return only a JSON object where each key is the question number as a string "
            'and each value is the question text. Example: {"1": "Question text"}'
        )
        questions_json = safe_answer(rag, prompt)
        if isinstance(questions_json, tuple):
            return questions_json

        try:
            questions = extract_json_object(questions_json)
            sorted_questions = OrderedDict(
                sorted(questions.items(), key=lambda item: int(item[0]))
            )
        except (json.JSONDecodeError, ValueError, TypeError):
            return jsonify({"questions": questions_json, "warning": "Model did not return valid numbered JSON"})

        return jsonify({"questions": sorted_questions})

    @app.post("/evaluate_answers")
    def evaluate_answers():
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "JSON request body is required"}), 400

        prompt = f"""
Act as an interview answer reviewer.
Evaluate the submitted answers for correctness, clarity, strengths, and improvement areas.
Return only valid JSON in this shape:
{{
  "<id>": {{
    "question": "<question text>",
    "evaluation": "<evaluation text>",
    "positive_remarks": "<positive remarks>",
    "negative_remarks": "<negative remarks>"
  }}
}}

Submission:
{json.dumps(data, indent=2)}
"""
        evaluations_json = safe_answer(rag, prompt)
        if isinstance(evaluations_json, tuple):
            return evaluations_json

        try:
            evaluations = extract_json_object(evaluations_json)
            sorted_evaluations = OrderedDict(sorted(evaluations.items(), key=lambda item: item[0]))
        except json.JSONDecodeError:
            return jsonify({"evaluations": evaluations_json, "warning": "Model did not return valid JSON"})

        return jsonify({"evaluations": sorted_evaluations})

    @app.post("/analyze_resume")
    def analyze_resume():
        if "resume" not in request.files:
            return jsonify({"error": "resume PDF file is required"}), 400

        resume_file = request.files["resume"]
        if not resume_file.filename:
            return jsonify({"error": "resume filename is required"}), 400

        if not is_allowed_file(resume_file.filename):
            return jsonify({"error": "Only PDF files are supported"}), 400

        filename = secure_filename(resume_file.filename)
        file_path = UPLOAD_DIR / filename
        resume_file.save(file_path)

        try:
            resume_text = read_pdf_text(file_path)
            if not resume_text.strip():
                return jsonify({"error": "Could not extract text from the uploaded PDF"}), 400

            prompt = f"""
Analyze this resume for an interview preparation platform.
Give practical tips to improve content, structure, role alignment, measurable impact, and missing skills.

Resume:
{resume_text}
"""
            analysis = safe_answer(rag, prompt)
            if isinstance(analysis, tuple):
                return analysis
            return jsonify({"tips": analysis})
        finally:
            file_path.unlink(missing_ok=True)

    return app


def is_allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def safe_answer(rag, prompt):
    try:
        return rag.answer(prompt)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500


app = create_app()


if __name__ == "__main__":
    app.run(host=os.getenv("FLASK_HOST", "127.0.0.1"), port=int(os.getenv("PORT", "5000")), debug=True)
