import os
import sys
import django

# Setup django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

print("AVAILABLE MODELS:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)
