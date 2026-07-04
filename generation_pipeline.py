import json
import os

from openai import OpenAI


class GenerationPipeline:
    def __init__(self, model: str):
        self.model = model
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    @property
    def is_configured(self):
        return self.client is not None

    def generate(self, task: str, user_input, context: list[dict], schema_name: str, schema: dict):
        if not self.client:
            raise RuntimeError("OPENAI_API_KEY is not configured. Add it to .env before using generation.")

        response = self.client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": (
                        "You are Interview360's RAG generation service. "
                        "Return only data that matches the requested JSON schema."
                    ),
                },
                {
                    "role": "user",
                    "content": build_user_message(task, user_input, context),
                },
            ],
            text={
                "format": {
                    "type": "json_schema",
                    "name": schema_name,
                    "schema": schema,
                    "strict": True,
                }
            },
        )
        return json.loads(response.output_text)


def build_user_message(task: str, user_input, context: list[dict]):
    return json.dumps(
        {
            "task": task,
            "retrieved_context": context,
            "user_input": user_input,
        },
        indent=2,
    )
