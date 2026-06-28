import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.journal.models import JournalEntry
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
def test_create_journal_entry(authenticated_client):
    client, profile = authenticated_client
    url = reverse('journal-entry-list')
    data = {'title': 'My Day', 'content': 'It was good.'}
    response = client.post(url, data, format='json')
    
    assert response.status_code == 201
    assert JournalEntry.objects.count() == 1
    assert JournalEntry.objects.first().user == profile

@pytest.mark.django_db
def test_list_journal_entries(authenticated_client):
    client, profile = authenticated_client
    JournalEntry.objects.create(title="T1", content="C1", user=profile)
    
    url = reverse('journal-entry-list')
    response = client.get(url)
    
    assert response.status_code == 200
    assert len(response.data['results']) == 1
