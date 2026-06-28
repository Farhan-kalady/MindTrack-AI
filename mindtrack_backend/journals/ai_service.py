import google.generativeai as genai
import json
from decouple import config
import time

def analyze_emotion(text):
    # Rate limit protection
    time.sleep(0.5)  # Small delay between requests
    ...

def check_crisis_content(text):
    """
    Checks if the entry contains indicators of self-harm or suicide risk.
    """
    lowercase_text = text.lower()
    crisis_keywords = ['suicide', 'kill myself', 'want to die', 'self-harm', 'harm myself', 'end my life', 'ending my life', 'cut myself']
    return any(kw in lowercase_text for kw in crisis_keywords)

CRISIS_RESPONSE = {
    "emotion": "stressed",
    "sentiment": "negative",
    "mood_score": 1,
    "feedback": "If you are experiencing thoughts of self-harm or suicide, please know that you do not have to go through this alone. Please reach out to the National Suicide Prevention Lifeline by calling or texting 988, or contact emergency services immediately for support.",
    "keywords": ["crisis", "help", "support"]
}

def fallback_analysis(text):
    text_lower = text.lower()
    
    is_negated_positive = any(phrase in text_lower for phrase in ['not happy', "isn't happy", "wasn't happy", 'not great', 'not good', 'not joy', 'not excited', 'not wonderful', 'not amazing'])
    
    if is_negated_positive or any(word in text_lower for word in ['sad', 'depressed', 'down', 'crying', 'unhappy']):
        return {
            "emotion": "sad",
            "sentiment": "negative",
            "mood_score": 3,
            "feedback": "I'm sorry you're feeling down. Be kind to yourself today and consider talking to someone you trust.",
            "keywords": ["sad", "down", "negative"]
        }
    elif any(word in text_lower for word in ['happy', 'great', 'joy', 'excited', 'good', 'wonderful', 'amazing']):
        return {
            "emotion": "happy",
            "sentiment": "positive",
            "mood_score": 8,
            "feedback": "It sounds like you had a wonderful day! Keep holding on to these positive moments.",
            "keywords": ["happy", "joy", "positive"]
        }
    elif any(word in text_lower for word in ['anxious', 'nervous', 'worried', 'afraid', 'scared', 'fear', 'stress', 'overwhelmed']):
        return {
            "emotion": "anxious",
            "sentiment": "negative",
            "mood_score": 4,
            "feedback": "It's completely normal to feel anxious or afraid. Try some deep breathing exercises to help ground yourself.",
            "keywords": ["anxious", "nervous", "stress"]
        }
    elif any(word in text_lower for word in ['angry', 'mad', 'frustrated', 'annoyed', 'furious']):
        return {
            "emotion": "angry",
            "sentiment": "negative",
            "mood_score": 3,
            "feedback": "It's completely valid to feel frustrated. Taking a short walk might help clear your head.",
            "keywords": ["angry", "frustrated", "stress"]
        }
    elif any(word in text_lower for word in ['calm', 'peaceful', 'relaxed', 'chill', 'fine']):
        return {
            "emotion": "calm",
            "sentiment": "positive",
            "mood_score": 7,
            "feedback": "It's wonderful that you're feeling peaceful. Enjoy this sense of calm.",
            "keywords": ["calm", "peaceful", "relaxed"]
        }
    else:
        return {
            "emotion": "neutral",
            "sentiment": "neutral",
            "mood_score": 5,
            "feedback": "Thank you for sharing your thoughts. Keep reflecting on your day.",
            "keywords": ["journaling", "reflection"]
        }

# Configure Gemini
genai.configure(api_key=config('GEMINI_API_KEY'))
# Reload triggered
model = genai.GenerativeModel('gemini-2.0-flash')

def analyze_emotion(text):
    """
    Analyzes journal entry using Google Gemini API.
    Input: journal entry text (string)
    Output: dict with emotion, sentiment, mood_score, feedback, keywords
    """
    # Check local crisis content safeguard first
    if check_crisis_content(text):
        return CRISIS_RESPONSE

    prompt = f"""You are an emotional wellness assistant for MindTrack AI.

Analyze this journal entry and return ONLY a valid JSON object with no extra text:
{{
    "emotion": "one of: happy, sad, anxious, angry, calm, excited, stressed, grateful, neutral",
    "sentiment": "one of: positive, negative, neutral",
    "mood_score": a number from 1 to 10,
    "feedback": "a supportive empathetic wellness suggestion in 2-3 sentences. CRITICAL: If the entry indicates self-harm, suicidal ideation, or severe crisis, you MUST set this feedback to provide immediate crisis helpline resources (e.g. 'If you are experiencing thoughts of self-harm, please reach out to the National Suicide Prevention Lifeline by calling or texting 988, or contact emergency services immediately.') and set mood_score to 1.",
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
        print("AI analysis exception: JSON decoding failed")
        return fallback_analysis(text)
    except Exception as e:
        print(f"AI analysis exception: {str(e)}")
        return fallback_analysis(text)


def generate_weekly_summary(entries):
    """
    Generates an AI narrative summary of the week's emotional trend.
    Input: list of dicts with 'text', 'emotion', 'mood_score', 'created_at'
    Output: string summary text
    """
    if not entries:
        return "You have no journal entries for this period. Try writing more entries to generate a summary."

    formatted_entries = ""
    for idx, entry in enumerate(entries):
        date_str = entry.get('created_at').strftime('%Y-%m-%d') if hasattr(entry.get('created_at'), 'strftime') else entry.get('created_at')
        formatted_entries += f"Entry #{idx+1} ({date_str}) - Mood: {entry.get('mood_score')}/10, Emotion: {entry.get('emotion')}\nText: \"{entry.get('text')}\"\n\n"

    prompt = f"""You are an emotional wellness assistant for MindTrack AI.
Analyze this user's journal entries from the past week and write a concise, compassionate 3-4 sentence narrative summary of their emotional trend, identifying any patterns (e.g. specific stressors, sources of joy, or changes in mood) and offering a supportive suggestion.

Weekly Journal Data:
{formatted_entries}

Your response must be a single paragraph of plain text (no markdown, no bullets). Keep it brief, supportive, and focused on patterns.
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return "Based on your entries this week, you experienced a mix of emotions. Keep reflecting and journaling regularly to track your progress."