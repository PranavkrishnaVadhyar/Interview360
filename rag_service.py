from pathlib import Path

from embedding_pipeline import EmbeddingPipeline
from generation_pipeline import GenerationPipeline
from schemas import (
    ANSWER_SCHEMA,
    EVALUATION_SCHEMA,
    QUESTIONS_SCHEMA,
    RESUME_ANALYSIS_SCHEMA,
)


class RAGService:
    def __init__(
        self,
        documents_dir: Path,
        db_dir: Path,
        model: str,
        embedding_model: str,
        collection_name: str = "interview360_questions",
    ):
        self.embedding_pipeline = EmbeddingPipeline(
            documents_dir=documents_dir,
            db_dir=db_dir,
            collection_name=collection_name,
            embedding_model=embedding_model,
        )
        self.generation_pipeline = GenerationPipeline(model=model)

    @property
    def is_configured(self):
        return self.embedding_pipeline.is_configured and self.generation_pipeline.is_configured

    @property
    def chunk_count(self):
        return self.embedding_pipeline.chunk_count

    def ingest_documents(self):
        return self.embedding_pipeline.run()

    def answer(self, query: str, top_k: int = 4):
        context = self.embedding_pipeline.retrieve(query, top_k=top_k)
        return self.generation_pipeline.generate(
            task="Answer the user question using the retrieved PDF context when it is relevant.",
            user_input=query,
            context=context,
            schema_name="rag_answer",
            schema=ANSWER_SCHEMA,
        )

    def generate_questions(self, job_role: str, num_questions: int, top_k: int = 4):
        context = self.embedding_pipeline.retrieve(job_role, top_k=top_k)
        return self.generation_pipeline.generate(
            task=(
                f"Generate exactly {num_questions} interview questions for the job role. "
                "Questions should be practical, interview-ready, and grounded in the context when relevant."
            ),
            user_input=f"Job role: {job_role}\nNumber of questions: {num_questions}",
            context=context,
            schema_name="interview_questions",
            schema=QUESTIONS_SCHEMA,
        )

    def evaluate_answers(self, submission: dict, top_k: int = 4):
        context = self.embedding_pipeline.retrieve(str(submission), top_k=top_k)
        return self.generation_pipeline.generate(
            task=(
                "Evaluate submitted interview answers for correctness, clarity, strengths, and gaps. "
                "Use the retrieved PDF context when it helps judge correctness."
            ),
            user_input=submission,
            context=context,
            schema_name="answer_evaluations",
            schema=EVALUATION_SCHEMA,
        )

    def analyze_resume(self, resume_text: str, top_k: int = 4):
        context = self.embedding_pipeline.retrieve(resume_text[:4000], top_k=top_k)
        return self.generation_pipeline.generate(
            task=(
                "Analyze the resume for interview preparation. Focus on role alignment, measurable impact, "
                "clarity, missing skills, and concrete improvements."
            ),
            user_input=resume_text,
            context=context,
            schema_name="resume_analysis",
            schema=RESUME_ANALYSIS_SCHEMA,
        )
