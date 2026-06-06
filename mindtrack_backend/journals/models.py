from django.db import models
from django.contrib.auth.models import User

class JournalEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    entry_text = models.TextField()
    mood_score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at}"

class EmotionAnalysis(models.Model):
    entry = models.OneToOneField(JournalEntry, on_delete=models.CASCADE)
    emotion = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=20)
    mood_score = models.IntegerField()
    ai_feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.emotion} - {self.entry.id}"