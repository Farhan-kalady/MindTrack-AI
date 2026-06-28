import pytest
from unittest.mock import patch
from journals.models import JournalEntry


@pytest.mark.django_db
class TestJournalEntryViewSet:
    def test_unauthenticated_cannot_list(self, api_client):
        response = api_client.get('/api/journals/')
        assert response.status_code == 401

    def test_authenticated_can_create_entry(self, auth_client):
        response = auth_client.post('/api/journals/', {'entry_text': 'My day was fine.'})
        assert response.status_code == 201
        assert JournalEntry.objects.count() == 1

    def test_user_only_sees_own_entries(self, auth_client, test_user, django_user_model):
        other_user = django_user_model.objects.create_user(username='other', password='pass123')
        JournalEntry.objects.create(user=other_user, entry_text="Not yours")
        JournalEntry.objects.create(user=test_user, entry_text="Yours")

        response = auth_client.get('/api/journals/')
        assert response.status_code == 200
        results = response.data.get('results', response.data)
        assert len(results) == 1


@pytest.mark.django_db
class TestMoodEndpoints:
    def test_mood_summary_no_entries(self, auth_client):
        response = auth_client.get('/api/mood/summary/')
        assert response.status_code == 200
        assert response.data['message'] == 'No entries yet'

    def test_mood_history_returns_entries(self, auth_client, test_user):
        JournalEntry.objects.create(user=test_user, entry_text="Day 1", mood_score=5)
        response = auth_client.get('/api/mood/history/')
        assert response.status_code == 200
        assert response.data['count'] == 1

    def test_mood_summary_calculates_average(self, auth_client, test_user):
        JournalEntry.objects.create(user=test_user, entry_text="Day 1", mood_score=4)
        JournalEntry.objects.create(user=test_user, entry_text="Day 2", mood_score=8)
        response = auth_client.get('/api/mood/summary/')
        assert response.status_code == 200
        assert response.data['average_mood_score'] == 6.0


@pytest.mark.django_db
class TestAnalyzeEntryView:
    """
    These tests mock journals.views.analyze_emotion so no real call
    to the Gemini API happens during testing.
    """

    @patch('journals.views.analyze_emotion')
    def test_analyze_entry_success(self, mock_analyze, auth_client, test_user):
        mock_analyze.return_value = {
            'emotion': 'joy',
            'sentiment': 'positive',
            'mood_score': 9,
            'feedback': 'Great mood!',
            'keywords': ['happy']
        }
        entry = JournalEntry.objects.create(user=test_user, entry_text="Amazing day!")

        response = auth_client.post(f'/api/journals/{entry.id}/analyze/')

        assert response.status_code == 200
        assert response.data['emotion'] == 'joy'
        mock_analyze.assert_called_once_with("Amazing day!")

    def test_analyze_entry_not_found(self, auth_client):
        response = auth_client.post('/api/journals/9999/analyze/')
        assert response.status_code == 404

    @patch('journals.views.analyze_emotion')
    def test_analyze_entry_handles_ai_failure_gracefully(self, mock_analyze, auth_client, test_user):
        mock_analyze.side_effect = Exception("Gemini API error")
        entry = JournalEntry.objects.create(user=test_user, entry_text="Test")

        response = auth_client.post(f'/api/journals/{entry.id}/analyze/')

        assert response.status_code == 200
        assert response.data['emotion'] == 'neutral'

    @patch('journals.views.analyze_emotion')
    def test_analyze_entry_creates_emotion_analysis_record(self, mock_analyze, auth_client, test_user):
        mock_analyze.return_value = {
            'emotion': 'calm', 'sentiment': 'neutral',
            'mood_score': 7, 'feedback': 'Stay balanced.', 'keywords': []
        }
        entry = JournalEntry.objects.create(user=test_user, entry_text="An okay day.")

        auth_client.post(f'/api/journals/{entry.id}/analyze/')

        entry.refresh_from_db()
        assert entry.mood_score == 7
        assert entry.emotionanalysis.emotion == 'calm'

    @patch('journals.views.analyze_emotion')
    def test_analyze_entry_rate_limit(self, mock_analyze, auth_client, test_user):
        from django.core.cache import cache
        cache.clear() # Clear cache to ensure clean state
        mock_analyze.return_value = {
            'emotion': 'joy', 'sentiment': 'positive',
            'mood_score': 9, 'feedback': 'Great!', 'keywords': []
        }
        entry = JournalEntry.objects.create(user=test_user, entry_text="Amazing day!")

        # Make 5 requests (all should succeed)
        for _ in range(5):
            response = auth_client.post(f'/api/journals/{entry.id}/analyze/')
            assert response.status_code == 200

        # The 6th request should fail with 429
        response = auth_client.post(f'/api/journals/{entry.id}/analyze/')
        assert response.status_code == 429
        assert 'error' in response.data


@pytest.mark.django_db
class TestHomePage:
    def test_home_page_renders_successfully(self, api_client):
        response = api_client.get('/')
        assert response.status_code == 200
        assert b"MindTrack AI" in response.content
        assert b"Explore API Docs" in response.content

    def test_health_check_returns_ok(self, api_client):
        response = api_client.get('/healthz/')
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


@pytest.mark.django_db
class TestNewFeaturesPRD:
    def test_crisis_content_override(self, auth_client, test_user):
        entry = JournalEntry.objects.create(user=test_user, entry_text="I want to die, my life is too hard.")
        response = auth_client.post(f'/api/journals/{entry.id}/analyze/')
        assert response.status_code == 200
        assert response.data['mood_score'] == 1
        assert "National Suicide Prevention Lifeline" in response.data['feedback']

    @patch('journals.views.generate_weekly_summary')
    def test_weekly_summary_with_ai_narrative(self, mock_summary, auth_client, test_user):
        mock_summary.return_value = "Mocked emotional summary."
        JournalEntry.objects.create(user=test_user, entry_text="Day 1", mood_score=5)
        response = auth_client.get('/api/mood/weekly/')
        assert response.status_code == 200
        assert response.data['ai_summary'] == "Mocked emotional summary."