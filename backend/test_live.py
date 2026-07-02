import os
import sys
import django
import requests

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from supabase import create_client
from django.conf import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
# We can't easily sign in without password, but maybe we can use the local JWT?
# Wait, Supabase issues JWTs. If I sign in, I need credentials. 
# Let's just check the health endpoint to see if Render is alive and updated.
try:
    print("Checking live Render health endpoint...")
    r = requests.get('https://mindtrack-ai-lw6i.onrender.com/api/health/')
    print(f"Status: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")

print("Testing the live API schema for the new endpoint...")
try:
    r2 = requests.get('https://mindtrack-ai-lw6i.onrender.com/api/schema/')
    if r2.status_code == 200:
        if '/api/assistant/chat/' in r2.text:
            print("SUCCESS: The /api/assistant/chat/ endpoint is LIVE on Render!")
        else:
            print("WARNING: The endpoint is not yet in the live schema.")
    else:
        print(f"Schema status: {r2.status_code}")
except Exception as e:
    print(f"Error: {e}")
