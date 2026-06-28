from rest_framework import serializers
from .models import EmotionAnalysis

class EmotionAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionAnalysis
        fields = ['emotion', 'sentiment', 'mood_score', 'wellness_suggestion', 'crisis_detected', 'gemini_model_used', 'analysis_error', 'created_at']
