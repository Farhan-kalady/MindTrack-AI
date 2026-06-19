from rest_framework import serializers
from .models import JournalEntry, EmotionAnalysis


class EmotionAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for EmotionAnalysis model.
    Returns AI analysis results in JSON format.
    """
    class Meta:
        model = EmotionAnalysis
        fields = ['id', 'emotion', 'sentiment', 'mood_score', 'ai_feedback', 'created_at']
        read_only_fields = fields


class JournalEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for JournalEntry model.
    Handles conversion between JournalEntry instances and JSON.
    Includes nested EmotionAnalysis data when available.
    """
    emotionanalysis = EmotionAnalysisSerializer(read_only=True)

    class Meta:
        model = JournalEntry
        fields = [
            'id',
            'user',
            'entry_text',
            'mood_score',
            'created_at',
            'updated_at',
            'emotionanalysis',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']