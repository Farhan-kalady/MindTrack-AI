import json

def analyze_emotion(text):
    """
    AI Emotion Analysis Skeleton for MindTrack AI
    
    Input: journal entry text (string)
    Output: dict with emotion, sentiment, mood_score, feedback, keywords
    
    Flow:
    1. text → Gemini API (gemini-1.5-flash)
    2. Gemini returns JSON
    3. JSON saved to EmotionAnalysis table in Supabase
    
    Note: Real API integration coming in Day 8
    GEMINI_API_KEY will be loaded from .env
    """

    # SYSTEM PROMPT (will be sent to Gemini API in Day 8)
    SYSTEM_PROMPT = """
    You are an emotional wellness assistant for MindTrack AI.
    Analyze the journal entry and return ONLY valid JSON:
    {
        "emotion": "happy/sad/anxious/angry/calm/excited/stressed/grateful/neutral",
        "sentiment": "positive/negative/neutral",
        "mood_score": 1-10,
        "feedback": "supportive 2-3 sentence wellness suggestion",
        "keywords": ["3", "emotional", "keywords"]
    }
    Return ONLY the JSON. No markdown. No extra text.
    """

    # TODO Day 8: Replace mock with real Gemini API call
    # import google.generativeai as genai
    # from decouple import config
    # genai.configure(api_key=config('GEMINI_API_KEY'))
    # model = genai.GenerativeModel('gemini-1.5-flash')
    # response = model.generate_content(f"{SYSTEM_PROMPT}\nJournal: {text}")
    # return json.loads(response.text.strip())

    # MOCK RESPONSE — skeleton for today
    text_lower = text.lower()
    if any(w in text_lower for w in ['anxious', 'worried', 'stress', 'nervous', 'fear']):
        emotion, sentiment, score = 'anxious', 'negative', 3
        feedback = "It sounds like you are under pressure. Try deep breathing and focus on one task at a time. You can handle this!"
        keywords = ["anxious", "stress", "worry"]
    elif any(w in text_lower for w in ['happy', 'great', 'amazing', 'wonderful', 'good', 'excited']):
        emotion, sentiment, score = 'happy', 'positive', 9
        feedback = "What a wonderful day! Your positive energy is inspiring. Keep nurturing the things that bring you joy!"
        keywords = ["happy", "positive", "joy"]
    elif any(w in text_lower for w in ['sad', 'crying', 'depressed', 'lonely', 'upset']):
        emotion, sentiment, score = 'sad', 'negative', 2
        feedback = "I hear that you are going through a tough time. Be gentle with yourself today. Talking to someone you trust can really help."
        keywords = ["sad", "lonely", "down"]
    elif any(w in text_lower for w in ['calm', 'peaceful', 'relaxed', 'grateful', 'thankful']):
        emotion, sentiment, score = 'calm', 'positive', 8
        feedback = "You are in a great headspace today! Use this clarity to focus on your goals and enjoy the present moment."
        keywords = ["calm", "peaceful", "grateful"]
    elif any(w in text_lower for w in ['angry', 'frustrated', 'annoyed', 'mad']):
        emotion, sentiment, score = 'angry', 'negative', 2
        feedback = "It is okay to feel frustrated. Try taking a short walk to clear your mind. Your feelings are valid."
        keywords = ["angry", "frustrated", "tense"]
    else:
        emotion, sentiment, score = 'neutral', 'neutral', 5
        feedback = "Thank you for taking time to reflect today. Regular journaling builds emotional awareness over time. Keep it up!"
        keywords = ["reflection", "journal", "mindful"]

    return {
        "emotion": emotion,
        "sentiment": sentiment,
        "mood_score": score,
        "feedback": feedback,
        "keywords": keywords
    }