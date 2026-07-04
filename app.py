import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename

from embedding_pipeline import read_pdf_text
from rag_service import RAGService


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
QUESTIONS_DIR = BASE_DIR / "questions"
UPLOAD_DIR = BASE_DIR / "uploads"
CHROMA_DB_DIR = BASE_DIR / os.getenv("CHROMA_DB_DIR", "chroma_db")
ALLOWED_EXTENSIONS = {"pdf"}


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024
    app.config["UPLOAD_FOLDER"] = UPLOAD_DIR

    QUESTIONS_DIR.mkdir(exist_ok=True)
    UPLOAD_DIR.mkdir(exist_ok=True)

    rag = RAGService(
        documents_dir=QUESTIONS_DIR,
        db_dir=CHROMA_DB_DIR,
        model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
        embedding_model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
        collection_name=os.getenv("CHROMA_COLLECTION_NAME", "interview360_questions"),
    )

    @app.get("/health")
    def health():
        return jsonify({
            "status": "ok",
            "chunks_loaded": rag.chunk_count,
            "openai_configured": rag.is_configured,
            "chroma_db_dir": str(CHROMA_DB_DIR),
        })

    @app.post("/ingest")
    def ingest_documents():
        result = safe_call(rag.ingest_documents)
        if isinstance(result, tuple):
            return result
        return jsonify({"status": "ingested", **result})

    @app.post("/reload")
    def reload_documents():
        return ingest_documents()

    @app.post("/ask")
    def ask():
        data = request.get_json(silent=True) or {}
        query = data.get("query")
        if not query:
            return jsonify({"error": "query is required"}), 400

        result = safe_call(rag.answer, query)
        if isinstance(result, tuple):
            return result
        return jsonify(result)

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

        result = safe_call(rag.generate_questions, job_role, num_questions)
        if isinstance(result, tuple):
            return result
        return jsonify(result)

    @app.post("/evaluate_answers")
    def evaluate_answers():
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "JSON request body is required"}), 400

        result = safe_call(rag.evaluate_answers, data)
        if isinstance(result, tuple):
            return result
        return jsonify(result)

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

            result = safe_call(rag.analyze_resume, resume_text)
            if isinstance(result, tuple):
                return result
            return jsonify(result)
        finally:
            file_path.unlink(missing_ok=True)

    return app


def is_allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def safe_call(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500


app = create_app()


if __name__ == "__main__":
    app.run(host=os.getenv("FLASK_HOST", "127.0.0.1"), port=int(os.getenv("PORT", "5000")), debug=True)
