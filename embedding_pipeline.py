import hashlib
import os
import re
from dataclasses import dataclass
from pathlib import Path

import chromadb
from openai import OpenAI
from pypdf import PdfReader


@dataclass
class IngestionResult:
    pdf_count: int
    chunk_count: int
    collection_name: str
    db_path: str

    def to_dict(self):
        return {
            "pdf_count": self.pdf_count,
            "chunk_count": self.chunk_count,
            "collection_name": self.collection_name,
            "db_path": self.db_path,
        }


class EmbeddingPipeline:
    def __init__(
        self,
        documents_dir: Path,
        db_dir: Path,
        collection_name: str,
        embedding_model: str,
        chunk_size: int = 900,
        chunk_overlap: int = 120,
    ):
        self.documents_dir = Path(documents_dir)
        self.db_dir = Path(db_dir)
        self.collection_name = collection_name
        self.embedding_model = embedding_model
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = OpenAI(api_key=self.api_key) if self.api_key else None
        self.chroma_client = chromadb.PersistentClient(path=str(self.db_dir))
        self.collection = self.chroma_client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    @property
    def is_configured(self):
        return self.openai_client is not None

    @property
    def chunk_count(self):
        return self.collection.count()

    def run(self):
        if not self.openai_client:
            raise RuntimeError("OPENAI_API_KEY is not configured. Add it to .env before running ingestion.")

        self.documents_dir.mkdir(exist_ok=True)
        self.db_dir.mkdir(exist_ok=True)

        pdfs = sorted(self.documents_dir.glob("*.pdf"))
        chunks = []
        for pdf_path in pdfs:
            text = read_pdf_text(pdf_path)
            for index, chunk_text in enumerate(split_text(text, self.chunk_size, self.chunk_overlap)):
                chunks.append({
                    "id": stable_chunk_id(pdf_path, index, chunk_text),
                    "text": chunk_text,
                    "metadata": {
                        "source": pdf_path.name,
                        "chunk_index": index,
                        "path": str(pdf_path),
                    },
                })

        self._clear_collection()
        if not chunks:
            return IngestionResult(0, 0, self.collection_name, str(self.db_dir)).to_dict()

        embeddings = self._embed_many([chunk["text"] for chunk in chunks])
        self.collection.add(
            ids=[chunk["id"] for chunk in chunks],
            documents=[chunk["text"] for chunk in chunks],
            embeddings=embeddings,
            metadatas=[chunk["metadata"] for chunk in chunks],
        )

        return IngestionResult(len(pdfs), len(chunks), self.collection_name, str(self.db_dir)).to_dict()

    def retrieve(self, query: str, top_k: int = 4):
        if not self.openai_client:
            raise RuntimeError("OPENAI_API_KEY is not configured. Add it to .env before using RAG.")

        if self.collection.count() == 0:
            return []

        query_embedding = self._embed_many([query])[0]
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        return [
            {
                "text": document,
                "source": metadata.get("source", "unknown"),
                "chunk_index": metadata.get("chunk_index"),
                "distance": distance,
            }
            for document, metadata, distance in zip(documents, metadatas, distances)
        ]

    def _embed_many(self, texts: list[str]):
        response = self.openai_client.embeddings.create(
            model=self.embedding_model,
            input=texts,
        )
        return [item.embedding for item in response.data]

    def _clear_collection(self):
        existing = self.collection.get(include=[])
        ids = existing.get("ids", [])
        if ids:
            self.collection.delete(ids=ids)


def read_pdf_text(path: Path):
    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def split_text(text: str, chunk_size: int, chunk_overlap: int):
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
        start = max(0, end - chunk_overlap)
    return chunks


def stable_chunk_id(path: Path, index: int, text: str):
    digest = hashlib.sha256(f"{path.name}:{index}:{text}".encode("utf-8")).hexdigest()
    return f"{path.stem}-{index}-{digest[:16]}"
