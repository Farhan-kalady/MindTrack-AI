from rest_framework import serializers
from .models import JournalEntry, EmotionAnalysis   

class JournalEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for JournalEntry model.
    Handles conversion between JournalEntry instances and JSON.
    Includes nested EmotionAnalysis data when available.
    """
    ...

class EmotionAnalysisSerializer(serializers.ModelSerializer):
    """
    Serializer for EmotionAnalysis model.
    Returns AI analysis results in JSON format.
    """
    ...