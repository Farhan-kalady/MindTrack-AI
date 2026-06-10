from openai import OpenAI
from decouple import config

client = OpenAI(api_key=config('OPENAI_API_KEY'))

def analyze_emotion(text):
    prompt = f"""
    Analyze the following journal entry and return a JSON response with:
    - emotion: the dominant emotion (happy, sad, anxious, angry, calm, excited, stressed, grateful)
    - sentiment: positive, negative, or neutral
    - mood_score: a number from 1 to 10
    - feedback: a short personalized wellness suggestion (2-3 sentences)

    Journal entry: "{text}"

    Respond ONLY with valid JSON, no extra text.
    Example:
    {{
        "emotion": "happy",
        "sentiment": "positive",
        "mood_score": 8,
        "feedback": "You seem to be in a great mood today! Keep up the positive energy."
    }}
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    import json
    result = response.choices[0].message.content.strip()
    return json.loads(result)