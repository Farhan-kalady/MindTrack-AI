import pytest
from journals.models import JournalEntry, EmotionAnalysis
from journals.serializers import JournalEntrySerializer, EmotionAnalysisSerializer


@pytest.mark.django_db
class TestJournalEntrySerializer:
    def test_serializes_expected_fields(self, test_user):
        entry = JournalEntry.objects.create(
            user=test_user, entry_text="Test entry", mood_score=7
        )
        data = JournalEntrySerializer(entry).data

        assert data['entry_text'] == "Test entry"
        assert data['mood_score'] == 7
        assert data['emotionanalysis'] is None

    def test_includes_nested_emotion_analysis_when_present(self, test_user):
        entry = JournalEntry.objects.create(user=test_user, entry_text="Test entry")
        EmotionAnalysis.objects.create(
            entry=entry, emotion="joy", sentiment="positive",
            mood_score=9, ai_feedback="Great!"
        )
        data = JournalEntrySerializer(entry).data
        assert data['emotionanalysis']['emotion'] == "joy"

    def test_user_field_is_read_only(self):
        serializer = JournalEntrySerializer()
        assert serializer.fields['user'].read_only is True

    def test_timestamps_are_read_only(self):
        serializer = JournalEntrySerializer()
        assert serializer.fields['created_at'].read_only is True
        assert serializer.fields['updated_at'].read_only is True


@pytest.mark.django_db
class TestEmotionAnalysisSerializer:
    def test_serializes_fields(self, test_user):
        entry = JournalEntry.objects.create(user=test_user, entry_text="Test")
        analysis = EmotionAnalysis.objects.create(
            entry=entry, emotion="sad", sentiment="negative",
            mood_score=3, ai_feedback="Reach out to someone."
        )
        data = EmotionAnalysisSerializer(analysis).data
        assert data['emotion'] == "sad"
        assert data['mood_score'] == 3
        assert data['ai_feedback'] == "Reach out to someone."