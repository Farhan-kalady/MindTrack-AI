from rest_framework import serializers
from .models import JournalEntry, EmotionAnalysis

class EmotionAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionAnalysis
        fields = '__all__'

class JournalEntrySerializer(serializers.ModelSerializer):
    emotion_analysis = EmotionAnalysisSerializer(
        source='emotionanalysis',
        read_only=True
    )

    class Meta:
        model = JournalEntry
        fields = [
            'id',
            'entry_text',
            'mood_score',
            'created_at',
            'updated_at',
            'emotion_analysis'
        ]
        read_only_fields = ['created_at', 'updated_at']