import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.users.models import UserProfile
from unittest.mock import patch
import uuid

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
@patch('apps.users.views.get_supabase_client')
def test_register_user(mock_get_supabase, api_client):
    mock_supabase = mock_get_supabase.return_value
    class MockUser:
        id = str(uuid.uuid4())
    class MockSession:
        access_token = "access123"
        refresh_token = "refresh123"
    class MockAuthResponse:
        user = MockUser()
        session = MockSession()
    mock_supabase.auth.sign_up.return_value = MockAuthResponse()

    url = reverse('register')
    data = {'email': 'test@example.com', 'password': 'password123', 'name': 'Test User', 'consent_given': True}
    response = api_client.post(url, data, format='json')
    
    assert response.status_code == 201
    assert 'access_token' in response.data
    assert UserProfile.objects.count() == 1

@pytest.mark.django_db
@patch('apps.users.views.get_supabase_client')
def test_login_user(mock_get_supabase, api_client):
    mock_supabase = mock_get_supabase.return_value
    class MockUser:
        email = "test@example.com"
    class MockSession:
        access_token = "access123"
        refresh_token = "refresh123"
    class MockAuthResponse:
        user = MockUser()
        session = MockSession()
    mock_supabase.auth.sign_in_with_password.return_value = MockAuthResponse()

    url = reverse('login')
    data = {'email': 'test@example.com', 'password': 'password123'}
    response = api_client.post(url, data, format='json')
    
    assert response.status_code == 200
    assert 'access_token' in response.data
