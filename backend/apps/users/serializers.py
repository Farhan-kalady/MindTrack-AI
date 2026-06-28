from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'email', 'name', 'current_streak', 'longest_streak', 'last_entry_date', 'consent_given', 'created_at']
