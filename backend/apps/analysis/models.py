import uuid
from django.db import models
from apps.journal.models import JournalEntry

class EmotionAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry = models.OneToOneField(JournalEntry, on_delete=models.CASCADE, related_name='analysis')
    emotion = models.CharField(max_length=50, default='neutral')
    sentiment = models.CharField(max_length=10, default='neutral')
    mood_score = models.IntegerField()
    wellness_suggestion = models.TextField(blank=True, null=True)
    crisis_detected = models.BooleanField(default=False)
    gemini_model_used = models.CharField(max_length=50, blank=True, null=True)
    analysis_error = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.entry.id} - {self.emotion}"
