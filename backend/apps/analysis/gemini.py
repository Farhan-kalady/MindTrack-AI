import json
import logging
import google.generativeai as genai
from django.conf import settings
from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

VALID_EMOTIONS = {
    "happy", "sad", "anxious", "angry", "neutral",
    "excited", "frustrated", "hopeful", "exhausted", "grateful"
}

FALLBACK = {
    "emotion": "neutral", "sentiment": "neutral",
    "mood_score": 5,
    "wellness_suggestion": "We couldn't analyze your entry right now. Try again shortly.",
    "crisis_detected": False, "error": True
}

def analyze_entry(text: str) -> dict:
    """Analyze a journal entry. Always returns a dict — never raises."""
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        prompt = f"""
Analyze the following journal entry. Return a JSON object with exactly these fields:
{{
  "emotion": "one of: happy, sad, anxious, angry, neutral, excited, frustrated, hopeful, exhausted, grateful",
  "sentiment": "one of: positive, negative, neutral",
  "mood_score": <integer 0-10>,
  "wellness_suggestion": "<1-2 sentence personalized suggestion>",
  "crisis_detected": <true only if entry contains self-harm or suicidal signals, else false>
}}

Journal entry:
\"\"\"
{text[:3000]}
\"\"\"

Return ONLY the JSON. No explanation. No markdown.
"""
        response = model.generate_content(prompt)
        raw = response.text.strip().lstrip('\ufeff')
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())

        # Validate emotion
        result["emotion"] = result.get("emotion", "neutral").lower()
        if result["emotion"] not in VALID_EMOTIONS:
            result["emotion"] = "neutral"

        # Validate mood_score
        score = result.get("mood_score", 5)
        result["mood_score"] = max(0, min(10, int(score)))

        result["error"] = False
        return result

    except ResourceExhausted:
        logger.warning("Gemini quota exceeded", exc_info=True)
        return {**FALLBACK, "error_type": "quota_exceeded"}
    except DeadlineExceeded:
        logger.warning("Gemini timeout", exc_info=True)
        return {**FALLBACK, "error_type": "timeout"}
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        logger.error(f"Gemini parse error: {e}", exc_info=True)
        return {**FALLBACK, "error_type": "parse_error"}
    except Exception as e:
        logger.error(f"Gemini unexpected error: {e}", exc_info=True)
        return {**FALLBACK, "error_type": "unknown"}

def generate_weekly_summary(entries: list[dict]) -> dict:
    """Generate weekly mood summary from a list of entry dicts."""
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        entries_text = "\n\n".join([
            f"[{e['date']}] Emotion: {e['emotion']} | Score: {e['mood_score']}/10\n{e['content'][:500]}"
            for e in entries
        ])
        prompt = f"""
Analyze this week's journal entries and return:
{{
  "dominant_emotion": "<most frequent emotion>",
  "average_mood_score": <float>,
  "mood_trend": "one of: improving, declining, stable",
  "week_summary": "<2-3 sentence narrative>",
  "weekly_suggestion": "<1-2 sentence recommendation for the coming week>"
}}

Entries:
{entries_text}
"""
        response = model.generate_content(prompt)
        raw = response.text.strip().lstrip('\ufeff')
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        logger.error(f"Weekly summary error: {e}", exc_info=True)
        return {
            "dominant_emotion": "neutral", "average_mood_score": 5.0,
            "mood_trend": "stable", "week_summary": "Could not generate summary.",
            "weekly_suggestion": "Keep journaling consistently.", "error": True
        }

def chat_with_assistant(history_text: str, user_message: str) -> str:
    """Generate a response for the AI wellness assistant using user's history."""
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
        )
        prompt = f"""
You are the MindTrack AI Wellness Assistant. Your goal is to be a supportive, empathetic, and insightful guide.
Use the following recent mood history (journal entries, emotions, and scores) to provide personalized insights to the user.
Do NOT give generic advice if you can reference their actual data.

User's Recent History:
{history_text}

User's Message:
{user_message}

Provide a thoughtful and helpful response. Use markdown for formatting.
"""
        response = model.generate_content(prompt)
        return response.text.strip()
    except ResourceExhausted:
        logger.warning("Gemini quota exceeded during chat", exc_info=True)
        return "I'm sorry, but my capacity is currently full (Quota Exceeded). Please try again in a few minutes."
    except DeadlineExceeded:
        logger.warning("Gemini timeout during chat", exc_info=True)
        return "I'm having trouble connecting right now (Timeout). Please try again later."
    except Exception as e:
        logger.error(f"Gemini unexpected error during chat: {e}", exc_info=True)
        return "An unexpected error occurred while generating my response. Please try again."
