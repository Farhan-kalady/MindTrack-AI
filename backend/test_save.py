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

client = Client(HTTP_HOST='127.0.0.1')
client.force_login(user)

print("Simulating POST /api/journals/ (Wait, what is the endpoint?)")
# The frontend calls api.post('/entries/', ...)
print("Sending POST request to /api/entries/...")
response = client.post('/api/entries/', {
    'title': 'tommorow is my birthday',
    'content': 'This is some test content to see if it saves.'
}, content_type='application/json')

print(f"Status Code: {response.status_code}")
try:
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Failed to parse JSON response: {response.content}")
