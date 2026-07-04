ANSWER_SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "sources": {
            "type": "array",
            "items": {"type": "string"},
        },
        "confidence": {
            "type": "string",
            "enum": ["low", "medium", "high"],
        },
    },
    "required": ["answer", "sources", "confidence"],
    "additionalProperties": False,
}


QUESTIONS_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "question": {"type": "string"},
                    "skill_area": {"type": "string"},
                },
                "required": ["id", "question", "skill_area"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["questions"],
    "additionalProperties": False,
}


EVALUATION_SCHEMA = {
    "type": "object",
    "properties": {
        "evaluations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "question": {"type": "string"},
                    "evaluation": {"type": "string"},
                    "positive_remarks": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "negative_remarks": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "score": {
                        "type": "integer",
                    },
                },
                "required": [
                    "id",
                    "question",
                    "evaluation",
                    "positive_remarks",
                    "negative_remarks",
                    "score",
                ],
                "additionalProperties": False,
            },
        }
    },
    "required": ["evaluations"],
    "additionalProperties": False,
}


RESUME_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "strengths": {
            "type": "array",
            "items": {"type": "string"},
        },
        "improvements": {
            "type": "array",
            "items": {"type": "string"},
        },
        "missing_skills": {
            "type": "array",
            "items": {"type": "string"},
        },
        "interview_preparation_tips": {
            "type": "array",
            "items": {"type": "string"},
        },
    },
    "required": [
        "summary",
        "strengths",
        "improvements",
        "missing_skills",
        "interview_preparation_tips",
    ],
    "additionalProperties": False,
}
