import uuid
from django.db import models

class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auth_user_id = models.UUIDField(unique=True, help_text="Supabase auth.users.id")
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True, max_length=254)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_entry_date = models.DateField(null=True, blank=True)
    consent_given = models.BooleanField(default=False)
    consent_ts = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
