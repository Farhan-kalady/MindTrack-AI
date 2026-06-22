import pytest
from journals.models import JournalEntry, EmotionAnalysis


@pytest.mark.django_db
class TestJournalEntryModel:
    def test_create_journal_entry(self, test_user):
        entry = JournalEntry.objects.create(
            user=test_user,
            entry_text="Today was a good day.",
            mood_score=8
        )
        assert entry.entry_text == "Today was a good day."
        assert entry.mood_score == 8
        assert entry.user == test_user

    def test_mood_score_defaults_to_none(self, test_user):
        entry = JournalEntry.objects.create(
            user=test_user,
            entry_text="No mood set yet."
        )
        assert entry.mood_score is None

    def test_timestamps_auto_populate(self, test_user):
        entry = JournalEntry.objects.create(user=test_user, entry_text="Test")
        assert entry.created_at is not None
        assert entry.updated_at is not None


@pytest.mark.django_db
class TestEmotionAnalysisModel:
    def test_create_emotion_analysis(self, test_user):
        entry = JournalEntry.objects.create(user=test_user, entry_text="Feeling okay.")
        analysis = EmotionAnalysis.objects.create(
            entry=entry,
            emotion="content",
            sentiment="neutral",
            mood_score=6,
            ai_feedback="Keep going."
        )
        assert analysis.entry == entry
        assert analysis.emotion == "content"

    def test_one_to_one_relationship_enforced(self, test_user):
        entry = JournalEntry.objects.create(user=test_user, entry_text="Test")
        EmotionAnalysis.objects.create(
            entry=entry, emotion="joy", sentiment="positive",
            mood_score=9, ai_feedback="Great!"
        )
        # accessing the reverse relation should return the linked analysis
        assert entry.emotionanalysis.emotion == "joy"