import os
import sys
import django
from django.test import Client

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()
user = User.objects.first()

refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

client = Client(HTTP_HOST='127.0.0.1')

print("Sending POST request to /api/assistant/chat/ with token...")
response = client.post('/api/assistant/chat/', {'message': 'how to calculate mood score'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {access_token}')
print(f"Status Code: {response.status_code}")
try:
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Failed to parse JSON response: {response.content}")
