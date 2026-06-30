import uuid
from django.db import models
from apps.users.models import UserProfile

class JournalEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="journal_entries")
    title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title if self.title else f"Entry by {self.user.email} at {self.created_at}"

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        
        if is_new:
            from django.utils import timezone
            from datetime import timedelta
            
            today = timezone.now().date()
            profile = self.user
            
            if profile.last_entry_date == today:
                # Already logged an entry today
                pass
            elif profile.last_entry_date == today - timedelta(days=1):
                # Streak continues
                profile.current_streak += 1
                profile.last_entry_date = today
            else:
                # Streak broken or first entry
                profile.current_streak = 1
                profile.last_entry_date = today
                
            if profile.current_streak > profile.longest_streak:
                profile.longest_streak = profile.current_streak
                
            profile.save(update_fields=['current_streak', 'longest_streak', 'last_entry_date'])
