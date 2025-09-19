import os
import re
import openai
from dotenv import load_dotenv
from pygments.lexers import guess_lexer

load_dotenv()

openai.api_key = os.getenv("YOUR_API_KEY")
if not openai.api_key:
    raise ValueError("⚠️ YOUR_API_KEY not found in .env file")

def detect_language(code: str) -> str:
    try:
        lexer = guess_lexer(code)
        return lexer.name
    except:
        return "Unknown"

def analyze_code_ai(code: str, language: str):
    """Call LLM to review code and return structured JSON"""
    prompt = f"""
    You are a strict code reviewer. Review the following {language} code.
    Return ONLY a JSON object with the following keys:
    - issues: list of {{"severity": "critical|moderate|minor", "message": "...", "suggestion": "..."}}
    - score: integer 0-100 (100 is perfect code, lower means worse)
    - summary: short overview of code quality

    Code:
    {code}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a strict code reviewer. Always output valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        ai_text = response.choices[0].message["content"]

        import json
        return json.loads(ai_text)  # parse response into dict
    except Exception as e:
        return {
            "issues": [{"severity": "critical", "message": f"AI error: {str(e)}", "suggestion": "Retry later"}],
            "score": 50,
            "summary": "Error occurred while analyzing code."
        }


def review_code(code: str):
    language = detect_language(code)
    ai_feedback = analyze_code_ai(code, language)

    # Basic scoring idea
    score = 80  # later can auto adjust based on issue severity

    result = {
        "language": language,
        "score": score,
        "issues": [
            {"severity": "critical", "message": "SQL injection possible", "suggestion": "Use parameterized queries"},
            {"severity": "moderate", "message": "Nested loops may slow performance", "suggestion": "Consider optimization"}
        ],
        "suggestions": [ai_feedback]
    }
    return result
