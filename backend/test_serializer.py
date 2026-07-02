import os
import sys
import django
from django.test import Client

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from supabase import create_client
from django.conf import settings
from apps.users.models import UserProfile

User = get_user_model()
user = User.objects.first()

client = Client(HTTP_HOST='127.0.0.1')
client.force_login(user)

# To properly test API, we need the token since force_login doesn't work for JWT
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
# We can't log in without password. Let's just patch the authentication class temporarily for this test
# Or better, let's call the serializer directly to see if it fails validation!
from apps.journal.serializers import JournalEntrySerializer
from rest_framework.request import Request
from django.http import HttpRequest

request = HttpRequest()
request.user = user

serializer = JournalEntrySerializer(data={
    'title': '',
    'content': 'tommorow is my birthday'
})

is_valid = serializer.is_valid()
print(f"Serializer is_valid: {is_valid}")
if not is_valid:
    print(f"Serializer errors: {serializer.errors}")
else:
    print("Serializer is valid. Testing view save...")
    try:
        serializer.save(user=user.profile)
        print("Save successful!")
        
        # Test analysis view logic
        from apps.analysis.gemini import analyze_entry
        res = analyze_entry(serializer.instance.content)
        print(f"Gemini output: {res}")
        
    except Exception as e:
        print(f"Save/Analysis failed with exception: {e}")

