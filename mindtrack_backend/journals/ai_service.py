import google.generativeai as genai
import json
from decouple import config
import time

def analyze_emotion(text):
    # Rate limit protection
    time.sleep(0.5)  # Small delay between requests
    ...

# Configure Gemini
genai.configure(api_key=config('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash')

def analyze_emotion(text):
    """
    Analyzes journal entry using Google Gemini API.
    Input: journal entry text (string)
    Output: dict with emotion, sentiment, mood_score, feedback, keywords
    """

    prompt = f"""You are an emotional wellness assistant for MindTrack AI.

Analyze this journal entry and return ONLY a valid JSON object with no extra text:
{{
    "emotion": "one of: happy, sad, anxious, angry, calm, excited, stressed, grateful, neutral",
    "sentiment": "one of: positive, negative, neutral",
    "mood_score": a number from 1 to 10,
    "feedback": "a supportive empathetic wellness suggestion in 2-3 sentences",
    "keywords": ["3 emotional keywords"]
}}

Journal entry: "{text}"

Return ONLY the JSON object. No explanation. No markdown. No code blocks."""

    try:
        response = model.generate_content(prompt)
        result_text = response.text.strip()

        # Clean if Gemini adds markdown
        if '```' in result_text:
            result_text = result_text.split('```')[1]
            if result_text.startswith('json'):
                result_text = result_text[4:]
            result_text = result_text.strip()

        return json.loads(result_text)

    except json.JSONDecodeError:
        # Fallback if JSON parsing fails
        return {
            "emotion": "neutral",
            "sentiment": "neutral",
            "mood_score": 5,
            "feedback": "Thank you for journaling. Keep reflecting on your emotions daily.",
            "keywords": ["reflection", "journal", "wellness"]
        }
    except Exception as e:
        raise Exception(f"AI analysis failed: {str(e)}")