import pytest
from django.contrib.auth.models import User


@pytest.mark.django_db
class TestRegisterView:
    def test_register_creates_user(self, api_client):
        response = api_client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123'
        })
        assert response.status_code == 201
        assert User.objects.filter(username='newuser').exists()
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_register_rejects_duplicate_username(self, api_client):
        User.objects.create_user(username='existing', password='pass123')
        response = api_client.post('/api/auth/register/', {
            'username': 'existing',
            'email': 'dupe@example.com',
            'password': 'securepass123'
        })
        assert response.status_code == 400
        assert response.data['error'] == 'Username already exists'


@pytest.mark.django_db
class TestLoginView:
    def test_login_with_valid_credentials(self, api_client):
        User.objects.create_user(username='loginuser', password='mypassword123')
        response = api_client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'mypassword123'
        })
        assert response.status_code == 200
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['message'] == 'Login successful'

    def test_login_with_invalid_password(self, api_client):
        User.objects.create_user(username='loginuser', password='correctpassword')
        response = api_client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'wrongpassword'
        })
        assert response.status_code == 401
        assert response.data['error'] == 'Invalid credentials'

    def test_login_with_nonexistent_user(self, api_client):
        response = api_client.post('/api/auth/login/', {
            'username': 'ghost',
            'password': 'whatever'
        })
        assert response.status_code == 401


@pytest.mark.django_db
class TestAuthFlowIntegration:
    """End-to-end: register, then immediately use returned token on a protected endpoint."""

    def test_register_then_access_protected_endpoint(self, api_client):
        register_response = api_client.post('/api/auth/register/', {
            'username': 'flowuser',
            'email': 'flow@example.com',
            'password': 'securepass123'
        })
        access_token = register_response.data['access']

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        journals_response = api_client.get('/api/journals/')

        assert journals_response.status_code == 200