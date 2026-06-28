import uuid
from django.db import models
from apps.users.models import UserProfile

class WeeklyReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='weekly_reports')
    week_start = models.DateField()
    week_end = models.DateField()
    dominant_emotion = models.CharField(max_length=50, blank=True, null=True)
    average_mood_score = models.FloatField(blank=True, null=True)
    mood_trend = models.CharField(max_length=20, blank=True, null=True)
    week_summary = models.TextField(blank=True, null=True)
    weekly_suggestion = models.TextField(blank=True, null=True)
    entries_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'week_start')

    def __str__(self):
        return f"Report {self.week_start} to {self.week_end} for {self.user.email}"
