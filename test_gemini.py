import google.generativeai as genai
from decouple import config
import os

try:
    genai.configure(api_key=config('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content("Say hello")
    print("SUCCESS:", response.text)
except Exception as e:
    print("ERROR:", str(e))
