import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.journal.models import JournalEntry
from apps.analysis.models import EmotionAnalysis
from apps.users.models import UserProfile
import uuid

@pytest.fixture
def authenticated_client():
    from django.contrib.auth.models import User
    client = APIClient()
    user_id = uuid.uuid4()
    profile = UserProfile.objects.create(auth_user_id=user_id, email="test@example.com", name="Test")
    user = User.objects.create(username=str(user_id))
    user.profile = profile
    client.force_authenticate(user=user)
    return client, profile

@pytest.mark.django_db
def test_mood_history(authenticated_client):
    client, profile = authenticated_client
    entry = JournalEntry.objects.create(title="Title", content="Content", user=profile)
    EmotionAnalysis.objects.create(entry=entry, emotion="happy", sentiment="positive", mood_score=8)
    
    url = reverse('mood-history')
    response = client.get(url)
    
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]['mood_score'] == 8

@pytest.mark.django_db
def test_mood_sparkline(authenticated_client):
    client, profile = authenticated_client
    entry = JournalEntry.objects.create(title="Title", content="Content", user=profile)
    EmotionAnalysis.objects.create(entry=entry, emotion="happy", sentiment="positive", mood_score=8)
    
    url = reverse('mood-sparkline')
    response = client.get(url)
    
    assert response.status_code == 200
    assert 'scores' in response.data
    assert len(response.data['scores']) == 1

@pytest.mark.django_db
def test_emotion_summary(authenticated_client):
    client, profile = authenticated_client
    entry = JournalEntry.objects.create(title="Title", content="Content", user=profile)
    EmotionAnalysis.objects.create(entry=entry, emotion="happy", sentiment="positive", mood_score=8)
    
    url = reverse('emotion-summary')
    response = client.get(url)
    
    assert response.status_code == 200
    assert response.data['happy'] == 1
