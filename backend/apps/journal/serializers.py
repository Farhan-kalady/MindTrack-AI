from rest_framework import serializers
from .models import JournalEntry
from apps.analysis.serializers import EmotionAnalysisSerializer

class JournalEntrySerializer(serializers.ModelSerializer):
    analysis = EmotionAnalysisSerializer(read_only=True)

    class Meta:
        model = JournalEntry
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'analysis']
        read_only_fields = ['id', 'created_at', 'updated_at']
