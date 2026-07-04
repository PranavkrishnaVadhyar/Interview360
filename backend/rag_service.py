import json
import math
import os
import re
from dataclasses import dataclass
from pathlib import Path

from openai import OpenAI
from pypdf import PdfReader


SUPPORTED_TEXT_EXTENSIONS = {".txt", ".md", ".csv"}


@dataclass
class Chunk:
    source: str
    text: str
    embedding: list[float]


class RAGService:
    def __init__(self, documents_dir: Path, model: str, embedding_model: str):
        self.documents_dir = Path(documents_dir)
        self.model = model
        self.embedding_model = embedding_model
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        self.chunks: list[Chunk] = []
        self.reload()

    @property
    def is_configured(self):
        return self.client is not None

    @property
    def chunk_count(self):
        return len(self.chunks)

    def reload(self):
        documents = load_documents(self.documents_dir)
        chunk_texts = []
        for source, text in documents:
            for chunk in split_text(text):
                chunk_texts.append((source, chunk))

        if not chunk_texts:
            self.chunks = []
            return

        if not self.client:
            self.chunks = []
            return

        embeddings = self._embed_many([text for _, text in chunk_texts])
        self.chunks = [
            Chunk(source=source, text=text, embedding=embedding)
            for (source, text), embedding in zip(chunk_texts, embeddings)
        ]

    def answer(self, query: str, top_k: int = 2):
        if not self.client:
            raise RuntimeError("OPENAI_API_KEY is not configured. Add it to .env before using AI endpoints.")

        context = self._context_for_query(query, top_k=top_k)
        input_text = build_prompt(query, context)

        response = self.client.responses.create(
            model=self.model,
            input=input_text,
        )
        return response.output_text.strip()

    def _context_for_query(self, query: str, top_k: int):
        if not self.chunks:
            return ""

        query_embedding = self._embed_one(query)
        scored_chunks = sorted(
            self.chunks,
            key=lambda chunk: cosine_similarity(query_embedding, chunk.embedding),
            reverse=True,
        )
        selected = scored_chunks[:top_k]
        return "\n\n".join(
            f"Source: {chunk.source}\n{chunk.text}"
            for chunk in selected
        )

    def _embed_one(self, text: str):
        return self._embed_many([text])[0]

    def _embed_many(self, texts: list[str]):
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=texts,
        )
        return [item.embedding for item in response.data]


def load_documents(documents_dir: Path):
    documents_dir.mkdir(exist_ok=True)
    documents = []

    for path in sorted(documents_dir.rglob("*")):
        if not path.is_file():
            continue

        if path.suffix.lower() in SUPPORTED_TEXT_EXTENSIONS:
            text = path.read_text(encoding="utf-8", errors="ignore")
        elif path.suffix.lower() == ".pdf":
            text = read_pdf_text(path)
        else:
            continue

        if text.strip():
            documents.append((path.name, text))

    return documents


def split_text(text: str, chunk_size: int = 500, overlap: int = 50):
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        if end == len(text):
            break
        start = max(0, end - overlap)

    return chunks


def cosine_similarity(left: list[float], right: list[float]):
    dot = sum(a * b for a, b in zip(left, right))
    left_norm = math.sqrt(sum(a * a for a in left))
    right_norm = math.sqrt(sum(b * b for b in right))
    if not left_norm or not right_norm:
        return 0.0
    return dot / (left_norm * right_norm)


def build_prompt(query: str, context: str):
    if not context:
        return query

    return f"""
Use the context below when it is relevant. If the context does not contain the answer,
answer from general interview knowledge and be clear about any assumptions.

Context:
{context}

Question:
{query}
"""


def read_pdf_text(path: Path):
    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages)


def extract_json_object(text: str):
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, flags=re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))
