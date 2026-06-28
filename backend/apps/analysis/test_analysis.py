import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.journal.models import JournalEntry
from apps.users.models import UserProfile
from unittest.mock import patch
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
@patch('apps.analysis.views.analyze_entry')
def test_analyze_entry(mock_analyze_entry, authenticated_client):
    mock_analyze_entry.return_value = {
        'emotion': 'happy',
        'sentiment': 'positive',
        'mood_score': 8,
        'wellness_suggestion': 'Keep it up!',
        'crisis_detected': False,
        'error': False
    }

    client, profile = authenticated_client
    entry = JournalEntry.objects.create(title="Title", content="Content", user=profile)

    url = reverse('analyze-entry', args=[entry.id])
    response = client.post(url, format='json')
    
    assert response.status_code == 200
    assert response.data['emotion'] == 'happy'
